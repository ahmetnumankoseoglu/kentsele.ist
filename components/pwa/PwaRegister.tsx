"use client";

import { useEffect } from "react";

/** web.dev standardı — Uint8Array */
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
    return { ok: false, message: "Abonelik anahtarları eksik." };
  }
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(json),
  });
  if (res.ok) return { ok: true };
  return { ok: false, message: "Abonelik kaydedilemedi." };
}

async function showWelcomeNotification(reg: ServiceWorkerRegistration) {
  try {
    await reg.showNotification("kentsele.ist", {
      body: "Bildirimler açıldı. Önemli güncellemeleri buradan alacaksın.",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "kentsele-welcome",
      data: { url: "/hesabim" },
    });
  } catch {
    try {
      // SW showNotification yoksa klasik API
      new Notification("kentsele.ist", {
        body: "Bildirimler açıldı. Önemli güncellemeleri buradan alacaksın.",
        icon: "/favicon.ico",
        tag: "kentsele-welcome",
      });
    } catch {
      /* ignore */
    }
  }
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
      } catch {
        /* sessiz */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

/** Hesabım — kullanıcı tıklamasıyla izin + abonelik */
export async function enablePushNotifications(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return { ok: false, message: "Bu tarayıcı bildirim desteklemiyor." };
  }
  if (!("PushManager" in window)) {
    return { ok: false, message: "Bu tarayıcı Web Push desteklemiyor." };
  }
  if (!window.isSecureContext) {
    return { ok: false, message: "Bildirimler yalnızca HTTPS üzerinde çalışır." };
  }

  const vapid = await fetchVapidPublicKey();
  if (!vapid) {
    return { ok: false, message: "Bildirim yapılandırması eksik." };
  }

  const keyBytes = urlBase64ToUint8Array(vapid);
  if (keyBytes.length !== 65 || keyBytes[0] !== 4) {
    return { ok: false, message: "Bildirim anahtarı geçersiz." };
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

    let sub = await reg.pushManager.getSubscription();
    if (sub) {
      const saved = await postSubscription(sub);
      if (saved.ok) {
        await showWelcomeNotification(reg);
        return { ok: true, message: "Bildirimler açık." };
      }
      try {
        await sub.unsubscribe();
        await sleep(400);
      } catch {
        /* ignore */
      }
      sub = null;
    }

    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes as BufferSource,
      });
    } catch {
      try {
        await reg.update();
        await sleep(500);
        const existing = await reg.pushManager.getSubscription();
        if (existing) {
          try {
            await existing.unsubscribe();
            await sleep(400);
          } catch {
            /* ignore */
          }
        }
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
        });
      } catch {
        return {
          ok: false,
          message:
            "Bildirim aboneliği başarısız. Tarayıcı ayarlarını kontrol edip tekrar dene.",
        };
      }
    }

    const saved = await postSubscription(sub);
    if (!saved.ok) {
      return { ok: false, message: saved.message || "Abonelik kaydedilemedi." };
    }

    await showWelcomeNotification(reg);
    return { ok: true, message: "Bildirimler açıldı." };
  } catch {
    return { ok: false, message: "Bildirim aboneliği başarısız." };
  }
}
