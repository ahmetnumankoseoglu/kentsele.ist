"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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

const navLinkClass =
  "shrink-0 rounded-lg px-1.5 py-1.5 text-xs font-semibold text-[#6b7280] transition-colors hover:bg-[#f8f8f8] hover:text-[#111321] sm:px-2 sm:text-sm";

/** Short unique labels (avoid long / repeated anchors) */
const SUBNAV = [
  { href: "/rehber/kentsel-donusum-nedir", label: "Nedir?" },
  { href: "/rehber/6306-sayili-kanun", label: "6306" },
  { href: "/rehber/kira-yardimi", label: "Kira" },
  { href: "/rehber/hibe-ve-kredi-hesaplama", label: "Hibe" },
  { href: "/rehber", label: "Tümü" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const subnavRef = useRef<HTMLElement>(null);
  const [hideIlanVer, setHideIlanVer] = useState(false);

  useEffect(() => {
    const el = subnavRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Müteahhit girişi varsa header'da İlan Ver gizle
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!cancelled) {
          setHideIlanVer(data?.role === "muteahhit");
        }
      } catch {
        if (!cancelled) setHideIlanVer(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e3e4e6] bg-white">
      <div className="mx-auto w-full min-w-0 max-w-lg">
        <div className="flex h-12 items-center justify-between gap-2 px-4 sm:h-14">
          {isHome ? (
            <Link
              href="/"
              className="shrink-0 text-[16px] font-bold tracking-tight text-[#111321] sm:text-[17px]"
            >
              kentsele
              <span className="text-[#2cb34f]">.ist</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="shrink-0 text-[16px] font-bold tracking-tight text-[#111321] sm:text-[17px]"
              aria-label="Ana sayfaya dön"
            >
              ‹ Anasayfa
            </Link>
          )}
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-1.5">
            <Link href="/ilanlar" className={navLinkClass} title="İlan listesi">
              Liste
            </Link>
            <Link href="/haberler" className={navLinkClass} title="Haberler">
              Haber
            </Link>
            <Link
              href="/hesabim"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-[#eaf8ee] hover:text-[#168f43]"
              aria-label="Hesabım"
              title="Hesabım"
            >
              <UserIcon />
            </Link>
            {!hideIlanVer && (
              <Link
                href="/ilan-ver"
                className="shrink-0 whitespace-nowrap rounded-[3px] bg-[#2cb34f] px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#1ca03e] sm:px-3 sm:py-2 sm:text-sm"
              >
                İlan Ver
              </Link>
            )}
          </div>
        </div>

        <nav
          ref={subnavRef}
          className="subnav-scroll flex min-w-0 gap-0.5 overflow-x-auto overscroll-x-contain border-t border-[#f0f0f0] px-4 py-1.5 sm:gap-1.5"
          aria-label="Rehber menüsü"
        >
          {SUBNAV.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
