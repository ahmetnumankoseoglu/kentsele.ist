import Link from "next/link";
import type { PublicListing } from "@/types/listing";
import { ODEME_LABELS, type OdemeTercihi } from "@/lib/constants/listing";
import { StatusBadge } from "./StatusBadge";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function ListingCard({ listing }: { listing: PublicListing }) {
  const adaParsel =
    listing.ada || listing.parsel
      ? [
          listing.ada ? `Ada ${listing.ada}` : null,
          listing.parsel ? `Parsel ${listing.parsel}` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  return (
    <Link
      href={`/ilan/${listing.slug}`}
      className="card flex gap-3 p-4 transition hover:shadow-[var(--card-shadow)] active:scale-[0.995]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf8ee] text-sm font-bold text-[#168f43]">
        {initials(listing.iletisim_adi || listing.ilce)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-[#111321]">
              {listing.ilce}
              {listing.mahalle ? ` · ${listing.mahalle}` : ""}
              {adaParsel ? ` · ${adaParsel}` : ""}
            </p>
            <p className="mt-0.5 text-xs text-[#6b7280]">
              Kentsel Dönüşüm · {listing.kat_sayisi} kat · {listing.daire_sayisi}{" "}
              daire
            </p>
          </div>
          <StatusBadge status={listing.status} />
        </div>
        <p className="mt-2 text-xs font-medium text-[#168f43]">
          {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-[#6b7280]">
          {listing.aciklama}
        </p>
      </div>
    </Link>
  );
}
