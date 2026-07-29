import {
  DEFAULT_OG_IMAGE,
  getSiteUrl,
  ISTANBUL_GEO,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
} from "./site";

export function jsonLdScript(
  data: Record<string, unknown> | Record<string, unknown>[]
) {
  // XSS: </script> kırılımını engelle
  const raw = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return { __html: raw };
}

export function istanbulPlaceSchema() {
  return {
    "@type": "City",
    "@id": `${getSiteUrl()}/#place-istanbul`,
    name: "İstanbul",
    alternateName: ["Istanbul", "İstanbul ili"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ISTANBUL_GEO.latitude,
      longitude: ISTANBUL_GEO.longitude,
    },
    containedInPlace: {
      "@type": "Country",
      name: "Türkiye",
    },
  };
}

export function websiteSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: SITE_NAME,
    alternateName: "İstanbul Kentsel Dönüşüm İlanları",
    url,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANG,
    publisher: { "@id": `${url}/#organization` },
    about: { "@id": `${url}/#place-istanbul` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/ilanlar?ilce={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: SITE_NAME,
    url,
    logo: {
      "@type": "ImageObject",
      url: `${url}/favicon.ico`,
      contentUrl: `${url}/favicon.svg`,
      width: 48,
      height: 48,
    },
    image: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
    },
    description: SITE_DESCRIPTION,
    alternateName: ["Kentsele", "kentsele"],
    areaServed: istanbulPlaceSchema(),
    knowsAbout: [
      "Riskli yapı",
      "6306 sayılı kanun",
      "Yarısı Bizden",
      "Kat karşılığı",
      "İstanbul emlak",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "TR-34",
      availableLanguage: ["Turkish"],
      url: `${url}/iletisim`,
    },
  };
}

/**
 * BreadcrumbList — en az 2 öğe (SERP / şema uyarıları).
 * Tek öğe verilirse “Ana sayfa” öne eklenir.
 */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const url = getSiteUrl();
  let list = items;
  if (list.length === 0) {
    list = [
      { name: "Ana sayfa", path: "/" },
      { name: SITE_NAME, path: "/" },
    ];
  } else if (list.length === 1) {
    const only = list[0]!;
    if (only.path === "/" || only.path === "") {
      list = [
        { name: "Ana sayfa", path: "/" },
        { name: "İlanlar", path: "/ilanlar" },
      ];
    } else {
      list = [{ name: "Ana sayfa", path: "/" }, only];
    }
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${url}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: SITE_LANG,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function serviceDistrictSchema(ilce: string, path: string) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${ilce} Kentsel Dönüşüm`,
    description: `${ilce} kentsel dönüşüm ilanları. Malikler ücretsiz ilan verir; onaylı müteahhitler ${ilce} bölgesindeki fırsatları inceler.`,
    provider: { "@id": `${url}/#organization` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${ilce}, İstanbul`,
      containedInPlace: istanbulPlaceSchema(),
    },
    serviceType: "Kentsel Dönüşüm",
    url: `${url}${path}`,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${url}${path}`,
      serviceLocation: istanbulPlaceSchema(),
    },
  };
}

export function newsArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}) {
  const url = getSiteUrl();
  const pageUrl = `${url}/haberler/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Person",
      name: article.authorName ?? "kentsele.ist Editör",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${url}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: article.image ? [article.image] : [DEFAULT_OG_IMAGE],
    inLanguage: SITE_LANG,
    articleSection: "İstanbul Kentsel Dönüşüm",
    contentLocation: istanbulPlaceSchema(),
    spatialCoverage: istanbulPlaceSchema(),
    keywords: [
      "kentsel dönüşüm",
      "İstanbul",
      "kentsel dönüşüm haberleri",
      article.title,
    ],
  };
}

export function collectionPageSchema(
  name: string,
  path: string,
  description: string
) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}${path}#webpage`,
    name,
    description,
    url: `${url}${path}`,
    inLanguage: SITE_LANG,
    isPartOf: { "@id": `${url}/#website` },
    about: { "@id": `${url}/#place-istanbul` },
    contentLocation: istanbulPlaceSchema(),
    spatialCoverage: istanbulPlaceSchema(),
    publisher: { "@id": `${url}/#organization` },
  };
}

/** Rehber makale: Article + WebPage + geo İstanbul */
export function rehberArticleSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
  articleSection?: string;
}) {
  const url = getSiteUrl();
  const pageUrl = `${url}${opts.path}`;
  const modified = opts.dateModified ?? opts.datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: opts.title,
    name: opts.title,
    description: opts.description,
    inLanguage: SITE_LANG,
    datePublished: opts.datePublished,
    dateModified: modified,
    author: { "@id": `${url}/#organization` },
    publisher: { "@id": `${url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
    },
    isPartOf: { "@id": `${url}/#website` },
    about: [
      { "@id": `${url}/#place-istanbul` },
      {
        "@type": "Thing",
        name: "Kentsel dönüşüm",
      },
    ],
    contentLocation: istanbulPlaceSchema(),
    spatialCoverage: istanbulPlaceSchema(),
    articleSection:
      opts.articleSection ?? "İstanbul Kentsel Dönüşüm Rehberi",
    keywords: [
      "İstanbul",
      "kentsel dönüşüm",
      ...(opts.keywords ?? []),
    ].join(", "),
    image: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
    },
  };
}

export function rehberWebPageSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  const url = getSiteUrl();
  const pageUrl = `${url}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: opts.title,
    description: opts.description,
    inLanguage: SITE_LANG,
    isPartOf: { "@id": `${url}/#website` },
    about: { "@id": `${url}/#place-istanbul` },
    contentLocation: istanbulPlaceSchema(),
    spatialCoverage: istanbulPlaceSchema(),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    breadcrumb: undefined as unknown as undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p"],
    },
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    inLanguage: SITE_LANG,
    supply: [],
    tool: [],
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Graph: Organization + Place + WebSite (site geneli) */
export function siteGraphSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationSchema(),
        "@context": undefined,
      },
      {
        ...istanbulPlaceSchema(),
        "@context": undefined,
      },
      {
        ...websiteSchema(),
        "@context": undefined,
      },
    ].map((node) => {
      const { ["@context"]: _, ...rest } = node as Record<string, unknown>;
      return rest;
    }),
  };
}
