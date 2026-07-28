"use client";

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

  function go(ilce?: string) {
    if (!ilce) {
      router.push(basePath);
      return;
    }
    router.push(`${basePath}?ilce=${encodeURIComponent(ilce)}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
