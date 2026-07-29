"use client";

import { useEffect } from "react";

/** web.dev / web-push standardı — Uint8Array (ArrayBuffer değil) */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function cleanVapidKey(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, "");
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
    /* ignore */
  }
  const embedded = cleanVapidKey(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
  );
  return embedded.length >= 80 ? embedded : null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker desteklenmiyor");
  }

  const reg = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });

  // Aktif olana kadar bekle
  if (reg.installing) {
    await new Promise<void>((resolve, reject) => {
      const sw = reg.installing!;
      const t = window.setTimeout(
        () => reject(new Error("Service Worker kurulum zaman aşımı")),
        20_000
      );
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" || sw.state === "activated") {
          window.clearTimeout(t);
          resolve();
        }
        if (sw.state === "redundant") {
          window.clearTimeout(t);
          reject(new Error("Service Worker kurulumu başarısız"));
        }
      });
    });
  }

  if (reg.waiting) {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
  }

  const ready = await navigator.serviceWorker.ready;

  // Sayfa controller olana kadar kısa bekle (ilk ziyaret)
  if (!navigator.serviceWorker.controller) {
    await Promise.race([
      new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true }
        );
      }),
      sleep(2500),
    ]);
  }

  if (!ready.active) {
    throw new Error("Service Worker aktif değil");
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
  try {
    const data = (await res.json()) as { message?: string; error?: string };
    if (data.message) return { ok: false, message: data.message };
    if (data.error === "db")
      return {
        ok: false,
        message:
          "Abonelik DB’ye yazılamadı. Supabase’te 013_push_subscriptions.sql çalıştırıldı mı?",
      };
  } catch {
    /* ignore */
  }
  return { ok: false, message: `Abonelik kaydı HTTP ${res.status}` };
}

export type PushDiagnostics = {
  secure: boolean;
  permission: NotificationPermission | "unsupported";
  hasServiceWorker: boolean;
  hasPushManager: boolean;
  controller: boolean;
  swState: string;
  vapidChars: number;
  vapidBytes: number;
  vapidFirstByte: number;
  healthCanSubscribe: boolean | null;
  healthCanSend: boolean | null;
  step: string;
  lastError: string | null;
};

export async function collectPushDiagnostics(): Promise<PushDiagnostics> {
  const d: PushDiagnostics = {
    secure: typeof window !== "undefined" && window.isSecureContext,
    permission:
      typeof Notification !== "undefined"
        ? Notification.permission
        : "unsupported",
    hasServiceWorker: "serviceWorker" in navigator,
    hasPushManager: "PushManager" in window,
    controller: Boolean(navigator.serviceWorker?.controller),
    swState: "—",
    vapidChars: 0,
    vapidBytes: 0,
    vapidFirstByte: -1,
    healthCanSubscribe: null,
    healthCanSend: null,
    step: "init",
    lastError: null,
  };

  try {
    const h = await fetch("/api/push/health", { cache: "no-store" }).then(
      (r) =>
        r.json() as Promise<{ canSubscribe?: boolean; canSend?: boolean }>
    );
    d.healthCanSubscribe = Boolean(h.canSubscribe);
    d.healthCanSend = Boolean(h.canSend);
  } catch {
    d.healthCanSubscribe = null;
  }

  try {
    const vapid = await fetchVapidPublicKey();
    if (vapid) {
      d.vapidChars = vapid.length;
      const u8 = urlBase64ToUint8Array(vapid);
      d.vapidBytes = u8.length;
      d.vapidFirstByte = u8[0] ?? -1;
    }
  } catch (e) {
    d.lastError = e instanceof Error ? e.message : String(e);
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration("/");
    d.swState =
      reg?.active?.state ||
      reg?.waiting?.state ||
      reg?.installing?.state ||
      "yok";
    d.controller = Boolean(navigator.serviceWorker.controller);
  } catch {
    d.swState = "hata";
  }

  return d;
}

