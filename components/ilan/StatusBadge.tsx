import { STATUS_LABELS, type ListingStatus } from "@/lib/constants/listing";

const styles: Partial<Record<ListingStatus, string>> = {
  yayinda: "bg-emerald-50 text-emerald-800",
  teklif_saglaniyor: "bg-amber-50 text-amber-900",
  anlasildi: "bg-slate-100 text-slate-600",
  incelemede: "bg-sky-50 text-sky-900",
  kaldirildi: "bg-rose-50 text-rose-800",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-slate-100"}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
