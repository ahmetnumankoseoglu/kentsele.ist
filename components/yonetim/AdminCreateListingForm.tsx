"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import { getMahallelerForIlce } from "@/lib/constants/istanbul-mahalleler";
import {
  LISTING_BELGELER,
  LISTING_STATUSES,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  STATUS_LABELS,
  type ListingBelgeKey,
  type ListingStatus,
  type OdemeTercihi,
} from "@/lib/constants/listing";
import { formatPhoneInput } from "@/lib/phone";
import { sanitizeDigitInput } from "@/lib/utils/numeric-input";

export function AdminCreateListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    ilce: "Kadıköy",
    mahalle: "",
    ada: "",
    parsel: "",
    kat_sayisi: "5",
    daire_sayisi: "8",
    odeme_tercihi: "kat_karsiligi" as OdemeTercihi,
    aciklama: "",
    iletisim_adi: "",
    telefon: "",
    email: "",
    status: "incelemede" as ListingStatus,
    belge_aplikasyon: false,
    belge_imar_durum: false,
    belge_istikamet_roleve: false,
    belge_kot_kesit: false,
  });

  const mahalleler = useMemo(
    () => getMahallelerForIlce(form.ilce),
    [form.ilce]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/yonetim/ilanlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          belge_aplikasyon: form.belge_aplikasyon,
          belge_imar_durum: form.belge_imar_durum,
          belge_istikamet_roleve: form.belge_istikamet_roleve,
          belge_kot_kesit: form.belge_kot_kesit,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "validation"
            ? "Formu kontrol edin (zorunlu alanlar, e-posta, telefon)."
            : data.error === "unauthorized"
              ? "Oturum süresi dolmuş."
              : "İlan oluşturulamadı."
        );
        setLoading(false);
        return;
      }
      router.push(`/yonetim/ilanlar/${data.listing.id}`);
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="c-ilce">
            İlçe
          </label>
          <select
            id="c-ilce"
            className={inputClass}
            value={form.ilce}
            onChange={(e) =>
              setForm((f) => ({ ...f, ilce: e.target.value, mahalle: "" }))
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
          <label className={labelClass} htmlFor="c-mahalle">
            Mahalle
          </label>
          <select
            id="c-mahalle"
            className={inputClass}
            value={form.mahalle}
            onChange={(e) => setForm((f) => ({ ...f, mahalle: e.target.value }))}
            required
          >
            <option value="">Seçin</option>
            {mahalleler.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="c-ada">
            Ada
          </label>
          <input
            id="c-ada"
            className={inputClass}
            inputMode="numeric"
            required
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
          <label className={labelClass} htmlFor="c-parsel">
            Parsel
          </label>
          <input
            id="c-parsel"
            className={inputClass}
            inputMode="numeric"
            required
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
          <label className={labelClass} htmlFor="c-kat">
            Kat
          </label>
          <input
            id="c-kat"
            className={inputClass}
            inputMode="numeric"
            required
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
          <label className={labelClass} htmlFor="c-daire">
            Daire
          </label>
          <input
            id="c-daire"
            className={inputClass}
            inputMode="numeric"
            required
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
        <label className={labelClass} htmlFor="c-odeme">
          Ödeme
        </label>
        <select
          id="c-odeme"
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
        <label className={labelClass} htmlFor="c-status">
          Durum
        </label>
        <select
          id="c-status"
          className={inputClass}
          value={form.status}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              status: e.target.value as ListingStatus,
            }))
          }
        >
          {LISTING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="c-aciklama">
          Açıklama
        </label>
        <textarea
          id="c-aciklama"
          className={`${inputClass} min-h-28 resize-y`}
          required
          minLength={20}
          value={form.aciklama}
          onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
        />
      </div>

      <div>
        <p className={labelClass}>Belgeler</p>
        <ul className="space-y-2">
          {LISTING_BELGELER.map((b) => (
            <li key={b.key}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#2cb34f]"
                  checked={form[b.key as ListingBelgeKey] as boolean}
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
        <label className={labelClass} htmlFor="c-ad">
          İletişim adı
        </label>
        <input
          id="c-ad"
          className={inputClass}
          required
          value={form.iletisim_adi}
          onChange={(e) =>
            setForm((f) => ({ ...f, iletisim_adi: e.target.value }))
          }
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="c-tel">
          Telefon
        </label>
        <input
          id="c-tel"
          className={inputClass}
          required
          inputMode="tel"
          value={form.telefon}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              telefon: formatPhoneInput(e.target.value),
            }))
          }
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="c-email">
          E-posta
        </label>
        <input
          id="c-email"
          type="email"
          className={inputClass}
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>

      {error ? (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-[#2cb34f] text-sm font-medium text-white hover:bg-[#1ca03e] disabled:opacity-60"
      >
        {loading ? "Kaydediliyor…" : "İlanı oluştur"}
      </button>
    </form>
  );
}
