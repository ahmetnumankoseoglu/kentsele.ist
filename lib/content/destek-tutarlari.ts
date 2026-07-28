/**
 * Kentsel dönüşüm destek tutarları (bilgilendirme).
 * Konut: 875.000 ₺ hibe + 875.000 ₺ kredi = 1.750.000 ₺
 * Ticari: 437.500 ₺ hibe + 437.500 ₺ kredi = 875.000 ₺
 */
export const DESTEK_TUTARLARI = {
  konut: {
    label: "Konut",
    hibe: 875_000,
    kredi: 875_000,
    get toplam() {
      return this.hibe + this.kredi;
    },
  },
  ticari: {
    label: "Ticari",
    hibe: 437_500,
    kredi: 437_500,
    get toplam() {
      return this.hibe + this.kredi;
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
