import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ilan/ListingCard";
import { IlceFilter } from "@/components/ilan/IlceFilter";
import { getPublicListings } from "@/lib/listings/queries";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";
import type { PublicListing } from "@/types/listing";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ ilce?: string }>;
}) {
  const sp = await searchParams;
  const ilce =
    sp.ilce && isValidIstanbulIlce(sp.ilce) ? sp.ilce : undefined;

  let listings: PublicListing[] = [];
  let errorMsg: string | null = null;
  try {
    listings = await getPublicListings(ilce);
  } catch {
    errorMsg =
      "İlanlar yüklenemedi. Supabase yapılandırmasını kontrol edin.";
  }

  return (
    <AppShell>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          İstanbul kentsel dönüşüm ilanları
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Malikler ilan verir; müteahhitler ücretsiz inceler ve arar.
        </p>
      </section>
      <Suspense fallback={null}>
        <IlceFilter />
      </Suspense>
      <div className="mt-4 flex flex-col gap-3">
        {errorMsg ? (
          <p className="text-sm text-rose-700">{errorMsg}</p>
        ) : listings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-slate-500">
            Bu filtrede henüz ilan yok. İlk ilanı sen ver.
          </p>
        ) : (
          listings.map((l) => <ListingCard key={l.id} listing={l} />)
        )}
      </div>
    </AppShell>
  );
}
