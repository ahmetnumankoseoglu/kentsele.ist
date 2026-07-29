import Link from "next/link";
import {
  ISTANBUL_ILCELER,
  ilceToSeoSlug,
  type IstanbulIlce,
} from "@/lib/constants/istanbul-ilceler";

/** Popüler ilçeler — 39 link yerine yoğunluğu düşürür */
const FOOTER_ILCELER: IstanbulIlce[] = [
  "Kadıköy",
  "Üsküdar",
  "Beşiktaş",
  "Bakırköy",
  "Maltepe",
  "Kartal",
  "Fatih",
  "Şişli",
];

export function HomeFooter({
  withBottomCta = false,
}: {
  /** Sabit alt CTA varken alt boşluk */
  withBottomCta?: boolean;
}) {
  return (
    <footer
      className={`border-t border-[#e3e4e6] bg-[#f8f8f8] ${
        withBottomCta ? "pb-28" : "pb-10"
      }`}
    >
      <div className="mx-auto max-w-lg px-4 pb-6 pt-8">
        <p className="text-base font-bold text-[#111321]">
          kentsele<span className="text-[#2cb34f]">.ist</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          İstanbul’da malik ile onaylı müteahhiti buluşturan ilan platformu.
          İlan ücretsiz; iletişim belge onayı sonrasıdır.
        </p>

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
          <Link href="/canli" className="text-[#6b7280]">
            Canlı yayın
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
          Resmi kaynaklar
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
          <a
            href="https://yapiisleri.csb.gov.tr/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[#6b7280] hover:text-[#168f43]"
          >
            Yapı İşleri Genel Müdürlüğü
          </a>
          <a
            href="https://www.ibb.istanbul/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[#6b7280] hover:text-[#168f43]"
          >
            İstanbul Büyükşehir Belediyesi
          </a>
          <a
            href="https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6306.pdf"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[#6b7280] hover:text-[#168f43]"
          >
            6306 sayılı kanun (PDF)
          </a>
        </div>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
          Öne çıkan ilçeler
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
          {FOOTER_ILCELER.map((ilce) => (
            <Link
              key={ilce}
              href={`/${ilceToSeoSlug(ilce)}`}
              className="text-xs font-medium text-[#6b7280] hover:text-[#168f43]"
            >
              {ilce}
            </Link>
          ))}
          <Link
            href="/site-haritasi"
            className="text-xs font-bold text-[#168f43]"
          >
            Tüm {ISTANBUL_ILCELER.length} ilçe →
          </Link>
        </div>

        <p className="mt-6 text-xs text-[#9ca3af]">
          © {new Date().getFullYear()} Kentsele · Yalnızca İstanbul ·{" "}
          {ISTANBUL_ILCELER.length} ilçe
        </p>
      </div>
    </footer>
  );
}
