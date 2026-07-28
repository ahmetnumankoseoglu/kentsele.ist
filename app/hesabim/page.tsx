import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  getContractorProfile,
  getCurrentProfile,
  getSessionUser,
} from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/admin";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function HesabimPage() {
  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/hesabim");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/giris");

  let myListings: { id: string; slug: string; ilce: string; status: string }[] =
    [];
  try {
    const admin = createServiceClient();
    const { data } = await admin
      .from("listings")
      .select("id, slug, ilce, status")
      .eq("owner_user_id", profile.id)
      .order("created_at", { ascending: false });
    myListings = data ?? [];
  } catch {
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
          <Link href="/muteahhit" className="btn-primary mt-3 inline-flex">
            Müteahhit paneli / belgeler
          </Link>
        </div>
      )}

      <section className="mt-8">
        <h2 className="section-title">İlanlarım</h2>
        {myListings.length === 0 ? (
          <div className="card p-5 text-sm text-[#6b7280]">
            Henüz hesabına bağlı ilan yok. Yeni ilan ücretsiz ve kayıtsız
            oluşturulur; düzenlemek için yönetim linkinden giriş yapıp ilanı
            bağlarsın.
            <Link href="/ilan-ver" className="mt-3 block font-bold text-[#168f43]">
              İlan ver →
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {myListings.map((l) => (
              <li key={l.id} className="card flex justify-between p-3 text-sm">
                <span className="font-semibold">{l.ilce}</span>
                <span className="text-[#6b7280]">{l.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
