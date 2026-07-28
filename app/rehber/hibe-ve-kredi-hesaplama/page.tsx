import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { HibeKrediCalculator } from "@/components/rehber/HibeKrediCalculator";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

const TITLE = "Kentsel dönüşüm hibe ve kredi hesaplama";
const DESCRIPTION =
  "Kentsel dönüşümde kira yardımı, hibe ve faiz destekli krediyi anlama rehberi. Yaklaşık hesap aracı ile senaryo planla. Bilgilendirme amaçlıdır.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "kentsel dönüşüm hibe",
    "kentsel dönüşüm kredi",
    "kira yardımı hesaplama",
    "yarısı bizden",
    "kentsel dönüşüm faiz desteği",
    "6306 hibe kredi",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "tr_TR",
  },
  alternates: {
    canonical: `${getSiteUrl()}/rehber/hibe-ve-kredi-hesaplama`,
  },
};

export default function HibeKrediPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      inLanguage: "tr-TR",
      author: { "@type": "Organization", name: "kentsele.ist" },
      publisher: {
        "@type": "Organization",
        name: "kentsele.ist",
        url: getSiteUrl(),
      },
      mainEntityOfPage: `${getSiteUrl()}/rehber/hibe-ve-kredi-hesaplama`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Kentsel dönüşüm hibe-kredi hesaplayıcı",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      description: DESCRIPTION,
      url: `${getSiteUrl()}/rehber/hibe-ve-kredi-hesaplama`,
    },
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      {
        name: "Hibe ve kredi hesaplama",
        path: "/rehber/hibe-ve-kredi-hesaplama",
      },
    ]),
  ];

  return (
    <RehberLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumbLast="Hibe & kredi"
      schemas={schemas}
    >
      <p>
        Kentsel dönüşüm sürecinde malikler çoğu zaman iki soruyu bir arada
        sorar: <em>“Devlet ne kadar destek veriyor?”</em> ve{" "}
        <em>“Kredi taksitim ne olur?”</em> Bu rehber, 6306 sayılı kanun
        kapsamındaki uygulamalara eşlik eden{" "}
        <strong>kira yardımı</strong>, <strong>hibe / yapım yardımı</strong> ve{" "}
        <strong>faiz destekli kredi</strong> kalemlerini sade bir dille
        açıklar; ardından yaklaşık bir senaryo hesaplayıcısı sunar.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Destek türleri nelerdir?
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Kira yardımı:</strong> Riskli yapı nedeniyle tahliye olan
          malik/kiracıya (şartlara göre) belirli süre aylık destek.
        </li>
        <li>
          <strong>Hibe / yapım yardımı:</strong> Dönemsel programlarda konut
          birimi başına hibe veya eş finansman (kampanya şartları değişkendir).
        </li>
        <li>
          <strong>Faiz destekli kredi:</strong> Banka kredisinde kamu faiz
          desteği; tavan tutar ve vade programa bağlıdır.
        </li>
      </ul>

      <p>
        Destekler genellikle riskli yapı / riskli alan / rezerv yapı alanı
        statüsüne ve başvuru belgelerine bağlanır. Hukuki çerçeve için{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          6306 sayılı kanun sayfasını
        </Link>{" "}
        okuyun.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Hesabı ne etkiler?
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Bağımsız bölüm adedi ve malik profili</li>
        <li>İl / ilçe ve dönemsel program limitleri</li>
        <li>Riskli yapı veya rezerv alan statüsü</li>
        <li>Hane geliri, ikamet ve birden fazla konut sahipliği</li>
        <li>Banka ekspertiz ve teminat koşulları</li>
      </ul>

      <div className="card mt-4 border-l-4 border-l-[#ee401d] bg-[#fef2f2] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Önemli:</strong> Aşağıdaki araç
        resmî teklif değildir. Güncel tutarlar bakanlık/başkanlık, belediye ve
        banka kanallarından doğrulanmalıdır.
      </div>

      <HibeKrediCalculator />

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Hesabı nasıl okumalısın?
      </h2>
      <p>
        <strong>Kira + hibe paketi</strong>, inşaat süresince nakit akışına
        katkı sunan kalemlerin kabaca toplamıdır.{" "}
        <strong>Faiz desteği farkı</strong> ise aynı kredi tutarında piyasa
        faiziyle destekli faiz arasındaki toplam ödeme farkının yaklaşık
        ifadesidir. Banka, teminat ve sigorta taksiti değiştirir; hibe ve kira
        tutarları yıl içinde güncellenebilir.
      </p>
    </RehberLayout>
  );
}
