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
  title: "Kentsel Dönüşüm Rehberi | 6306, Kira, Hibe ve Kredi",
  description:
    "6306 sayılı kanun, kira yardımı evrak listesi, Yarısı Bizden hibe ve kredi hesaplama. İstanbul kentsel dönüşüm bilgi bankası.",
  alternates: { canonical: `${getSiteUrl()}/rehber` },
};

const GUIDES = [
  {
    href: "/rehber/6306-sayili-kanun",
    badge: "Mevzuat",
    title: "6306 sayılı kanun nedir?",
    desc: "Riskli yapı, malik hakları, tespit–yıkım süreci ve sık sorulan sorular.",
  },
  {
    href: "/rehber/kira-yardimi",
    badge: "Başvuru",
    title: "Kira & taşınma yardımı",
    desc: "Malik Ek-1, konut kiracısı Ek-2, iş yeri kiracısı Ek-3 evrak listeleri.",
  },
  {
    href: "/rehber/hibe-ve-kredi-hesaplama",
    badge: "Hesapla",
    title: "Yarısı Bizden hibe & kredi",
    desc: "Konut 1.875.000 ₺, iş yeri 1.000.000 ₺. Konut + dükkân karışık hesap.",
  },
] as const;

export default function RehberIndexPage() {
  const site = getSiteUrl();
  const schemas = [
    collectionPageSchema(
      "Kentsel Dönüşüm Rehberi",
      "/rehber",
      "6306 sayılı kanun, kira yardımı, hibe ve kredi"
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

      <header className="relative overflow-hidden rounded-xl border border-[#e3e4e6] bg-gradient-to-br from-[#f4fbf6] via-white to-white p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#2cb34f]/10"
          aria-hidden
        />
        <p className="rehber-hero-chip">Bilgi bankası</p>
        <h1 className="mt-3 text-[1.5rem] font-bold tracking-tight text-[#111321]">
          Kentsel dönüşüm rehberi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          6306 sayılı kanun, kira–taşınma yardımı evrakları ve Yarısı Bizden
          destek tutarları. Genel bilgilendirmedir; resmî kurum duyuruları esas
          alınmalıdır.
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-3">
        {GUIDES.map((g, i) => (
          <Link
            key={g.href}
            href={g.href}
            className="news-card card group relative block overflow-hidden p-0"
          >
            <div className="flex gap-0">
              <div className="flex w-14 shrink-0 flex-col items-center justify-center bg-[#eaf8ee] text-[#168f43]">
                <span className="text-lg font-bold">{i + 1}</span>
              </div>
              <div className="min-w-0 flex-1 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2cb34f]">
                  {g.badge}
                </span>
                <h2 className="mt-1 text-[15px] font-bold leading-snug text-[#111321] group-hover:text-[#168f43]">
                  {g.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
                  {g.desc}
                </p>
                <span className="mt-3 inline-block text-xs font-bold text-[#168f43]">
                  Devamını oku →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/ilan-ver" className="btn-primary mt-8 w-full">
        Ücretsiz ilan ver
      </Link>
    </AppShell>
  );
}
