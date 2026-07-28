import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { HibeKrediCalculator } from "@/components/rehber/HibeKrediCalculator";
import { DESTEK_TUTARLARI, formatTRY } from "@/lib/content/destek-tutarlari";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

const K = DESTEK_TUTARLARI.konut;
const T = DESTEK_TUTARLARI.ticari;

const TITLE = "Yarısı Bizden hibe ve kredi hesaplama (İstanbul)";
const DESCRIPTION = `Konut birim: ${formatTRY(K.hibe)} hibe + ${formatTRY(K.kredi)} kredi + ${formatTRY(K.tasinma)} taşınma = ${formatTRY(K.toplamBirim)}. İş yeri birim: ${formatTRY(T.hibe)} + ${formatTRY(T.kredi)} + ${formatTRY(T.tasinma)} = ${formatTRY(T.toplamBirim)}. Her birim için aynı paket.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Yarısı Bizden",
    "kentsel dönüşüm hibe 875000",
    "kentsel dönüşüm kredi",
    "1 milyon 875 bin destek",
    "iş yeri dönüşüm 1 milyon",
    "İstanbul kentsel dönüşüm destek",
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
      name: "Yarısı Bizden hibe-kredi hesaplayıcı",
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
        <strong>Yarısı Bizden</strong> kampanyası, Kentsel Dönüşüm Başkanlığı
        koordinesinde İstanbul’un tüm ilçelerini kapsayan destek programıdır.
        Her konut ve her iş yeri birimi için{" "}
        <strong>hibe + kredi + taşınma</strong> birlikte hesaplanır.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Konut birim: {formatTRY(K.toplamBirim)}
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Hibe: <strong>{formatTRY(K.hibe)}</strong>
        </li>
        <li>
          Kredi: <strong>{formatTRY(K.kredi)}</strong>
        </li>
        <li>
          Taşınma: <strong>{formatTRY(K.tasinma)}</strong> (her birim için)
        </li>
        <li>
          Birim toplam: <strong>{formatTRY(K.toplamBirim)}</strong>
        </li>
      </ul>
      <p>
        Örnek: 4 konut → {formatTRY(K.toplamBirim * 4)} (
        {formatTRY(K.hibe * 4)} hibe + {formatTRY(K.kredi * 4)} kredi +{" "}
        {formatTRY(K.tasinma * 4)} taşınma).
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        İş yeri birim: {formatTRY(T.toplamBirim)}
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Hibe: <strong>{formatTRY(T.hibe)}</strong>
        </li>
        <li>
          Kredi: <strong>{formatTRY(T.kredi)}</strong>
        </li>
        <li>
          Taşınma: <strong>{formatTRY(T.tasinma)}</strong> (her birim için)
        </li>
        <li>
          Birim toplam: <strong>{formatTRY(T.toplamBirim)}</strong>
        </li>
      </ul>
      <p>
        Örnek: 2 dükkân → {formatTRY(T.toplamBirim * 2)}.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Konut + ticari karışık binalar
      </h2>
      <p>
        Zemin dükkân, üst kat konut gibi durumlarda her iki adedi de girin.
        Örnek: 6 konut + 2 ticari → 6 × {formatTRY(K.toplamBirim)} + 2 ×{" "}
        {formatTRY(T.toplamBirim)} ={" "}
        {formatTRY(K.toplamBirim * 6 + T.toplamBirim * 2)}.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Taşınma desteği ≠ aylık kira yardımı
      </h2>
      <p>
        Taşınma ({formatTRY(K.tasinma)} / birim) paket içindedir. Aylık kira
        yardımı ayrı destektir —{" "}
        <Link href="/rehber/kira-yardimi" className="font-bold text-[#168f43]">
          kira yardımı rehberi
        </Link>
        .
      </p>

      <div className="card mt-4 border-l-4 border-l-[#ee401d] bg-[#fef2f2] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Önemli:</strong> Tutarlar
        bilgilendirme amaçlıdır. Hak sahipliği ve ödeme resmî kurum / banka
        süreçlerine tabidir.
      </div>

      <HibeKrediCalculator />

      <p className="!mt-6">
        Hukuki çerçeve:{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          6306 sayılı kanun
        </Link>
        .{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          Ücretsiz ilan ver
        </Link>
        .
      </p>
    </RehberLayout>
  );
}
