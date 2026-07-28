import type { OdemeTercihi } from "@/lib/constants/listing";

const TR_MAP: Record<string, string> = {
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

export function slugifyTr(input: string): string {
  const mapped = input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("");
  return mapped
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function buildListingSlug(parts: {
  ilce: string;
  katSayisi: string;
  daireSayisi: string;
  odemeTercihi: OdemeTercihi | string;
  shortId: string;
}): string {
  const ilce = slugifyTr(parts.ilce);
  const kat = slugifyTr(parts.katSayisi);
  const daire = slugifyTr(parts.daireSayisi);
  const odeme = slugifyTr(String(parts.odemeTercihi).replace(/_/g, "-"));
  const id = parts.shortId.toLowerCase();
  return `${ilce}-${kat}-kat-${daire}-daire-${odeme}-${id}`;
}

export function randomShortId(length = 4): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}
