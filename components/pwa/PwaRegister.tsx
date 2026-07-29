"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function cleanVapidKey(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, "");
}

/**
 * Chrome PushManager: bazı sürümlerde offset’li ArrayBuffer sorun çıkarır.
 * Temiz kopya ArrayBuffer üret.
 */
function toApplicationServerKey(vapid: string): ArrayBuffer {
  const u8 = urlBase64ToUint8Array(vapid);
  const copy = new ArrayBuffer(u8.byteLength);
  new Uint8Array(copy).set(u8);
  return copy;
}

async function fetchVapidPublicKey(): Promise<string | null> {
  try {
    const res = await fetch("/api/push/vapid-public", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { publicKey?: string };
      const k = cleanVapidKey(data.publicKey || "");
      if (k.length >= 80) return k;
    }
  } catch {
    /* fall through */
  }
  const embedded = cleanVapidKey(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
  );
  return embedded.length >= 80 ? embedded : null;
}

async function waitForController(timeoutMs = 8000): Promise<boolean> {
  if (navigator.serviceWorker.controller) return true;
  return new Promise((resolve) => {
    const t = window.setTimeout(() => resolve(false), timeoutMs);
    const onChange = () => {
      if (navigator.serviceWorker.controller) {
        window.clearTimeout(t);
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          onChange
        );
        resolve(true);
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", onChange);
  });
}

async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker desteklenmiyor");
  }

  // Eski / bozuk kayıtları temizle (yalnızca bizim sw.js)
  const existingRegs = await navigator.serviceWorker.getRegistrations();
  for (const r of existingRegs) {
    const script = r.active?.scriptURL || r.installing?.scriptURL || "";
    // Yabancı SW varsa dokunma; bizim eski sw'yi yenile
    if (script && !script.endsWith("/sw.js") && !script.includes("/sw.js")) {
      continue;
    }
  }

  let reg = await navigator.serviceWorker.getRegistration("/");
  if (!reg) {
    reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  } else {
    try {
      await reg.update();
    } catch {
      /* ignore */
    }
  }

  // installing / waiting → active
  if (!reg.active) {
    const pending = reg.installing || reg.waiting;
    if (pending) {
      await new Promise<void>((resolve, reject) => {
        const t = window.setTimeout(
          () => reject(new Error("Service Worker zaman aşımı")),
          15_000
        );
        const done = () => {
          window.clearTimeout(t);
          resolve();
        };
        pending.addEventListener("statechange", () => {
          if (pending.state === "activated") done();
          if (pending.state === "redundant") {
            window.clearTimeout(t);
            reject(new Error("Service Worker kurulumu başarısız"));
          }
        });
        if (pending.state === "activated") done();
      });
    }
  }

  if (reg.waiting) {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
    await waitForController(4000);
  }

  const ready = await navigator.serviceWorker.ready;
  if (!ready.active) {
    throw new Error("Service Worker henüz aktif değil");
  }

  // İlk kurulumda controller yok → sayfa kontrol edilmiyor; push bazen patlar
  if (!navigator.serviceWorker.controller) {
    const controlled = await waitForController(3000);
    if (!controlled) {
      // Tek seferlik soft reload bayrağı
      const flag = "kentsele_sw_reload";
      if (!sessionStorage.getItem(flag)) {
        sessionStorage.setItem(flag, "1");
        window.location.reload();
        // reload sonrası kod çalışmaz
        throw new Error("SW_RELOAD");
      }
      // Reload sonrası hâlâ controller yoksa claim için mesaj + kısa bekleme
      ready.active.postMessage({ type: "SKIP_WAITING" });
      await waitForController(2000);
    }
  }

  return ready;
}

async function postSubscription(sub: PushSubscription): Promise<{
  ok: boolean;
  message?: string;
}> {
  const json = sub.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return { ok: false, message: "Tarayıcı abonelik anahtarları eksik." };
  }
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(json),
  });
  if (res.ok) return { ok: true };
  let message = "Abonelik kaydedilemedi.";
  try {
    const data = (await res.json()) as { message?: string; error?: string };
    if (data.message) message = data.message;
    else if (data.error === "db")
      message =
        "Abonelik kaydı başarısız. Supabase’te 013_push_subscriptions.sql çalıştırıldı mı?";
    else if (data.error === "validation")
      message = "Abonelik verisi geçersiz (tarayıcı anahtarı).";
  } catch {
    /* ignore */
  }
  return { ok: false, message };
}

async function subscribeWithKey(
  reg: ServiceWorkerRegistration,
  vapid: string
): Promise<PushSubscription> {
  // Her zaman temiz abonelik — eski anahtar / bozuk FCM kaydı
  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    try {
      await existing.unsubscribe();
    } catch {
      /* ignore */
    }
  }

  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: toApplicationServerKey(vapid),
  });
}

