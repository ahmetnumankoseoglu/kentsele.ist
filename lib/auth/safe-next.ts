/**
 * Prevent open redirects: only same-origin relative paths.
 * Blocks //evil.com, https://..., javascript:, etc.
 */
export function safeInternalPath(
  next: string | null | undefined,
  fallback = "/hesabim"
): string {
  if (!next || typeof next !== "string") return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  if (trimmed.includes("\\")) return fallback;
  // Reject control characters / obvious injection
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return fallback;
  // Path must stay relative; allow Unicode query (ilçe names etc.)
  if (trimmed.includes("@")) return fallback;
  return trimmed;
}
