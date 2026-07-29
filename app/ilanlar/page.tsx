import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ListingsFeed } from "@/components/ilan/ListingsFeed";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicListingsForViewer } from "@/lib/listings/queries";
import { formatListingUnits } from "@/lib/listings/format";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo/schema";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import { getSiteUrl } from "@/lib/seo/site";
import type { PublicListing } from "@/types/listing";

const PAGE_SIZE = 20;

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ ilce?: string; page?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const ilce =
    sp.ilce && isValidIstanbulIlce(sp.ilce) ? sp.ilce : undefined;
  const page = parsePage(sp.page);
  const title = ilce
    ? `${ilce} malik ilanları`
    : "İstanbul malik ilanları";
  const description = ilce
    ? `${ilce} için açık ilanlar. Ücretsiz malik kaydı; onaylı müteahhit iletişimi.`
    : "İstanbul geneli açık ilanlar. 39 ilçe, ücretsiz malik ilanı, onaylı müteahhit iletişimi.";

  const params = new URLSearchParams();
  if (ilce) params.set("ilce", ilce);
  if (page > 1) params.set("page", String(page));
  const q = params.toString();
  const path = `/ilanlar${q ? `?${q}` : ""}`;

  return istanbulGeoMetadata({
    title: page > 1 ? `${title} · Sayfa ${page}` : title,
    description,
    path,
    keywords: ilce
      ? [`${ilce} ilan`, "malik", "müteahhit"]
      : ["ilan listesi", "malik", "İstanbul"],
  });
}

export default async function IlanlarPage({
  searchParams,
}: {
  searchParams: Promise<{ ilce?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const ilce =
    sp.ilce && isValidIstanbulIlce(sp.ilce) ? sp.ilce : undefined;
  let page = parsePage(sp.page);

  let all: PublicListing[] = [];
  let errorMsg: string | null = null;
  try {
    all = await getPublicListingsForViewer(ilce);
  } catch {
    errorMsg = "İlanlar yüklenemedi.";
  }

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  if (page > totalPages) page = totalPages;
  const start = (page - 1) * PAGE_SIZE;
  const listings = all.slice(start, start + PAGE_SIZE);

  const site = getSiteUrl();
  const h1 = ilce ? `${ilce} malik ilanları` : "İstanbul malik ilanları";
  const crumbs = [
    { name: "Ana sayfa", path: "/" },
    { name: "İlanlar", path: "/ilanlar" },
    ...(ilce
      ? [
          {
            name: ilce,
            path: `/ilanlar?ilce=${encodeURIComponent(ilce)}`,
          },
        ]
      : []),
  ];

  const schemas = [
    collectionPageSchema(h1, "/ilanlar", "İstanbul malik ilan listesi"),
    breadcrumbSchema(crumbs),
    itemListSchema(
      "Malik ilanları",
      listings.map((l) => ({
        name: `${l.ilce} · ${formatListingUnits(l)}`,
        url: `${site}/ilan/${l.slug}`,
      }))
    ),
  ];

  return (
    <AppShell>
      <JsonLd data={schemas} />
      <Breadcrumbs
        items={crumbs.map((c, i) => ({
          name: c.name,
          href: i < crumbs.length - 1 ? c.path : undefined,
        }))}
      />
      <h1 className="mb-1 text-2xl font-bold text-[#111321]">{h1}</h1>
      <p className="mb-6 text-sm text-[#6b7280]">
        Tüm açık ilanlar. İlçeye göre filtrele. Malik numarası yalnızca onaylı
        müteahhit hesaplarına açıktır.
      </p>
      <ListingsFeed
        listings={listings}
        errorMsg={errorMsg}
        ilce={ilce}
        filterBasePath="/ilanlar"
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={total}
        showPagination
      />
    </AppShell>
  );
}
