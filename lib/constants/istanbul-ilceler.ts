/** İstanbul'un 39 ilçesi — alfabetik, tek kaynak. Ürün yalnızca İstanbul. */
export const ISTANBUL_ILCELER = [
  "Adalar",
  "Arnavutköy",
  "Ataşehir",
  "Avcılar",
  "Bağcılar",
  "Bahçelievler",
  "Bakırköy",
  "Başakşehir",
  "Bayrampaşa",
  "Beşiktaş",
  "Beykoz",
  "Beylikdüzü",
  "Beyoğlu",
  "Büyükçekmece",
  "Çatalca",
  "Çekmeköy",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan",
  "Fatih",
  "Gaziosmanpaşa",
  "Güngören",
  "Kadıköy",
  "Kağıthane",
  "Kartal",
  "Küçükçekmece",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sarıyer",
  "Silivri",
  "Sultanbeyli",
  "Sultangazi",
  "Şile",
  "Şişli",
  "Tuzla",
  "Ümraniye",
  "Üsküdar",
  "Zeytinburnu",
] as const;

export type IstanbulIlce = (typeof ISTANBUL_ILCELER)[number];

export function isValidIstanbulIlce(value: string): value is IstanbulIlce {
  return (ISTANBUL_ILCELER as readonly string[]).includes(value);
}

/** SEO path: bayrampasa-kentsel-donusum */
export function ilceToSeoSlug(ilce: string): string {
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  const base = ilce
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-kentsel-donusum`;
}

export function ilceFromSeoSlug(slug: string): IstanbulIlce | null {
  for (const ilce of ISTANBUL_ILCELER) {
    if (ilceToSeoSlug(ilce) === slug) return ilce;
  }
  return null;
}

export function allSeoDistrictSlugs(): string[] {
  return ISTANBUL_ILCELER.map(ilceToSeoSlug);
}
