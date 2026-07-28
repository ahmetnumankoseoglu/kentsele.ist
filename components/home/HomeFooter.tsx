import Link from "next/link";
import {
  ISTANBUL_ILCELER,
  ilceToSeoSlug,
} from "@/lib/constants/istanbul-ilceler";

export function HomeFooter() {
  return (
    <footer className="-mb-28 border-t border-[#e3e4e6] bg-[#f8f8f8] pb-28">
      <div className="mx-auto max-w-lg px-4 pb-6 pt-8">
        <p className="text-base font-bold text-[#111321]">
          kentsele<span className="text-[#2cb34f]">.ist</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          İstanbul kentsel dönüşüm ilan platformu. Malik ücretsiz ilan verir;
          müteahhit belge onayı sonrası iletişime geçer.
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
          <Link href="/rehber" className="text-[#6b7280]">
            Rehber
          </Link>
          <Link href="/rehber/6306-sayili-kanun" className="text-[#6b7280]">
            6306 kanun
          </Link>
          <Link
            href="/rehber/hibe-ve-kredi-hesaplama"
            className="text-[#6b7280]"
          >
            Hibe & kredi
          </Link>
        </div>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
          İstanbul ilçeleri · kentsel dönüşüm
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
          {ISTANBUL_ILCELER.map((ilce) => (
            <Link
              key={ilce}
              href={`/${ilceToSeoSlug(ilce)}`}
              className="text-xs font-medium text-[#6b7280] hover:text-[#168f43]"
            >
              {ilce}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#9ca3af]">
          © {new Date().getFullYear()} kentsele.ist · Yalnızca İstanbul ·{" "}
          {ISTANBUL_ILCELER.length} ilçe
        </p>
      </div>
    </footer>
  );
}
