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

const STEP_META = [
  { title: "İlçe seçin", sub: "Yalnızca İstanbul · 39 ilçe" },
  {
    title: "Kaç kat inşa edilecek?",
    sub: "Zemin altı katlar dahil",
  },
  { title: "Binada kaç daire olacak?", sub: "Hedef daire sayısını seç" },
  { title: "Ödeme tercihiniz nedir?", sub: "Müteahhitler buna göre teklif verir" },
  {
    title: "İhtiyaç detayı",
    sub: "Ada/parsel, mevcut durum, beklenti…",
  },
  { title: "İletişim bilgilerin", sub: "Yayında telefon ve WhatsApp görünür" },
];

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
  const meta = STEP_META[step]!;

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
        JSON.stringify({
          managePath: data.managePath,
          manageUrl: data.manageUrl,
        })
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
    if (step === 5) {
      if (form.iletisim_adi.trim().length < 2)
        return setError("Ad soyad girin");
      if (!form.telefon.trim()) return setError("Telefon girin");
      return submit();
    }
    setError(null);
    setStep((s) => s + 1);
  }

  return (
    <div className="pb-4">
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#6b7280]">
        <span>
          Adım {step + 1}/{STEPS}
        </span>
        <span>%{Math.round(progress)}</span>
      </div>
      <div className="progress-track mb-6">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="text-[22px] font-bold leading-snug text-[#111321]">
        {meta.title}
      </h1>
      <p className="mt-1 text-sm text-[#6b7280]">{meta.sub}</p>

      <div className="mt-5">
        {step === 0 && (
          <div>
            <div className="max-h-[46vh] space-y-1.5 overflow-y-auto pr-0.5">
              {ISTANBUL_ILCELER.map((ilce) => (
                <button
                  key={ilce}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, ilce }));
                    setError(null);
                  }}
                  data-selected={form.ilce === ilce}
                  className="option-chip flex w-full px-3.5 py-3 text-left text-sm"
                >
                  {ilce}
                </button>
              ))}
            </div>
            <input
              className="input-field mt-3"
              placeholder="Mahalle (opsiyonel)"
              value={form.mahalle}
              onChange={(e) =>
                setForm((f) => ({ ...f, mahalle: e.target.value }))
              }
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-4 gap-2">
            {KAT_SECENEKLERI.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, kat_sayisi: k }));
                  setError(null);
                }}
                data-selected={form.kat_sayisi === k}
                className="option-chip py-3.5 text-sm font-bold"
              >
                {k}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-3 gap-2">
            {DAIRE_SECENEKLERI.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, daire_sayisi: d }));
                  setError(null);
                }}
                data-selected={form.daire_sayisi === d}
                className="option-chip py-3.5 text-sm font-bold"
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            {ODEME_TERCIHLERI.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, odeme_tercihi: o }));
                  setError(null);
                }}
                data-selected={form.odeme_tercihi === o}
                className="option-chip flex w-full px-3.5 py-3.5 text-left text-sm"
              >
                {ODEME_LABELS[o]}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <textarea
            className="input-field min-h-44 resize-y"
            placeholder="Örn: 4 katlı 8 daireli bina, riskli yapı raporu alındı, kat karşılığı düşünüyoruz…"
            value={form.aciklama}
            onChange={(e) =>
              setForm((f) => ({ ...f, aciklama: e.target.value }))
            }
          />
        )}

        {step === 5 && (
          <div className="space-y-3">
            <input
              className="input-field"
              placeholder="Ad soyad"
              value={form.iletisim_adi}
              onChange={(e) =>
                setForm((f) => ({ ...f, iletisim_adi: e.target.value }))
              }
            />
            <input
              className="input-field"
              placeholder="Cep telefonu (05xx…)"
              inputMode="tel"
              value={form.telefon}
              onChange={(e) =>
                setForm((f) => ({ ...f, telefon: e.target.value }))
              }
            />
            <input
              className="input-field"
              placeholder="E-posta (opsiyonel)"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-[#ee401d]">{error}</p>
      )}

      <div className="mt-8 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep((s) => s - 1);
            }}
            className="btn-secondary flex-1"
          >
            Geri
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={next}
          className="btn-primary flex-[2]"
        >
          {step === 5
            ? loading
              ? "Gönderiliyor…"
              : "İlanı Gönder"
            : "Devam"}
        </button>
      </div>
    </div>
  );
}
