import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Kentsel Dönüşüm Rehberi | 6306, Hibe ve Kredi",
  description:
    "6306 sayılı kanun, riskli yapı, hibe ve kredi hesaplama. İstanbul kentsel dönüşüm bilgi bankası — kentsele.ist",
  alternates: { canonical: `${getSiteUrl()}/rehber` },
};

const GUIDES = [
  {
    href: "/rehber/6306-sayili-kanun",
    title: "6306 sayılı kanun nedir?",
    desc: "Afet riski altındaki alanların dönüşümü kanunu: riskli yapı, malik hakları, süreç ve sık sorular.",
  },
  {
    href: "/rehber/hibe-ve-kredi-hesaplama",
    title: "Hibe ve kredi hesaplama",
    desc: "Kentsel dönüşümde kira yardımı, hibe, faiz destekli kredi ve yaklaşık tutarları anlama rehberi.",
  },
] as const;

export default function RehberIndexPage() {
  const site = getSiteUrl();
  const schemas = [
    collectionPageSchema(
      "Kentsel Dönüşüm Rehberi",
      "/rehber",
      "6306 sayılı kanun, hibe ve kredi bilgileri"
    ),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
    ]),
    itemListSchema(
      "Kentsel dönüşüm rehberleri",
      GUIDES.map((g) => ({ name: g.title, url: `${site}${g.href}` }))
    ),
  ];

  return (
    <AppShell showBottomCta={false}>
      <JsonLd data={schemas} />
      <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
        Bilgi bankası
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#111321]">
        Kentsel dönüşüm rehberi
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        Malikler ve müteahhitler için 6306 sayılı kanun, hibe-kredi ve süreç
        bilgileri. Bilgiler genel bilgilendirme amaçlıdır; güncel mevzuat ve
        resmî kurum açıklamaları esas alınmalıdır.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {GUIDES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="card news-card block p-4 transition hover:border-[#2cb34f]/30"
          >
            <h2 className="text-base font-bold text-[#111321]">{g.title}</h2>
            <p className="mt-1.5 text-sm text-[#6b7280]">{g.desc}</p>
            <span className="mt-3 inline-block text-xs font-bold text-[#168f43]">
              Oku →
            </span>
          </Link>
        ))}
      </div>
      <Link href="/ilan-ver" className="btn-primary mt-8 w-full">
        Ücretsiz ilan ver
      </Link>
    </AppShell>
  );
}
