"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { toTelHref, toWhatsAppUrl } from "@/lib/phone";

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
        <Phone className="h-[18px] w-[18px] shrink-0" strokeWidth={2.25} aria-hidden />
        <span>Ara</span>
      </a>
      <a
        href={toWhatsAppUrl(telefon)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-[3px] bg-[#25D366] px-3 py-3 text-sm font-bold text-white transition hover:bg-[#1ebe57]"
      >
        <FaWhatsapp className="h-5 w-5 shrink-0" aria-hidden />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
