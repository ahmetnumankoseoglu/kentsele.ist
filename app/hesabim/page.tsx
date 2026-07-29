import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  getContractorProfile,
  getCurrentProfile,
  getSessionUser,
} from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { PushEnableButton } from "@/components/pwa/PushEnableButton";
import {
  OWNER_STATUS_LABELS,
  PUBLIC_STATUSES,
  type ListingStatus,
} from "@/lib/constants/listing";

type MyListing = {
  id: string;
  slug: string;
  ilce: string;
  mahalle: string | null;
  status: ListingStatus;
  manage_token: string;
  kat_sayisi: string;
  daire_sayisi: string;
  dukkan_sayisi?: string | null;
};

export default async function HesabimPage() {
  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/hesabim");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/giris");

  let myListings: MyListing[] = [];
  try {
    const { getListingsForAccount } = await import(
      "@/lib/listings/claim-by-email"
    );
    const rows = await getListingsForAccount(profile.id, user.email);
    myListings = rows as MyListing[];
  } catch (e) {
    console.error("[hesabim] listings", e);
    myListings = [];
  }

  const contractor =
    profile.role === "muteahhit"
      ? await getContractorProfile(profile.id)
      : null;

  return (
    <AppShell showBottomCta={false}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111321]">Hesabım</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {profile.full_name || user.email} ·{" "}
            <span className="font-semibold text-[#168f43]">
              {profile.role === "muteahhit"
                ? "Müteahhit"
                : profile.role === "admin"
                  ? "Admin"
                  : "Malik"}
            </span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <PushEnableButton />

      {contractor && (
        <div className="card mt-5 p-4">
          <p className="text-sm font-bold text-[#111321]">
            Doğrulama:{" "}
            <span
              className={
                contractor.verification_status === "approved"
                  ? "text-[#168f43]"
                  : contractor.verification_status === "rejected"
                    ? "text-[#ee401d]"
                    : "text-[#b45309]"
              }
            >
              {contractor.verification_status === "approved"
                ? "Onaylı"
                : contractor.verification_status === "rejected"
                  ? "Reddedildi"
                  : "İncelemede"}
            </span>
          </p>
          <p className="mt-1 text-xs text-[#6b7280]">
            {contractor.company_name || "Firma adı girilmedi"}
          </p>
          <Link href="/muteahhit" className="btn-primary mt-3 w-full">
            Müteahhit paneli / belgeler
          </Link>
        </div>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="section-title !mb-0">İlanlarım</h2>
          {profile.role !== "muteahhit" && (
            <Link
              href="/ilan-ver"
              className="text-xs font-bold text-[#168f43]"
            >
              + Yeni ilan
            </Link>
          )}
        </div>

        {myListings.length === 0 ? (
          <div className="card p-5 text-sm text-[#6b7280]">
            {profile.role === "muteahhit" ? (
              <p>
                Müteahhit hesapları ilan vermez. İlanları ana sayfa ve ilanlar
                listesinden görüntüleyebilirsin.
              </p>
            ) : (
              <>
                <p>
                  Henüz hesabına bağlı ilan yok. Daha önce kayıtsız ilan verdiysen,
                  ilandaki e-posta ile giriş yaptığından emin ol — sistem otomatik
                  bağlar.
                </p>
                <Link href="/ilan-ver" className="btn-primary mt-3 w-full">
                  İlan ver
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {myListings.map((l) => {
              const isPublic = PUBLIC_STATUSES.includes(l.status);
              const statusLabel = OWNER_STATUS_LABELS[l.status] ?? l.status;
              return (
                <li key={l.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[#111321]">
                        {l.ilce}
                        {l.mahalle ? ` · ${l.mahalle}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280]">
                        {l.kat_sayisi} kat · {l.daire_sayisi} daire
                        {l.dukkan_sayisi && l.dukkan_sayisi !== "0"
                          ? ` · ${l.dukkan_sayisi} dükkan`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        l.status === "yayinda" ||
                        l.status === "teklif_saglaniyor"
                          ? "bg-[#eaf8ee] text-[#168f43]"
                          : l.status === "incelemede"
                            ? "bg-amber-50 text-amber-800"
                            : l.status === "anlasildi"
                              ? "bg-[#f3f4f6] text-[#6b7280]"
                              : l.status === "kaldirildi"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {isPublic ? (
                      <Link
                        href={`/ilan/${l.slug}`}
                        className="btn-secondary !py-2.5 text-center !text-sm"
                      >
                        İlanı gör
                      </Link>
                    ) : (
                      <span className="flex items-center justify-center rounded-[3px] bg-[#f8f8f8] px-2 py-2.5 text-center text-xs text-[#9ca3af]">
                        İnceleniyor
                      </span>
                    )}
                    <Link
                      href={`/yonet/${l.manage_token}`}
                      className="btn-primary !py-2.5 text-center !text-sm"
                    >
                      Düzenle / yönet
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
