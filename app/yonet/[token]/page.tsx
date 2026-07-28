import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { OwnerPanel } from "@/components/yonet/OwnerPanel";
import { getListingByManageToken } from "@/lib/listings/queries";
import type { Listing } from "@/types/listing";
import type { OdemeTercihi, ListingStatus } from "@/lib/constants/listing";

export default async function YonetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let listing: Listing | null = null;
  try {
    listing = await getListingByManageToken(token);
  } catch {
    notFound();
  }
  if (!listing) notFound();

  // Serialize plain object for client component (no class instances / Dates)
  const serialized = {
    id: listing.id,
    slug: listing.slug,
    ilce: listing.ilce,
    mahalle: listing.mahalle,
    kat_sayisi: listing.kat_sayisi,
    daire_sayisi: listing.daire_sayisi,
    odeme_tercihi: listing.odeme_tercihi as OdemeTercihi,
    aciklama: listing.aciklama,
    iletisim_adi: listing.iletisim_adi,
    telefon: listing.telefon,
    email: listing.email,
    status: listing.status as ListingStatus,
    agreement_requested_at: listing.agreement_requested_at,
    published_at: listing.published_at,
    created_at: listing.created_at,
    updated_at: listing.updated_at,
  };

  return (
    <AppShell showBottomCta={false}>
      <OwnerPanel listing={serialized} token={token} />
    </AppShell>
  );
}
