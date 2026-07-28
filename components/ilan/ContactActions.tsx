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
      <p className="rounded-[3px] bg-[#f8f8f8] px-4 py-3 text-sm text-[#6b7280]">
        Bu ilan için anlaşma sağlandı. İletişim bilgisi kapalı.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <a href={toTelHref(telefon)} className="btn-primary !px-2 text-sm">
        Ara
        <span className="ml-1 hidden font-medium sm:inline">
          · {formatPhoneDisplay(telefon)}
        </span>
      </a>
      <a
        href={toWhatsAppUrl(telefon)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-auto items-center justify-center rounded-[3px] bg-[#25D366] px-3 py-3 text-sm font-bold text-white hover:bg-[#1fb855]"
      >
        WhatsApp
      </a>
    </div>
  );
}
