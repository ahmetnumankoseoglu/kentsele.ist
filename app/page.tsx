import { Suspense } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ilan/ListingCard";
import { IlceFilter } from "@/components/ilan/IlceFilter";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { HomeFooter } from "@/components/home/HomeFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicListingsForViewer } from "@/lib/listings/queries";
import {
  isValidIstanbulIlce,
  ISTANBUL_ILCELER,
  ilceToSeoSlug,
} from "@/lib/constants/istanbul-ilceler";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { getPublishedNews } from "@/lib/news/queries";
import type { Metadata } from "next";
import {
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import type { PublicListing } from "@/types/listing";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "İstanbul Kentsel Dönüşüm İlanları | Ücretsiz Malik İlanı",
  description:
    "İstanbul kentsel dönüşüm ilanları. Malikler ücretsiz ve kayıtsız ilan verir; onaylı müteahhitler iletişime geçer. 39 ilçe, rehber ve destek hesaplama.",
  path: "/",
  keywords: [
    "kentsel dönüşüm ilanları",
    "İstanbul kentsel dönüşüm",
    "malik ilanı",
    "müteahhit bul",
    "kat karşılığı",
  ],
});

const POPULAR_ILCELER = [
  "Kadıköy",
  "Üsküdar",
  "Beşiktaş",
  "Bakırköy",
  "Maltepe",
  "Kartal",
  "Fatih",
  "Şişli",
  "Bahçelievler",
  "Küçükçekmece",
  "Pendik",
  "Bayrampaşa",
] as const;

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ ilce?: string }>;
}) {
  const sp = await searchParams;
  const ilce =
    sp.ilce && isValidIstanbulIlce(sp.ilce) ? sp.ilce : undefined;

  let listings: PublicListing[] = [];
  let errorMsg: string | null = null;
  try {
    listings = await getPublicListingsForViewer(ilce);
  } catch {
    errorMsg = "İlanlar yüklenemedi.";
  }

  const haberler = (await getPublishedNews()).slice(0, 3);

  const schemas = [
    websiteSchema(),
    organizationSchema(),
    breadcrumbSchema([{ name: "Ana sayfa", path: "/" }]),
    faqPageSchema([...FAQ_ITEMS]),
  ];

  return (
    <AppShell fullBleed>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden bg-[#111321] text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(https://cdn.armut.com/images/services/mobile/00761-kentsel-donusum-proje.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111321] via-[#111321]/70 to-[#111321]/40" />
        <div className="relative mx-auto max-w-lg px-4 pb-8 pt-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
            İstanbul · Kentsel Dönüşüm
          </p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-white">
            Kentsel dönüşüm ilanı ver, müteahhit bul.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Malikler ücretsiz ve kayıtsız ilan verir. Müteahhitler belge onayı
            sonrası malikle iletişime geçer.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Link
              href="/ilan-ver"
              className="btn-primary w-full flex-1 !text-base"
            >
              BAŞLA
            </Link>
            <Link
              href="/ilanlar"
              className="inline-flex w-full flex-1 items-center justify-center rounded-[3px] bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
            >
              İlanları Gör
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/55">
            39 ilçe · Ücretsiz ilan · Onaylı müteahhit iletişimi
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-lg px-4">
        <section className="py-8">
          <h2 className="section-title">Neden kentsele.ist?</h2>
          <div className="grid gap-3">
            {[
              {
                t: "İstanbul’a özel",
                d: "Sadece İstanbul kentsel dönüşüm ilanları. 39 ilçenin tamamı tek yerde.",
              },
              {
                t: "Ücretsiz malik ilanı",
                d: "İlan vermek ücretsiz ve kayıtsız. Düzenlemek için hesap gerekir. Müteahhitler ilan veremez.",
              },
              {
                t: "Teyitli yayın",
                d: "İlanlar ekip teyidi sonrası yayına alınır; sahte ilan riski azalır.",
              },
              {
                t: "Onaylı müteahhit iletişimi",
                d: "Malik numarası herkese açık değildir. Yalnızca belge onayı almış müteahhitler arar.",
              },
            ].map((item, i) => (
              <div
                key={item.t}
                className="how-step card flex gap-3 p-4 animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf8ee] text-sm font-bold text-[#168f43]">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold text-[#111321]">{item.t}</p>
                  <p className="mt-0.5 text-sm leading-snug text-[#6b7280]">
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-8">
          <h2 className="section-title">Nasıl çalışır?</h2>
          <div className="grid gap-3">
            {[
              {
                n: "1",
                t: "İhtiyacını anlat",
                d: "Birkaç kısa soruya yanıt ver, 2 dakikada kayıtsız ilan oluştur.",
              },
              {
                n: "2",
                t: "Onay ve yayın",
                d: "Ekibimiz teyit araması yapar, ilanın yayına alınır.",
              },
              {
                n: "3",
                t: "Onaylı müteahhitler ulaşır",
                d: "Belgesi onaylı müteahhitler ilanı görür ve seninle iletişime geçer.",
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className="how-step card flex gap-3 p-4 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2cb34f] text-sm font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#111321]">{s.t}</p>
                  <p className="mt-0.5 text-sm text-[#6b7280]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/ilan-ver" className="btn-primary mt-5 w-full">
            Hemen İlan Ver
          </Link>
        </section>

        <section className="pb-8">
          <div className="mb-4 flex items-end justify-between gap-2">
            <h2 className="section-title mb-0 pb-2">
              {ilce ? `${ilce} ilanları` : "Güncel ilanlar"}
            </h2>
            <Link
              href="/ilanlar"
              className="mb-2 text-xs font-bold text-[#168f43]"
            >
              Tümünü gör →
            </Link>
          </div>

          <Suspense fallback={null}>
            <IlceFilter basePath="/" />
          </Suspense>

          <div className="mt-4 flex flex-col gap-3">
            {errorMsg ? (
              <div className="card p-5 text-sm text-[#be3317]">{errorMsg}</div>
            ) : listings.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-sm font-bold text-[#111321]">
                  Bu filtrede henüz ilan yok
                </p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  İlk ilanı sen ver; onaylı müteahhitler seni bulsun.
                </p>
                <Link href="/ilan-ver" className="btn-primary mt-5 w-full">
                  Ücretsiz İlan Ver
                </Link>
              </div>
            ) : (
              listings.slice(0, 6).map((l, i) => (
                <div
                  key={l.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ListingCard listing={l} />
                </div>
              ))
            )}
          </div>
          {listings.length > 6 && (
            <Link href="/ilanlar" className="btn-secondary mt-4 w-full">
              Daha fazla ilan ({listings.length})
            </Link>
          )}
        </section>

        <section className="pb-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="section-title mb-0 pb-2">Haberler</h2>
            <Link
              href="/haberler"
              className="mb-2 text-xs font-bold text-[#168f43]"
            >
              Tümü →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {haberler.map((h, i) => (
              <Link
                key={h.slug}
                href={`/haberler/${h.slug}`}
                className="news-card card animate-fade-up block p-4"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <time className="text-xs font-bold text-[#2cb34f]">
                  {formatDate(h.published_at || h.created_at)}
                </time>
                <h3 className="mt-1 text-sm font-bold leading-snug text-[#111321]">
                  {h.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#6b7280]">
                  {h.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-8">
          <h2 className="section-title">Popüler ilçeler</h2>
          <p className="mb-4 -mt-2 text-sm text-[#6b7280]">
            İstanbul’da en çok aranan kentsel dönüşüm bölgelerine hızlı erişim.
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_ILCELER.map((name) => (
              <Link
                key={name}
                href={`/${ilceToSeoSlug(name)}`}
                className="rounded-full border border-[#e3e4e6] bg-white px-3.5 py-2 text-xs font-semibold text-[#111321] transition hover:border-[#2cb34f] hover:text-[#168f43]"
              >
                {name} kentsel dönüşüm
              </Link>
            ))}
            <Link
              href="/ilanlar"
              className="rounded-full bg-[#eaf8ee] px-3.5 py-2 text-xs font-bold text-[#168f43]"
            >
              Tüm {ISTANBUL_ILCELER.length} ilçe
            </Link>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-lg bg-[#111321] px-5 py-7 text-center text-white">
          <h2 className="text-lg font-bold">
            Kentsel dönüşüm için teklif mi arıyorsun?
          </h2>
          <p className="mt-2 text-sm text-white/70">
            İlanını 2 dakikada oluştur; teyit sonrası onaylı müteahhitler seni
            arasın.
          </p>
          <Link href="/ilan-ver" className="btn-primary mt-5 w-full sm:w-auto sm:min-w-[200px]">
            Ücretsiz İlan Ver
          </Link>
        </section>

        <section className="pb-8">
          <h2 className="section-title">Sıkça sorulan sorular</h2>
          <FaqAccordion />
          <Link href="/ilan-ver" className="btn-primary mt-6 w-full">
            Hâlâ soruların mı var? İlan ver, arayalım
          </Link>
        </section>
      </div>

      <HomeFooter />
    </AppShell>
  );
}
