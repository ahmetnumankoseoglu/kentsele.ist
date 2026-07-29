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
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
        if (
          !vapid ||
          !("PushManager" in window) ||
          Notification.permission === "denied"
        ) {
          return;
        }

        // Soft prompt only if already granted, or after user gesture via Hesabım
        if (Notification.permission === "granted") {
          const existing = await reg.pushManager.getSubscription();
          if (existing) {
            await fetch("/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify(existing.toJSON()),
            });
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
  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  if (!vapid) {
    return {
      ok: false,
      message:
        "Push yapılandırılmamış (NEXT_PUBLIC_VAPID_PUBLIC_KEY). Yine de uygulamayı ana ekrana ekleyebilirsin.",
    };
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { ok: false, message: "Bildirim izni verilmedi." };
    }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid),
      });
    }
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(sub.toJSON()),
    });
    if (!res.ok) {
      return { ok: false, message: "Abonelik kaydedilemedi." };
    }
    return { ok: true, message: "Bildirimler açıldı." };
  } catch (e) {
    console.error("[push]", e);
    return { ok: false, message: "Bildirim aboneliği başarısız." };
  }
}
