/** Canlı domain — schema, canonical, sitemap, OG için varsayılan */
export const PRODUCTION_SITE_URL = "https://kentsele.ist";

function isLocalhostUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "[::1]"
    );
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

/**
 * Public site origin for SEO (JSON-LD, canonical, sitemap, OG).
 * Never returns localhost — even if NEXT_PUBLIC_SITE_URL is set to it in .env.local.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (raw && !isLocalhostUrl(raw)) {
    return raw;
  }

  // Vercel production hostname (optional override without env)
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    ""
  );
  if (vercelProd && !isLocalhostUrl(`https://${vercelProd}`)) {
    return vercelProd.startsWith("http")
      ? vercelProd
      : `https://${vercelProd}`;
  }

  return PRODUCTION_SITE_URL;
}

export const SITE_NAME = "kentsele.ist";
export const SITE_LOCALE = "tr_TR";
export const SITE_LANG = "tr-TR";
export const SITE_DESCRIPTION =
  "İstanbul kentsel dönüşüm ilanları. Malikler ücretsiz ve kayıtsız ilan verir; onaylı müteahhitler iletişime geçer.";

/** İstanbul geo — ICBM / schema GeoCoordinates (merkez yaklaşık) */
export const ISTANBUL_GEO = {
  name: "İstanbul",
  region: "TR-34",
  country: "TR",
  placename: "İstanbul",
  latitude: 41.0082,
  longitude: 28.9784,
  /** ICBM meta: lat, lng */
  icbm: "41.0082, 28.9784",
} as const;

/** Absolute OG/Twitter image (Next.js file convention) */
export const DEFAULT_OG_IMAGE = `${PRODUCTION_SITE_URL}/opengraph-image`;
export const DEFAULT_OG_IMAGE_ALT =
  "kentsele.ist — İstanbul kentsel dönüşüm ilanları, malik ücretsiz ilan";
