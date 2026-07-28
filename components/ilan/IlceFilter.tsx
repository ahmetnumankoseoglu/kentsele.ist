"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";

export function IlceFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("ilce") ?? "";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => router.push("/")}
        className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
          !current
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-700 border border-black/5"
        }`}
      >
        Tümü
      </button>
      {ISTANBUL_ILCELER.map((ilce) => (
        <button
          key={ilce}
          type="button"
          onClick={() => router.push(`/?ilce=${encodeURIComponent(ilce)}`)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
            current === ilce
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 border border-black/5"
          }`}
        >
          {ilce}
        </button>
      ))}
    </div>
  );
}
