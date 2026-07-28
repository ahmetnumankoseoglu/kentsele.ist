import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ilan/ListingCard";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  allSeoDistrictSlugs,
  ilceFromSeoSlug,
  ilceToSeoSlug,
  ISTANBUL_ILCELER,
} from "@/lib/constants/istanbul-ilceler";
import { getPublicListings } from "@/lib/listings/queries";
import { FAQ_ITEMS } from "@/lib/content/faq";
import {
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
  serviceDistrictSchema,
} from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import type { PublicListing } from "@/types/listing";

export function generateStaticParams() {
  return allSeoDistrictSlugs().map((seoSlug) => ({ seoSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  const ilce = ilceFromSeoSlug(seoSlug);
  if (!ilce) return { title: "Sayfa bulunamadı" };

  const title = `${ilce} Kentsel Dönüşüm | İlan Ver, Müteahhit Bul`;
  const description = `${ilce} kentsel dönüşüm ilanları ve rehberi. ${ilce}’da kentsel dönüşüm için ücretsiz ilan verin; müteahhitler sizi arasın. kentsele.ist`;

  return {
    title,
    description,
    keywords: [
      `${ilce} kentsel dönüşüm`,
      `${ilce} kentsel dönüşüm ilanları`,
      `${ilce} müteahhit`,
      `${ilce} kat karşılığı`,
      "İstanbul kentsel dönüşüm",
    ],
    openGraph: {
      title,
      description,
      locale: "tr_TR",
      type: "website",
      url: `${getSiteUrl()}/${seoSlug}`,
    },
    alternates: {
      canonical: `${getSiteUrl()}/${seoSlug}`,
    },
  };
}

export default async function DistrictSeoPage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;
  const ilce = ilceFromSeoSlug(seoSlug);
  if (!ilce) notFound();

  let listings: PublicListing[] = [];
  try {
    listings = await getPublicListings(ilce);
  } catch {
    listings = [];
  }

  const site = getSiteUrl();
  const path = `/${seoSlug}`;

  const schemas = [
    serviceDistrictSchema(ilce, path),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "İlanlar", path: "/ilanlar" },
      { name: `${ilce} Kentsel Dönüşüm`, path },
    ]),
    faqPageSchema([...FAQ_ITEMS]),
    itemListSchema(
      `${ilce} kentsel dönüşüm ilanları`,
      listings.map((l) => ({
        name: `${l.ilce} · ${l.kat_sayisi} kat · ${l.daire_sayisi} daire`,
        url: `${site}/ilan/${l.slug}`,
      }))
    ),
  ];

  const related = ISTANBUL_ILCELER.filter((x) => x !== ilce).slice(0, 8);

  return (
    <AppShell fullBleed>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden bg-[#111321] text-white">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "url(https://cdn.armut.com/images/services/mobile/00761-kentsel-donusum-proje.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-[#111321]/75 to-[#111321]/45" />
        <div className="relative mx-auto max-w-lg px-4 pb-8 pt-8">
          <nav className="mb-3 text-xs text-white/60">
            <Link href="/" className="text-[#2cb34f]">
              Ana sayfa
            </Link>
            <span className="mx-1.5">/</span>
            <span>{ilce} kentsel dönüşüm</span>
          </nav>
          <h1 className="text-[26px] font-bold leading-tight">
            {ilce} Kentsel Dönüşüm
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {ilce} bölgesinde kentsel dönüşüm ilanı verin veya güncel ilanları
            inceleyin. Ücretsiz, teyitli ve doğrudan iletişim.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link href="/ilan-ver" className="btn-primary">
              {ilce}’da İlan Ver
            </Link>
            <Link
              href={`/ilanlar?ilce=${encodeURIComponent(ilce)}`}
              className="inline-flex items-center justify-center rounded-[3px] bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
            >
              Tüm {ilce} ilanları
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-lg px-4 py-8">
        <article className="card-elevated mb-8 p-5">
          <h2 className="section-title">
            {ilce} kentsel dönüşüm hakkında
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-[#6b7280]">
            <p>
              <strong className="text-[#111321]">{ilce}</strong>, İstanbul’da
              kentsel dönüşüm talebinin yoğun olduğu ilçelerden biridir. Riskli
              yapı stoku, kat karşılığı ve hakediş modelleri bu bölgede sık
              gündeme gelir.
            </p>
            <p>
              kentsele.ist üzerinden {ilce} kentsel dönüşüm ilanı oluşturmak
              ücretsizdir. İlanınız teyit sonrası yayına alınır; müteahhitler
              sizi arayabilir veya WhatsApp ile yazabilir.
            </p>
            <p>
              Aşağıda {ilce} için yayındaki güncel ilanları görebilir, benzer
              ilçelerin SEO sayfalarına göz atabilirsiniz.
            </p>
          </div>
        </article>

        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="section-title mb-0 pb-2">
              {ilce} güncel ilanlar
            </h2>
            <span className="mb-2 text-xs font-bold text-[#6b7280]">
              {listings.length} ilan
            </span>
          </div>
          {listings.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm font-bold text-[#111321]">
                {ilce}’da henüz yayınlı ilan yok
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                İlk ilanı sen ver.
              </p>
              <Link href="/ilan-ver" className="btn-primary mt-4">
                İlan Ver
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="section-title">Sıkça sorulan sorular</h2>
          <FaqAccordion />
        </section>

        <section className="mb-4">
          <h2 className="section-title">Diğer ilçeler</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((name) => (
              <Link
                key={name}
                href={`/${ilceToSeoSlug(name)}`}
                className="rounded-full border border-[#e3e4e6] bg-white px-3 py-1.5 text-xs font-semibold text-[#111321] hover:border-[#2cb34f] hover:text-[#168f43]"
              >
                {name} kentsel dönüşüm
              </Link>
            ))}
            <Link
              href="/ilanlar"
              className="rounded-full bg-[#eaf8ee] px-3 py-1.5 text-xs font-bold text-[#168f43]"
            >
              Tüm ilanlar
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
