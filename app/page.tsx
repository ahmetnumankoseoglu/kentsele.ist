import { Suspense } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ilan/ListingCard";
import { IlceFilter } from "@/components/ilan/IlceFilter";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { HomeFooter } from "@/components/home/HomeFooter";
import { getPublicListings } from "@/lib/listings/queries";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import type { PublicListing } from "@/types/listing";

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
  "Ümraniye",
] as const;

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
    listings = await getPublicListings(ilce);
  } catch {
    errorMsg =
      "İlanlar yüklenemedi. Supabase yapılandırmasını kontrol edin.";
  }

  return (
    <AppShell fullBleed>
      {/* Hero */}
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
            Malikler ücretsiz ilan oluşturur. Müteahhitler listeden inceler ve
            doğrudan arar.
          </p>
          <Link
            href="/ilan-ver"
            className="btn-primary mt-6 w-full max-w-xs !text-base"
          >
            BAŞLA
          </Link>
          <p className="mt-3 text-xs text-white/55">
            39 ilçe · Ücretsiz ilan · Üyeliksiz iletişim
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-lg px-4">
        {/* Why */}
        <section className="py-8">
          <h2 className="section-title">Neden kentsele.ist?</h2>
          <div className="grid gap-3">
            {[
              {
                t: "İstanbul’a özel",
                d: "Sadece İstanbul kentsel dönüşüm ilanları. 39 ilçenin tamamı tek yerde.",
              },
              {
                t: "Ücretsiz ve sade",
                d: "İlan vermek, incelemek ve aramak ücretsiz. Karmaşık üyelik yok.",
              },
              {
                t: "Teyitli yayın",
                d: "İlanlar ekip teyidi sonrası yayına alınır; sahte ilan riski azalır.",
              },
              {
                t: "Doğrudan iletişim",
                d: "Müteahhitler Ara / WhatsApp ile malikle hemen görüşür.",
              },
            ].map((item) => (
              <div key={item.t} className="card flex gap-3 p-4">
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

        {/* How it works */}
        <section className="pb-8">
          <h2 className="section-title">Nasıl çalışır?</h2>
          <div className="grid gap-3">
            {[
              {
                n: "1",
                t: "İhtiyacını anlat",
                d: "Birkaç kısa soruya yanıt ver, 2 dakikada ilanını oluştur.",
              },
              {
                n: "2",
                t: "Onay ve yayın",
                d: "Ekibimiz teyit araması yapar, ilanın yayına alınır.",
              },
              {
                n: "3",
                t: "Müteahhitler arasın",
                d: "İlanı gören müteahhitler seni arar veya WhatsApp yazar.",
              },
            ].map((s) => (
              <div key={s.n} className="card flex gap-3 p-4">
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

        {/* Listings */}
        <section className="pb-8">
          <div className="mb-4 flex items-end justify-between gap-2">
            <h2 className="section-title mb-0 pb-2">
              {ilce ? `${ilce} ilanları` : "Güncel ilanlar"}
            </h2>
            {!errorMsg && (
              <span className="mb-2 text-xs font-bold text-[#6b7280]">
                {listings.length} ilan
              </span>
            )}
          </div>

          <Suspense fallback={null}>
            <IlceFilter />
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
                  İlk ilanı sen ver, müteahhitler seni bulsun.
                </p>
                <Link href="/ilan-ver" className="btn-primary mt-5">
                  Ücretsiz İlan Ver
                </Link>
              </div>
            ) : (
              listings.map((l) => <ListingCard key={l.id} listing={l} />)
            )}
          </div>
        </section>

        {/* Popular districts */}
        <section className="pb-8">
          <h2 className="section-title">Popüler ilçeler</h2>
          <p className="mb-4 -mt-2 text-sm text-[#6b7280]">
            İstanbul’un en çok aranan kentsel dönüşüm bölgelerine hızlı filtre.
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_ILCELER.map((name) => (
              <Link
                key={name}
                href={`/?ilce=${encodeURIComponent(name)}`}
                className="rounded-full border border-[#e3e4e6] bg-white px-3.5 py-2 text-xs font-semibold text-[#111321] transition hover:border-[#2cb34f] hover:text-[#168f43]"
              >
                {name}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full bg-[#eaf8ee] px-3.5 py-2 text-xs font-bold text-[#168f43]"
            >
              Tüm {ISTANBUL_ILCELER.length} ilçe
            </Link>
          </div>
        </section>

        {/* Mid CTA band */}
        <section className="mb-8 overflow-hidden rounded-lg bg-[#111321] px-5 py-7 text-center text-white">
          <h2 className="text-lg font-bold">
            Kentsel dönüşüm için teklif mi arıyorsun?
          </h2>
          <p className="mt-2 text-sm text-white/70">
            İlanını 2 dakikada oluştur; teyit sonrası müteahhitler seni arasın.
          </p>
          <Link
            href="/ilan-ver"
            className="btn-primary mt-5 inline-flex min-w-[200px]"
          >
            Ücretsiz İlan Ver
          </Link>
        </section>

        {/* FAQ */}
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
