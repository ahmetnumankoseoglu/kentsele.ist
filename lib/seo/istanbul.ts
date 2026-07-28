import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  getSiteUrl,
  ISTANBUL_GEO,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_NAME,
} from "./site";

/** Primary keyword first; Istanbul is geo/local modifier (OK for single-city product) */
const CORE_KEYWORDS = [
  "kentsel dönüşüm",
  "İstanbul kentsel dönüşüm",
  "riskli yapı",
  "Yarısı Bizden",
  "6306 sayılı kanun",
];

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
    overrides?.title ?? "İstanbul Kentsel Dönüşüm İlanları | Ücretsiz Malik İlanı";
  const description = overrides?.description ?? SITE_DESCRIPTION;
  const keywords = [
    ...CORE_KEYWORDS,
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
    // Self-referencing hreflang + x-default (single-locale TR site)
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": url,
        "x-default": url,
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
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: DEFAULT_OG_IMAGE_ALT,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
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
      "kentsel dönüşüm",
      ...opts.keywords,
      "İstanbul kentsel dönüşüm rehberi",
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
      section: "Kentsel Dönüşüm Rehberi",
      tags: ["kentsel dönüşüm", ...opts.keywords],
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: opts.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
