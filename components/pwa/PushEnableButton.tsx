"use client";

import { useState } from "react";
import { enablePushNotifications } from "@/components/pwa/PwaRegister";

export function PushEnableButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      <p className="mt-1 text-xs text-[#6b7280]">
        Uygulamayı ana ekrana ekleyebilir ve tarayıcı izin verdiyse push
        bildirim alabilirsin.
      </p>
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={loading}
        className="btn-secondary mt-3 w-full !py-2.5 !text-sm"
      >
        {loading ? "…" : "Bildirimleri aç"}
      </button>
      {msg ? (
        <p className="mt-2 text-xs font-medium text-[#168f43]">{msg}</p>
      ) : null}
    </div>
  );
}
