import Link from "next/link";

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
          <Link href="/" className="text-[#6b7280]">
            İlanlar
          </Link>
        </div>
        <p className="mt-6 text-xs text-[#9ca3af]">
          © {new Date().getFullYear()} kentsele.ist · Yalnızca İstanbul
        </p>
      </div>
    </footer>
  );
}
