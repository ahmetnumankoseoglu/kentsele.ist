"use client";

import { useRouter } from "next/navigation";

export function ContactMessageActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  async function setStatus(next: "yeni" | "okundu" | "arsiv") {
    await fetch("/api/yonetim/iletisim", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {status !== "okundu" && (
        <button
          type="button"
          className="btn-secondary !py-1.5 !text-xs"
          onClick={() => setStatus("okundu")}
        >
          Okundu
        </button>
      )}
      {status !== "arsiv" && (
        <button
          type="button"
          className="btn-secondary !py-1.5 !text-xs"
          onClick={() => setStatus("arsiv")}
        >
          Arşivle
        </button>
      )}
      {status !== "yeni" && (
        <button
          type="button"
          className="btn-secondary !py-1.5 !text-xs"
          onClick={() => setStatus("yeni")}
        >
          Yeni yap
        </button>
      )}
    </div>
  );
}
