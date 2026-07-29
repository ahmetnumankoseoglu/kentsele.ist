/** Kat / daire / dükkan özeti — kart, başlık, şema */
export function formatListingUnits(l: {
  kat_sayisi: string;
  daire_sayisi: string;
  dukkan_sayisi?: string | null;
}): string {
  const parts = [`${l.kat_sayisi} kat`, `${l.daire_sayisi} daire`];
  const dukkanRaw = (l.dukkan_sayisi ?? "0").trim();
  const dukkanN = /^\d+$/.test(dukkanRaw) ? Number(dukkanRaw) : 0;
  if (dukkanN > 0) parts.push(`${dukkanRaw} dükkan`);
  return parts.join(" · ");
}
