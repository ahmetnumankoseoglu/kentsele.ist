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

/**
 * Durum etiketleri.
 * Listeye çıkmış ilan: “Teklife açık” (yeşil)
 * Anlaşma: “Anlaşma sağlandı” (gri)
 */
export const STATUS_LABELS: Record<ListingStatus, string> = {
  incelemede: "İncelemede",
  yayinda: "Teklife açık",
  teklif_saglaniyor: "Teklife açık",
  anlasildi: "Anlaşma sağlandı",
  kaldirildi: "Kaldırıldı",
};

/** İlan listesi / ilan detayı — public rozet */
export const PUBLIC_STATUS_LABELS: Partial<Record<ListingStatus, string>> = {
  yayinda: "Teklife açık",
  teklif_saglaniyor: "Teklife açık",
  anlasildi: "Anlaşma sağlandı",
};

/** Hesabım / malik paneli */
export const OWNER_STATUS_LABELS: Record<ListingStatus, string> = {
  incelemede: "İnceleniyor",
  yayinda: "Teklife açık",
  teklif_saglaniyor: "Teklife açık",
  anlasildi: "Anlaşma sağlandı",
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

/**
 * İlan formu hızlı seçimler (chip).
 * Değerler saf rakam — özel girişi de destekler (1–99 / 1–999).
 */
export const KAT_SECENEKLERI = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "10",
  "12",
] as const;

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
  "50",
] as const;

/** Dükkan hızlı seçim — 0 = dükkan yok */
export const DUKKAN_SECENEKLERI = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
] as const;

/** Malik formunda “elimde var” diye işaretlenen belgeler */
export const LISTING_BELGELER = [
  {
    key: "belge_aplikasyon",
    label: "Aplikasyon Krokisi",
  },
  {
    key: "belge_imar_durum",
    label: "İmar Durum Belgesi",
  },
  {
    key: "belge_istikamet_roleve",
    label: "İnşaat İstikamet Rölevesi",
  },
  {
    key: "belge_kot_kesit",
    label: "Kot-Kesit",
  },
] as const;

export type ListingBelgeKey = (typeof LISTING_BELGELER)[number]["key"];
