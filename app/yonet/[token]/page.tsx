import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { OwnerPanel } from "@/components/yonet/OwnerPanel";
import { getListingByManageToken } from "@/lib/listings/queries";
import { getCurrentProfile, getSessionUser } from "@/lib/auth/session";
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
            İlan oluşturmak ücretsiz ve kayıtsızdır. Düzenleme, anlaşma bildirimi
            ve yönetim için hesap açman veya giriş yapman gerekir. Girişten sonra
            bu ilan hesabına bağlanır.
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
              Kayıt ol (malik)
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (listing.owner_user_id && listing.owner_user_id !== profile.id) {
    return (
      <AppShell showBottomCta={false}>
        <div className="card p-6 text-center text-sm text-[#ee401d]">
          Bu ilan başka bir hesaba bağlı.
        </div>
      </AppShell>
    );
  }

  // Auto-claim on view when logged in
  if (!listing.owner_user_id) {
    try {
      const { createServiceClient } = await import("@/lib/supabase/admin");
      const admin = createServiceClient();
      await admin
        .from("listings")
        .update({ owner_user_id: profile.id })
        .eq("id", listing.id);
      listing = { ...listing, owner_user_id: profile.id };
    } catch {
      /* ignore if column missing until migration */
    }
  }

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
