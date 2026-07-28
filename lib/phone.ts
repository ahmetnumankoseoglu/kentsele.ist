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
