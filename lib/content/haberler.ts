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
 * Seed haberler — DB’de yayınlı haber yoksa fallback.
 * Admin panelinden gerçek haber eklemen önerilir.
 * (Eski 3 seed’ten 2’si kaldırıldı.)
 */
export const HABERLER: Haber[] = [
  {
    slug: "istanbul-kentsel-donusum-2026-rehberi",
    title: "İstanbul Kentsel Dönüşüm 2026 Rehberi: Malikler Ne Yapmalı?",
    description:
      "İstanbul’da kentsel dönüşüm sürecine giren malikler için adım adım rehber: riskli yapı, mutabakat, kat karşılığı ve ilan süreci.",
    datePublished: "2026-07-20T09:00:00+03:00",
    authorName: "kentsele.ist Editör",
    tags: ["kentsel dönüşüm", "İstanbul", "malik rehberi"],
    body: [
      "İstanbul’da kentsel dönüşüm, deprem riski altındaki yapı stokunun yenilenmesi için en kritik kentsel politikalardan biri olmaya devam ediyor. Malikler çoğu zaman sürecin nereden başlayacağını, hangi belgelerin gerektiğini ve müteahhit seçiminin nasıl yapılması gerektiğini merak ediyor.",
      "İlk adım genelde riskli yapı tespitidir. Yetkili kurumlarca yapılan tespit sonrasında malikler arasında mutabakat ve proje modeli (kat karşılığı, hasılat paylaşımı, peşin vb.) konuşulur. Bu aşamada şeffaf teklif karşılaştırması kritik önem taşır.",
      "kentsele.ist üzerinde malikler ilçeye özel ücretsiz ve kayıtsız ilan oluşturabilir. Müteahhitler kayıt olup belge onayı aldıktan sonra malik iletişim bilgisine erişebilir. Onay sonrası ilanlar hem ilgili ilçe sayfasında hem genel listede görünür.",
      "2026 itibarıyla kamu destekleri ve yerel uygulamalar bölgeye göre değişebildiği için, kendi ilçenizdeki güncel projelere ve benzer ilanlara bakmak en sağlıklı başlangıçtır.",
    ],
  },
];

export function getAllHaberler(): Haber[] {
  return [...HABERLER].sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

export function getHaberBySlug(slug: string): Haber | undefined {
  return HABERLER.find((h) => h.slug === slug);
}
