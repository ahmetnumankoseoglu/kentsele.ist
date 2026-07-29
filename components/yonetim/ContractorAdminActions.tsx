"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContractorAdminActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function setStatus(
    verification_status: "approved" | "rejected" | "pending"
  ) {
    setLoading(verification_status);
    setError(null);
    setOk(null);
    try {
      const res = await fetch(
        `/api/yonetim/muteahhitler/${encodeURIComponent(userId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            verification_status,
            rejection_reason:
              verification_status === "rejected" ? "Belgeler yetersiz" : null,
          }),
        }
      );

      let data: { message?: string; error?: string; item?: unknown } = {};
      try {
        data = await res.json();
      } catch {
        /* non-json */
      }

      if (!res.ok) {
        const msg =
          data.message ||
          (res.status === 401
            ? "Oturum geçersiz. /yonetim’den yeniden giriş yap."
            : res.status === 404
              ? "API bulunamadı — deploy tamamlandı mı?"
              : `Durum güncellenemedi (HTTP ${res.status}). Supabase SQL Editor’da 010_admin_set_contractor_verification.sql çalıştır.`);
        setError(msg);
        console.error("[ContractorAdminActions]", res.status, data);
        return;
      }

      setOk(
        verification_status === "approved"
          ? "Onaylandı — durum güncellendi."
          : verification_status === "rejected"
            ? "Reddedildi — durum güncellendi."
            : "Beklemeye alındı."
      );
      router.refresh();
    } catch (e) {
      console.error("[ContractorAdminActions]", e);
      setError("Bağlantı hatası. Ağ veya sunucu yanıt vermiyor.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary !py-2 !text-xs"
          disabled={!!loading}
          onClick={() => void setStatus("approved")}
        >
          {loading === "approved" ? "Onaylanıyor…" : "Onayla"}
        </button>
        <button
          type="button"
          className="btn-secondary !py-2 !text-xs text-[#ee401d]"
          disabled={!!loading}
          onClick={() => void setStatus("rejected")}
        >
          {loading === "rejected" ? "Reddediliyor…" : "Reddet"}
        </button>
        <button
          type="button"
          className="btn-secondary !py-2 !text-xs"
          disabled={!!loading}
          onClick={() => void setStatus("pending")}
        >
          {loading === "pending" ? "Bekletiliyor…" : "Beklet"}
        </button>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-[3px] border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium leading-relaxed text-rose-800"
        >
          {error}
        </div>
      ) : null}
      {ok ? (
        <div
          role="status"
          className="rounded-[3px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"
        >
          {ok}
        </div>
      ) : null}
    </div>
  );
}
