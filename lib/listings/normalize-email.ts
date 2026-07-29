/** İlan / hesap e-posta eşleşmesi için normalize */
export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const cleaned = email
    .normalize("NFKC")
    // zero-width / BOM
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase();
  if (!cleaned || !cleaned.includes("@")) return null;
  return cleaned;
}
