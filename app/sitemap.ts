import type { MetadataRoute } from "next";
import { allSeoDistrictSlugs } from "@/lib/constants/istanbul-ilceler";
import { getAllHaberler } from "@/lib/content/haberler";
import { getSiteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
      changeFrequency: "monthly",
      priority: 0.85,
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
  ];

  const districts: MetadataRoute.Sitemap = allSeoDistrictSlugs().map(
    (slug) => ({
      url: `${site}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const news: MetadataRoute.Sitemap = getAllHaberler().map((h) => ({
    url: `${site}/haberler/${h.slug}`,
    lastModified: new Date(h.dateModified ?? h.datePublished),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...districts, ...news];
}
