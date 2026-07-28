import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ilan/StatusBadge";
import { ContactActions } from "@/components/ilan/ContactActions";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getListingBySlugFull,
  getPublicListingBySlug,
} from "@/lib/listings/queries";
import {
  LISTING_BELGELER,
  ODEME_LABELS,
  type ListingBelgeKey,
  type OdemeTercihi,
} from "@/lib/constants/listing";
import { ilceToSeoSlug } from "@/lib/constants/istanbul-ilceler";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import {
  canViewListingContact,
  getCurrentProfile,
  getSessionUser,
} from "@/lib/auth/session";
import { canOwnerEditListing } from "@/lib/listings/ownership";
import { ShareButtons } from "@/components/seo/ShareButtons";
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
    const pageUrl = `${getSiteUrl()}/ilan/${slug}`;
    return {
      title,
      description,
      openGraph: { title, description, type: "article", locale: "tr_TR" },
      alternates: {
        canonical: pageUrl,
        languages: { "tr-TR": pageUrl, "x-default": pageUrl },
      },
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

  let ownerManagePath: string | null = null;
  let titleAdaParsel: string | null = null;
  try {
    const user = await getSessionUser();
    const profile = await getCurrentProfile();
    const full = await getListingBySlugFull(slug);
    if (
      full &&
      user &&
      profile &&
      canOwnerEditListing({
        profileId: profile.id,
        userEmail: user.email,
        listing: full,
      })
    ) {
      ownerManagePath = `/yonet/${full.manage_token}`;
    }
    if (canViewContact && full) {
      const parts = [
        full.ada ? `Ada ${full.ada}` : null,
        full.parsel ? `Parsel ${full.parsel}` : null,
      ].filter(Boolean);
      if (parts.length) titleAdaParsel = parts.join(" · ");
    }
  } catch {
    /* sahiplik yoksa buton çıkmaz */
  }

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
        <Link
          href={districtPath}
          className="font-medium text-[#168f43]"
          title={`${listing.ilce} kentsel dönüşüm`}
        >
          {listing.ilce}
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
        {titleAdaParsel ? ` · ${titleAdaParsel}` : ""}
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
        <h2 className="text-sm font-bold text-[#111321]">Belgeler</h2>
        <ul className="mt-3 space-y-2">
          {LISTING_BELGELER.map((b) => {
            const ok = Boolean(listing[b.key as ListingBelgeKey]);
            return (
              <li
                key={b.key}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-[#374151]">{b.label}</span>
                <span
                  className={
                    ok
                      ? "font-bold text-[#168f43]"
                      : "font-medium text-[#9ca3af]"
                  }
                >
                  {ok ? "Var" : "Yok / belirtilmedi"}
                </span>
              </li>
            );
          })}
        </ul>
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

      <ShareButtons
        className="mt-6"
        url={`${getSiteUrl()}/ilan/${listing.slug}`}
        title={`${listing.ilce} · ${listing.kat_sayisi} kat, ${listing.daire_sayisi} daire`}
      />

      {ownerManagePath ? (
        <Link href={ownerManagePath} className="btn-primary mt-6 w-full">
          Düzenle
        </Link>
      ) : (
        <Link href="/ilan-ver" className="btn-primary mt-6 w-full">
          Sen de ilan ver
        </Link>
      )}
    </AppShell>
  );
}
