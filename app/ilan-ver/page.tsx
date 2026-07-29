import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { IlanVerWizard } from "@/components/ilan-ver/IlanVerWizard";
import { getCurrentProfile, getSessionUser } from "@/lib/auth/session";

export default async function IlanVerPage() {
  const profile = await getCurrentProfile();
  const user = await getSessionUser();

  if (profile?.role === "muteahhit") {
    return (
      <AppShell showBottomCta={false}>
        <div className="card-elevated p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff7e6] text-2xl">
            ⛔
          </div>
          <h1 className="mt-4 text-xl font-bold text-[#111321]">
            Müteahhitler ilan veremez
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            İlan oluşturma yalnızca malik / kat maliki içindir. Müteahhit
            hesabınızla yayındaki ilanları inceleyebilir, onay sonrası iletişim
            bilgilerine ulaşabilirsiniz.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link href="/ilanlar" className="btn-primary w-full">
              İlanlara git
            </Link>
            <Link href="/muteahhit" className="btn-secondary w-full">
              Müteahhit paneli
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const initialContact =
    profile && user
      ? {
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          email: user.email || "",
        }
      : null;

  return (
    <AppShell showBottomCta={false}>
      <IlanVerWizard initialContact={initialContact} />
    </AppShell>
  );
}
