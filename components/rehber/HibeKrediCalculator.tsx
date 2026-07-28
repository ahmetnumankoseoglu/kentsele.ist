"use client";

import { useMemo, useState } from "react";
import {
  DESTEK_TUTARLARI,
  formatTRY,
  hesaplaYarisiBizden,
} from "@/lib/content/destek-tutarlari";
import {
  parseDigitInput,
  sanitizeDigitInput,
} from "@/lib/utils/numeric-input";

export function HibeKrediCalculator() {
  const [konutRaw, setKonutRaw] = useState("0");
  const [ticariRaw, setTicariRaw] = useState("0");

  const konutAdet = parseDigitInput(konutRaw, 0);
  const ticariAdet = parseDigitInput(ticariRaw, 0);

  const sonuc = useMemo(
    () => hesaplaYarisiBizden(konutAdet, ticariAdet),
    [konutAdet, ticariAdet]
  );

  const bos = sonuc.konutAdet === 0 && sonuc.ticariAdet === 0;

  return (
    <section className="card-elevated not-prose mt-2 p-4 sm:p-5">
      <h2 className="text-base font-bold text-[#111321]">
        Yarısı Bizden · destek hesaplayıcı
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
        Her birim için hibe + kredi + taşınma uygulanır. Konut ve dükkân
        adedini birlikte girebilirsiniz.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-3 text-xs">
          <p className="font-bold text-[#168f43]">Konut (birim başına)</p>
          <ul className="mt-1.5 space-y-0.5 text-[#374151]">
            <li>Hibe {formatTRY(DESTEK_TUTARLARI.konut.hibe)}</li>
            <li>Kredi {formatTRY(DESTEK_TUTARLARI.konut.kredi)}</li>
            <li>Taşınma {formatTRY(DESTEK_TUTARLARI.konut.tasinma)}</li>
            <li className="font-bold">
              Toplam {formatTRY(DESTEK_TUTARLARI.konut.toplamBirim)}
            </li>
          </ul>
        </div>
        <div className="rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-3 text-xs">
          <p className="font-bold text-[#168f43]">İş yeri (birim başına)</p>
          <ul className="mt-1.5 space-y-0.5 text-[#374151]">
            <li>Hibe {formatTRY(DESTEK_TUTARLARI.ticari.hibe)}</li>
            <li>Kredi {formatTRY(DESTEK_TUTARLARI.ticari.kredi)}</li>
            <li>Taşınma {formatTRY(DESTEK_TUTARLARI.ticari.tasinma)}</li>
            <li className="font-bold">
              Toplam {formatTRY(DESTEK_TUTARLARI.ticari.toplamBirim)}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block text-xs font-bold text-[#6b7280]">
          Konut adedi
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            className="input-field mt-1 tabular-nums"
            value={konutRaw}
            onChange={(e) => setKonutRaw(sanitizeDigitInput(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
        </label>
        <label className="block text-xs font-bold text-[#6b7280]">
          Ticari (dükkân) adedi
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            className="input-field mt-1 tabular-nums"
            value={ticariRaw}
            onChange={(e) =>
              setTicariRaw(sanitizeDigitInput(e.target.value))
            }
            onFocus={(e) => e.target.select()}
          />
        </label>
      </div>
      <p className="mt-2 text-[11px] text-[#9ca3af]">
        Örnek: zemin 2 dükkân + üstte 6 daire → konut 6, ticari 2
      </p>

      {bos ? (
        <p className="mt-4 rounded-[3px] bg-[#fff7e6] px-3 py-2 text-sm text-[#b45309]">
          En az 1 konut veya 1 ticari birim girin.
        </p>
      ) : (
        <div className="mt-5 space-y-2 rounded-[3px] bg-[#eaf8ee] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#168f43]">
            Hesap sonucu
            {sonuc.konutAdet > 0 ? ` · ${sonuc.konutAdet} konut` : ""}
            {sonuc.ticariAdet > 0 ? ` · ${sonuc.ticariAdet} ticari` : ""}
          </p>
          <Row label="Toplam hibe" value={formatTRY(sonuc.hibe)} />
          <Row label="Toplam kredi" value={formatTRY(sonuc.kredi)} />
          <Row
            label="Toplam taşınma (birim × 125.000 ₺)"
            value={formatTRY(sonuc.tasinma)}
          />
          <div className="my-2 border-t border-[#2cb34f]/20" />
          <Row
            label="Genel toplam"
            value={formatTRY(sonuc.genelToplam)}
            strong
          />
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-[#9ca3af]">
        Aylık kira yardımı bu paketten ayrıdır;{" "}
        <a href="/rehber/kira-yardimi" className="font-semibold text-[#168f43]">
          kira yardımı rehberi
        </a>
        . Nihai hak ve ödeme resmî başvuruya bağlıdır.
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
            ? "shrink-0 font-bold tabular-nums text-[#168f43]"
            : "shrink-0 font-semibold tabular-nums text-[#111321]"
        }
      >
        {value}
      </span>
    </div>
  );
}
