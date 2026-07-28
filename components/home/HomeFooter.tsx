import Link from "next/link";
import { ISTANBUL_ILCELER, ilceToSeoSlug } from "@/lib/constants/istanbul-ilceler";

const FOOTER_ILCELER = [
  "Bayrampaşa",
  "Kadıköy",
  "Üsküdar",
  "Fatih",
  "Maltepe",
  "Bahçelievler",
] as const;

export function HomeFooter() {
  return (
    <footer className="border-t border-[#e3e4e6] bg-[#f8f8f8]">
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-base font-bold text-[#111321]">
          kentsele<span className="text-[#2cb34f]">.ist</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          İstanbul kentsel dönüşüm ilan platformu. Malik ile müteahhit arasında
          sade ve şeffaf buluşma noktası.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          <Link href="/ilan-ver" className="text-[#168f43]">
            İlan ver
          </Link>
          <Link href="/ilanlar" className="text-[#6b7280]">
            İlanlar
          </Link>
          <Link href="/haberler" className="text-[#6b7280]">
            Haberler
          </Link>
          <Link href="/haberler/rss.xml" className="text-[#6b7280]">
            RSS
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {FOOTER_ILCELER.map((ilce) => (
            <Link
              key={ilce}
              href={`/${ilceToSeoSlug(ilce)}`}
              className="text-xs font-medium text-[#9ca3af] hover:text-[#168f43]"
            >
              {ilce}
            </Link>
          ))}
          <span className="text-xs text-[#d1d5db]">
            +{ISTANBUL_ILCELER.length - FOOTER_ILCELER.length} ilçe
          </span>
        </div>
        <p className="mt-6 text-xs text-[#9ca3af]">
          © {new Date().getFullYear()} kentsele.ist · Yalnızca İstanbul
        </p>
      </div>
    </footer>
  );
}
