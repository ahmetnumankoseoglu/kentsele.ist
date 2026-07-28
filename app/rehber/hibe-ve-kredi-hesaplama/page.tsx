import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { HibeKrediCalculator } from "@/components/rehber/HibeKrediCalculator";
import { DESTEK_TUTARLARI, formatTRY } from "@/lib/content/destek-tutarlari";
import {
  breadcrumbSchema,
  organizationSchema,
  rehberArticleSchema,
  rehberWebPageSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import { rehberArticleMetadata } from "@/lib/seo/istanbul";
import { getSiteUrl } from "@/lib/seo/site";

const K = DESTEK_TUTARLARI.konut;
const T = DESTEK_TUTARLARI.ticari;
const PATH = "/rehber/hibe-ve-kredi-hesaplama";
const TITLE =
  "İstanbul Yarısı Bizden Hibe ve Kredi Hesaplama | Konut & İş Yeri";
const DESCRIPTION = `İstanbul Yarısı Bizden: konut ${formatTRY(K.toplamBirim)} (hibe ${formatTRY(K.hibe)} + kredi ${formatTRY(K.kredi)} + taşınma ${formatTRY(K.tasinma)}), iş yeri ${formatTRY(T.toplamBirim)}. Konut+dükkân karışık hesap.`;
const PUBLISHED = "2026-07-01T09:00:00+03:00";
const MODIFIED = "2026-07-29T12:00:00+03:00";

export const metadata: Metadata = rehberArticleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "Yarısı Bizden İstanbul",
    "kentsel dönüşüm hibe 875000",
    "kentsel dönüşüm kredi 875000",
    "1 milyon 875 bin destek",
    "iş yeri dönüşüm 1 milyon",
    "İstanbul kentsel dönüşüm destek",
  ],
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
});

export default function HibeKrediPage() {
  const site = getSiteUrl();
  const schemas = [
    websiteSchema(),
    organizationSchema(),
    rehberWebPageSchema({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
    }),
    rehberArticleSchema({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      keywords: [
        "Yarısı Bizden",
        "hibe",
        "kredi",
        "İstanbul",
        "kentsel dönüşüm",
      ],
    }),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${site}${PATH}#app`,
      name: "İstanbul Yarısı Bizden hibe-kredi hesaplayıcı",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      inLanguage: "tr-TR",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "TRY",
      },
      description: DESCRIPTION,
      url: `${site}${PATH}`,
      provider: { "@id": `${site}/#organization` },
      areaServed: {
        "@type": "City",
        name: "İstanbul",
        address: {
          "@type": "PostalAddress",
          addressLocality: "İstanbul",
          addressCountry: "TR",
        },
      },
    },
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      { name: "Hibe ve kredi hesaplama", path: PATH },
    ]),
  ];

  return (
    <RehberLayout
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumbLast="Hibe & kredi"
      schemas={schemas}
    >
      <p>
        <strong>Yarısı Bizden</strong> kampanyası, Kentsel Dönüşüm Başkanlığı
        koordinesinde <strong>İstanbul</strong>’un tüm ilçelerini kapsayan
        destek programıdır. Her konut ve her iş yeri birimi için{" "}
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
      <p>Örnek: 2 dükkân → {formatTRY(T.toplamBirim * 2)}.</p>

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
        Proje ön şartı ve başvuru (özet)
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Yeni projedeki yapı (otopark ve sığınak hariç), eski yapının bir buçuk
          katını (bağımsız bölüm veya inşaat alanı) geçmemelidir.
        </li>
        <li>
          İstanbul’un 39 ilçesinde riskli yapı sahipleri kampanya kapsamında
          değerlendirilebilir.
        </li>
        <li>
          Başvuru genelde e-Devlet ile yapılmaz: kat irtifakı sonrası hak sahibi
          tespiti için ilçe belediyesine başvurulur; randevuda hibe taahhütnamesi
          ve kredi sözleşmesi imzalanır.
        </li>
        <li>
          Kredi geri ödemeleri uygulamada yapı ruhsatı sonrası belirli süre
          (ör. 2 yıl) sonra başlayıp uzun vadeye (ör. 10 yıl) yayılabilir; ilk
          dönem faiz uygulanmayabilir. Güncel banka/kampanya şartı esas alınır.
        </li>
        <li>
          Ada/site ölçekli büyük dönüşümde tam uzlaşma halinde Kentsel Dönüşüm
          Başkanlığı, TOKİ ve Emlak Konut iş birliği gündeme gelebilir.
        </li>
      </ul>
      <p>
        Resmî duyurularda bazen “ilk birim tam paket, sonraki birimler yalnızca
        kredi” şeklinde ayrım anlatılır. Aşağıdaki hesaplayıcı, pratik planlama
        için her birime tam paket uygular; kesin hak tutarı kurum/banka
        onayına bağlıdır.
      </p>

      <div className="card mt-4 border-l-4 border-l-[#ee401d] bg-[#fef2f2] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Önemli:</strong> Tutarlar
        bilgilendirme amaçlıdır. Hak sahipliği ve ödeme resmî kurum / banka
        süreçlerine tabidir.
      </div>

      <HibeKrediCalculator />

      <p className="!mt-6">
        İlgili:{" "}
        <Link
          href="/rehber/kentsel-donusum-nedir"
          className="font-bold text-[#168f43]"
        >
          kentsel dönüşüm nedir
        </Link>
        ,{" "}
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
