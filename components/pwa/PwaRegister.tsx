"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
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

async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  // Wait until active (ready can hang if no controller yet)
  if (reg.installing) {
    await new Promise<void>((resolve) => {
      const sw = reg.installing!;
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" || sw.state === "activated") resolve();
      });
    });
  }
  return navigator.serviceWorker.ready;
}

async function postSubscription(sub: PushSubscription): Promise<{
  ok: boolean;
  message?: string;
}> {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(sub.toJSON()),
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

/** Registers service worker; optional push subscribe when VAPID public key set */
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

        const vapid = cleanVapidKey(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        );
        if (
          !vapid ||
          !("PushManager" in window) ||
          Notification.permission === "denied"
        ) {
          return;
        }

        // Soft re-sync only if already granted + existing subscription
        if (Notification.permission === "granted") {
          const existing = await reg.pushManager.getSubscription();
          if (existing) {
            await postSubscription(existing);
            return;
          }
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

/** Call from Hesabım / settings — user gesture for Notification permission */
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

  const vapid = cleanVapidKey(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "");
  if (!vapid) {
    return {
      ok: false,
      message:
        "Push yapılandırılmamış (NEXT_PUBLIC_VAPID_PUBLIC_KEY). Vercel env’e ekleyip redeploy et.",
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
    let sub = await reg.pushManager.getSubscription();

    // VAPID key değiştiyse eski abonelik subscribe’ı bozar — yenile
    if (sub) {
      try {
        await postSubscription(sub);
        return { ok: true, message: "Bildirimler açık." };
      } catch {
        try {
          await sub.unsubscribe();
        } catch {
          /* ignore */
        }
        sub = null;
      }
    }

    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid),
      });
    } catch (e) {
      console.error("[push] subscribe", e);
      const msg = e instanceof Error ? e.message : String(e);
      if (/applicationServerKey|Invalid|DOMException/i.test(msg)) {
        return {
          ok: false,
          message:
            "VAPID anahtarı geçersiz. NEXT_PUBLIC_VAPID_PUBLIC_KEY’i kontrol edip redeploy et.",
        };
      }
      return {
        ok: false,
        message: `Bildirim aboneliği başarısız: ${msg.slice(0, 120)}`,
      };
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
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    return {
      ok: false,
      message: `Bildirim aboneliği başarısız: ${msg.slice(0, 120)}`,
    };
  }
}
