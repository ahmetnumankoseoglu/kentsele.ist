import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { HibeKrediCalculator } from "@/components/rehber/HibeKrediCalculator";
import { DESTEK_TUTARLARI, formatTRY } from "@/lib/content/destek-tutarlari";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

const TITLE = "Kentsel dönüşüm hibe ve kredi hesaplama";
const DESCRIPTION = `Konut: ${formatTRY(DESTEK_TUTARLARI.konut.hibe)} hibe + ${formatTRY(DESTEK_TUTARLARI.konut.kredi)} kredi = ${formatTRY(DESTEK_TUTARLARI.konut.toplam)}. Ticari: ${formatTRY(DESTEK_TUTARLARI.ticari.hibe)} hibe + ${formatTRY(DESTEK_TUTARLARI.ticari.kredi)} kredi = ${formatTRY(DESTEK_TUTARLARI.ticari.toplam)}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "kentsel dönüşüm hibe",
    "kentsel dönüşüm kredi",
    "875000 hibe",
    "kentsel dönüşüm 1750000",
    "ticari hibe kredi",
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
        Kentsel dönüşüm destek paketinde birim başına hibe ve kredi tutarları
        netleştirilmiştir. Hesaplayıcı bu sabitleri kullanır; kafadan oran veya
        rastgele faiz senaryosu üretmez.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Birim başına destek tutarları
      </h2>
      <div className="not-prose mt-3 grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#168f43]">
            Konut
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[#374151]">
            <li>Hibe: <strong>{formatTRY(DESTEK_TUTARLARI.konut.hibe)}</strong></li>
            <li>Kredi: <strong>{formatTRY(DESTEK_TUTARLARI.konut.kredi)}</strong></li>
            <li className="pt-1 font-bold text-[#111321]">
              Toplam: {formatTRY(DESTEK_TUTARLARI.konut.toplam)}
            </li>
          </ul>
        </div>
        <div className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#168f43]">
            Ticari
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[#374151]">
            <li>Hibe: <strong>{formatTRY(DESTEK_TUTARLARI.ticari.hibe)}</strong></li>
            <li>
              Kredi: <strong>{formatTRY(DESTEK_TUTARLARI.ticari.kredi)}</strong>
            </li>
            <li className="pt-1 font-bold text-[#111321]">
              Toplam: {formatTRY(DESTEK_TUTARLARI.ticari.toplam)}
            </li>
          </ul>
        </div>
      </div>

      <p className="!mt-4">
        Örnek: 4 konut birimi → hibe{" "}
        {formatTRY(DESTEK_TUTARLARI.konut.hibe * 4)}, kredi{" "}
        {formatTRY(DESTEK_TUTARLARI.konut.kredi * 4)}, genel toplam{" "}
        {formatTRY(DESTEK_TUTARLARI.konut.toplam * 4)}. 2 ticari birim → hibe{" "}
        {formatTRY(DESTEK_TUTARLARI.ticari.hibe * 2)}, kredi{" "}
        {formatTRY(DESTEK_TUTARLARI.ticari.kredi * 2)}, genel toplam{" "}
        {formatTRY(DESTEK_TUTARLARI.ticari.toplam * 2)}.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Destek türleri nelerdir?
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Hibe:</strong> Geri ödemesiz kamu katkısı (hak sahipliği ve
          program şartlarına bağlı).
        </li>
        <li>
          <strong>Kredi:</strong> Banka üzerinden kullanılan, faiz/şartları
          programa göre belirlenen finansman.
        </li>
        <li>
          <strong>Kira yardımı:</strong> Ayrı bir destek kalemidir; detay için{" "}
          <Link href="/rehber/kira-yardimi" className="font-bold text-[#168f43]">
            kira yardımı rehberine
          </Link>{" "}
          bakın.
        </li>
      </ul>

      <p>
        Hukuki çerçeve için{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          6306 sayılı kanun
        </Link>{" "}
        sayfasını inceleyin. Başvuru ve ödeme takvimi resmî kurum / banka
        süreçlerine tabidir.
      </p>

      <div className="card mt-4 border-l-4 border-l-[#ee401d] bg-[#fef2f2] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Önemli:</strong> Bu sayfadaki tutarlar
        bilgilendirme amaçlıdır. Nihai hak sahipliği, başvuru ve ödeme için
        yetkili kurum ve banka kanallarını kullanın.
      </div>

      <HibeKrediCalculator />
    </RehberLayout>
  );
}
