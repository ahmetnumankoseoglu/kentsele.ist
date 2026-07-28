/** Sadece rakam; baştaki sıfırları temizler ("" veya "0" veya "5" — "05" olmaz) */
export function sanitizeDigitInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";
  // parseInt "05" → 5 → "5"; "0" → 0 → "0"
  return String(parseInt(digits, 10));
}

export function parseDigitInput(raw: string, fallback = 0): number {
  if (raw.trim() === "") return fallback;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}
