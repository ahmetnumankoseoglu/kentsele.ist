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
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">İstanbul · {listing.ilce}</p>
        <StatusBadge status={listing.status} />
      </div>
      <h1 className="text-xl font-semibold">
        {listing.kat_sayisi} kat · {listing.daire_sayisi} daire
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
        {listing.mahalle ? ` · ${listing.mahalle}` : ""}
      </p>
      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-4">
        <h2 className="text-sm font-semibold">İhtiyaç detayı</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {listing.aciklama}
        </p>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-slate-700">
          {listing.iletisim_adi}
        </p>
        <ContactActions
          telefon={listing.telefon}
          anlasildi={listing.status === "anlasildi"}
        />
      </div>
    </AppShell>
  );
}
