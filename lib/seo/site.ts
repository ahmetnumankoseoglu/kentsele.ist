export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://kentsele.ist"
  );
}

export const SITE_NAME = "kentsele.ist";
export const SITE_LOCALE = "tr-TR";
export const SITE_DESCRIPTION =
  "İstanbul kentsel dönüşüm ilanları. Malikler ücretsiz ilan verir, müteahhitler ücretsiz inceler ve arar.";
