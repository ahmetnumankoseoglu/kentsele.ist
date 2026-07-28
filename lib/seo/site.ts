export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://kentsele.ist"
  );
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

export const DEFAULT_OG_IMAGE = `${getSiteUrl()}/favicon.ico`;
