import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F7F6F3]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          kentsele<span className="text-[#0B6E4F]">.ist</span>
        </Link>
        <Link
          href="/ilan-ver"
          className="rounded-full bg-[#0B6E4F] px-3 py-1.5 text-sm font-medium text-white"
        >
          İlan ver
        </Link>
      </div>
    </header>
  );
}
