"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "./AdminLogoutButton";

const LINKS = [
  { href: "/yonetim/ilanlar", label: "İlanlar" },
  { href: "/yonetim/ilanlar/yeni", label: "Yeni ilan" },
  { href: "/yonetim/malikler", label: "Malikler" },
  { href: "/yonetim/muteahhitler", label: "Müteahhitler" },
  { href: "/yonetim/iletisim", label: "İletişim" },
  { href: "/yonetim/haberler", label: "Haberler" },
] as const;

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#111321] text-white">
      <div className="mx-auto w-full max-w-lg px-4">
        <div className="flex h-12 items-center justify-between gap-2 sm:h-14">
          <Link href="/yonetim/ilanlar" className="shrink-0">
            <span className="text-[15px] font-bold tracking-tight">
              kentsele
              <span className="text-[#2cb34f]">.ist</span>
            </span>
            <span className="ml-2 rounded bg-[#2cb34f]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2cb34f]">
              Admin
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-white/70 transition hover:text-white sm:text-sm"
            >
              Siteye dön
            </Link>
            <AdminLogoutButton className="!text-white/80 hover:!text-white" />
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto border-t border-white/10 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Yönetim menüsü"
        >
          {LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/yonetim/ilanlar" &&
                l.href !== "/yonetim/ilanlar/yeni" &&
                pathname.startsWith(l.href)) ||
              (l.href === "/yonetim/ilanlar" &&
                pathname.startsWith("/yonetim/ilanlar") &&
                !pathname.startsWith("/yonetim/ilanlar/yeni"));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
