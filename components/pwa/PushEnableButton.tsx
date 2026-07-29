"use client";

import { useState } from "react";
import { enablePushNotifications } from "@/components/pwa/PwaRegister";

export function PushEnableButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const vapidConfigured = Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()
  );

  async function onClick() {
    setLoading(true);
    setMsg(null);
    const r = await enablePushNotifications();
    setMsg(r.message);
    setLoading(false);
  }

  return (
    <div className="card mt-4 p-4">
      <p className="text-sm font-bold text-[#111321]">Bildirimler</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
        Tarayıcı / PWA bildirimleri (e-postadan ayrı). Açtığında şunları
        alabilirsin:
      </p>
      <ul className="mt-2 list-inside list-disc text-xs text-[#6b7280]">
        <li>
          Yeni yayına alınan ilanlar — yalnızca onaylı müteahhit hesaplarına
        </li>
        <li>Kendi ilanının yayına alınması / kaldırılması</li>
        <li>Müteahhit onay veya red sonucu</li>
      </ul>
      {!vapidConfigured ? (
        <p className="mt-2 rounded-[3px] bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
          Sunucuda{" "}
          <code className="font-mono text-[11px]">
            NEXT_PUBLIC_VAPID_PUBLIC_KEY
          </code>{" "}
          tanımlı değil. Vercel env’e ekleyip yeniden deploy et.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={loading || !vapidConfigured}
        className="btn-secondary mt-3 w-full !py-2.5 !text-sm disabled:opacity-50"
      >
        {loading ? "…" : "Bildirimleri aç"}
      </button>
      {msg ? (
        <p
          className={`mt-2 text-xs font-medium ${
            msg.includes("açıldı") || msg.includes("açık")
              ? "text-[#168f43]"
              : "text-[#be3317]"
          }`}
        >
          {msg}
        </p>
      ) : null}
    </div>
  );
}
