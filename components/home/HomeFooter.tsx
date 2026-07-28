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

        {/* Unique short anchors (avoid repeating header labels) */}
        <nav
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold"
          aria-label="Alt menü"
        >
          <Link href="/ilan-ver" className="text-[#168f43]">
            Ücretsiz ilan oluştur
          </Link>
          <Link href="/ilanlar" className="text-[#6b7280]">
            Tüm ilanlar
          </Link>
          <Link href="/haberler" className="text-[#6b7280]">
            Güncel haber
          </Link>
          <Link href="/rehber" className="text-[#6b7280]">
            Destek rehberi
          </Link>
          <Link href="/hakkimizda" className="text-[#6b7280]">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="text-[#6b7280]">
            Bize yazın
          </Link>
          <Link href="/site-haritasi" className="text-[#6b7280]">
            Sayfa listesi
          </Link>
          <Link href="/gizlilik" className="text-[#6b7280]">
            KVKK / Gizlilik
          </Link>
        </nav>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
          Resmi kurumlar
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
          <a
            href="https://www.csb.gov.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-[#168f43]"
          >
            CSB Bakanlığı
          </a>
          <a
            href="https://www.ibb.istanbul"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-[#168f43]"
          >
            İBB
          </a>
          <a
            href="https://www.mevzuat.gov.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-[#168f43]"
          >
            Mevzuat
          </a>
        </div>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
          İlçe sayfaları
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
          {ISTANBUL_ILCELER.map((ilce) => (
            <Link
              key={ilce}
              href={`/${ilceToSeoSlug(ilce)}`}
              className="text-xs font-medium text-[#6b7280] hover:text-[#168f43]"
              title={`${ilce} kentsel dönüşüm ilanları`}
            >
              {ilce}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#9ca3af]">
          © {new Date().getFullYear()} Kentsele · Yalnızca İstanbul ·{" "}
          {ISTANBUL_ILCELER.length} ilçe
        </p>
      </div>
    </footer>
  );
}
