import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ilan/StatusBadge";
import { ContactActions } from "@/components/ilan/ContactActions";
import { getPublicListingBySlug } from "@/lib/listings/queries";
import { ODEME_LABELS, type OdemeTercihi } from "@/lib/constants/listing";
import type { PublicListing } from "@/types/listing";

export default async function IlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let listing: PublicListing | null = null;
  try {
    listing = await getPublicListingBySlug(slug);
  } catch {
    notFound();
  }
  if (!listing) notFound();

  return (
    <AppShell showBottomCta={false}>
      <nav className="mb-4 text-xs text-[#6b7280]">
        <Link href="/" className="font-medium text-[#168f43]">
          kentsele.ist
        </Link>
        <span className="mx-1.5">/</span>
        <span>Kentsel Dönüşüm</span>
        <span className="mx-1.5">/</span>
        <span className="text-[#111321]">{listing.ilce}</span>
      </nav>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#6b7280]">
          İstanbul · {listing.ilce}
          {listing.mahalle ? ` · ${listing.mahalle}` : ""}
        </p>
        <StatusBadge status={listing.status} />
      </div>

      <h1 className="text-[22px] font-bold leading-snug text-[#111321]">
        {listing.kat_sayisi} kat · {listing.daire_sayisi} daire
      </h1>
      <p className="mt-1 text-sm font-bold text-[#168f43]">
        {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
      </p>

      <div className="card-elevated mt-6 p-4">
        <h2 className="text-sm font-bold text-[#111321]">İhtiyaç detayı</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#6b7280]">
          {listing.aciklama}
        </p>
      </div>

      <div className="card mt-4 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf8ee] text-sm font-bold text-[#168f43]">
            {listing.iletisim_adi
              .split(/\s+/)
              .slice(0, 2)
              .map((p) => p[0]?.toUpperCase() ?? "")
              .join("")}
          </div>
          <div>
            <p className="text-sm font-bold text-[#111321]">
              {listing.iletisim_adi}
            </p>
            <p className="text-xs text-[#6b7280]">İlan sahibi</p>
          </div>
        </div>
        <ContactActions
          telefon={listing.telefon}
          anlasildi={listing.status === "anlasildi"}
        />
      </div>

      <Link
        href="/ilan-ver"
        className="btn-primary mt-6 w-full"
      >
        Sen de ilan ver
      </Link>
    </AppShell>
  );
}
