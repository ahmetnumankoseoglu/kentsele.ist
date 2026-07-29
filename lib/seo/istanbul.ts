import type { Metadata } from "next";
import { clampMetaDescription } from "./meta";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  getSiteUrl,
  ISTANBUL_GEO,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_NAME,
} from "./site";

/** Kısa çekirdek set — yığma riskini düşür */
const CORE_KEYWORDS = [
  "kentsele.ist",
  "İstanbul kentsel dönüşüm",
  "müteahhit iletişim",
  "kat karşılığı",
  "riskli yapı",
];

function ogImages(alt?: string) {
  return [
    {
      url: DEFAULT_OG_IMAGE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
      alt: alt ?? DEFAULT_OG_IMAGE_ALT,
      type: "image/png" as const,
    },
  ];
}

export function istanbulGeoMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const site = getSiteUrl();
  const path = overrides?.path ?? "/";
  const url = `${site}${path === "/" ? "" : path}`;
  const title =
    overrides?.title ?? "kentsele.ist | İstanbul Kentsel Dönüşüm İlanları";
  const description = clampMetaDescription(
    overrides?.description ?? SITE_DESCRIPTION
  );
  // Tekrarlayan anahtar kelimeleri sadeleştir
  const keywords = Array.from(
    new Set([
      ...CORE_KEYWORDS,
      ...(overrides?.keywords ?? []).filter(
        (k) => !/kentsel dönüşüm kentsel dönüşüm/i.test(k)
      ),
    ])
  ).slice(0, 12);

  const noIndex = Boolean(overrides?.noIndex);

  return {
    title,
    description,
    keywords: noIndex ? undefined : keywords,
    authors: noIndex
      ? undefined
      : [{ name: "kentsele.ist Editör", url: `${site}/hakkimizda` }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Emlak ve İnşaat",
    applicationName: SITE_NAME,
    metadataBase: new URL(site),
    // noindex sayfalarda hreflang verme (çakışma uyarısı)
    alternates: noIndex
      ? { canonical: url }
      : {
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
      images: ogImages(title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false, noimageindex: true },
        }
      : {
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
    other: noIndex
      ? undefined
      : {
          "geo.region": ISTANBUL_GEO.region,
          "geo.placename": ISTANBUL_GEO.placename,
          "geo.position": `${ISTANBUL_GEO.latitude};${ISTANBUL_GEO.longitude}`,
          ICBM: ISTANBUL_GEO.icbm,
          language: SITE_LANG,
          "content-language": SITE_LANG,
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
  const description = clampMetaDescription(opts.description);
  const base = istanbulGeoMetadata({
    title: opts.title,
    description,
    path: opts.path,
    keywords: opts.keywords.slice(0, 8),
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      url,
      title: opts.title,
      description,
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      publishedTime: opts.datePublished,
      modifiedTime: opts.dateModified ?? opts.datePublished,
      authors: [SITE_NAME],
      section: "Rehber",
      tags: opts.keywords.slice(0, 6),
      images: ogImages(opts.title),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
