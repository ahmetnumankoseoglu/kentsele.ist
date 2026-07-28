import Link from "next/link";
import { StatusBadge } from "@/components/ilan/StatusBadge";
import type { Listing } from "@/types/listing";
import type { ListingStatus } from "@/lib/constants/listing";

function needsAttention(listing: Listing): boolean {
  if (listing.status === "incelemede") return true;
  if (
    listing.agreement_requested_at &&
    listing.status !== "anlasildi"
  ) {
    return true;
  }
  return false;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AdminListingsTable({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <p className="rounded-xl border border-black/5 bg-white px-4 py-6 text-center text-sm text-slate-600">
        Henüz ilan yok.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {listings.map((listing) => {
        const alert = needsAttention(listing);
        return (
          <li key={listing.id}>
            <Link
              href={`/yonetim/ilanlar/${listing.id}`}
              className={`block rounded-xl border px-3 py-3 transition hover:border-black/20 ${
                alert
                  ? "border-amber-200 bg-amber-50/80"
                  : "border-black/5 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {listing.ilce}
                    {listing.mahalle ? ` · ${listing.mahalle}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {listing.kat_sayisi} kat · {listing.daire_sayisi} daire ·{" "}
                    {listing.iletisim_adi}
                  </p>
                </div>
                <StatusBadge
                  status={listing.status as ListingStatus}
                  variant="admin"
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{formatDate(listing.created_at)}</span>
                {listing.status === "incelemede" ? (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 font-medium text-sky-900">
                    Onay bekliyor
                  </span>
                ) : null}
                {listing.agreement_requested_at &&
                listing.status !== "anlasildi" ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-900">
                    Anlaşma talebi
                  </span>
                ) : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
