import type { MetadataRoute } from "next";
import { allSeoDistrictSlugs } from "@/lib/constants/istanbul-ilceler";
import { getPublicListings } from "@/lib/listings/queries";
import { getPublishedNews } from "@/lib/news/queries";
import { getSiteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${site}/ilanlar`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${site}/ilan-ver`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site}/haberler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${site}/rehber`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site}/rehber/kentsel-donusum-nedir`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site}/rehber/6306-sayili-kanun`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site}/rehber/hibe-ve-kredi-hesaplama`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site}/rehber/kira-yardimi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${site}/gizlilik`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${site}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site}/site-haritasi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const districts: MetadataRoute.Sitemap = allSeoDistrictSlugs().map(
    (slug) => ({
      url: `${site}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  let news: MetadataRoute.Sitemap = [];
  try {
    const articles = await getPublishedNews();
    news = articles.map((h) => ({
      url: `${site}/haberler/${h.slug}`,
      lastModified: new Date(h.updated_at || h.published_at || h.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    /* haber yoksa sitemap yine döner */
  }

  // Yayındaki ilanlar
  let listings: MetadataRoute.Sitemap = [];
  try {
    const publicListings = await getPublicListings();
    listings = publicListings.map((l) => ({
      url: `${site}/ilan/${l.slug}`,
      lastModified: new Date(l.updated_at || l.published_at || now),
      changeFrequency: "daily" as const,
      priority: 0.75,
    }));
  } catch {
    /* ilan yoksa sitemap yine static + ilçe + haber döner */
  }

  return [...staticRoutes, ...districts, ...news, ...listings];
}
