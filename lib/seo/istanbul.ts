import type { Metadata } from "next";
import {
  getSiteUrl,
  ISTANBUL_GEO,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_NAME,
} from "./site";

/** Root + tüm sayfalarda ortak İstanbul geo / local SEO metadata */
export function istanbulGeoMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const site = getSiteUrl();
  const path = overrides?.path ?? "/";
  const url = `${site}${path === "/" ? "" : path}`;
  const title =
    overrides?.title ?? "kentsele.ist — İstanbul Kentsel Dönüşüm İlanları";
  const description = overrides?.description ?? SITE_DESCRIPTION;
  const keywords = [
    "İstanbul kentsel dönüşüm",
    "kentsel dönüşüm İstanbul",
    "riskli yapı İstanbul",
    "Yarısı Bizden",
    "6306 sayılı kanun",
    ...(overrides?.keywords ?? []),
  ];

  return {
    title,
    description,
    keywords,
    authors: [{ name: SITE_NAME, url: site }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Kentsel Dönüşüm",
    applicationName: SITE_NAME,
    metadataBase: new URL(site),
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": url,
      },
    },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url,
      siteName: SITE_NAME,
      title,
      description,
      countryName: "Türkiye",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": ISTANBUL_GEO.region,
      "geo.placename": ISTANBUL_GEO.placename,
      "geo.position": `${ISTANBUL_GEO.latitude};${ISTANBUL_GEO.longitude}`,
      ICBM: ISTANBUL_GEO.icbm,
      language: SITE_LANG,
      "content-language": SITE_LANG,
      "revisit-after": "7 days",
      distribution: "global",
      coverage: "İstanbul, Türkiye",
      target: "İstanbul",
    },
  };
}

/** Rehber makale sayfaları için zengin metadata */
export function rehberArticleMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  datePublished?: string;
  dateModified?: string;
}): Metadata {
  const site = getSiteUrl();
  const url = `${site}${opts.path}`;
  const base = istanbulGeoMetadata({
    title: opts.title,
    description: opts.description,
    path: opts.path,
    keywords: [
      ...opts.keywords,
      "İstanbul kentsel dönüşüm rehberi",
      "kentsel dönüşüm bilgi bankası",
    ],
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      url,
      title: opts.title,
      description: opts.description,
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      publishedTime: opts.datePublished,
      modifiedTime: opts.dateModified ?? opts.datePublished,
      authors: [SITE_NAME],
      section: "İstanbul Kentsel Dönüşüm Rehberi",
      tags: opts.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}
