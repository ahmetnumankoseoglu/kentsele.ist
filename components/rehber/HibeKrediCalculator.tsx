"use client";

import { useMemo, useState } from "react";

const ORNEK = {
  kiraAyMin: 3500,
  kiraAyMax: 9000,
  kiraAySure: 18,
  hibeDaireOrnek: 750_000,
  krediTavanOrnek: 1_500_000,
  faizDestekli: 0.49,
  faizPiyasa: 3.5,
};

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function HibeKrediCalculator() {
  const [daire, setDaire] = useState(1);
  const [kiraAy, setKiraAy] = useState(5500);
  const [kiraSure, setKiraSure] = useState(ORNEK.kiraAySure);
  const [hibe, setHibe] = useState(ORNEK.hibeDaireOrnek);
  const [kredi, setKredi] = useState(800_000);
  const [vadeAy, setVadeAy] = useState(120);

  const sonuc = useMemo(() => {
    const toplamKira = kiraAy * kiraSure * daire;
    const toplamHibe = hibe * daire;
    const r = ORNEK.faizDestekli / 100 / 12;
    const rP = ORNEK.faizPiyasa / 100 / 12;
    const n = vadeAy;
    const taksit =
      r === 0
        ? kredi / n
        : (kredi * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const taksitPiyasa =
      rP === 0
        ? kredi / n
        : (kredi * rP * Math.pow(1 + rP, n)) / (Math.pow(1 + rP, n) - 1);
    const toplamOdeme = taksit * n;
    const toplamOdemePiyasa = taksitPiyasa * n;
    return {
      toplamKira,
      toplamHibe,
      taksit,
      taksitPiyasa,
      destekFarki: toplamOdemePiyasa - toplamOdeme,
      paketToplam: toplamKira + toplamHibe,
    };
  }, [daire, kiraAy, kiraSure, hibe, kredi, vadeAy]);

  return (
    <section className="card-elevated not-prose mt-2 p-4 sm:p-5">
      <h2 className="text-base font-bold text-[#111321]">
        Yaklaşık destek hesaplayıcı
      </h2>
      <p className="mt-1 text-xs text-[#6b7280]">
        Alanları senaryona göre değiştir. Sonuçlar bağlayıcı teklif değildir.
      </p>

      <div className="mt-4 space-y-3">
        <label className="block text-xs font-bold text-[#6b7280]">
          Daire / bağımsız bölüm adedi
          <input
            type="number"
            min={1}
            max={50}
            className="input-field mt-1"
            value={daire}
            onChange={(e) => setDaire(Number(e.target.value) || 1)}
          />
        </label>
        <label className="block text-xs font-bold text-[#6b7280]">
          Aylık kira yardımı (TL)
          <input
            type="number"
            min={0}
            step={100}
            className="input-field mt-1"
            value={kiraAy}
            onChange={(e) => setKiraAy(Number(e.target.value) || 0)}
          />
          <span className="mt-1 block font-normal">
            Örnek aralık: {formatTRY(ORNEK.kiraAyMin)} –{" "}
            {formatTRY(ORNEK.kiraAyMax)}
          </span>
        </label>
        <label className="block text-xs font-bold text-[#6b7280]">
          Kira yardım süresi (ay)
          <input
            type="number"
            min={1}
            max={36}
            className="input-field mt-1"
            value={kiraSure}
            onChange={(e) => setKiraSure(Number(e.target.value) || 1)}
          />
        </label>
        <label className="block text-xs font-bold text-[#6b7280]">
          Daire başı hibe (TL, örnek)
          <input
            type="number"
            min={0}
            step={10000}
            className="input-field mt-1"
            value={hibe}
            onChange={(e) => setHibe(Number(e.target.value) || 0)}
          />
        </label>
        <label className="block text-xs font-bold text-[#6b7280]">
          Kullanılacak kredi tutarı (TL)
          <input
            type="number"
            min={0}
            step={10000}
            className="input-field mt-1"
            value={kredi}
            onChange={(e) => setKredi(Number(e.target.value) || 0)}
          />
          <span className="mt-1 block font-normal">
            Örnek tavan bandı: ~{formatTRY(ORNEK.krediTavanOrnek)}
          </span>
        </label>
        <label className="block text-xs font-bold text-[#6b7280]">
          Vade (ay)
          <input
            type="number"
            min={12}
            max={240}
            className="input-field mt-1"
            value={vadeAy}
            onChange={(e) => setVadeAy(Number(e.target.value) || 12)}
          />
        </label>
      </div>

      <div className="mt-5 space-y-2 rounded-[3px] bg-[#eaf8ee] p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#168f43]">
          Yaklaşık sonuç
        </p>
        <Row label="Toplam kira yardımı" value={formatTRY(sonuc.toplamKira)} />
        <Row label="Toplam hibe (örnek)" value={formatTRY(sonuc.toplamHibe)} />
        <Row
          label="Kira + hibe paketi"
          value={formatTRY(sonuc.paketToplam)}
          strong
        />
        <div className="my-2 border-t border-[#2cb34f]/20" />
        <Row
          label={`Aylık taksit (destekli ~%${ORNEK.faizDestekli})`}
          value={formatTRY(sonuc.taksit)}
        />
        <Row
          label={`Aylık taksit (piyasa ~%${ORNEK.faizPiyasa})`}
          value={formatTRY(sonuc.taksitPiyasa)}
        />
        <Row
          label="Faiz desteği farkı (toplam vade)"
          value={formatTRY(sonuc.destekFarki)}
          strong
        />
      </div>
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
