import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ListingsFeed } from "@/components/ilan/ListingsFeed";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicListingsForViewer } from "@/lib/listings/queries";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import type { PublicListing } from "@/types/listing";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ ilce?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const ilce =
    sp.ilce && isValidIstanbulIlce(sp.ilce) ? sp.ilce : undefined;
  const title = ilce
    ? `${ilce} Kentsel Dönüşüm İlanları`
    : "İstanbul Kentsel Dönüşüm İlanları";
  const description = ilce
    ? `${ilce} kentsel dönüşüm ilanları. Malikler ücretsiz ilan verir; onaylı müteahhitler iletişime geçer.`
    : "İstanbul geneli kentsel dönüşüm ilanları. 39 ilçe, ücretsiz malik ilanı, onaylı müteahhit iletişimi.";

  return {
    title,
    description,
    openGraph: { title, description, locale: "tr_TR", type: "website" },
    alternates: {
      canonical: ilce
        ? `${getSiteUrl()}/ilanlar?ilce=${encodeURIComponent(ilce)}`
        : `${getSiteUrl()}/ilanlar`,
    },
  };
}

export default async function IlanlarPage({
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

  const site = getSiteUrl();
  const schemas = [
    collectionPageSchema(
      ilce ? `${ilce} Kentsel Dönüşüm İlanları` : "İstanbul Kentsel Dönüşüm İlanları",
      "/ilanlar",
      "İstanbul kentsel dönüşüm ilan listesi"
    ),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "İlanlar", path: "/ilanlar" },
      ...(ilce ? [{ name: ilce, path: `/ilanlar?ilce=${encodeURIComponent(ilce)}` }] : []),
    ]),
    itemListSchema(
      "Kentsel dönüşüm ilanları",
      listings.map((l) => ({
        name: `${l.ilce} · ${l.kat_sayisi} kat · ${l.daire_sayisi} daire`,
        url: `${site}/ilan/${l.slug}`,
      }))
    ),
  ];

  return (
    <AppShell>
      <JsonLd data={schemas} />
      <nav className="mb-4 text-xs text-[#6b7280]">
        <Link href="/" className="font-medium text-[#168f43]">
          Ana sayfa
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#111321]">İlanlar</span>
      </nav>
      <h1 className="mb-1 text-2xl font-bold text-[#111321]">
        {ilce ? `${ilce} kentsel dönüşüm ilanları` : "İstanbul kentsel dönüşüm ilanları"}
      </h1>
      <p className="mb-6 text-sm text-[#6b7280]">
        Tüm açık ilanlar. İlçeye göre filtrele. Malik numarası yalnızca
        onaylı müteahhit hesaplarına açıktır.
      </p>
      <ListingsFeed
        listings={listings}
        errorMsg={errorMsg}
        ilce={ilce}
        filterBasePath="/ilanlar"
      />
    </AppShell>
  );
}
