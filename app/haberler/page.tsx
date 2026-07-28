import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllHaberler } from "@/lib/content/haberler";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "İstanbul Kentsel Dönüşüm Haberleri",
  description:
    "İstanbul kentsel dönüşüm haberleri, rehberler ve piyasa notları. Google News uyumlu güncel içerikler.",
  openGraph: {
    title: "İstanbul Kentsel Dönüşüm Haberleri | kentsele.ist",
    description:
      "İstanbul kentsel dönüşüm haberleri ve rehberler. Malikler ve müteahhitler için güncel içerik.",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: `${getSiteUrl()}/haberler`,
    types: {
      "application/rss+xml": `${getSiteUrl()}/haberler/rss.xml`,
    },
  },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function HaberlerPage() {
  const haberler = getAllHaberler();
  const site = getSiteUrl();

  const schemas = [
    collectionPageSchema(
      "İstanbul Kentsel Dönüşüm Haberleri",
      "/haberler",
      "İstanbul kentsel dönüşüm haberleri ve rehberler"
    ),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Haberler", path: "/haberler" },
    ]),
    itemListSchema(
      "Kentsel dönüşüm haberleri",
      haberler.map((h) => ({
        name: h.title,
        url: `${site}/haberler/${h.slug}`,
      }))
    ),
  ];

  return (
    <AppShell showBottomCta={false}>
      <JsonLd data={schemas} />
      <nav className="mb-4 text-xs text-[#6b7280]">
        <Link href="/" className="font-medium text-[#168f43]">
          Ana sayfa
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#111321]">Haberler</span>
      </nav>

      <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
        İstanbul · Kentsel Dönüşüm
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#111321]">
        Kentsel dönüşüm haberleri
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        Malikler ve müteahhitler için güncel rehberler, piyasa notları ve
        İstanbul kentsel dönüşüm haberleri.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {haberler.map((h, i) => (
          <Link
            key={h.slug}
            href={`/haberler/${h.slug}`}
            className="news-card card animate-fade-up block p-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <time className="text-xs font-bold text-[#2cb34f]">
              {formatDate(h.datePublished)}
            </time>
            <h2 className="mt-1.5 text-[15px] font-bold leading-snug text-[#111321]">
              {h.title}
            </h2>
            <p className="mt-1.5 line-clamp-2 text-sm text-[#6b7280]">
              {h.description}
            </p>
            <span className="mt-3 inline-block text-xs font-bold text-[#168f43]">
              Devamını oku →
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
