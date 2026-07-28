import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site";

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}

export function websiteSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    description: SITE_DESCRIPTION,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/ilanlar?ilce={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    logo: `${url}/favicon.ico`,
    areaServed: {
      "@type": "City",
      name: "İstanbul",
    },
    description: SITE_DESCRIPTION,
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

export function faqPageSchema(
  items: { q: string; a: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${ilce}, İstanbul`,
    },
    serviceType: "Kentsel Dönüşüm",
    url: `${url}${path}`,
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
    image: article.image ? [article.image] : [`${url}/favicon.ico`],
    inLanguage: "tr-TR",
    articleSection: "İstanbul Kentsel Dönüşüm",
    keywords: [
      "kentsel dönüşüm",
      "İstanbul",
      "kentsel dönüşüm haberleri",
      article.title,
    ],
  };
}

export function collectionPageSchema(name: string, path: string, description: string) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${url}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url,
    },
  };
}
