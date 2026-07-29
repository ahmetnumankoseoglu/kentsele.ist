import Link from "next/link";

export function ListingsPagination({
  page,
  totalPages,
  basePath,
  ilce,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  ilce?: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    if (ilce) params.set("ilce", ilce);
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
  }

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  // Show a compact window of page numbers
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const nums: number[] = [];
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav
      className="mt-6 flex flex-col items-center gap-3"
      aria-label="Sayfalama"
    >
      <p className="text-xs font-medium text-[#6b7280]">
        Sayfa {page} / {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {prev ? (
          <Link
            href={hrefFor(prev)}
            className="rounded-[3px] border border-[#e3e4e6] bg-white px-3 py-2 text-xs font-bold text-[#111321] hover:border-[#2cb34f]"
            rel="prev"
          >
            ← Önceki
          </Link>
        ) : (
          <span className="rounded-[3px] border border-transparent px-3 py-2 text-xs font-bold text-[#9ca3af]">
            ← Önceki
          </span>
        )}
        {nums.map((n) =>
          n === page ? (
            <span
              key={n}
              className="rounded-[3px] bg-[#2cb34f] px-3 py-2 text-xs font-bold text-white"
              aria-current="page"
            >
              {n}
            </span>
          ) : (
            <Link
              key={n}
              href={hrefFor(n)}
              className="rounded-[3px] border border-[#e3e4e6] bg-white px-3 py-2 text-xs font-bold tabular-nums text-[#111321] hover:border-[#2cb34f]"
            >
              {n}
            </Link>
          )
        )}
        {next ? (
          <Link
            href={hrefFor(next)}
            className="rounded-[3px] border border-[#e3e4e6] bg-white px-3 py-2 text-xs font-bold text-[#111321] hover:border-[#2cb34f]"
            rel="next"
          >
            Sonraki →
          </Link>
        ) : (
          <span className="rounded-[3px] border border-transparent px-3 py-2 text-xs font-bold text-[#9ca3af]">
            Sonraki →
          </span>
        )}
      </div>
    </nav>
  );
}
