import { Suspense } from "react";
import Link from "next/link";
import { ListingCard } from "@/components/ilan/ListingCard";
import { IlceFilter } from "@/components/ilan/IlceFilter";
import { ListingsPagination } from "@/components/ilan/ListingsPagination";
import type { PublicListing } from "@/types/listing";

export function ListingsFeed({
  listings,
  errorMsg,
  ilce,
  title,
  filterBasePath = "/ilanlar",
  page = 1,
  pageSize = 20,
  totalCount,
  showPagination = false,
}: {
  listings: PublicListing[];
  errorMsg: string | null;
  ilce?: string;
  title?: string;
  /** IlceFilter uses / by default; for /ilanlar pass /ilanlar */
  filterBasePath?: "/" | "/ilanlar";
  page?: number;
  pageSize?: number;
  /** Full filtered total (for pagination label) */
  totalCount?: number;
  showPagination?: boolean;
}) {
  const total = totalCount ?? listings.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-2">
        <h2 className="section-title mb-0 pb-2">
          {title ?? (ilce ? `${ilce} ilanları` : "Güncel ilanlar")}
        </h2>
        {!errorMsg && (
          <span className="mb-2 text-xs font-bold text-[#6b7280]">
            {total} ilan
            {showPagination && totalPages > 1
              ? ` · s. ${page}/${totalPages}`
              : ""}
          </span>
        )}
      </div>

      <Suspense fallback={null}>
        <IlceFilter basePath={filterBasePath} />
      </Suspense>

      <div className="mt-4 flex flex-col gap-3">
        {errorMsg ? (
          <div className="card p-5 text-sm text-[#be3317]">{errorMsg}</div>
        ) : listings.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm font-bold text-[#111321]">
              Bu filtrede henüz ilan yok
            </p>
            <p className="mt-1 text-sm text-[#6b7280]">
              İlk ilanı sen ver; onaylı müteahhitler seni bulsun.
            </p>
            <Link href="/ilan-ver" className="btn-primary mt-5 w-full">
              Ücretsiz İlan Ver
            </Link>
          </div>
        ) : (
          listings.map((l, i) => (
            <div
              key={l.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
            >
              <ListingCard listing={l} />
            </div>
          ))
        )}
      </div>

      {showPagination && !errorMsg && total > 0 ? (
        <ListingsPagination
          page={page}
          totalPages={totalPages}
          basePath={filterBasePath}
          ilce={ilce}
        />
      ) : null}
    </section>
  );
}
