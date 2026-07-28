/**
 * "Yarısı Bizden" kampanyası destek tutarları (İstanbul)
 * Kaynak: Cumhurbaşkanı açıklaması / Kentsel Dönüşüm Başkanlığı koordinasyonu
 * — Hibe 700.000 → 875.000 ₺
 * — Kredi 700.000 → 875.000 ₺
 * — Taşınma 100.000 → 125.000 ₺
 * — 1 konut toplam: 1.875.000 ₺
 * — İş yeri hibe/kredi 350.000 → 437.500 ₺; taşınma 125.000 ₺; toplam 1.000.000 ₺
 * — Ek konut: 1.750.000 ₺ kredi imkânı
 * — Ek dükkân: 875.000 ₺ kredi imkânı
 *
 * Not: Bilgilendirme amaçlıdır; resmî başvuru şartları esas alınır.
 */
export const DESTEK_TUTARLARI = {
  kampanya: "Yarısı Bizden",
  sehir: "İstanbul",
  konut: {
    label: "Konut",
    /** İlk / birim konut hibe */
    hibe: 875_000,
    /** İlk / birim konut kredi */
    kredi: 875_000,
    /** Taşınma / tahliye desteği (bir kerelik) */
    tasinma: 125_000,
    /** İlk konut paket toplamı (hibe + kredi + taşınma) */
    get toplamIlk() {
      return this.hibe + this.kredi + this.tasinma;
    },
    /** Hibe + kredi (taşınma hariç) — ek konut paketinde kullanılan baz */
    get hibeKrediToplam() {
      return this.hibe + this.kredi;
    },
    /**
     * Hak sahibinin diğer her bir konutu için sunulan kredi imkânı
     * (açıklama: 1.750.000 ₺ kredi)
     */
    ekKonutKredi: 1_750_000,
  },
  ticari: {
    label: "Ticari / iş yeri",
    hibe: 437_500,
    kredi: 437_500,
    tasinma: 125_000,
    get toplamIlk() {
      return this.hibe + this.kredi + this.tasinma;
    },
    get hibeKrediToplam() {
      return this.hibe + this.kredi;
    },
    /** Diğer her bir dükkân için kredi imkânı */
    ekDukkanKredi: 875_000,
  },
} as const;

export function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Karışık bina: konut + ticari birim sayısına göre paket.
 * - İlk konut: hibe+kredi+taşınma (1.875.000)
 * - Ek konutlar: her biri için 1.750.000 kredi imkânı
 * - İlk ticari: hibe+kredi+taşınma (1.000.000)
 * - Ek dükkânlar: her biri için 875.000 kredi imkânı
 */
export function hesaplaYarisiBizden(konutAdet: number, ticariAdet: number) {
  const k = Math.max(0, Math.floor(konutAdet));
  const t = Math.max(0, Math.floor(ticariAdet));
  const { konut, ticari } = DESTEK_TUTARLARI;

  let hibe = 0;
  let kredi = 0;
  let tasinma = 0;
  let ekKredi = 0;

  if (k >= 1) {
    hibe += konut.hibe;
    kredi += konut.kredi;
    tasinma += konut.tasinma;
    if (k > 1) ekKredi += (k - 1) * konut.ekKonutKredi;
  }
  if (t >= 1) {
    hibe += ticari.hibe;
    kredi += ticari.kredi;
    tasinma += ticari.tasinma;
    if (t > 1) ekKredi += (t - 1) * ticari.ekDukkanKredi;
  }

  return {
    konutAdet: k,
    ticariAdet: t,
    hibe,
    kredi,
    tasinma,
    ekKredi,
    /** İlk birim paketleri (hibe+kredi+taşınma) + ek birim kredileri */
    genelToplam: hibe + kredi + tasinma + ekKredi,
    ilkPaketToplam: hibe + kredi + tasinma,
  };
}
