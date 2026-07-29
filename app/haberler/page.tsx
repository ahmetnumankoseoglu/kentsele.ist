import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedNews } from "@/lib/news/queries";
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
    title: "İstanbul Kentsel Dönüşüm Haberleri",
    description:
      "İstanbul kentsel dönüşüm haberleri ve rehberler. Malikler ve müteahhitler için güncel içerik.",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: `${getSiteUrl()}/haberler`,
    languages: {
      "tr-TR": `${getSiteUrl()}/haberler`,
      "x-default": `${getSiteUrl()}/haberler`,
    },
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

export default async function HaberlerPage() {
  const haberler = await getPublishedNews();
  const site = getSiteUrl();
  const featured = haberler[0];
  const rest = haberler.slice(1);

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
    <AppShell fullBleed showBottomCta={false}>
      <JsonLd data={schemas} />

      {/* Banner */}
      <section className="relative min-h-[220px] overflow-hidden bg-[#111321] text-white">
        <div
          className="absolute inset-0 scale-105 opacity-45"
          style={{
            backgroundImage: `url(${featured?.banner_image_url || featured?.cover_image_url || "/images/kentsel-donusum-cover.jpeg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111321] via-[#111321]/85 to-[#111321]/40" />
        <div className="relative mx-auto flex max-w-lg flex-col justify-end px-4 pb-8 pt-16">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2cb34f]">
            Haberler · İstanbul
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Kentsel dönüşüm haberleri
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/75">
            Malikler ve müteahhitler için güncel rehberler, regülasyon notları ve
            piyasa haberleri.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-lg px-4 py-6">
        <Breadcrumbs
          className="mb-5"
          items={[
            { name: "Ana sayfa", href: "/" },
            { name: "Haberler" },
          ]}
        />

        {featured && (
          <Link
            href={`/haberler/${featured.slug}`}
            className="news-card group relative mb-6 block overflow-hidden rounded-xl"
          >
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  featured.cover_image_url ||
                  featured.banner_image_url ||
                  "/images/kentsel-donusum-cover.jpeg"
                }
                alt={featured.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <span className="rounded-full bg-[#2cb34f] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  Manşet
                </span>
                <h2 className="mt-2 text-lg font-bold leading-snug">
                  {featured.title}
                </h2>
                <time className="mt-1 block text-xs text-white/70">
                  {formatDate(featured.published_at || featured.created_at)}
                </time>
              </div>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-3">
          {rest.map((h, i) => (
            <Link
              key={h.id}
              href={`/haberler/${h.slug}`}
              className="news-card card animate-fade-up flex gap-3 overflow-hidden p-0"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative h-auto w-28 shrink-0 self-stretch overflow-hidden bg-[#e3e4e6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    h.cover_image_url ||
                    "/images/kentsel-donusum-hero.jpeg"
                  }
                  alt={h.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 py-3 pr-3">
                <time className="text-[11px] font-bold text-[#2cb34f]">
                  {formatDate(h.published_at || h.created_at)}
                </time>
                <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#111321]">
                  {h.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-[#6b7280]">
                  {h.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {haberler.length === 0 && (
          <div className="card p-8 text-center text-sm text-[#6b7280]">
            Henüz yayınlanmış haber yok.
          </div>
        )}
      </div>
    </AppShell>
  );
}
