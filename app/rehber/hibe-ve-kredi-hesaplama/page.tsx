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
const DESCRIPTION = `Konut: ${formatTRY(K.hibe)} hibe + ${formatTRY(K.kredi)} kredi + ${formatTRY(K.tasinma)} taşınma = ${formatTRY(K.toplamIlk)}. İş yeri: ${formatTRY(T.hibe)} + ${formatTRY(T.kredi)} + ${formatTRY(T.tasinma)} = ${formatTRY(T.toplamIlk)}.`;

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
        <strong>Yarısı Bizden</strong> kampanyası, Çevre, Şehircilik ve İklim
        Değişikliği Bakanlığı’na bağlı{" "}
        <strong>Kentsel Dönüşüm Başkanlığı</strong> koordinesinde 2023’te
        başlatılan ve İstanbul’un tüm ilçelerini kapsayan bir dönüşüm destek
        programıdır. Evini veya iş yerini dönüştürmek isteyen vatandaşlara{" "}
        <strong>hibe</strong>, <strong>kredi</strong> ve{" "}
        <strong>taşınma (tahliye) yardımı</strong> ödenir.
      </p>
      <p>
        Cumhurbaşkanı Recep Tayyip Erdoğan’ın açıkladığı güncelleme ile destek
        tutarları artırılmıştır. Bu sayfadaki rakamlar o açıklamaya göre
        sabittir; sitede uydurma oran kullanılmaz.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        1 konut için destek: {formatTRY(K.toplamIlk)}
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Hibe: <strong>{formatTRY(K.hibe)}</strong> (önceki 700.000 ₺)
        </li>
        <li>
          Kredi: <strong>{formatTRY(K.kredi)}</strong> (önceki 700.000 ₺)
        </li>
        <li>
          Taşınma / tahliye desteği: <strong>{formatTRY(K.tasinma)}</strong>{" "}
          (önceki 100.000 ₺)
        </li>
        <li>
          Toplam: <strong>{formatTRY(K.toplamIlk)}</strong>
        </li>
      </ul>
      <p>
        Hak sahiplerinin <strong>diğer her bir konutu</strong> için ayrıca{" "}
        <strong>{formatTRY(K.ekKonutKredi)}</strong> kredi imkânı sunulur
        (hibe+kredi 1.750.000 ₺ bandı; taşınma ilk birim paketinde).
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        1 iş yeri için destek: {formatTRY(T.toplamIlk)}
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Hibe: <strong>{formatTRY(T.hibe)}</strong> (önceki 350.000 ₺)
        </li>
        <li>
          Kredi: <strong>{formatTRY(T.kredi)}</strong> (önceki 350.000 ₺)
        </li>
        <li>
          Taşınma yardımı: <strong>{formatTRY(T.tasinma)}</strong>
        </li>
        <li>
          Toplam: <strong>{formatTRY(T.toplamIlk)}</strong>
        </li>
      </ul>
      <p>
        Hak sahiplerinin <strong>diğer her bir dükkânı</strong> için{" "}
        <strong>{formatTRY(T.ekDukkanKredi)}</strong> kredi imkânı sunulur.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Konut + ticari karışık binalar
      </h2>
      <p>
        Birçok İstanbul binasında zemin veya bodrum <strong>dükkân</strong>,
        üst katlar <strong>konut</strong>tur. Hesaplayıcıda konut ve ticari
        adedini <strong>aynı anda</strong> girebilirsiniz; ilk birimler için
        hibe+kredi+taşınma, ek birimler için açıklanan ek kredi imkânları
        toplanır.
      </p>

      <h2 className="!mt-6 text-base font-bold text-[#111321]">
        Taşınma desteği ≠ aylık kira yardımı
      </h2>
      <p>
        Bu paketteki <strong>{formatTRY(K.tasinma)} taşınma / tahliye
        desteği</strong> bir kerelik (veya programda tanımlı) taşınma
        yardımını ifade eder. Aylık ödenen{" "}
        <strong>kira yardımı</strong> ayrı bir destek kalemidir; detay ve
        başvuru için{" "}
        <Link href="/rehber/kira-yardimi" className="font-bold text-[#168f43]">
          kira yardımı rehberine
        </Link>{" "}
        bakın.
      </p>

      <div className="card mt-4 border-l-4 border-l-[#ee401d] bg-[#fef2f2] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Önemli:</strong> Tutarlar
        bilgilendirme amaçlıdır. Hak sahipliği, başvuru sırası, ödeme planı ve
        banka kredisi şartları resmî kurum ve banka süreçlerine tabidir.
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
        . İstanbul’da müteahhit arıyorsanız{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          ücretsiz ilan
        </Link>{" "}
        verebilirsiniz.
      </p>
    </RehberLayout>
  );
}
