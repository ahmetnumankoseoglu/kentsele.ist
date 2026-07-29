import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ContactForm } from "@/components/iletisim/ContactForm";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import { getCurrentProfile, getSessionUser } from "@/lib/auth/session";
import { formatPhoneInput } from "@/lib/phone";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "İletişim | Sorularınızı Bize Yazın",
  description:
    "Kentsele iletişim formu. Sorularınız, önerileriniz ve destek talepleriniz için bize yazın.",
  path: "/iletisim",
  keywords: ["kentsele iletişim", "kentsel dönüşüm iletişim İstanbul"],
});

export default async function IletisimPage() {
  const user = await getSessionUser();
  const profile = user ? await getCurrentProfile() : null;

  const prefill =
    user || profile
      ? {
          full_name: profile?.full_name ?? null,
          email: user?.email ?? null,
          phone: profile?.phone
            ? formatPhoneInput(profile.phone)
            : null,
        }
      : null;

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">İletişim</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        Platform, ilan veya hesap hakkında sorularınızı bize iletin. Mesajınız
        yönetim paneline düşer.
      </p>
      <div className="mt-6">
        <ContactForm prefill={prefill} />
      </div>
    </AppShell>
  );
}
