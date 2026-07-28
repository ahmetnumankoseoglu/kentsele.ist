import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  organizationSchema,
  websiteSchema,
  istanbulPlaceSchema,
} from "@/lib/seo/schema";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import { getSiteUrl } from "@/lib/seo/site";

const PATH = "/rehber";
const TITLE =
  "İstanbul Kentsel Dönüşüm Rehberi | 6306, Kira Yardımı, Hibe ve Kredi";
const DESCRIPTION =
  "İstanbul kentsel dönüşüm rehberi: 6306 sayılı kanun, kira ve taşınma yardımı evrak listeleri, Yarısı Bizden hibe-kredi hesaplama. 39 ilçe.";

export const metadata: Metadata = {
  ...istanbulGeoMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    keywords: [
      "İstanbul kentsel dönüşüm rehberi",
      "6306 sayılı kanun",
      "kira yardımı İstanbul",
      "Yarısı Bizden hesaplama",
    ],
  }),
};

const GUIDES = [
  {
    href: "/rehber/6306-sayili-kanun",
    title: "6306 sayılı kanun nedir?",
    desc: "Afet riski altındaki alanların dönüşümü kanunu: riskli yapı, malik hakları, süreç ve sık sorular.",
  },
  {
    href: "/rehber/kira-yardimi",
    title: "Kira yardımı nedir? Nasıl alınır?",
    desc: "Malik, konut kiracısı ve iş yeri kiracısı için istenen belgeler ve başvuru adımları.",
  },
  {
    href: "/rehber/hibe-ve-kredi-hesaplama",
    title: "Hibe ve kredi hesaplama",
    desc: "Yarısı Bizden: konut 1.875.000 ₺, iş yeri 1.000.000 ₺. Konut + dükkân karışık hesap.",
  },
] as const;

export default function RehberIndexPage() {
  const site = getSiteUrl();
  const schemas = [
    websiteSchema(),
    organizationSchema(),
    {
      "@context": "https://schema.org",
      ...istanbulPlaceSchema(),
    },
    collectionPageSchema(TITLE, PATH, DESCRIPTION),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: PATH },
    ]),
    itemListSchema(
      "İstanbul kentsel dönüşüm rehberleri",
      GUIDES.map((g) => ({ name: g.title, url: `${site}${g.href}` }))
    ),
  ];

  return (
    <AppShell showBottomCta>
      <JsonLd data={schemas} />
      <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
        Bilgi bankası · İstanbul
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#111321]">
        İstanbul kentsel dönüşüm rehberi
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        6306 sayılı kanun, kira–taşınma yardımı evrakları ve Yarısı Bizden
        destek tutarları. Bilgiler genel bilgilendirme amaçlıdır; güncel
        mevzuat ve resmî kurum açıklamaları esas alınmalıdır.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {GUIDES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="card block p-4 transition hover:border-[#2cb34f]/30"
          >
            <h2 className="text-base font-bold text-[#111321]">{g.title}</h2>
            <p className="mt-1.5 text-sm text-[#6b7280]">{g.desc}</p>
            <span className="mt-3 inline-block text-xs font-bold text-[#168f43]">
              Oku →
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
