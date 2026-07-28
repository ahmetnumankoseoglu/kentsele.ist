"use client";

import { useMemo, useState } from "react";
import { DESTEK_TUTARLARI, formatTRY } from "@/lib/content/destek-tutarlari";

type BirimTipi = "konut" | "ticari";

export function HibeKrediCalculator() {
  const [tip, setTip] = useState<BirimTipi>("konut");
  const [adet, setAdet] = useState(1);

  const paket = DESTEK_TUTARLARI[tip];

  const sonuc = useMemo(() => {
    const hibeToplam = paket.hibe * adet;
    const krediToplam = paket.kredi * adet;
    return {
      hibeBirim: paket.hibe,
      krediBirim: paket.kredi,
      toplamBirim: paket.toplam,
      hibeToplam,
      krediToplam,
      genelToplam: hibeToplam + krediToplam,
    };
  }, [paket, adet]);

  return (
    <section className="card-elevated not-prose mt-2 p-4 sm:p-5">
      <h2 className="text-base font-bold text-[#111321]">
        Hibe ve kredi hesaplayıcı
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
        Birim başına sabit tutarlar: konut{" "}
        <strong className="text-[#111321]">
          {formatTRY(DESTEK_TUTARLARI.konut.toplam)}
        </strong>
        ; ticari{" "}
        <strong className="text-[#111321]">
          {formatTRY(DESTEK_TUTARLARI.ticari.toplam)}
        </strong>
        . Adet ile çarparak toplam paketi görürsün.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(
          [
            { id: "konut" as const, label: "Konut" },
            { id: "ticari" as const, label: "Ticari" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTip(t.id)}
            data-selected={tip === t.id}
            className="option-chip py-3 text-sm font-bold"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-[3px] bg-[#f8f8f8] p-3 text-xs text-[#6b7280]">
        <p>
          <span className="font-bold text-[#111321]">{paket.label}</span> birim
          başına:
        </p>
        <ul className="mt-1.5 space-y-0.5">
          <li>Hibe: {formatTRY(paket.hibe)}</li>
          <li>Kredi: {formatTRY(paket.kredi)}</li>
          <li className="font-bold text-[#168f43]">
            Toplam: {formatTRY(paket.toplam)}
          </li>
        </ul>
      </div>

      <label className="mt-4 block text-xs font-bold text-[#6b7280]">
        Bağımsız bölüm / birim adedi
        <input
          type="number"
          min={1}
          max={200}
          className="input-field mt-1"
          value={adet}
          onChange={(e) => setAdet(Math.max(1, Number(e.target.value) || 1))}
        />
      </label>

      <div className="mt-5 space-y-2 rounded-[3px] bg-[#eaf8ee] p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#168f43]">
          Hesap sonucu · {adet} × {paket.label.toLowerCase()}
        </p>
        <Row label="Birim hibe" value={formatTRY(sonuc.hibeBirim)} />
        <Row label="Birim kredi" value={formatTRY(sonuc.krediBirim)} />
        <Row
          label="Birim toplam (hibe + kredi)"
          value={formatTRY(sonuc.toplamBirim)}
        />
        <div className="my-2 border-t border-[#2cb34f]/20" />
        <Row label={`Toplam hibe (${adet} birim)`} value={formatTRY(sonuc.hibeToplam)} />
        <Row
          label={`Toplam kredi (${adet} birim)`}
          value={formatTRY(sonuc.krediToplam)}
        />
        <Row
          label="Genel toplam destek paketi"
          value={formatTRY(sonuc.genelToplam)}
          strong
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[#9ca3af]">
        Tutarlar bilgilendirme amaçlıdır. Başvuru şartları, hak sahipliği ve
        ödeme planı resmî kurum ve banka süreçlerine tabidir.
      </p>
    </section>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-[#6b7280]">{label}</span>
      <span
        className={
          strong
            ? "shrink-0 font-bold text-[#168f43]"
            : "shrink-0 font-semibold text-[#111321]"
        }
      >
        {value}
      </span>
    </div>
  );
}
