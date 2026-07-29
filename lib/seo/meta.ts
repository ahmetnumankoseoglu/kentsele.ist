/**
 * Meta description helpers — SERP kesilmesini ve piksel uyarılarını azaltır.
 * Önerilen: ~120–160 karakter (TR’de yaklaşık 900–920px).
 */
export function clampMetaDescription(
  text: string,
  maxLen = 155
): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  const cut = cleaned.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}
