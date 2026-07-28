import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  ISTANBUL_ILCELER,
  ilceToSeoSlug,
} from "@/lib/constants/istanbul-ilceler";
import { getAllHaberler } from "@/lib/content/haberler";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "Site Haritası | Tüm Sayfalar",
  description:
    "Kentsele site haritası: ilanlar, rehber, haberler, ilçe sayfaları ve iletişim.",
  path: "/site-haritasi",
});

const MAIN = [
  { href: "/", label: "Ana sayfa" },
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/ilan-ver", label: "İlan ver" },
  { href: "/haberler", label: "Haberler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/gizlilik", label: "KVKK / Gizlilik" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/giris", label: "Giriş" },
  { href: "/kayit", label: "Kayıt" },
] as const;

const REHBER = [
  { href: "/rehber", label: "Rehber ana sayfa" },
  { href: "/rehber/kentsel-donusum-nedir", label: "Kentsel dönüşüm nedir" },
  { href: "/rehber/6306-sayili-kanun", label: "6306 sayılı kanun" },
  { href: "/rehber/kira-yardimi", label: "Kira yardımı" },
  { href: "/rehber/hibe-ve-kredi-hesaplama", label: "Hibe ve kredi" },
] as const;

export default function SiteHaritasiPage() {
  const haberler = getAllHaberler();

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">Site haritası</h1>
      <p className="mt-2 text-sm text-[#6b7280]">
        Tüm önemli sayfalara buradan ulaşabilirsiniz.
      </p>

      <Section title="Ana sayfalar" links={MAIN} />
      <Section title="Rehber" links={REHBER} />

      <section className="mt-8">
        <h2 className="section-title">Haberler</h2>
        <ul className="space-y-1.5">
          {haberler.map((h) => {
            const short =
              h.title.length > 48 ? `${h.title.slice(0, 45).trim()}…` : h.title;
            return (
              <li key={h.slug}>
                <Link
                  href={`/haberler/${h.slug}`}
                  className="text-sm font-medium text-[#168f43]"
                  title={h.title}
                >
                  {short}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="section-title">İstanbul ilçe sayfaları</h2>
        <div className="flex flex-wrap gap-2">
          {ISTANBUL_ILCELER.map((ilce) => (
            <Link
              key={ilce}
              href={`/${ilceToSeoSlug(ilce)}`}
              className="rounded-full border border-[#e3e4e6] bg-white px-3 py-1.5 text-xs font-semibold text-[#111321] hover:border-[#2cb34f] hover:text-[#168f43]"
            >
              {ilce}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-[#9ca3af]">
        Arama motorları için XML harita:{" "}
        <Link href="/sitemap.xml" className="font-semibold text-[#168f43]">
          /sitemap.xml
        </Link>
      </p>
    </AppShell>
  );
}

function Section({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <section className="mt-8">
      <h2 className="section-title">{title}</h2>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm font-medium text-[#168f43]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
