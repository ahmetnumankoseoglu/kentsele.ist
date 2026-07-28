"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type AdminListing = {
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
  manage_token: string;
};

const STATUS_ACTIONS: { status: ListingStatus; label: string }[] = [
  { status: "yayinda", label: "Yayınla" },
  { status: "teklif_saglaniyor", label: "Teklif sağlanıyor" },
  { status: "anlasildi", label: "Anlaşıldı" },
  { status: "kaldirildi", label: "Kaldır" },
];

export function AdminListingActions({ listing: initial }: { listing: AdminListing }) {
  const router = useRouter();
  const [listing, setListing] = useState(initial);
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
        kat_sayisi: form.kat_sayisi,
        daire_sayisi: form.daire_sayisi,
        odeme_tercihi: form.odeme_tercihi,
        aciklama: form.aciklama,
        iletisim_adi: form.iletisim_adi,
        telefon: form.telefon,
        email: form.email || null,
      });
      setListing((prev) => ({
        ...prev,
        ilce: updated.ilce,
        mahalle: updated.mahalle,
        kat_sayisi: updated.kat_sayisi,
        daire_sayisi: updated.daire_sayisi,
        odeme_tercihi: updated.odeme_tercihi as OdemeTercihi,
        aciklama: updated.aciklama,
        iletisim_adi: updated.iletisim_adi,
        telefon: updated.telefon,
        email: updated.email,
        updated_at: updated.updated_at,
      }));
      setForm({
        ilce: updated.ilce,
        mahalle: updated.mahalle ?? "",
        kat_sayisi: updated.kat_sayisi,
        daire_sayisi: updated.daire_sayisi,
        odeme_tercihi: updated.odeme_tercihi as OdemeTercihi,
        aciklama: updated.aciklama,
        iletisim_adi: updated.iletisim_adi,
        telefon: updated.telefon,
        email: updated.email ?? "",
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
          <label className={labelClass} htmlFor="admin-mahalle">
            Mahalle
          </label>
          <input
            id="admin-mahalle"
            className={inputClass}
            value={form.mahalle}
            onChange={(e) => setForm((f) => ({ ...f, mahalle: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="admin-kat">
              Kat
            </label>
            <select
              id="admin-kat"
              className={inputClass}
              value={form.kat_sayisi}
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
            <label className={labelClass} htmlFor="admin-daire">
              Daire
            </label>
            <select
              id="admin-daire"
              className={inputClass}
              value={form.daire_sayisi}
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
          className="h-12 w-full rounded-xl bg-[#0B6E4F] text-sm font-medium text-white disabled:opacity-60"
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
