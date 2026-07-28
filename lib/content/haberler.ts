export type Haber = {
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 */
  datePublished: string;
  dateModified?: string;
  authorName: string;
  /** HTML-safe paragraphs */
  body: string[];
  tags: string[];
  image?: string;
};

/**
 * İstanbul kentsel dönüşüm haberleri.
 * Yeni haber eklemek için bu diziye kayıt ekle (Google News / RSS için).
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
      "kentsele.ist üzerinde malikler ilçeye özel ücretsiz ilan oluşturabilir; müteahhitler de üyeliksiz şekilde ilanları inceleyip doğrudan iletişime geçebilir. Teyit sonrası yayınlanan ilanlar, hem SEO sayfalarında hem genel listede görünür.",
      "2026 itibarıyla kamu destekleri ve yerel uygulamalar bölgeye göre değişebildiği için, kendi ilçenizdeki güncel projelere ve benzer ilanlara bakmak en sağlıklı başlangıçtır.",
    ],
  },
  {
    slug: "kat-karsiligi-mi-hakedis-mi",
    title: "Kat Karşılığı mı, Hakediş mi? Kentsel Dönüşümde Ödeme Modelleri",
    description:
      "Kentsel dönüşümde kat karşılığı, hakediş ve peşin modellerinin malik açısından artı ve eksileri.",
    datePublished: "2026-07-15T11:30:00+03:00",
    authorName: "kentsele.ist Editör",
    tags: ["kat karşılığı", "hakediş", "kentsel dönüşüm"],
    body: [
      "Kentsel dönüşüm projelerinde en çok konuşulan konuların başında ödeme / paylaşım modeli gelir. Kat karşılığı, hakedişe tabi ve peşin nakit modelleri farklı risk ve getiri profilleri sunar.",
      "Kat karşılığında müteahhit inşaatı üstlenir; malikler genelde belirli bağımsız bölümleri alır. Hakediş modelinde ise ilerleme basamaklarına göre ödemeler yapılır. Peşin modellerde nakit akışı daha net olsa da bütçe disiplini şarttır.",
      "Hangi modelin uygun olduğu; arsa payı, emsal, konum, daire adedi ve malik mutabakatına göre değişir. kentsele.ist ilan formunda ödeme tercihi seçilerek müteahhitlerin doğru beklentiyle iletişime geçmesi sağlanır.",
    ],
  },
  {
    slug: "avrupa-yakasi-kentsel-donusum-trendleri",
    title: "Avrupa Yakası’nda Kentsel Dönüşüm Trendleri",
    description:
      "Bağcılar, Bahçelievler, Küçükçekmece ve Fatih hattında öne çıkan kentsel dönüşüm dinamikleri.",
    datePublished: "2026-07-08T14:00:00+03:00",
    authorName: "kentsele.ist Editör",
    tags: ["Avrupa Yakası", "İstanbul", "trend"],
    body: [
      "İstanbul Avrupa Yakası’nda yoğun yapı stoku, kentsel dönüşümü hem fırsat hem operasyonel zorluk haline getiriyor. Özellikle Bağcılar, Bahçelievler, Güngören, Küçükçekmece ve Fatih gibi ilçelerde parsel bazlı dönüşüm talepleri sık görülüyor.",
      "Müteahhitler için bu bölgelerde referans iş, zemin koşulları ve malik iletişimi belirleyici. Malikler içinse şeffaf süreç ve iletişim kanalları güven inşa ediyor.",
      "kentsele.ist üzerinde ilçe filtreleri ve SEO ilçe sayfaları sayesinde ilgili bölgedeki ilanlar daha kolay keşfedilebilir.",
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
