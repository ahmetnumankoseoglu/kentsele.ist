import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e3e4e6] bg-white">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2cb34f] text-sm font-bold text-white">
            k
          </span>
          <span className="text-[17px] font-bold tracking-tight text-[#111321]">
            kentsele
            <span className="text-[#2cb34f]">.ist</span>
          </span>
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/ilanlar"
            className="hidden text-sm font-semibold text-[#6b7280] hover:text-[#111321] xs:inline sm:inline"
          >
            İlanlar
          </Link>
          <Link
            href="/haberler"
            className="text-sm font-semibold text-[#6b7280] hover:text-[#111321]"
          >
            Haberler
          </Link>
          <Link
            href="/hesabim"
            className="text-sm font-semibold text-[#6b7280] hover:text-[#111321]"
          >
            Hesap
          </Link>
          <Link
            href="/ilan-ver"
            className="text-sm font-bold text-[#2cb34f] hover:text-[#1ca03e]"
          >
            İlan Ver
          </Link>
        </div>
      </div>
    </header>
  );
}