function explainPushError(e: unknown): string {
  if (e instanceof Error && e.message === "SW_RELOAD") {
    return "Service Worker kuruldu; sayfa yenileniyor…";
  }
  const msg = e instanceof Error ? e.message : String(e);
  const name = e instanceof DOMException ? e.name : "";

  if (/push service error|registration failed/i.test(msg)) {
    return (
      "Tarayıcı FCM push kaydını reddetti (VAPID sunucuda geçerli). " +
      "Dene: (1) chrome://settings/content/notifications — siteye izin ver, " +
      "(2) chrome://settings/content/siteDetails?site=https://kentsele.ist — verileri temizle, " +
      "(3) sayfayı kapatıp yeniden aç, (4) Edge dene. " +
      "Brave ise Ayarlar → Gizlilik → “Google push messaging” açık olsun. " +
      "VPN/kurum ağı FCM engelliyorsa kapat. Teşhis: /api/push/health"
    );
  }
  if (/applicationServerKey|invalid|not a valid/i.test(msg) || name === "InvalidAccessError") {
    return "VAPID public key tarayıcıda geçersiz sayıldı. /api/push/health ve /api/push/vapid-public kontrol et.";
  }
  if (/permission|denied|not allowed/i.test(msg) || name === "NotAllowedError") {
    return "Bildirim izni yok. Site ayarlarından bildirimleri aç.";
  }
  if (/service worker|no active/i.test(msg)) {
    return "Service Worker hazır değil. F5 ile yenile, 3 sn bekle, tekrar dene.";
  }
  return `Bildirim aboneliği başarısız: ${msg.slice(0, 160)}`;
}

/** Registers service worker; soft re-sync existing push when already granted */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const reg = await ensureServiceWorker();
        if (cancelled) return;
        if (Notification.permission !== "granted") return;
        if (!("PushManager" in window)) return;

        const existing = await reg.pushManager.getSubscription();
        if (existing && !cancelled) {
          await postSubscription(existing);
        }
      } catch (e) {
        if (e instanceof Error && e.message === "SW_RELOAD") return;
        console.warn("[pwa]", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

/** Call from Hesabım — user gesture for Notification permission */
export async function enablePushNotifications(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return { ok: false, message: "Bu tarayıcı PWA / bildirim desteklemiyor." };
  }
  if (!("PushManager" in window)) {
    return {
      ok: false,
      message:
        "Bu tarayıcı Web Push desteklemiyor. Chrome / Edge / Android Chrome dene; iOS’ta Ana Ekrana Ekle gerekir.",
    };
  }
  if (!window.isSecureContext) {
    return {
      ok: false,
      message: "Bildirimler yalnızca HTTPS (veya localhost) üzerinde çalışır.",
    };
  }

  // Sunucu sağlığı (VAPID gerçekten var mı?)
  try {
    const health = await fetch("/api/push/health", { cache: "no-store" }).then(
      (r) => r.json() as Promise<{ canSubscribe?: boolean; hint?: string }>
    );
    if (!health.canSubscribe) {
      return {
        ok: false,
        message:
          health.hint ||
          "Sunucuda geçerli VAPID public key yok. Vercel env kontrol et.",
      };
    }
  } catch {
    /* health opsiyonel */
  }

  const vapid = await fetchVapidPublicKey();
  if (!vapid) {
    return {
      ok: false,
      message:
        "Push yapılandırılmamış. Vercel’e NEXT_PUBLIC_VAPID_PUBLIC_KEY ekleyip redeploy et.",
    };
  }

  try {
    const bytes = urlBase64ToUint8Array(vapid);
    if (bytes.length !== 65 || bytes[0] !== 4) {
      return {
        ok: false,
        message:
          "VAPID public key formatı hatalı (65 bayt P-256 olmalı). web-push generate-vapid-keys ile yenile.",
      };
    }
  } catch {
    return {
      ok: false,
      message: "VAPID public key okunamadı. Env değerini kontrol et.",
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return {
        ok: false,
        message:
          permission === "denied"
            ? "Bildirim izni engellendi. Tarayıcı site ayarlarından izin ver."
            : "Bildirim izni verilmedi.",
      };
    }

    let reg = await ensureServiceWorker();

    try {
      const sub = await subscribeWithKey(reg, vapid);
      const saved = await postSubscription(sub);
      if (!saved.ok) {
        return {
          ok: false,
          message: saved.message || "Abonelik kaydedilemedi.",
        };
      }
      sessionStorage.removeItem("kentsele_sw_reload");
      return { ok: true, message: "Bildirimler açıldı." };
    } catch (first) {
      console.error("[push] subscribe first", first);

      // Hard reset SW
      try {
        const old = await reg.pushManager.getSubscription();
        if (old) await old.unsubscribe();
      } catch {
        /* ignore */
      }
      try {
        await reg.unregister();
      } catch {
        /* ignore */
      }

      // Tüm registration'ları sil (temiz slate)
      try {
        const all = await navigator.serviceWorker.getRegistrations();
        await Promise.all(all.map((r) => r.unregister()));
      } catch {
        /* ignore */
      }

      reg = await ensureServiceWorker();
      try {
        const sub = await subscribeWithKey(reg, vapid);
        const saved = await postSubscription(sub);
        if (!saved.ok) {
          return {
            ok: false,
            message: saved.message || "Abonelik kaydedilemedi.",
          };
        }
        sessionStorage.removeItem("kentsele_sw_reload");
        return { ok: true, message: "Bildirimler açıldı." };
      } catch (second) {
        console.error("[push] subscribe second", second);
        return { ok: false, message: explainPushError(second) };
      }
    }
  } catch (e) {
    console.error("[push]", e);
    if (e instanceof Error && e.message === "SW_RELOAD") {
      return {
        ok: true,
        message: "Service Worker kuruldu — sayfa yenileniyor, sonra tekrar dene.",
      };
    }
    return { ok: false, message: explainPushError(e) };
  }
}
