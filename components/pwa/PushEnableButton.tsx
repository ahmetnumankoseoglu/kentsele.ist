"use client";

import { useEffect, useState } from "react";
import { enablePushNotifications } from "@/components/pwa/PwaRegister";

type Health = {
  canSubscribe?: boolean;
  canSend?: boolean;
  publicKeyValid?: boolean;
  privateKeyPresent?: boolean;
  vapidPairOk?: boolean;
  hint?: string;
  publicKeyPrefix?: string | null;
};

export function PushEnableButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    void fetch("/api/push/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Health) => setHealth(d))
      .catch(() => setHealth({ canSubscribe: false }));
  }, []);

  const ready = health?.canSubscribe !== false;

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

      {health ? (
        <p className="mt-2 rounded-[3px] bg-[#f8f8f8] px-2 py-1.5 text-[11px] text-[#6b7280]">
          Sunucu:{" "}
          {health.canSubscribe ? (
            <span className="font-semibold text-[#168f43]">VAPID public OK</span>
          ) : (
            <span className="font-semibold text-[#be3317]">VAPID public yok</span>
          )}
          {health.publicKeyPrefix ? ` (${health.publicKeyPrefix})` : ""}
          {" · "}
          gönderim:{" "}
          {health.canSend ? (
            <span className="font-semibold text-[#168f43]">hazır</span>
          ) : (
            <span className="font-semibold text-[#b45309]">private eksik?</span>
          )}
        </p>
      ) : null}

      {!ready && health ? (
        <p className="mt-2 rounded-[3px] bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
          {health.hint ||
            "NEXT_PUBLIC_VAPID_PUBLIC_KEY Vercel’de yok. Env ekleyip redeploy et."}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void onClick()}
        disabled={loading || health?.canSubscribe === false}
        className="btn-secondary mt-3 w-full !py-2.5 !text-sm disabled:opacity-50"
      >
        {loading ? "…" : "Bildirimleri aç"}
      </button>
      {msg ? (
        <p
          className={`mt-2 text-xs font-medium leading-relaxed ${
            msg.includes("açıldı") ||
            msg.includes("açık") ||
            msg.includes("yenileniyor")
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
