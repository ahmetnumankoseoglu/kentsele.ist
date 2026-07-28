import type { IstanbulIlce } from "./istanbul-ilceler";
import { isValidIstanbulIlce } from "./istanbul-ilceler";
import raw from "./istanbul-mahalleler.json";

/** İstanbul 39 ilçe → mahalle listesi (kaynak: turkey-neighbourhoods / PTT güncel isimler) */
export const ISTANBUL_MAHALLELER: Record<string, readonly string[]> =
  raw as Record<string, readonly string[]>;

export function getMahallelerForIlce(ilce: string): readonly string[] {
  if (!ilce) return [];
  return ISTANBUL_MAHALLELER[ilce] ?? [];
}

export function isValidMahalleForIlce(ilce: string, mahalle: string): boolean {
  if (!isValidIstanbulIlce(ilce)) return false;
  const list = getMahallelerForIlce(ilce);
  return list.includes(mahalle.trim());
}

/** Tüm mahalle sayısı (bilgi) */
export function totalIstanbulMahalleCount(): number {
  return Object.values(ISTANBUL_MAHALLELER).reduce((s, a) => s + a.length, 0);
}

export type MahalleByIlce = {
  [K in IstanbulIlce]?: readonly string[];
};
