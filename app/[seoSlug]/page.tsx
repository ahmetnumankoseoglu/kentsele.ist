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
import {
  buildDistrictSeoSections,
  getDistrictMeta,
} from "@/lib/content/district-meta";
import { getPublicListingsForViewer } from "@/lib/listings/queries";
import { formatListingUnits } from "@/lib/listings/format";
import {
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
  serviceDistrictSchema,
} from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import { ShareButtons } from "@/components/seo/ShareButtons";
import { OfficialSources } from "@/components/seo/OfficialSources";
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

  const meta = getDistrictMeta(ilce, ISTANBUL_ILCELER);
  const title = `${ilce} Kentsel Dönüşüm 2026 | İlan Ver, Müteahhit Bul`;
  const description = `${ilce} kentsel dönüşüm rehberi (${meta.side}). ${ilce}’da riskli yapı, kat karşılığı ve hakediş süreçleri. Ücretsiz ilan verin; onaylı müteahhitler sizi arasın.`;
  const pageUrl = `${getSiteUrl()}/${seoSlug}`;

  return {
    title,
    description,
    keywords: [
      `${ilce} kentsel dönüşüm`,
      `${ilce} kentsel dönüşüm ilanları`,
      `${ilce} kentsel dönüşüm müteahhit`,
      `${ilce} kat karşılığı`,
      `${ilce} riskli yapı`,
      `${ilce} kentsel dönüşüm 2026`,
      "İstanbul kentsel dönüşüm",
      `${meta.side} kentsel dönüşüm`,
    ],
    openGraph: {
      title: `${ilce} Kentsel Dönüşüm`,
      description,
      locale: "tr_TR",
      type: "website",
      url: pageUrl,
      siteName: "Kentsele",
    },
    twitter: {
      card: "summary_large_image",
      title: `${ilce} Kentsel Dönüşüm`,
      description,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        "tr-TR": pageUrl,
        "x-default": pageUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
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
    listings = await getPublicListingsForViewer(ilce);
  } catch {
    listings = [];
  }

  const site = getSiteUrl();
  const path = `/${seoSlug}`;
  const districtMeta = getDistrictMeta(ilce, ISTANBUL_ILCELER);
  const seo = buildDistrictSeoSections(districtMeta);

  const schemas = [
    serviceDistrictSchema(ilce, path),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${ilce} Kentsel Dönüşüm`,
      description: seo.intro,
      url: `${site}${path}`,
      inLanguage: "tr-TR",
      isPartOf: {
        "@type": "WebSite",
        name: "kentsele.ist",
        url: site,
      },
      about: {
        "@type": "Place",
        name: `${ilce}, İstanbul`,
        containedInPlace: {
          "@type": "City",
          name: "İstanbul",
        },
      },
    },
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "İlanlar", path: "/ilanlar" },
      { name: `${ilce} Kentsel Dönüşüm`, path },
    ]),
    faqPageSchema(seo.faq),
    itemListSchema(
      `${ilce} kentsel dönüşüm ilanları`,
      listings.map((l) => ({
        name: `${l.ilce} · ${formatListingUnits(l)}`,
        url: `${site}/ilan/${l.slug}`,
      }))
    ),
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `${ilce} kentsel dönüşüm adımları`,
      description: `${ilce}’da kentsel dönüşüm sürecine başlamak için önerilen adımlar.`,
      step: seo.processSteps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.t,
        text: s.d,
      })),
    },
  ];

  const related = ISTANBUL_ILCELER.filter((x) => x !== ilce);

  return (
    <AppShell fullBleed>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden bg-[#111321] text-white">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "url(/images/kentsel-donusum-hero.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-[#111321]/80 to-[#111321]/50" />
        <div className="relative mx-auto max-w-lg px-4 pb-8 pt-10">
          <nav className="mb-3 text-xs text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="text-[#2cb34f] hover:underline">
              Ana sayfa
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/ilanlar" className="text-white/70 hover:underline">
              İlanlar
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">{ilce} kentsel dönüşüm</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
            İstanbul · {districtMeta.side}
          </p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-white">
            {ilce} Kentsel Dönüşüm
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {ilce} kentsel dönüşüm ilanı verin veya güncel ilanları inceleyin.
            Ücretsiz malik ilanları; iletişim yalnızca onaylı müteahhitlere açık.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Link
              href="/ilan-ver"
              className="btn-primary w-full flex-1"
              title={`${ilce} ücretsiz kentsel dönüşüm ilanı`}
            >
              İlan ver
            </Link>
            <Link
              href={`/ilanlar?ilce=${encodeURIComponent(ilce)}`}
              className="inline-flex w-full flex-1 items-center justify-center rounded-[3px] bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
              title={`${ilce} ilan listesi`}
            >
              İlanları gör ({listings.length})
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Intro article */}
        <article className="card-elevated mb-8 p-5 sm:p-6">
          <h2 className="section-title">{ilce} kentsel dönüşüm nedir?</h2>
          <p className="text-sm leading-relaxed text-[#374151]">{seo.intro}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
            {districtMeta.character} Bu sayfa; “{ilce} kentsel dönüşüm”, “
            {ilce} kentsel dönüşüm ilanları” ve “{ilce} müteahhit” aramaları için
            bilgilendirici bir rehber olarak hazırlanmıştır.
          </p>
        </article>

        {/* Why */}
        <section className="mb-8">
          <h2 className="section-title">{seo.whyTitle}</h2>
          <div className="space-y-3">
            {seo.whyBody.map((p, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-[#6b7280]"
              >
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {districtMeta.focusTopics.map((t) => (
              <li
                key={t}
                className="how-step card flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#111321]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf8ee] text-xs text-[#168f43]">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Process */}
        <section className="mb-8">
          <h2 className="section-title">{seo.processTitle}</h2>
          <ol className="space-y-3">
            {seo.processSteps.map((s, i) => (
              <li key={s.t} className="how-step card flex gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2cb34f] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#111321]">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Models */}
        <section className="mb-8">
          <h2 className="section-title">{seo.modelsTitle}</h2>
          <div className="grid gap-3">
            {seo.models.map((m) => (
              <div key={m.t} className="card p-4">
                <h3 className="text-sm font-bold text-[#168f43]">{m.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
                  {m.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Listings */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-2">
            <h2 className="section-title mb-0 pb-2">
              {ilce} güncel kentsel dönüşüm ilanları
            </h2>
            <span className="mb-2 text-xs font-bold text-[#6b7280]">
              {listings.length} ilan
            </span>
          </div>
          <p className="mb-4 text-sm text-[#6b7280]">
            Aşağıda {ilce} için yayındaki ilanlar listelenir. Detayda iletişim
            bilgisi yalnızca onaylı müteahhit hesaplarına açılır.
          </p>
          {listings.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm font-bold text-[#111321]">
                {ilce}’da henüz yayınlı ilan yok
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                İlk {ilce} kentsel dönüşüm ilanını sen ver.
              </p>
              <Link href="/ilan-ver" className="btn-primary mt-4 w-full">
                Ücretsiz ilan ver
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

        {/* Tips */}
        <section className="mb-8">
          <h2 className="section-title">{seo.tipsTitle}</h2>
          <ul className="space-y-2">
            {seo.tips.map((tip, i) => (
              <li
                key={i}
                className="card flex gap-3 p-4 text-sm leading-relaxed text-[#6b7280]"
              >
                <span className="font-bold text-[#2cb34f]">{i + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Mid CTA */}
        <section className="mb-8 overflow-hidden rounded-lg bg-[#111321] px-5 py-8 text-center text-white">
          <h2 className="text-lg font-bold">
            {ilce} kentsel dönüşüm için hazır mısın?
          </h2>
          <p className="mt-2 text-sm text-white/70">
            2 dakikada ücretsiz ilan oluştur. Teyit sonrası onaylı müteahhitler
            seni arasın.
          </p>
          <Link
            href="/ilan-ver"
            className="btn-primary mt-5 w-full sm:w-auto sm:min-w-[200px]"
            title={`${ilce} ücretsiz ilan`}
          >
            Ücretsiz ilan aç
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="section-title">
            {ilce} kentsel dönüşüm SSS
          </h2>
          <FaqAccordion items={seo.faq} />
        </section>

        {/* Closing */}
        <section className="card-elevated mb-8 p-5">
          <h2 className="text-base font-bold text-[#111321]">
            {ilce} kentsel dönüşümde bir sonraki adım
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            {seo.closing}
          </p>
        </section>

        <OfficialSources className="mb-8" />
        <ShareButtons
          className="mb-8"
          url={`${site}${path}`}
          title={`${ilce} Kentsel Dönüşüm`}
        />

        <section className="mb-4">
          <h2 className="section-title">Diğer ilçe rehberleri</h2>
          <p className="mb-4 -mt-2 text-sm text-[#6b7280]">
            Yakın bölgeler: {districtMeta.neighboring.join(", ")}. Tüm 39 ilçe
            için ayrı rehber sayfaları:
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map((name) => (
              <Link
                key={name}
                href={`/${ilceToSeoSlug(name)}`}
                className="rounded-full border border-[#e3e4e6] bg-white px-3 py-1.5 text-xs font-semibold text-[#111321] transition hover:border-[#2cb34f] hover:text-[#168f43]"
              >
                {name} kentsel dönüşüm
              </Link>
            ))}
          </div>
          <Link
            href="/ilanlar"
            className="mt-4 inline-block text-sm font-bold text-[#168f43]"
          >
            Tüm İstanbul ilanları →
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
