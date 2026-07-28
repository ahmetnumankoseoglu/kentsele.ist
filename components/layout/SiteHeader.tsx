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
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/ilanlar"
            className="rounded-lg px-2 py-1.5 text-sm font-semibold text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#111321]"
          >
            İlanlar
          </Link>
          <Link
            href="/haberler"
            className="rounded-lg px-2 py-1.5 text-sm font-semibold text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#111321]"
          >
            Haberler
          </Link>
          <Link
            href="/hesabim"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#eaf8ee] hover:text-[#168f43]"
            aria-label="Hesabım"
            title="Hesabım"
          >
            <UserIcon />
          </Link>
          <Link
            href="/ilan-ver"
            className="ml-0.5 rounded-[3px] bg-[#2cb34f] px-3 py-2 text-sm font-bold text-white hover:bg-[#1ca03e]"
          >
            İlan Ver
          </Link>
        </div>
      </div>
    </header>
  );
}
