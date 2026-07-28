import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ContactForm } from "@/components/iletisim/ContactForm";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "İletişim | kentsele.ist",
  description:
    "kentsele.ist iletişim formu. Sorularınız, önerileriniz ve destek talepleriniz için bize yazın.",
  path: "/iletisim",
  keywords: ["kentsele iletişim", "kentsel dönüşüm iletişim İstanbul"],
});

export default function IletisimPage() {
  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">İletişim</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        Platform, ilan veya hesap hakkında sorularınızı bize iletin. Mesajınız
        yönetim paneline düşer.
      </p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </AppShell>
  );
}
