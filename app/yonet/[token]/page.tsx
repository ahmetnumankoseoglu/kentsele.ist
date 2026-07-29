import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { OwnerPanel } from "@/components/yonet/OwnerPanel";
import { getListingByManageToken } from "@/lib/listings/queries";
import { getCurrentProfile, getSessionUser } from "@/lib/auth/session";
import { canOwnerEditListing } from "@/lib/listings/ownership";
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

  const user = await getSessionUser();
  const profile = await getCurrentProfile();

  if (!user || !profile) {
    return (
      <AppShell showBottomCta={false}>
        <div className="card-elevated p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf8ee] text-2xl text-[#2cb34f]">
            🔒
          </div>
          <h1 className="mt-4 text-xl font-bold text-[#111321]">
            İlan düzenlemek için giriş gerekli
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            Düzenleme yalnızca ilanı oluştururken girdiğin{" "}
            <strong>e-posta</strong> ile giriş yaptığında mümkündür. Token tek
            başına yetmez.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href={`/giris?next=${encodeURIComponent(`/yonet/${token}`)}`}
              className="btn-primary w-full"
            >
              Giriş yap
            </Link>
            <Link
              href={`/kayit?next=${encodeURIComponent(`/yonet/${token}`)}`}
              className="btn-secondary w-full"
            >
              Kayıt ol
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const allowed = canOwnerEditListing({
    profileId: profile.id,
    userEmail: user.email,
    listing,
  });

  if (!allowed) {
    return (
      <AppShell showBottomCta={false}>
        <div className="card p-6 text-center">
          <p className="text-sm font-bold text-[#ee401d]">
            Bu ilanı düzenleme yetkin yok
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            İlan, oluşturulurken girilen e-posta hesabına aittir. Lütfen o
            e-posta ile giriş yap. Hesabın:{" "}
            <strong>{user.email ?? "—"}</strong>
          </p>
          <Link href="/hesabim" className="btn-secondary mt-4 w-full">
            Hesabıma git
          </Link>
        </div>
      </AppShell>
    );
  }

  // E-posta eşleşince hesabı bağla
  if (!listing.owner_user_id || listing.owner_user_id !== profile.id) {
    try {
      const { createServiceClient } = await import("@/lib/supabase/admin");
      const admin = createServiceClient();
      await admin
        .from("listings")
        .update({ owner_user_id: profile.id })
        .eq("id", listing.id);
      listing = { ...listing, owner_user_id: profile.id };
    } catch {
      /* ignore */
    }
  }

  const serialized = {
    id: listing.id,
    slug: listing.slug,
    ilce: listing.ilce,
    mahalle: listing.mahalle,
    ada: listing.ada ?? null,
    parsel: listing.parsel ?? null,
    kat_sayisi: listing.kat_sayisi,
    daire_sayisi: listing.daire_sayisi,
    dukkan_sayisi: listing.dukkan_sayisi ?? "0",
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
    belge_aplikasyon: listing.belge_aplikasyon ?? false,
    belge_imar_durum: listing.belge_imar_durum ?? false,
    belge_istikamet_roleve: listing.belge_istikamet_roleve ?? false,
    belge_kot_kesit: listing.belge_kot_kesit ?? false,
  };

  return (
    <AppShell showBottomCta={false}>
      <OwnerPanel listing={serialized} token={token} />
    </AppShell>
  );
}
