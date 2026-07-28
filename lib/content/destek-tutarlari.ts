/**
 * "Yarısı Bizden" kampanyası — birim başına sabit tutarlar (İstanbul)
 *
 * Konut birim: 875.000 hibe + 875.000 kredi + 125.000 taşınma = 1.875.000 ₺
 * Ticari birim: 437.500 hibe + 437.500 kredi + 125.000 taşınma = 1.000.000 ₺
 *
 * Her birim için aynı paket uygulanır (ayrı “ilk birim / ek birim” yok).
 * Bilgilendirme amaçlıdır; resmî başvuru şartları esas alınır.
 */
export const DESTEK_TUTARLARI = {
  kampanya: "Yarısı Bizden",
  sehir: "İstanbul",
  konut: {
    label: "Konut",
    hibe: 875_000,
    kredi: 875_000,
    tasinma: 125_000,
    get toplamBirim() {
      return this.hibe + this.kredi + this.tasinma;
    },
  },
  ticari: {
    label: "Ticari / iş yeri",
    hibe: 437_500,
    kredi: 437_500,
    tasinma: 125_000,
    get toplamBirim() {
      return this.hibe + this.kredi + this.tasinma;
    },
  },
} as const;

export function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Her konut ve her ticari birim için tam paket (hibe + kredi + taşınma) */
export function hesaplaYarisiBizden(konutAdet: number, ticariAdet: number) {
  const k = Math.max(0, Math.floor(konutAdet));
  const t = Math.max(0, Math.floor(ticariAdet));
  const { konut, ticari } = DESTEK_TUTARLARI;

  const hibe = k * konut.hibe + t * ticari.hibe;
  const kredi = k * konut.kredi + t * ticari.kredi;
  const tasinma = k * konut.tasinma + t * ticari.tasinma;

  return {
    konutAdet: k,
    ticariAdet: t,
    hibe,
    kredi,
    tasinma,
    genelToplam: hibe + kredi + tasinma,
  };
}
