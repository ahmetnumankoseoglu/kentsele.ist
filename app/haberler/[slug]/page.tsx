import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsComments } from "@/components/haber/NewsComments";
import {
  getNewsComments,
  getPublishedNews,
  getPublishedNewsBySlug,
} from "@/lib/news/queries";
import { breadcrumbSchema, newsArticleSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import { getCurrentProfile } from "@/lib/auth/session";
import { ShareButtons } from "@/components/seo/ShareButtons";

export async function generateStaticParams() {
  const items = await getPublishedNews();
  return items.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const haber = await getPublishedNewsBySlug(slug);
  if (!haber) return { title: "Haber bulunamadı" };

  return {
    title: haber.title,
    description: haber.description,
    authors: [{ name: haber.author_name }],
    keywords: haber.tags,
    openGraph: {
      title: haber.title,
      description: haber.description,
      type: "article",
      locale: "tr_TR",
      publishedTime: haber.published_at ?? undefined,
      modifiedTime: haber.updated_at,
      authors: [haber.author_name],
      images: haber.cover_image_url ? [haber.cover_image_url] : undefined,
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
  const haber = await getPublishedNewsBySlug(slug);
  if (!haber) notFound();

  const comments = await getNewsComments(haber.id);
  const profile = await getCurrentProfile();
  const paragraphs = haber.body.split(/\n\n+/).filter(Boolean);

  const schemas = [
    newsArticleSchema({
      title: haber.title,
      description: haber.description,
      slug: haber.slug,
      datePublished: haber.published_at || haber.created_at,
      dateModified: haber.updated_at,
      image: haber.cover_image_url || undefined,
      authorName: haber.author_name,
    }),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Haberler", path: "/haberler" },
      { name: haber.title, path: `/haberler/${haber.slug}` },
    ]),
  ];

  return (
    <AppShell fullBleed showBottomCta={false}>
      <JsonLd data={schemas} />

      {/* Hero banner */}
      <header className="relative min-h-[260px] overflow-hidden bg-[#111321] text-white">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url(${haber.banner_image_url || haber.cover_image_url || "https://cdn.armut.com/images/services/00761-kentsel-donusum-proje.jpeg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-[#111321]/70 to-black/20" />
        <div className="relative mx-auto flex max-w-lg flex-col justify-end px-4 pb-8 pt-20">
          <div className="flex flex-wrap gap-2">
            {haber.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-[24px] font-bold leading-snug">
            {haber.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
            <span className="font-semibold text-white/90">
              {haber.author_name}
            </span>
            <time dateTime={haber.published_at || haber.created_at}>
              {formatDate(haber.published_at || haber.created_at)}
            </time>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-lg px-4 py-6">
        <nav className="mb-4 text-xs text-[#6b7280]">
          <Link href="/" className="font-medium text-[#168f43]">
            Ana sayfa
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/haberler" className="font-medium text-[#168f43]">
            Haberler
          </Link>
        </nav>

        <p className="text-base font-medium leading-relaxed text-[#374151]">
          {haber.description}
        </p>

        <div className="prose-article mt-6 space-y-4">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="animate-fade-up text-sm leading-relaxed text-[#374151]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {p}
            </p>
          ))}
        </div>

        <ShareButtons
          className="mt-8"
          url={`${getSiteUrl()}/haberler/${haber.slug}`}
          title={haber.title}
        />

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/ilan-ver" className="btn-primary w-full">
            Ücretsiz kentsel dönüşüm ilanı ver
          </Link>
        </div>

        <section className="mt-10 border-t border-[#e3e4e6] pt-8">
          <h2 className="section-title">Yorumlar ({comments.length})</h2>
          <NewsComments
            newsId={haber.id}
            initialComments={comments}
            isLoggedIn={Boolean(profile)}
            isSeed={haber.id.startsWith("seed-")}
          />
        </section>

        <Link
          href="/haberler"
          className="mt-8 block text-center text-sm font-bold text-[#168f43]"
        >
          ← Tüm haberler
        </Link>
      </article>
    </AppShell>
  );
}
