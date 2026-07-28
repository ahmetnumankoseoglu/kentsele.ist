"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toTelHref, toWhatsAppUrl } from "@/lib/phone";

/** İkisi de aynı stroke stili — dolu/boş karışımı yok */
function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 10.5c.3 1.4 1.6 2.7 3 3M14 9.5c.7.3 1.4.9 1.8 1.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const actionBtnClass =
  "btn-primary !flex w-full items-center justify-center gap-2 !px-3 !py-3 text-sm";

export function ContactActions({
  slug,
  anlasildi,
  canViewContact,
}: {
  slug: string;
  anlasildi: boolean;
  canViewContact: boolean;
}) {
  const [telefon, setTelefon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (anlasildi || !canViewContact) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ilanlar/contact?slug=${encodeURIComponent(slug)}`
        );
        const data = await res.json();
        if (!cancelled) {
          if (res.ok) setTelefon(data.telefon);
          else setError(data.message || "Erişim yok");
        }
      } catch {
        if (!cancelled) setError("Yüklenemedi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, anlasildi, canViewContact]);

  if (anlasildi) {
    return (
      <p className="rounded-[3px] bg-[#f8f8f8] px-4 py-3 text-sm text-[#6b7280]">
        Bu ilan için anlaşma sağlandı. İletişim bilgisi kapalı.
      </p>
    );
  }

  if (!canViewContact) {
    return (
      <div className="rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-4">
        <p className="text-sm font-bold text-[#111321]">İletişim gizli</p>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
          Malik telefonu ve ada / parsel yalnızca{" "}
          <strong>onaylı müteahhit</strong> hesaplarına açıktır. Mahalle herkese
          görünür.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href="/kayit?next=/muteahhit"
            className="btn-primary w-full !py-2.5 !text-sm"
          >
            Müteahhit ol
          </Link>
          <Link
            href="/giris?next=/muteahhit"
            className="btn-secondary w-full !py-2.5 !text-sm"
          >
            Giriş yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-[#6b7280]">İletişim yükleniyor…</p>;
  }

  if (error || !telefon) {
    return (
      <p className="rounded-[3px] bg-[#fef2f2] px-4 py-3 text-sm text-[#be3317]">
        {error || "Numara alınamadı. Onay durumunuzu kontrol edin."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <a href={toTelHref(telefon)} className={actionBtnClass}>
        <PhoneIcon />
        <span>Ara</span>
      </a>
      <a
        href={toWhatsAppUrl(telefon)}
        target="_blank"
        rel="noopener noreferrer"
        className={actionBtnClass}
      >
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
