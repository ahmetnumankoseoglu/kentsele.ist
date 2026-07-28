export const LISTING_STATUSES = [
  "incelemede",
  "yayinda",
  "teklif_saglaniyor",
  "anlasildi",
  "kaldirildi",
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const PUBLIC_STATUSES: ListingStatus[] = [
  "yayinda",
  "teklif_saglaniyor",
  "anlasildi",
];

export const STATUS_LABELS: Record<ListingStatus, string> = {
  incelemede: "İncelemede",
  yayinda: "Yayında",
  teklif_saglaniyor: "Teklif sağlanıyor",
  anlasildi: "Anlaşıldı",
  kaldirildi: "Kaldırıldı",
};

export const ODEME_TERCIHLERI = [
  "kat_karsiligi",
  "hakedis",
  "pesin",
  "diger",
  "belirsiz",
] as const;

export type OdemeTercihi = (typeof ODEME_TERCIHLERI)[number];

export const ODEME_LABELS: Record<OdemeTercihi, string> = {
  kat_karsiligi: "Kat karşılığı",
  hakedis: "Hakedişe tabi",
  pesin: "Peşin nakit",
  diger: "Diğer",
  belirsiz: "Belirsiz",
};

export const KAT_SECENEKLERI = ["1", "2", "3", "4", "5", "6", "7", "8+"] as const;

export const DAIRE_SECENEKLERI = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
  "30",
  "40",
  "50+",
] as const;
