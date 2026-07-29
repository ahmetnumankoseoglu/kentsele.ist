"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import { getMahallelerForIlce } from "@/lib/constants/istanbul-mahalleler";
import {
  DAIRE_SECENEKLERI,
  KAT_SECENEKLERI,
  LISTING_BELGELER,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  type ListingBelgeKey,
  type OdemeTercihi,
} from "@/lib/constants/listing";
import {
  formatPhoneDisplay,
  formatPhoneInput,
  normalizeTrPhone,
} from "@/lib/phone";
import {
  parseDigitInput,
  sanitizeDigitInput,
} from "@/lib/utils/numeric-input";

const STEPS = 8;

export type InitialContact = {
  full_name: string;
  phone: string;
  email: string;
};

function phoneForInput(raw: string): string {
  if (!raw.trim()) return "";
  // Stored as +90… → display as 05xx xxx xx xx
  if (raw.startsWith("+") || raw.replace(/\D/g, "").startsWith("90")) {
    return formatPhoneDisplay(raw.startsWith("+") ? raw : `+${raw}`);
  }
  return formatPhoneInput(raw);
}

function buildStepMeta(fromAccount: boolean) {
  return [
    { title: "İlçe seçin", sub: "Yalnızca İstanbul · 39 ilçe" },
    {
      title: "Mahalle seçin",
      sub: "Seçtiğiniz ilçenin güncel mahalleleri",
    },
    {
      title: "Kaç kat inşa edilecek?",
      sub: "Hızlı seç veya özel rakam yaz (zemin altı dahil)",
    },
    {
      title: "Binada kaç daire olacak?",
      sub: "Hızlı seç veya özel rakam yaz",
    },
    {
      title: "Ödeme tercihiniz nedir?",
      sub: "Müteahhitler buna göre teklif verir",
    },
    {
      title: "Detay, ada/parsel ve belgeler",
      sub: "Açıklama zorunlu (en az 20 karakter) · ada/parsel zorunlu",
    },
    {
      title: "İletişim bilgilerin",
      sub: fromAccount
        ? "Hesabından alındı — kontrol edip devam et"
        : "Ad, telefon ve e-posta",
    },
    {
      title: "Onay ve gönder",
      sub: "Bilgileri kontrol et, şartları onayla",
    },
  ] as const;
}

const emptyBelgeler = () =>
  Object.fromEntries(LISTING_BELGELER.map((b) => [b.key, false])) as Record<
    ListingBelgeKey,
    boolean
  >;

