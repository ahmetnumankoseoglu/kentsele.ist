import type { LiveStats } from "@/lib/stats/live";

const ROWS: {
  key: keyof Pick<
    LiveStats,
    "contractors" | "listings" | "owners" | "agreed" | "openOffers"
  >;
  label: string;
  hint: string;
  accent: string;
}[] = [
  {
    key: "contractors",
    label: "Müteahhit firma",
    hint: "Siteye üye",
    accent: "bg-[#2cb34f]",
  },
  {
    key: "listings",
    label: "İlan",
    hint: "Aktif + incelemede",
    accent: "bg-[#168f43]",
  },
  {
    key: "owners",
    label: "Malik",
    hint: "Kayıtlı malik hesabı",
    accent: "bg-[#111321]",
  },
  {
    key: "agreed",
    label: "Anlaşıldı",
    hint: "Anlaşma sağlandı",
    accent: "bg-[#6b7280]",
  },
  {
    key: "openOffers",
    label: "Teklif bekliyor",
    hint: "Teklife açık ilanlar",
    accent: "bg-[#2cb34f]",
  },
];

function formatTr(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

export function LiveStatsPanel({
  stats,
  compact = false,
}: {
  stats: LiveStats;
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "space-y-2" : "space-y-2.5"}>
      {ROWS.map((row) => (
        <li
          key={row.key}
          className={`flex items-center justify-between gap-3 rounded-[3px] border border-[#e3e4e6] bg-white ${
            compact ? "px-3 py-2" : "px-3.5 py-2.5"
          }`}
        >
          <div className="min-w-0 flex items-center gap-2.5">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${row.accent} ${
                row.key === "contractors" || row.key === "openOffers"
                  ? "animate-pulse"
                  : ""
              }`}
              aria-hidden
            />
            <div className="min-w-0">
              <p
                className={`font-bold text-[#111321] ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {row.label}
              </p>
              {!compact ? (
                <p className="text-[11px] text-[#9ca3af]">{row.hint}</p>
              ) : null}
            </div>
          </div>
          <p
            className={`shrink-0 tabular-nums font-bold text-[#168f43] ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {formatTr(stats[row.key])}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function formatLiveUpdatedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}
