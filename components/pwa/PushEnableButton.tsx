"use client";

import { useState } from "react";
import { enablePushNotifications } from "@/components/pwa/PwaRegister";

export function PushEnableButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    setMsg(null);
    setOk(false);
    const r = await enablePushNotifications();
    setMsg(r.message);
    setOk(r.ok);
    setLoading(false);
  }

  return (
    <div className="card mt-4 p-4">
      <p className="text-sm font-bold text-[#111321]">Bildirimler</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
        Tarayıcı bildirimleri: yeni ilanlar (onaylı müteahhit), ilan durumun ve
        müteahhit onay sonucu.
      </p>
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={loading}
        className="btn-secondary mt-3 w-full !py-2.5 !text-sm disabled:opacity-50"
      >
        {loading ? "…" : "Bildirimleri aç"}
      </button>
      {msg ? (
        <p
          className={`mt-2 text-xs font-medium ${
            ok ? "text-[#168f43]" : "text-[#be3317]"
          }`}
        >
          {msg}
        </p>
      ) : null}
    </div>
  );
}
