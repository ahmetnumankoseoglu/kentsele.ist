import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ilan/StatusBadge";
import { ContactActions } from "@/components/ilan/ContactActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicListingBySlug } from "@/lib/listings/queries";
import { ODEME_LABELS, type OdemeTercihi } from "@/lib/constants/listing";
import { ilceToSeoSlug } from "@/lib/constants/istanbul-ilceler";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import { canViewListingContact } from "@/lib/auth/session";
import type { PublicListing } from "@/types/listing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await getPublicListingBySlug(slug);
    if (!listing) return { title: "İlan bulunamadı" };
    const title = `${listing.ilce} Kentsel Dönüşüm — ${listing.kat_sayisi} kat, ${listing.daire_sayisi} daire`;
    const description = listing.aciklama.slice(0, 155);
    return {
      title,
      description,
      openGraph: { title, description, type: "article", locale: "tr_TR" },
      alternates: { canonical: `${getSiteUrl()}/ilan/${slug}` },
    };
  } catch {
    return { title: "İlan" };
  }
}

export default async function IlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let listing: PublicListing | null = null;
  try {
    listing = await getPublicListingBySlug(slug);
  } catch {
    notFound();
  }
  if (!listing) notFound();

  const districtPath = `/${ilceToSeoSlug(listing.ilce)}`;
  const canViewContact = await canViewListingContact();
  const schemas = [
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "İlanlar", path: "/ilanlar" },
      { name: `${listing.ilce} Kentsel Dönüşüm`, path: districtPath },
      { name: "İlan detayı", path: `/ilan/${listing.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: `${listing.ilce} kentsel dönüşüm — ${listing.kat_sayisi} kat, ${listing.daire_sayisi} daire`,
      description: listing.aciklama,
      url: `${getSiteUrl()}/ilan/${listing.slug}`,
      datePosted: listing.published_at ?? listing.created_at,
      address: {
        "@type": "PostalAddress",
        addressLocality: listing.ilce,
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
    },
  ];

  return (
    <AppShell showBottomCta={false}>
      <JsonLd data={schemas} />
      <nav className="mb-4 text-xs text-[#6b7280]">
        <Link href="/" className="font-medium text-[#168f43]">
          Ana sayfa
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={districtPath} className="font-medium text-[#168f43]">
          {listing.ilce} kentsel dönüşüm
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#111321]">İlan</span>
      </nav>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#6b7280]">
          İstanbul · {listing.ilce}
          {listing.mahalle ? ` · ${listing.mahalle}` : ""}
        </p>
        <StatusBadge status={listing.status} />
      </div>

      <h1 className="text-[22px] font-bold leading-snug text-[#111321]">
        {listing.kat_sayisi} kat · {listing.daire_sayisi} daire
      </h1>
      <p className="mt-1 text-sm font-bold text-[#168f43]">
        {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
      </p>

      <div className="card-elevated mt-6 p-4">
        <h2 className="text-sm font-bold text-[#111321]">İhtiyaç detayı</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#6b7280]">
          {listing.aciklama}
        </p>
      </div>

      <div className="card mt-4 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf8ee] text-sm font-bold text-[#168f43]">
            {listing.iletisim_adi
              .split(/\s+/)
              .slice(0, 2)
              .map((p) => p[0]?.toUpperCase() ?? "")
              .join("")}
          </div>
          <div>
            <p className="text-sm font-bold text-[#111321]">
              {listing.iletisim_adi}
            </p>
            <p className="text-xs text-[#6b7280]">İlan sahibi</p>
          </div>
        </div>
        <ContactActions
          slug={listing.slug}
          anlasildi={
            listing.status === "anlasildi" ||
            Boolean(listing.contact_closed)
          }
          canViewContact={canViewContact}
        />
      </div>

      <Link
        href="/ilan-ver"
        className="btn-primary mt-6 w-full"
      >
        Sen de ilan ver
      </Link>
    </AppShell>
  );
}
