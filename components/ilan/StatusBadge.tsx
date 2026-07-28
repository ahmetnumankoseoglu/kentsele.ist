import {
  OWNER_STATUS_LABELS,
  PUBLIC_STATUS_LABELS,
  STATUS_LABELS,
  type ListingStatus,
} from "@/lib/constants/listing";

/** Teklife açık = yeşil, anlaşma = gri */
const styles: Partial<Record<ListingStatus, string>> = {
  yayinda: "bg-[#eaf8ee] text-[#168f43]",
  teklif_saglaniyor: "bg-[#eaf8ee] text-[#168f43]",
  anlasildi: "bg-[#f3f4f6] text-[#6b7280]",
  incelemede: "bg-amber-50 text-amber-800",
  kaldirildi: "bg-[#fef2f2] text-[#be3317]",
};

type Variant = "public" | "owner" | "admin";

export function StatusBadge({
  status,
  variant = "public",
}: {
  status: ListingStatus;
  variant?: Variant;
}) {
  const label =
    variant === "owner"
      ? OWNER_STATUS_LABELS[status]
      : variant === "admin"
        ? STATUS_LABELS[status]
        : (PUBLIC_STATUS_LABELS[status] ?? STATUS_LABELS[status]);

  if (variant === "public" && !PUBLIC_STATUS_LABELS[status]) {
    return null;
  }

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${styles[status] ?? "bg-[#f8f8f8] text-[#6b7280]"}`}
    >
      {label}
    </span>
  );
}
