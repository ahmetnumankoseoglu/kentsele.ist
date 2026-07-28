import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllHaberler, getHaberBySlug } from "@/lib/content/haberler";
import { breadcrumbSchema, newsArticleSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

export function generateStaticParams() {
  return getAllHaberler().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const haber = getHaberBySlug(slug);
  if (!haber) return { title: "Haber bulunamadı" };

  return {
    title: haber.title,
    description: haber.description,
    authors: [{ name: haber.authorName }],
    keywords: haber.tags,
    openGraph: {
      title: haber.title,
      description: haber.description,
      type: "article",
      locale: "tr_TR",
      publishedTime: haber.datePublished,
      modifiedTime: haber.dateModified ?? haber.datePublished,
      authors: [haber.authorName],
      url: `${getSiteUrl()}/haberler/${haber.slug}`,
    },
    alternates: {
      canonical: `${getSiteUrl()}/haberler/${haber.slug}`,
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function HaberDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const haber = getHaberBySlug(slug);
  if (!haber) notFound();

  const schemas = [
    newsArticleSchema(haber),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Haberler", path: "/haberler" },
      { name: haber.title, path: `/haberler/${haber.slug}` },
    ]),
  ];

  return (
    <AppShell showBottomCta={false}>
      <JsonLd data={schemas} />
      <article>
        <nav className="mb-4 text-xs text-[#6b7280]">
          <Link href="/" className="font-medium text-[#168f43]">
            Ana sayfa
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/haberler" className="font-medium text-[#168f43]">
            Haberler
          </Link>
          <span className="mx-1.5">/</span>
          <span className="line-clamp-1 text-[#111321]">Haber</span>
        </nav>

        <div className="flex flex-wrap gap-2">
          {haber.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#eaf8ee] px-2.5 py-0.5 text-[11px] font-bold text-[#168f43]"
            >
              {t}
            </span>
          ))}
        </div>

        <h1 className="mt-3 text-[22px] font-bold leading-snug text-[#111321]">
          {haber.title}
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">{haber.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9ca3af]">
          <span className="font-semibold text-[#6b7280]">{haber.authorName}</span>
          <time dateTime={haber.datePublished}>
            {formatDate(haber.datePublished)}
          </time>
        </div>

        <div className="card-elevated mt-6 space-y-4 p-5">
          {haber.body.map((p, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[#374151] animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Link href="/ilan-ver" className="btn-primary w-full">
            Ücretsiz kentsel dönüşüm ilanı ver
          </Link>
          <Link
            href="/haberler"
            className="text-center text-sm font-bold text-[#168f43]"
          >
            ← Tüm haberler
          </Link>
        </div>
      </article>
    </AppShell>
  );
}
