export type Haber = {
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 */
  datePublished: string;
  dateModified?: string;
  authorName: string;
  /** HTML-safe paragraphs (seed fallback) */
  body: string[];
  tags: string[];
  image?: string;
};

/**
 * Seed haberler — boş: yalnızca admin panelinden eklenen haberler gösterilir.
 * (Eski seed rehber / trend haberleri kaldırıldı.)
 */
export const HABERLER: Haber[] = [];

export function getAllHaberler(): Haber[] {
  return [...HABERLER].sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

export function getHaberBySlug(slug: string): Haber | undefined {
  return HABERLER.find((h) => h.slug === slug);
}
