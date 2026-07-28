import Link from "next/link";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19.5c1.2-3.2 3.6-4.5 6.5-4.5s5.3 1.3 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SUBNAV = [
  {
    href: "/rehber/6306-sayili-kanun",
    label: "6306 sayılı kanun",
  },
  {
    href: "/rehber/hibe-ve-kredi-hesaplama",
    label: "Hibe & kredi",
  },
  {
    href: "/rehber",
    label: "Rehber",
  },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e3e4e6] bg-white">
      <div className="mx-auto max-w-lg">
        {/* Ana bar */}
        <div className="flex h-12 items-center justify-between gap-2 px-4 sm:h-14">
          <Link
            href="/"
            className="shrink-0 text-[16px] font-bold tracking-tight text-[#111321] sm:text-[17px]"
          >
            kentsele
            <span className="text-[#2cb34f]">.ist</span>
          </Link>
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-1.5">
            <Link
              href="/ilanlar"
              className="hidden rounded-lg px-2 py-1.5 text-sm font-semibold text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#111321] sm:inline"
            >
              İlanlar
            </Link>
            <Link
              href="/haberler"
              className="hidden rounded-lg px-2 py-1.5 text-sm font-semibold text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#111321] xs:inline sm:inline"
            >
              Haberler
            </Link>
            <Link
              href="/hesabim"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#eaf8ee] hover:text-[#168f43]"
              aria-label="Hesabım"
              title="Hesabım"
            >
              <UserIcon />
            </Link>
            <Link
              href="/ilan-ver"
              className="shrink-0 whitespace-nowrap rounded-[3px] bg-[#2cb34f] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#1ca03e] sm:px-3 sm:py-2 sm:text-sm"
            >
              İlan Ver
            </Link>
          </div>
        </div>

        {/* Alt menü — faydalı rehberler */}
        <nav
          className="flex gap-1 overflow-x-auto border-t border-[#f0f0f0] px-3 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Rehber menüsü"
        >
          {SUBNAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] transition hover:bg-[#eaf8ee] hover:text-[#168f43] sm:text-xs"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/ilanlar"
            className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] transition hover:bg-[#eaf8ee] hover:text-[#168f43] sm:hidden sm:text-xs"
          >
            İlanlar
          </Link>
          <Link
            href="/haberler"
            className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] transition hover:bg-[#eaf8ee] hover:text-[#168f43] sm:hidden sm:text-xs"
          >
            Haberler
          </Link>
        </nav>
      </div>
    </header>
  );
}
