import { formatPhoneDisplay, toTelHref, toWhatsAppUrl } from "@/lib/phone";

export function ContactActions({
  telefon,
  anlasildi,
}: {
  telefon: string | null;
  anlasildi: boolean;
}) {
  if (anlasildi || !telefon) {
    return (
      <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        Bu ilan için anlaşma sağlandı. İletişim bilgisi kapalı.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={toTelHref(telefon)}
        className="flex h-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white"
      >
        Ara · {formatPhoneDisplay(telefon)}
      </a>
      <a
        href={toWhatsAppUrl(telefon)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center rounded-2xl bg-[#25D366] text-sm font-semibold text-white"
      >
        WhatsApp
      </a>
    </div>
  );
}
