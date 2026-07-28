import { STATUS_LABELS, type ListingStatus } from "@/lib/constants/listing";

const styles: Partial<Record<ListingStatus, string>> = {
  yayinda: "bg-[#eaf8ee] text-[#168f43]",
  teklif_saglaniyor: "bg-[#fff7e6] text-[#b45309]",
  anlasildi: "bg-[#f3f4f6] text-[#6b7280]",
  incelemede: "bg-[#eff6ff] text-[#1d4ed8]",
  kaldirildi: "bg-[#fef2f2] text-[#be3317]",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${styles[status] ?? "bg-[#f8f8f8] text-[#6b7280]"}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
