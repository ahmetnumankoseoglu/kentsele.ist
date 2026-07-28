"use client";

import { useState } from "react";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import {
  DAIRE_SECENEKLERI,
  KAT_SECENEKLERI,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  STATUS_LABELS,
  type ListingStatus,
  type OdemeTercihi,
} from "@/lib/constants/listing";
import type { Listing } from "@/types/listing";

type OwnerListing = {
  id: string;
  slug: string;
  ilce: string;
  mahalle: string | null;
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
    kat_sayisi: initial.kat_sayisi,
    daire_sayisi: initial.daire_sayisi,
    odeme_tercihi: initial.odeme_tercihi,
    aciklama: initial.aciklama,
    iletisim_adi: initial.iletisim_adi,
    telefon: initial.telefon,
    email: initial.email ?? "",
  });
  const [status] = useState(initial.status);
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
          kat_sayisi: form.kat_sayisi,
          daire_sayisi: form.daire_sayisi,
          odeme_tercihi: form.odeme_tercihi,
          aciklama: form.aciklama,
          iletisim_adi: form.iletisim_adi,
          telefon: form.telefon,
          email: form.email || null,
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
        kat_sayisi: listing.kat_sayisi,
        daire_sayisi: listing.daire_sayisi,
        odeme_tercihi: listing.odeme_tercihi,
        aciklama: listing.aciklama,
        iletisim_adi: listing.iletisim_adi,
        telefon: listing.telefon,
        email: listing.email ?? "",
      });
      setMessage("Değişiklikler kaydedildi.");
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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">İlanımı yönet</h1>
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {STATUS_LABELS[status]}
        </span>
      </div>

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
            onChange={(e) => setForm((f) => ({ ...f, ilce: e.target.value }))}
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
          <input
            id="mahalle"
            className={inputClass}
            value={form.mahalle}
            disabled={readOnly}
            placeholder="Opsiyonel"
            onChange={(e) => setForm((f) => ({ ...f, mahalle: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="kat">
              Kat
            </label>
            <select
              id="kat"
              className={inputClass}
              value={form.kat_sayisi}
              disabled={readOnly}
              onChange={(e) =>
                setForm((f) => ({ ...f, kat_sayisi: e.target.value }))
              }
            >
              {KAT_SECENEKLERI.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="daire">
              Daire
            </label>
            <select
              id="daire"
              className={inputClass}
              value={form.daire_sayisi}
              disabled={readOnly}
              onChange={(e) =>
                setForm((f) => ({ ...f, daire_sayisi: e.target.value }))
              }
            >
              {DAIRE_SECENEKLERI.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
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
            onChange={(e) => setForm((f) => ({ ...f, telefon: e.target.value }))}
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
            className="h-12 w-full rounded-xl bg-[#0B6E4F] text-sm font-medium text-white disabled:opacity-60"
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
