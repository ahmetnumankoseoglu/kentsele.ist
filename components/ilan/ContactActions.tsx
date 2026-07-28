"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPhoneDisplay, toTelHref, toWhatsAppUrl } from "@/lib/phone";

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
        <p className="text-sm font-bold text-[#111321]">
          İletişim gizli
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
          Malik telefon numarası yalnızca <strong>onaylı müteahhit</strong>{" "}
          hesaplarına açıktır. Belge yükleyip doğrulama sonrası arayabilirsiniz.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/kayit?role=muteahhit" className="btn-primary !py-2 !text-sm">
            Müteahhit ol
          </Link>
          <Link
            href="/giris?next=/muteahhit"
            className="btn-secondary !py-2 !text-sm"
          >
            Giriş yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-[#6b7280]">İletişim yükleniyor…</p>
    );
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
