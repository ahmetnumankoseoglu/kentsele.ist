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
      const res = await fetch(`/api/yonetim/muteahhitler/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification_status,
          rejection_reason:
            verification_status === "rejected" ? "Belgeler yetersiz" : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.message ||
            (res.status === 401
              ? "Oturum geçersiz. Yeniden giriş yap."
              : "Durum güncellenemedi. Supabase migration 009 uygulandı mı?")
        );
        return;
      }
      setOk(
        verification_status === "approved"
          ? "Onaylandı."
          : verification_status === "rejected"
            ? "Reddedildi."
            : "Beklemeye alındı."
      );
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary !py-2 !text-xs"
          disabled={!!loading}
          onClick={() => setStatus("approved")}
        >
          {loading === "approved" ? "…" : "Onayla"}
        </button>
        <button
          type="button"
          className="btn-secondary !py-2 !text-xs text-[#ee401d]"
          disabled={!!loading}
          onClick={() => setStatus("rejected")}
        >
          {loading === "rejected" ? "…" : "Reddet"}
        </button>
        <button
          type="button"
          className="btn-secondary !py-2 !text-xs"
          disabled={!!loading}
          onClick={() => setStatus("pending")}
        >
          {loading === "pending" ? "…" : "Beklet"}
        </button>
      </div>
      {error ? (
        <p className="text-xs font-medium text-[#ee401d]">{error}</p>
      ) : null}
      {ok ? (
        <p className="text-xs font-medium text-[#168f43]">{ok}</p>
      ) : null}
    </div>
  );
}
