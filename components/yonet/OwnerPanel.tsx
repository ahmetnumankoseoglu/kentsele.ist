"use client";

import { useState } from "react";
import Link from "next/link";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import { getMahallelerForIlce } from "@/lib/constants/istanbul-mahalleler";
import {
  LISTING_BELGELER,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  OWNER_STATUS_LABELS,
  PUBLIC_STATUSES,
  type ListingBelgeKey,
  type ListingStatus,
  type OdemeTercihi,
} from "@/lib/constants/listing";
import type { Listing } from "@/types/listing";
import { sanitizeDigitInput } from "@/lib/utils/numeric-input";
import { formatPhoneInput } from "@/lib/phone";

type OwnerListing = {
  id: string;
  slug: string;
  ilce: string;
  mahalle: string | null;
  ada: string | null;
  parsel: string | null;
  kat_sayisi: string;
  daire_sayisi: string;
  odeme_tercihi: OdemeTercihi;
  aciklama: string;
  iletisim_adi: string;
  telefon: string;
  email: string | null;
  status: ListingStatus;
  agreement_requested_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  belge_aplikasyon: boolean;
  belge_imar_durum: boolean;
  belge_istikamet_roleve: boolean;
  belge_kot_kesit: boolean;
};

export function OwnerPanel({
  listing: initial,
  token,
}: {
  listing: OwnerListing;
  token: string;
}) {
  const readOnly = initial.status === "kaldirildi";
  const [form, setForm] = useState({
    ilce: initial.ilce,
    mahalle: initial.mahalle ?? "",
    ada: initial.ada ?? "",
    parsel: initial.parsel ?? "",
    kat_sayisi: initial.kat_sayisi,
    daire_sayisi: initial.daire_sayisi,
    odeme_tercihi: initial.odeme_tercihi,
    aciklama: initial.aciklama,
    iletisim_adi: initial.iletisim_adi,
    telefon: initial.telefon,
    email: initial.email ?? "",
    belge_aplikasyon: initial.belge_aplikasyon ?? false,
    belge_imar_durum: initial.belge_imar_durum ?? false,
    belge_istikamet_roleve: initial.belge_istikamet_roleve ?? false,
    belge_kot_kesit: initial.belge_kot_kesit ?? false,
  });
  const mahalleler = getMahallelerForIlce(form.ilce);
  const [status, setStatus] = useState(initial.status);
  const [agreementRequestedAt, setAgreementRequestedAt] = useState(
    initial.agreement_requested_at
  );
  const [loading, setLoading] = useState(false);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/yonet/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ilce: form.ilce,
          mahalle: form.mahalle || null,
          ada: form.ada || null,
          parsel: form.parsel || null,
          kat_sayisi: form.kat_sayisi,
          daire_sayisi: form.daire_sayisi,
          odeme_tercihi: form.odeme_tercihi,
          aciklama: form.aciklama,
          iletisim_adi: form.iletisim_adi,
          telefon: form.telefon,
          email: form.email || null,
          belge_aplikasyon: form.belge_aplikasyon,
          belge_imar_durum: form.belge_imar_durum,
          belge_istikamet_roleve: form.belge_istikamet_roleve,
          belge_kot_kesit: form.belge_kot_kesit,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "phone"
            ? "Geçerli bir cep telefonu girin."
            : "Kaydedilemedi. Formu kontrol edip tekrar dene."
        );
        return;
      }
      const listing = data.listing as Listing;
      setForm({
        ilce: listing.ilce,
        mahalle: listing.mahalle ?? "",
        ada: listing.ada ?? "",
        parsel: listing.parsel ?? "",
        kat_sayisi: listing.kat_sayisi,
        daire_sayisi: listing.daire_sayisi,
        odeme_tercihi: listing.odeme_tercihi,
        aciklama: listing.aciklama,
        iletisim_adi: listing.iletisim_adi,
        telefon: listing.telefon,
        email: listing.email ?? "",
        belge_aplikasyon: listing.belge_aplikasyon ?? false,
        belge_imar_durum: listing.belge_imar_durum ?? false,
        belge_istikamet_roleve: listing.belge_istikamet_roleve ?? false,
        belge_kot_kesit: listing.belge_kot_kesit ?? false,
      });
      setStatus(listing.status as ListingStatus);
      setMessage(
        "Değişiklikler kaydedildi. İlan yeniden incelemeye alındı; admin onayından sonra yayınlanır."
      );
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function requestAgreement() {
    setAgreementLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/yonet/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_agreement: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Bildirim gönderilemedi. Tekrar dene.");
        return;
      }
      const listing = data.listing as Listing;
      setAgreementRequestedAt(listing.agreement_requested_at);
      setMessage("Anlaşma bildirimi iletildi.");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setAgreementLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  const isPublic = PUBLIC_STATUSES.includes(status);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">İlanımı yönet</h1>
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {OWNER_STATUS_LABELS[status]}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {isPublic ? (
          <Link
            href={`/ilan/${initial.slug}`}
            className="text-sm font-bold text-[#168f43]"
          >
            ← İlanı gör
          </Link>
        ) : null}
        <Link href="/hesabim" className="text-sm font-medium text-[#6b7280]">
          Hesabıma dön
        </Link>
      </div>

      <p className="mb-4 rounded-xl border border-[#e3e4e6] bg-[#f8f8f8] px-3 py-2 text-xs leading-relaxed text-[#6b7280]">
        <strong className="text-[#111321]">Durum notu:</strong> Her kayıt
        sonrası ilan yeniden <strong>incelemeye</strong> düşer; yayın için admin
        onayı gerekir. Anlaşma bildirimi de admin paneline iletilir.
      </p>

      {readOnly ? (
        <p className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          Bu ilan kaldırıldı. Düzenleme yapılamaz.
        </p>
      ) : null}

      {agreementRequestedAt ? (
        <p className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Anlaşma bildirimi alındı; yönetici bilgilendirildi.
        </p>
      ) : null}

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="ilce">
            İlçe
          </label>
          <select
            id="ilce"
            className={inputClass}
            value={form.ilce}
            disabled={readOnly}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                ilce: e.target.value,
                mahalle: "",
              }))
            }
          >
            {ISTANBUL_ILCELER.map((ilce) => (
              <option key={ilce} value={ilce}>
                {ilce}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="mahalle">
            Mahalle
          </label>
          <select
            id="mahalle"
            className={inputClass}
            value={form.mahalle}
            disabled={readOnly}
            onChange={(e) => setForm((f) => ({ ...f, mahalle: e.target.value }))}
          >
            <option value="">Seçin</option>
            {mahalleler.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="ada">
              Ada
            </label>
            <input
              id="ada"
              className={inputClass}
              value={form.ada}
              disabled={readOnly}
              inputMode="numeric"
              placeholder="Yalnızca rakam"
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  ada: sanitizeDigitInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="parsel">
              Parsel
            </label>
            <input
              id="parsel"
              className={inputClass}
              value={form.parsel}
              disabled={readOnly}
              inputMode="numeric"
              placeholder="Yalnızca rakam"
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  parsel: sanitizeDigitInput(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="kat">
              Kat
            </label>
            <input
              id="kat"
              className={inputClass}
              inputMode="numeric"
              value={form.kat_sayisi}
              disabled={readOnly}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  kat_sayisi: sanitizeDigitInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="daire">
              Daire
            </label>
            <input
              id="daire"
              className={inputClass}
              inputMode="numeric"
              value={form.daire_sayisi}
              disabled={readOnly}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  daire_sayisi: sanitizeDigitInput(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="odeme">
            Ödeme tercihi
          </label>
          <select
            id="odeme"
            className={inputClass}
            value={form.odeme_tercihi}
            disabled={readOnly}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                odeme_tercihi: e.target.value as OdemeTercihi,
              }))
            }
          >
            {ODEME_TERCIHLERI.map((o) => (
              <option key={o} value={o}>
                {ODEME_LABELS[o]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className={labelClass}>Belgeler</p>
          <ul className="space-y-2">
            {LISTING_BELGELER.map((b) => (
              <li key={b.key}>
                <label className="flex items-center gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#2cb34f]"
                    disabled={readOnly}
                    checked={form[b.key as ListingBelgeKey]}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        [b.key]: !f[b.key as ListingBelgeKey],
                      }))
                    }
                  />
                  {b.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className={labelClass} htmlFor="aciklama">
            Açıklama
          </label>
          <textarea
            id="aciklama"
            className={`${inputClass} min-h-28 resize-y`}
            value={form.aciklama}
            disabled={readOnly}
            onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="iletisim_adi">
            İletişim adı
          </label>
          <input
            id="iletisim_adi"
            className={inputClass}
            value={form.iletisim_adi}
            disabled={readOnly}
            onChange={(e) =>
              setForm((f) => ({ ...f, iletisim_adi: e.target.value }))
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="telefon">
            Telefon
          </label>
          <input
            id="telefon"
            className={inputClass}
            value={form.telefon}
            disabled={readOnly}
            inputMode="tel"
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                telefon: formatPhoneInput(e.target.value),
              }))
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            disabled={readOnly}
            placeholder="Opsiyonel"
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 text-sm text-emerald-800" role="status">
          {message}
        </p>
      ) : null}

      {!readOnly ? (
        <div className="mt-6 space-y-2">
          <button
            type="button"
            disabled={loading}
            onClick={save}
            className="h-12 w-full rounded-xl bg-[#2cb34f] hover:bg-[#1ca03e] text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button
            type="button"
            disabled={agreementLoading}
            onClick={requestAgreement}
            className="h-12 w-full rounded-xl border border-black/10 bg-white text-sm font-medium text-slate-900 disabled:opacity-60"
          >
            {agreementLoading
              ? "Gönderiliyor…"
              : "Anlaşma sağlandı bildir"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
