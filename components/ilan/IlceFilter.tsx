"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";

export function IlceFilter({
  basePath = "/",
}: {
  basePath?: "/" | "/ilanlar";
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("ilce") ?? "";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Header subnav ile aynı: fare tekerleği dikey → yatay kaydırma (masaüstü)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function go(ilce?: string) {
    if (!ilce) {
      router.push(basePath);
      return;
    }
    router.push(`${basePath}?ilce=${encodeURIComponent(ilce)}`);
  }

  return (
    <div
      ref={scrollRef}
      className="subnav-scroll flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1.5"
      role="listbox"
      aria-label="İlçe filtresi"
    >
      <button
        type="button"
        onClick={() => go()}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
          !current
            ? "bg-[#2cb34f] text-white"
            : "border border-[#e3e4e6] bg-white text-[#111321]"
        }`}
      >
        Tümü
      </button>
      {ISTANBUL_ILCELER.map((ilce) => (
        <button
          key={ilce}
          type="button"
          onClick={() => go(ilce)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
            current === ilce
              ? "bg-[#2cb34f] text-white"
              : "border border-[#e3e4e6] bg-white text-[#111321]"
          }`}
        >
          {ilce}
        </button>
      ))}
    </div>
  );
}