/** Arka plan: SW kaydı + mevcut aboneliği sunucuya yaz */
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
        const sub = await reg.pushManager.getSubscription();
        if (sub) await postSubscription(sub);
      } catch (e) {
        console.warn("[pwa]", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

/**
 * Hesabım — kullanıcı tıklamasıyla izin + FCM aboneliği
 */
export async function enablePushNotifications(): Promise<{
  ok: boolean;
  message: string;
  diagnostics?: PushDiagnostics;
}> {
  const diag = await collectPushDiagnostics();

  if (!diag.secure) {
    return {
      ok: false,
      message: "Bildirimler yalnızca HTTPS üzerinde çalışır.",
      diagnostics: diag,
    };
  }
  if (!diag.hasServiceWorker || !diag.hasPushManager) {
    return {
      ok: false,
      message:
        "Bu tarayıcı Web Push desteklemiyor. Chrome veya Edge’in güncel sürümünü dene.",
      diagnostics: diag,
    };
  }
  if (diag.healthCanSubscribe === false) {
    return {
      ok: false,
      message:
        "Sunucuda VAPID public key yok. Vercel env + redeploy kontrol et (/api/push/health).",
      diagnostics: diag,
    };
  }

  const vapid = await fetchVapidPublicKey();
  if (!vapid) {
    return {
      ok: false,
      message: "VAPID public key alınamadı.",
      diagnostics: diag,
    };
  }

  const keyBytes = urlBase64ToUint8Array(vapid);
  if (keyBytes.length !== 65 || keyBytes[0] !== 4) {
    return {
      ok: false,
      message: `VAPID public key bozuk (bayt=${keyBytes.length}, ilk=${keyBytes[0]}). Yeniden üret.`,
      diagnostics: { ...diag, vapidBytes: keyBytes.length, vapidFirstByte: keyBytes[0] ?? -1 },
    };
  }

  try {
    diag.step = "permission";
    const permission = await Notification.requestPermission();
    diag.permission = permission;
    if (permission !== "granted") {
      return {
        ok: false,
        message:
          permission === "denied"
            ? "İzin engelli görünüyor. chrome://settings/content/notifications içinde kentsele.ist = İzin ver olmalı (yalnızca site popup’ı yetmeyebilir)."
            : "Bildirim izni verilmedi.",
        diagnostics: diag,
      };
    }

    diag.step = "service-worker";
    const reg = await ensureServiceWorker();
    diag.swState = reg.active?.state || "—";
    diag.controller = Boolean(navigator.serviceWorker.controller);

    // Mevcut abonelik varsa önce sunucuya yaz — FCM zaten kayıtlı demektir
    diag.step = "existing-subscription";
    let sub = await reg.pushManager.getSubscription();
    if (sub) {
      const saved = await postSubscription(sub);
      if (saved.ok) {
        return {
          ok: true,
          message: "Bildirimler zaten açık ve sunucuya kaydedildi.",
          diagnostics: diag,
        };
      }
      // Eski abonelik sunucuya yazılamadıysa yenile
      try {
        await sub.unsubscribe();
        await sleep(400);
      } catch {
        /* ignore */
      }
      sub = null;
    }

    diag.step = "subscribe";
    try {
      // web.dev örneği birebir: Uint8Array
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes as BufferSource,
      });
    } catch (subErr) {
      console.error("[push] subscribe", subErr);
      const errMsg =
        subErr instanceof Error ? subErr.message : String(subErr);
      const errName =
        subErr instanceof DOMException ? subErr.name : "";
      diag.lastError = `${errName}: ${errMsg}`;

      // İkinci deneme: kısa bekle + SW update
      try {
        await reg.update();
        await sleep(500);
        const existing2 = await reg.pushManager.getSubscription();
        if (existing2) {
          try {
            await existing2.unsubscribe();
            await sleep(400);
          } catch {
            /* ignore */
          }
        }
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
        });
      } catch (subErr2) {
        console.error("[push] subscribe retry", subErr2);
        const msg2 =
          subErr2 instanceof Error ? subErr2.message : String(subErr2);
        diag.lastError = msg2;
        diag.step = "subscribe-failed";

        // İzin var ama FCM red — net ayrım
        if (/push service error|registration failed/i.test(msg2 + errMsg)) {
          return {
            ok: false,
            message:
              "Site izni açık ama Chrome FCM aboneliğini oluşturamıyor (VAPID sunucuda OK). " +
              "Bu genelde tarayıcı/OS tarafıdır: Windows Bildirim ayarları, Chrome arka plan uygulamaları, " +
              "VPN/antivirüs veya bozuk site verisi. " +
              "Yap: (1) Site verilerini sil → F5 → tekrar dene (2) Edge ile dene (3) chrome://gcm-internals — hatalara bak. " +
              `Teşhis: izin=${permission}, SW=${diag.swState}, controller=${diag.controller}`,
            diagnostics: diag,
          };
        }
        return {
          ok: false,
          message: `Abonelik hatası: ${msg2}`,
          diagnostics: diag,
        };
      }
    }

    diag.step = "save";
    const saved = await postSubscription(sub);
    if (!saved.ok) {
      return {
        ok: false,
        message: saved.message || "Abonelik kaydedilemedi.",
        diagnostics: diag,
      };
    }

    diag.step = "done";
    return {
      ok: true,
      message: "Bildirimler açıldı.",
      diagnostics: diag,
    };
  } catch (e) {
    console.error("[push]", e);
    diag.lastError = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      message: `Bildirim aboneliği başarısız: ${diag.lastError}`,
      diagnostics: diag,
    };
  }
}
