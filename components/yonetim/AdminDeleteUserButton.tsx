"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminDeleteUserButton({
  userId,
  label,
  redirectTo,
}: {
  userId: string;
  /** Onay diyaloğunda gösterilecek isim */
  label: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    const ok = window.confirm(
      `"${label}" üyesini silmek istediğine emin misin?\n\nBu işlem geri alınamaz. Hesap ve ilişkili müteahhit belgeleri silinir; ilanlardaki sahiplik bağlantısı kaldırılır.`
    );
    if (!ok) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/yonetim/uyeler/${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Silinemedi.");
        setLoading(false);
        return;
      }
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 border-t border-[#e3e4e6] pt-4">
      <button
        type="button"
        onClick={onDelete}
        disabled={loading}
        className="w-full rounded-[3px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
      >
        {loading ? "Siliniyor…" : "Üyeliği sil"}
      </button>
      {error ? (
        <p className="mt-2 text-center text-xs text-[#ee401d]">{error}</p>
      ) : null}
    </div>
  );
}
