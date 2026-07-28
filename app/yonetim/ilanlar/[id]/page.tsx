import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AdminListingActions } from "@/components/yonetim/AdminListingActions";
import { AdminLogoutButton } from "@/components/yonetim/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { getListingById } from "@/lib/listings/queries";
import type { Listing } from "@/types/listing";
import type { ListingStatus, OdemeTercihi } from "@/lib/constants/listing";

export default async function YonetimIlanDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/yonetim");
  }

  const { id } = await params;

  let listing: Listing | null = null;
  try {
    listing = await getListingById(id);
  } catch {
    notFound();
  }
  if (!listing) notFound();

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
    manage_token: listing.manage_token,
  };

  return (
    <AppShell showBottomCta={false}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <Link
            href="/yonetim/ilanlar"
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            ← İlan listesi
          </Link>
          <h1 className="mt-1 text-xl font-semibold">
            {listing.ilce}
            {listing.mahalle ? ` · ${listing.mahalle}` : ""}
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {listing.iletisim_adi} · {listing.telefon}
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminListingActions listing={serialized} />
    </AppShell>
  );
}
