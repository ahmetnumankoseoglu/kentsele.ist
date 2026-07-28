"use client";

import { useRouter } from "next/navigation";

export function ContractorAdminActions({ userId }: { userId: string }) {
  const router = useRouter();

  async function setStatus(verification_status: "approved" | "rejected" | "pending") {
    await fetch(`/api/yonetim/muteahhitler/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verification_status,
        rejection_reason:
          verification_status === "rejected" ? "Belgeler yetersiz" : null,
      }),
    });
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        className="btn-primary !py-2 !text-xs"
        onClick={() => setStatus("approved")}
      >
        Onayla
      </button>
      <button
        type="button"
        className="btn-secondary !py-2 !text-xs text-[#ee401d]"
        onClick={() => setStatus("rejected")}
      >
        Reddet
      </button>
      <button
        type="button"
        className="btn-secondary !py-2 !text-xs"
        onClick={() => setStatus("pending")}
      >
        Beklet
      </button>
    </div>
  );
}
