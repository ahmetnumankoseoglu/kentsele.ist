import Link from "next/link";
import type { PublicListing } from "@/types/listing";
import { ODEME_LABELS, type OdemeTercihi } from "@/lib/constants/listing";
import { StatusBadge } from "./StatusBadge";

export function ListingCard({ listing }: { listing: PublicListing }) {
  return (
    <Link
      href={`/ilan/${listing.slug}`}
      className="block rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {listing.ilce}
            {listing.mahalle ? ` · ${listing.mahalle}` : ""}
          </p>
          <p className="text-xs text-slate-500">
            {listing.kat_sayisi} kat · {listing.daire_sayisi} daire ·{" "}
            {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
          </p>
        </div>
        <StatusBadge status={listing.status} />
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{listing.aciklama}</p>
    </Link>
  );
}
