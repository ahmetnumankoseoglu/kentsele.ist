"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import {
  DAIRE_SECENEKLERI,
  KAT_SECENEKLERI,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  type OdemeTercihi,
} from "@/lib/constants/listing";

const STEPS = 6;

export function IlanVerWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    ilce: "",
    mahalle: "",
    kat_sayisi: "",
    daire_sayisi: "",
    odeme_tercihi: "" as OdemeTercihi | "",
    aciklama: "",
    iletisim_adi: "",
    telefon: "",
    email: "",
  });

  const progress = useMemo(() => ((step + 1) / STEPS) * 100, [step]);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ilanlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          mahalle: form.mahalle || null,
          email: form.email || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Formu kontrol edip tekrar dene.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem(
        "kentsele_manage",
        JSON.stringify({ managePath: data.managePath, manageUrl: data.manageUrl })
      );
      router.push("/ilan-ver/basarili");
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  function next() {
    if (step === 0 && !form.ilce) return setError("İlçe seçin");
    if (step === 1 && !form.kat_sayisi) return setError("Kat seçin");
    if (step === 2 && !form.daire_sayisi) return setError("Daire seçin");
    if (step === 3 && !form.odeme_tercihi) return setError("Ödeme tercihi seçin");
    if (step === 4 && form.aciklama.trim().length < 20)
      return setError("En az 20 karakter yazın");
    if (step === 5) return submit();
    setError(null);
    setStep((s) => s + 1);
  }

  return (
    <div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full bg-[#0B6E4F] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step === 0 && (
        <div>
          <h1 className="text-xl font-semibold">İlçe seçin</h1>
          <p className="mt-1 text-sm text-slate-600">Yalnızca İstanbul · 39 ilçe</p>
          <div className="mt-4 max-h-[50vh] space-y-1 overflow-y-auto">
            {ISTANBUL_ILCELER.map((ilce) => (
              <button
                key={ilce}
                type="button"
                onClick={() => setForm((f) => ({ ...f, ilce }))}
                className={`flex w-full rounded-xl px-3 py-3 text-left text-sm ${
                  form.ilce === ilce
                    ? "bg-[#0B6E4F] text-white"
                    : "border border-black/5 bg-white"
                }`}
              >
                {ilce}
              </button>
            ))}
          </div>
          <input
            className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
            placeholder="Mahalle (opsiyonel)"
            value={form.mahalle}
            onChange={(e) => setForm((f) => ({ ...f, mahalle: e.target.value }))}
          />
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-xl font-semibold">Kaç kat inşa edilecek?</h1>
          <p className="mt-1 text-sm text-slate-600">Zemin altı katlar dahil</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {KAT_SECENEKLERI.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setForm((f) => ({ ...f, kat_sayisi: k }))}
                className={`rounded-xl py-3 text-sm font-medium ${
                  form.kat_sayisi === k
                    ? "bg-[#0B6E4F] text-white"
                    : "border border-black/5 bg-white"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-semibold">Binada kaç daire olacak?</h1>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {DAIRE_SECENEKLERI.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm((f) => ({ ...f, daire_sayisi: d }))}
                className={`rounded-xl py-3 text-sm font-medium ${
                  form.daire_sayisi === d
                    ? "bg-[#0B6E4F] text-white"
                    : "border border-black/5 bg-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 className="text-xl font-semibold">Ödeme tercihiniz nedir?</h1>
          <div className="mt-4 space-y-2">
            {ODEME_TERCIHLERI.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setForm((f) => ({ ...f, odeme_tercihi: o }))}
                className={`flex w-full rounded-xl px-3 py-3 text-left text-sm ${
                  form.odeme_tercihi === o
                    ? "bg-[#0B6E4F] text-white"
                    : "border border-black/5 bg-white"
                }`}
              >
                {ODEME_LABELS[o]}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h1 className="text-xl font-semibold">İhtiyaç detayı</h1>
          <textarea
            className="mt-4 min-h-40 w-full rounded-2xl border border-black/10 bg-white p-3 text-sm"
            placeholder="Ada/parsel, mevcut durum, beklenti..."
            value={form.aciklama}
            onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
          />
        </div>
      )}

      {step === 5 && (
        <div>
          <h1 className="text-xl font-semibold">İletişim</h1>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
              placeholder="Ad soyad"
              value={form.iletisim_adi}
              onChange={(e) =>
                setForm((f) => ({ ...f, iletisim_adi: e.target.value }))
              }
            />
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
              placeholder="Cep telefonu"
              inputMode="tel"
              value={form.telefon}
              onChange={(e) => setForm((f) => ({ ...f, telefon: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
              placeholder="E-posta (opsiyonel)"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

      <div className="mt-8 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="h-12 flex-1 rounded-2xl border border-black/10 bg-white text-sm font-medium"
          >
            Geri
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={next}
          className="h-12 flex-[2] rounded-2xl bg-[#0B6E4F] text-sm font-semibold text-white disabled:opacity-60"
        >
          {step === 5 ? (loading ? "Gönderiliyor…" : "Gönder") : "Devam"}
        </button>
      </div>
    </div>
  );
}
