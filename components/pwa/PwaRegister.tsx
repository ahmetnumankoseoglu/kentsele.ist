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

/** Uint8Array → BufferSource (Chrome offset sorununu önler) */
function toApplicationServerKey(vapid: string): BufferSource {
  const u8 = urlBase64ToUint8Array(vapid);
  // Copy into a clean ArrayBuffer (no SharedArrayBuffer / offset quirks)
  const copy = new Uint8Array(u8.byteLength);
  copy.set(u8);
  return copy;
}

async function fetchVapidPublicKey(): Promise<string | null> {
  // 1) Runtime API (Vercel env rebuild kaçırsa bile)
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
  // 2) Build-time embed
  const embedded = cleanVapidKey(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
  );
  return embedded.length >= 80 ? embedded : null;
}

async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker desteklenmiyor");
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

  // installing / waiting → active olana kadar bekle
  if (!reg.active) {
    const pending = reg.installing || reg.waiting;
    if (pending) {
      await new Promise<void>((resolve, reject) => {
        const t = window.setTimeout(
          () => reject(new Error("Service Worker zaman aşımı")),
          15_000
        );
        pending.addEventListener("statechange", () => {
          if (pending.state === "activated") {
            window.clearTimeout(t);
            resolve();
          }
          if (pending.state === "redundant") {
            window.clearTimeout(t);
            reject(new Error("Service Worker kurulumu başarısız"));
          }
        });
        // already activated between checks
        if (pending.state === "activated") {
          window.clearTimeout(t);
          resolve();
        }
      });
    }
  }

  // waiting worker varsa aktifleştir
  if (reg.waiting) {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
  }

  const ready = await navigator.serviceWorker.ready;
  if (!ready.active) {
    throw new Error("Service Worker henüz aktif değil");
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

function explainPushError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const lower = msg.toLowerCase();

  if (/push service error|registration failed/i.test(msg)) {
    return (
      "Push servisi reddetti. Kontrol et: (1) Chrome’da bildirimler açık mı, " +
      "(2) Brave ise “Google services for push” açık mı, " +
      "(3) Vercel’de NEXT_PUBLIC_VAPID_PUBLIC_KEY doğru mu ve redeploy yapıldı mı, " +
      "(4) site HTTPS mi. Eski aboneliği temizlemek için site verilerini silip tekrar dene."
    );
  }
  if (/applicationServerKey|invalid|not a valid/i.test(lower)) {
    return "VAPID anahtarı geçersiz veya eksik. Vercel env + redeploy kontrol et.";
  }
  if (/permission|denied|not allowed/i.test(lower)) {
    return "Bildirim izni yok. Tarayıcı site ayarlarından izin ver.";
  }
  if (/service worker|no active/i.test(lower)) {
    return "Service Worker hazır değil. Sayfayı yenileyip 2 sn sonra tekrar dene.";
  }
  return `Bildirim aboneliği başarısız: ${msg.slice(0, 140)}`;
}

/** Registers service worker; soft re-sync existing push when already granted */
export function PwaRegister() {
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const reg = await ensureServiceWorker();
        if (Notification.permission !== "granted") return;
        if (!("PushManager" in window)) return;

        const existing = await reg.pushManager.getSubscription();
        if (existing && !cancelled) {
          await postSubscription(existing);
        }
      } catch (e) {
        console.warn("[pwa]", e);
        if (!cancelled) setBanner(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!banner) return null;
  return (
    <p className="sr-only" role="status">
      {banner}
    </p>
  );
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

  const vapid = await fetchVapidPublicKey();
  if (!vapid) {
    return {
      ok: false,
      message:
        "Push yapılandırılmamış. Vercel’e NEXT_PUBLIC_VAPID_PUBLIC_KEY ekleyip redeploy et.",
    };
  }

  // Quick structural check (uncompressed P-256 ≈ 87 char url-safe base64)
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

    const reg = await ensureServiceWorker();
    const appKey = toApplicationServerKey(vapid);

    // Eski abonelik varsa: kaydetmeyi dene; fail veya key değişimi → unsubscribe + yeniden
    let sub = await reg.pushManager.getSubscription();
    if (sub) {
      const saved = await postSubscription(sub);
      if (saved.ok) {
        return { ok: true, message: "Bildirimler zaten açık." };
      }
      try {
        await sub.unsubscribe();
      } catch {
        /* ignore */
      }
      sub = null;
    }

    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appKey,
      });
    } catch (first) {
      console.error("[push] subscribe first attempt", first);
      // Stale subscription / SW race: force re-register SW and retry once
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
      const reg2 = await ensureServiceWorker();
      try {
        sub = await reg2.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toApplicationServerKey(vapid),
        });
      } catch (second) {
        console.error("[push] subscribe second attempt", second);
        return { ok: false, message: explainPushError(second) };
      }
    }

    const saved = await postSubscription(sub);
    if (!saved.ok) {
      return {
        ok: false,
        message: saved.message || "Abonelik kaydedilemedi.",
      };
    }
    return { ok: true, message: "Bildirimler açıldı." };
  } catch (e) {
    console.error("[push]", e);
    return { ok: false, message: explainPushError(e) };
  }
}
