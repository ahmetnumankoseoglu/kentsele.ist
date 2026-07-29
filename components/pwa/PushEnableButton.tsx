"use client";

import { useEffect, useState } from "react";
import {
  collectPushDiagnostics,
  enablePushNotifications,
  type PushDiagnostics,
} from "@/components/pwa/PwaRegister";

type Health = {
  canSubscribe?: boolean;
  canSend?: boolean;
  publicKeyPrefix?: string | null;
  hint?: string;
};

export function PushEnableButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [diag, setDiag] = useState<PushDiagnostics | null>(null);

  useEffect(() => {
    void fetch("/api/push/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Health) => setHealth(d))
      .catch(() => setHealth({ canSubscribe: false }));
  }, []);

  async function onClick() {
    setLoading(true);
    setMsg(null);
    setOk(false);
    const r = await enablePushNotifications();
    setMsg(r.message);
    setOk(r.ok);
    if (r.diagnostics) setDiag(r.diagnostics);
    setLoading(false);
  }

  async function onDiagnose() {
    setLoading(true);
    const d = await collectPushDiagnostics();
    setDiag(d);
    setMsg("Teşhis güncellendi (aşağıda).");
    setOk(true);
    setLoading(false);
  }

  return (
    <div className="card mt-4 p-4">
      <p className="text-sm font-bold text-[#111321]">Bildirimler</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
        Tarayıcı push bildirimleri. Site izni ile FCM aboneliği ayrı adımlardır —
        izin açık olsa bile FCM bazen reddedebilir.
      </p>
      <ul className="mt-2 list-inside list-disc text-xs text-[#6b7280]">
        <li>Yeni ilan → onaylı müteahhitlere</li>
        <li>Kendi ilanının durum değişimi</li>
        <li>Müteahhit onay / red</li>
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

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void onClick()}
          disabled={loading || health?.canSubscribe === false}
          className="btn-secondary flex-1 !py-2.5 !text-sm disabled:opacity-50"
        >
          {loading ? "…" : "Bildirimleri aç"}
        </button>
        <button
          type="button"
          onClick={() => void onDiagnose()}
          disabled={loading}
          className="rounded-[3px] border border-[#e3e4e6] bg-white px-3 py-2.5 text-xs font-bold text-[#6b7280] hover:border-[#2cb34f] disabled:opacity-50"
        >
          Teşhis
        </button>
      </div>

      {msg ? (
        <p
          className={`mt-2 text-xs font-medium leading-relaxed ${
            ok ? "text-[#168f43]" : "text-[#be3317]"
          }`}
        >
          {msg}
        </p>
      ) : null}

      {diag ? (
        <pre className="mt-3 overflow-x-auto rounded-[3px] bg-[#111321] p-3 text-[10px] leading-relaxed text-[#a7f3d0]">
          {JSON.stringify(
            {
              permission: diag.permission,
              secure: diag.secure,
              swState: diag.swState,
              controller: diag.controller,
              vapidBytes: diag.vapidBytes,
              vapidFirstByte: diag.vapidFirstByte,
              healthSubscribe: diag.healthCanSubscribe,
              healthSend: diag.healthCanSend,
              step: diag.step,
              lastError: diag.lastError,
            },
            null,
            2
          )}
        </pre>
      ) : null}

      <p className="mt-2 text-[10px] leading-relaxed text-[#9ca3af]">
        İzin = site ayarı. FCM = Chrome’un Google push servisi. İzin açık + FCM
        red ise Windows bildirimleri / VPN / antivirüs veya bozuk profil dene.
        Edge’de çalışıyorsa sorun Chrome+FCM.
      </p>
    </div>
  );
}