export function IlanVerWizard({
  initialContact = null,
}: {
  initialContact?: InitialContact | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  const prefilledName = initialContact?.full_name?.trim() || "";
  const prefilledPhone = phoneForInput(initialContact?.phone || "");
  const prefilledEmail = initialContact?.email?.trim() || "";

  // Hesaptan ad + telefon + e-posta doluysa iletişim adımı salt okunur
  const contactFromAccount = Boolean(
    prefilledName.length >= 2 &&
      normalizeTrPhone(prefilledPhone) &&
      prefilledEmail &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefilledEmail)
  );

  const stepMeta = useMemo(
    () => buildStepMeta(contactFromAccount),
    [contactFromAccount]
  );

  const [form, setForm] = useState({
    ilce: "",
    mahalle: "",
    ada: "",
    parsel: "",
    kat_sayisi: "",
    daire_sayisi: "",
    odeme_tercihi: "" as OdemeTercihi | "",
    aciklama: "",
    iletisim_adi: prefilledName,
    telefon: prefilledPhone,
    email: prefilledEmail,
    ...emptyBelgeler(),
  });

  const progress = useMemo(() => ((step + 1) / STEPS) * 100, [step]);
  const meta = stepMeta[step]!;
  const mahalleler = useMemo(
    () => getMahallelerForIlce(form.ilce),
    [form.ilce]
  );

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ilanlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ilce: form.ilce,
          mahalle: form.mahalle,
          ada: form.ada,
          parsel: form.parsel,
          kat_sayisi: form.kat_sayisi,
          daire_sayisi: form.daire_sayisi,
          odeme_tercihi: form.odeme_tercihi,
          aciklama: form.aciklama,
          iletisim_adi: form.iletisim_adi,
          telefon: form.telefon,
          email: form.email.trim(),
          belge_aplikasyon: form.belge_aplikasyon,
          belge_imar_durum: form.belge_imar_durum,
          belge_istikamet_roleve: form.belge_istikamet_roleve,
          belge_kot_kesit: form.belge_kot_kesit,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.message ||
            "Formu kontrol edip tekrar dene. Eksik veya hatalı alan olabilir."
        );
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
    if (step === 1 && !form.mahalle) return setError("Mahalle seçin");
    if (step === 2) {
      const n = parseDigitInput(form.kat_sayisi, 0);
      if (!form.kat_sayisi.trim() || n < 1)
        return setError("Kat sayısı girin (en az 1)");
    }
    if (step === 3) {
      const n = parseDigitInput(form.daire_sayisi, 0);
      if (!form.daire_sayisi.trim() || n < 1)
        return setError("Daire sayısı girin (en az 1)");
    }
    if (step === 4 && !form.odeme_tercihi)
      return setError("Ödeme tercihi seçin");
    if (step === 5) {
      if (form.aciklama.trim().length < 20)
        return setError("Açıklama en az 20 karakter olmalı");
      if (!/^\d+$/.test(form.ada.trim()))
        return setError("Ada numarası girin (yalnızca rakam)");
      if (!/^\d+$/.test(form.parsel.trim()))
        return setError("Parsel numarası girin (yalnızca rakam)");
    }
    if (step === 6) {
      if (form.iletisim_adi.trim().length < 2)
        return setError("Ad soyad girin");
      if (!normalizeTrPhone(form.telefon))
        return setError("Geçerli bir cep telefonu girin (05xx…)");
      const em = form.email.trim();
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
        return setError("Geçerli bir e-posta girin");
    }
    if (step === 7) {
      if (!accepted)
        return setError("Devam etmek için onay kutusunu işaretleyin");
      return submit();
    }
    setError(null);
    setStep((s) => s + 1);
  }

  function toggleBelge(key: ListingBelgeKey) {
    setForm((f) => ({ ...f, [key]: !f[key] }));
  }

  const odemeLabel = form.odeme_tercihi
    ? ODEME_LABELS[form.odeme_tercihi]
    : "—";

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
          <div className="max-h-[46vh] space-y-1.5 overflow-y-auto pr-0.5">
            {ISTANBUL_ILCELER.map((ilce) => (
              <button
                key={ilce}
                type="button"
                onClick={() => {
                  setForm((f) => ({
                    ...f,
                    ilce,
                    mahalle: "",
                  }));
                  setError(null);
                }}
                data-selected={form.ilce === ilce}
                className="option-chip flex w-full px-3.5 py-3 text-left text-sm"
              >
                {ilce}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-2 text-xs font-medium text-[#6b7280]">
              {form.ilce} · {mahalleler.length} mahalle
            </p>
            <div className="max-h-[46vh] space-y-1.5 overflow-y-auto pr-0.5">
              {mahalleler.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, mahalle: m }));
                    setError(null);
                  }}
                  data-selected={form.mahalle === m}
                  className="option-chip flex w-full px-3.5 py-3 text-left text-sm"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {KAT_SECENEKLERI.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, kat_sayisi: k }));
                    setError(null);
                  }}
                  data-selected={form.kat_sayisi === k}
                  className="option-chip py-3.5 text-sm font-bold tabular-nums"
                >
                  {k}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-xs font-bold text-[#6b7280]">
              Özel kat sayısı
              <input
                className="input-field mt-1.5 text-lg font-bold tabular-nums"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                placeholder="Listede yoksa yazın"
                value={form.kat_sayisi}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    kat_sayisi: sanitizeDigitInput(e.target.value),
                  }));
                  setError(null);
                }}
                onFocus={(e) => e.target.select()}
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {DAIRE_SECENEKLERI.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, daire_sayisi: d }));
                    setError(null);
                  }}
                  data-selected={form.daire_sayisi === d}
                  className="option-chip py-3.5 text-sm font-bold tabular-nums"
                >
                  {d}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-xs font-bold text-[#6b7280]">
              Özel daire sayısı
              <input
                className="input-field mt-1.5 text-lg font-bold tabular-nums"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                placeholder="Listede yoksa yazın"
                value={form.daire_sayisi}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    daire_sayisi: sanitizeDigitInput(e.target.value),
                  }));
                  setError(null);
                }}
                onFocus={(e) => e.target.select()}
              />
            </label>
          </div>
        )}

        {step === 4 && (
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

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-[#111321]">
                İhtiyaç detayı <span className="text-[#ee401d]">*</span>
              </p>
              <p className="mt-0.5 text-xs text-[#6b7280]">
                Zorunlu · en az 20 karakter
              </p>
              <textarea
                className="input-field mt-2 min-h-32 resize-y"
                placeholder="Örn: 4 katlı 8 daireli bina, riskli yapı raporu alındı, kat karşılığı düşünüyoruz…"
                value={form.aciklama}
                onChange={(e) =>
                  setForm((f) => ({ ...f, aciklama: e.target.value }))
                }
              />
              <p className="mt-1 text-right text-xs text-[#9ca3af]">
                {form.aciklama.trim().length}/20+
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#111321]">
                Ada / parsel <span className="text-[#ee401d]">*</span>
              </p>
              <p className="mt-0.5 text-xs text-[#6b7280]">
                Zorunlu. Yalnızca rakam. Mahalle herkese açık; ada ve parsel
                yalnızca <strong>onaylı müteahhit</strong> hesaplarına
                gösterilir.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  className="input-field tabular-nums"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ada"
                  value={form.ada}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      ada: sanitizeDigitInput(e.target.value),
                    }))
                  }
                />
                <input
                  className="input-field tabular-nums"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Parsel"
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
            <div>
              <p className="text-sm font-bold text-[#111321]">
                Elinizde hangi belgeler var?
              </p>
              <p className="mt-0.5 text-xs text-[#6b7280]">
                Olanlara tik atın (yoksa boş bırakın).
              </p>
              <ul className="mt-3 space-y-2">
                {LISTING_BELGELER.map((b) => (
                  <li key={b.key}>
                    <label className="option-chip flex w-full cursor-pointer items-center gap-3 px-3.5 py-3 text-left text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 accent-[#2cb34f]"
                        checked={form[b.key]}
                        onChange={() => toggleBelge(b.key)}
                      />
                      <span className="font-medium text-[#111321]">
                        {b.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {step === 6 &&
          (contactFromAccount ? (
            <div className="space-y-3">
              <div className="card space-y-2.5 border border-[#eaf8ee] bg-[#f8fdf9] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#168f43]">
                  Hesabından alındı
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#6b7280]">Ad soyad</span>
                    <span className="font-semibold text-[#111321]">
                      {form.iletisim_adi}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#6b7280]">Telefon</span>
                    <span className="font-semibold tabular-nums text-[#111321]">
                      {form.telefon}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#6b7280]">E-posta</span>
                    <span className="break-all text-right font-semibold text-[#111321]">
                      {form.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                className="input-field tabular-nums"
                placeholder="Cep telefonu"
                inputMode="tel"
                autoComplete="tel"
                value={form.telefon}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    telefon: formatPhoneInput(e.target.value),
                  }));
                  setError(null);
                }}
              />
              <input
                className="input-field"
                placeholder="E-posta"
                inputMode="email"
                autoComplete="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
          ))}

        {step === 7 && (
          <div className="space-y-4">
            <div className="card space-y-2 p-4 text-sm text-[#374151]">
              <p className="font-bold text-[#111321]">Özet</p>
              <ul className="space-y-1.5 text-[#6b7280]">
                <li>
                  <span className="font-semibold text-[#111321]">Konum:</span>{" "}
                  {form.ilce} / {form.mahalle}
                </li>
                <li>
                  <span className="font-semibold text-[#111321]">Bina:</span>{" "}
                  {form.kat_sayisi} kat · {form.daire_sayisi} daire
                </li>
                <li>
                  <span className="font-semibold text-[#111321]">Ödeme:</span>{" "}
                  {odemeLabel}
                </li>
                <li>
                  <span className="font-semibold text-[#111321]">
                    Ada / parsel:
                  </span>{" "}
                  {form.ada} / {form.parsel}
                </li>
                <li>
                  <span className="font-semibold text-[#111321]">İletişim:</span>{" "}
                  {form.iletisim_adi} · {form.telefon} · {form.email}
                </li>
              </ul>
              <p className="mt-3 rounded-[3px] border border-[#eaf8ee] bg-[#f8fdf9] px-3 py-2.5 text-xs font-semibold leading-relaxed text-[#168f43]">
                Telefon numarası ile ada/parsel bilgisi yalnızca onaylı
                müteahhit hesaplarına gösterilir. Mahalle ve ilan özeti herkese
                açıktır.
              </p>
            </div>

            <div className="rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-4 text-xs leading-relaxed text-[#6b7280]">
              <p className="font-bold text-[#111321]">Onay metni</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4">
                <li>
                  Verdiğim bilgilerin doğru olduğunu, ilanın kentsel dönüşüm
                  amacıyla yayınlanacağını kabul ediyorum.
                </li>
                <li>
                  Telefon numaram ve ada/parsel bilgisi yalnızca{" "}
                  <strong>onaylı müteahhit</strong> hesaplarına açılır; mahalle
                  ve ilan özeti herkese görünür.
                </li>
                <li>
                  E-posta adresim, ilanı sonradan hesabıma bağlamak ve iletişim
                  için kullanılacaktır.
                </li>
                <li>
                  İlan önce incelemeye alınır; yayın admin onayı sonrasındadır.
                </li>
                <li>
                  kentsele.ist aracı platformdur; müteahhit ile yapılacak
                  sözleşmeden kendim sorumluyum.
                </li>
              </ul>
            </div>

            <label className="option-chip flex w-full cursor-pointer items-start gap-3 px-3.5 py-3.5 text-left text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2cb34f]"
                checked={accepted}
                onChange={(e) => {
                  setAccepted(e.target.checked);
                  setError(null);
                }}
              />
              <span className="font-medium leading-snug text-[#111321]">
                Yukarıdaki koşulları okudum, kabul ediyorum ve ilanımı göndermek
                istiyorum.
              </span>
            </label>
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
          {step === 7
            ? loading
              ? "Gönderiliyor…"
              : "İlanı Gönder"
            : "Devam"}
        </button>
      </div>
    </div>
  );
}
