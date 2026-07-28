"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import { getMahallelerForIlce } from "@/lib/constants/istanbul-mahalleler";
import {
  LISTING_BELGELER,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  STATUS_LABELS,
  type ListingBelgeKey,
  type ListingStatus,
  type OdemeTercihi,
} from "@/lib/constants/listing";
import type { Listing } from "@/types/listing";
import { sanitizeDigitInput } from "@/lib/utils/numeric-input";

type AdminListing = {
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
  manage_token: string;
  belge_aplikasyon: boolean;
  belge_imar_durum: boolean;
  belge_istikamet_roleve: boolean;
  belge_kot_kesit: boolean;
};

const STATUS_ACTIONS: { status: ListingStatus; label: string }[] = [
  { status: "yayinda", label: "Teklife açık" },
  { status: "anlasildi", label: "Anlaşma sağlandı" },
  { status: "incelemede", label: "İncelemeye al" },
  { status: "kaldirildi", label: "Kaldır" },
];

export function AdminListingActions({ listing: initial }: { listing: AdminListing }) {
  const router = useRouter();
  const [listing, setListing] = useState(initial);
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
  const [statusLoading, setStatusLoading] = useState<ListingStatus | null>(
    null
  );
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/yonetim/ilanlar/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(
        data.error === "phone"
          ? "Geçerli bir cep telefonu girin."
          : data.error === "unauthorized"
            ? "Oturum süresi dolmuş. Tekrar giriş yapın."
            : "İşlem başarısız."
      ) as Error & { code?: string };
      err.code = data.error;
      throw err;
    }
    return data.listing as Listing;
  }

  async function setStatus(status: ListingStatus) {
    setStatusLoading(status);
    setError(null);
    setMessage(null);
    try {
      const updated = await patch({ status });
      setListing((prev) => ({
        ...prev,
        status: updated.status as ListingStatus,
        agreement_requested_at: updated.agreement_requested_at,
        published_at: updated.published_at,
        updated_at: updated.updated_at,
      }));
      setMessage(`Durum güncellendi: ${STATUS_LABELS[status]}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "İşlem başarısız.");
    } finally {
      setStatusLoading(null);
    }
  }

  async function saveFields() {
    setSaveLoading(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await patch({
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
      });
      setListing((prev) => ({
        ...prev,
        ilce: updated.ilce,
        mahalle: updated.mahalle,
        ada: updated.ada ?? null,
        parsel: updated.parsel ?? null,
        kat_sayisi: updated.kat_sayisi,
        daire_sayisi: updated.daire_sayisi,
        odeme_tercihi: updated.odeme_tercihi as OdemeTercihi,
        aciklama: updated.aciklama,
        iletisim_adi: updated.iletisim_adi,
        telefon: updated.telefon,
        email: updated.email,
        belge_aplikasyon: updated.belge_aplikasyon ?? false,
        belge_imar_durum: updated.belge_imar_durum ?? false,
        belge_istikamet_roleve: updated.belge_istikamet_roleve ?? false,
        belge_kot_kesit: updated.belge_kot_kesit ?? false,
        updated_at: updated.updated_at,
      }));
      setForm({
        ilce: updated.ilce,
        mahalle: updated.mahalle ?? "",
        ada: updated.ada ?? "",
        parsel: updated.parsel ?? "",
        kat_sayisi: updated.kat_sayisi,
        daire_sayisi: updated.daire_sayisi,
        odeme_tercihi: updated.odeme_tercihi as OdemeTercihi,
        aciklama: updated.aciklama,
        iletisim_adi: updated.iletisim_adi,
        telefon: updated.telefon,
        email: updated.email ?? "",
        belge_aplikasyon: updated.belge_aplikasyon ?? false,
        belge_imar_durum: updated.belge_imar_durum ?? false,
        belge_istikamet_roleve: updated.belge_istikamet_roleve ?? false,
        belge_kot_kesit: updated.belge_kot_kesit ?? false,
      });
      setMessage("İlan alanları kaydedildi.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    } finally {
      setSaveLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Durum
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900">
          {STATUS_LABELS[listing.status]}
        </p>
        {listing.agreement_requested_at ? (
          <p className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-900">
            Anlaşma talebi var
            {listing.status !== "anlasildi"
              ? " — onaylamak için Anlaşıldı seçin"
              : ""}
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {STATUS_ACTIONS.map(({ status, label }) => {
            const active = listing.status === status;
            const isDanger = status === "kaldirildi";
            return (
              <button
                key={status}
                type="button"
                disabled={statusLoading !== null || active}
                onClick={() => setStatus(status)}
                className={`h-11 rounded-xl text-sm font-medium disabled:opacity-50 ${
                  active
                    ? "bg-slate-200 text-slate-600"
                    : isDanger
                      ? "border border-rose-200 bg-rose-50 text-rose-800"
                      : "border border-black/10 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {statusLoading === status ? "…" : label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">İlan bilgileri</h2>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Slug</dt>
            <dd className="truncate font-mono text-xs text-slate-800">
              {listing.slug}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Yönetim linki</dt>
            <dd className="truncate font-mono text-xs text-slate-800">
              /yonet/{listing.manage_token}
            </dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4 rounded-xl border border-black/5 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">Düzenle</h2>

        <div>
          <label className={labelClass} htmlFor="admin-ilce">
            İlçe
          </label>
          <select
            id="admin-ilce"
            className={inputClass}
            value={form.ilce}
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
          <label className={labelClass} htmlFor="admin-mahalle">
            Mahalle
          </label>
          <select
            id="admin-mahalle"
            className={inputClass}
            value={form.mahalle}
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
            <label className={labelClass} htmlFor="admin-ada">
              Ada
            </label>
            <input
              id="admin-ada"
              className={inputClass}
              inputMode="numeric"
              value={form.ada}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  ada: sanitizeDigitInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="admin-parsel">
              Parsel
            </label>
            <input
              id="admin-parsel"
              className={inputClass}
              inputMode="numeric"
              value={form.parsel}
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
            <label className={labelClass} htmlFor="admin-kat">
              Kat
            </label>
            <input
              id="admin-kat"
              className={inputClass}
              inputMode="numeric"
              value={form.kat_sayisi}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  kat_sayisi: sanitizeDigitInput(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="admin-daire">
              Daire
            </label>
            <input
              id="admin-daire"
              className={inputClass}
              inputMode="numeric"
              value={form.daire_sayisi}
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
          <label className={labelClass} htmlFor="admin-odeme">
            Ödeme tercihi
          </label>
          <select
            id="admin-odeme"
            className={inputClass}
            value={form.odeme_tercihi}
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
          <label className={labelClass} htmlFor="admin-aciklama">
            Açıklama
          </label>
          <textarea
            id="admin-aciklama"
            className={`${inputClass} min-h-28 resize-y`}
            value={form.aciklama}
            onChange={(e) =>
              setForm((f) => ({ ...f, aciklama: e.target.value }))
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="admin-ad">
            İletişim adı
          </label>
          <input
            id="admin-ad"
            className={inputClass}
            value={form.iletisim_adi}
            onChange={(e) =>
              setForm((f) => ({ ...f, iletisim_adi: e.target.value }))
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="admin-tel">
            Telefon
          </label>
          <input
            id="admin-tel"
            className={inputClass}
            value={form.telefon}
            inputMode="tel"
            onChange={(e) => setForm((f) => ({ ...f, telefon: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="admin-email">
            E-posta
          </label>
          <input
            id="admin-email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        <button
          type="button"
          disabled={saveLoading}
          onClick={saveFields}
          className="h-12 w-full rounded-xl bg-[#2cb34f] hover:bg-[#1ca03e] text-sm font-medium text-white disabled:opacity-60"
        >
          {saveLoading ? "Kaydediliyor…" : "Alanları kaydet"}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-800" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
