export function normalizeTrPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("90") && national.length === 12) {
    national = national.slice(2);
  }
  if (national.startsWith("0") && national.length === 11) {
    national = national.slice(1);
  }
  if (national.length !== 10 || !national.startsWith("5")) {
    return null;
  }
  return `+90${national}`;
}

/**
 * Yazarken TR cep formatı: 05xx xxx xx xx
 * En fazla 11 hane (0 + 10).
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length >= 12) {
    digits = digits.slice(2);
  }
  if (digits.length > 0 && !digits.startsWith("0") && digits.startsWith("5")) {
    digits = `0${digits}`;
  }
  digits = digits.slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

export function toWhatsAppUrl(e164: string): string {
  return `https://wa.me/${e164.replace(/\D/g, "")}`;
}

export function formatPhoneDisplay(e164: string): string {
  const d = e164.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("90")) {
    const n = d.slice(2);
    return `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}`;
  }
  return e164;
}

export function toTelHref(e164: string): string {
  return `tel:${e164}`;
}
