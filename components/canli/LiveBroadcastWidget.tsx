"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EMPTY_LIVE_STATS,
  type LiveStats,
} from "@/lib/stats/live";
import {
  formatLiveUpdatedAt,
  LiveStatsPanel,
} from "@/components/canli/LiveStatsPanel";

const REFRESH_MS = 30_000;

function shouldHide(pathname: string | null) {
  if (!pathname) return false;
  if (pathname.startsWith("/yonetim")) return true;
  return false;
}

/** WhatsApp tarzı sağ-alt sabit canlı yayın balonu */
export function LiveBroadcastWidget({
  liftForBottomCta = true,
}: {
  /** Alt CTA şeridi varken yukarı kaydır */
  liftForBottomCta?: boolean;
}) {
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<LiveStats>(EMPTY_LIVE_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/canli", { cache: "no-store" });
      if (!res.ok) throw new Error("fail");
      const data = (await res.json()) as LiveStats;
      setStats(data);
      setError(Boolean((data as LiveStats & { error?: boolean }).error));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldHide(pathname)) return;
    void load();
    const t = window.setInterval(() => void load(), REFRESH_MS);
    return () => window.clearInterval(t);
  }, [load, pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  if (shouldHide(pathname)) return null;

  const bottomClass = liftForBottomCta
    ? "bottom-[calc(4.75rem+env(safe-area-inset-bottom))] sm:bottom-[calc(5rem+env(safe-area-inset-bottom))]"
    : "bottom-[calc(1rem+env(safe-area-inset-bottom))]";

  return (
    <div
      ref={rootRef}
      className={`fixed right-3 z-[60] flex flex-col items-end gap-2 ${bottomClass} md:right-5`}
    >
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Canlı yayın istatistikleri"
          className="w-[min(100vw-1.5rem,20rem)] overflow-hidden rounded-2xl border border-[#e3e4e6] bg-white shadow-[var(--card-shadow)] animate-fade-up"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#e3e4e6] bg-[#111321] px-3.5 py-3 text-white">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
                <span
                  className="relative flex h-2 w-2"
                  aria-hidden
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2cb34f] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2cb34f]" />
                </span>
                Canlı yayın
              </p>
              <p className="mt-0.5 truncate text-[11px] text-white/60">
                kentsele.ist · anlık özet
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white hover:bg-white/15"
              aria-label="Kapat"
            >
              ×
            </button>
          </div>

          <div className="bg-[#f8f8f8] p-3">
            {loading && stats.updatedAt === EMPTY_LIVE_STATS.updatedAt ? (
              <p className="py-6 text-center text-xs text-[#6b7280]">
                Yükleniyor…
              </p>
            ) : (
              <LiveStatsPanel stats={stats} compact />
            )}
            {error ? (
              <p className="mt-2 text-center text-[11px] text-[#be3317]">
                Bağlantı zayıf — son bilinen değerler
              </p>
            ) : null}
            <p className="mt-2.5 text-center text-[10px] text-[#9ca3af]">
              Güncellendi {formatLiveUpdatedAt(stats.updatedAt)} · 30 sn
            </p>
            <Link
              href="/canli"
              onClick={() => setOpen(false)}
              className="mt-2 block text-center text-xs font-bold text-[#168f43] hover:underline"
            >
              Tam canlı yayın sayfası →
            </Link>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#2cb34f] text-white shadow-[0_8px_24px_rgba(44,179,79,0.45)] transition hover:bg-[#1ca03e] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2cb34f] focus-visible:ring-offset-2"
        title="Canlı yayın"
      >
        {/* pulse ring */}
        <span
          className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#2cb34f] opacity-30"
          aria-hidden
        />
        <span className="relative flex flex-col items-center leading-none">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide">
            Canlı
          </span>
        </span>
        {!open ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ee401d] opacity-70" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ee401d]" />
          </span>
        ) : null}
      </button>
    </div>
  );
}
