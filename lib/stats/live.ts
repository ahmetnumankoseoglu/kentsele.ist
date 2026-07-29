import { createServiceClient } from "@/lib/supabase/admin";

/** Müteahhit sayısı: baz + veritabanındaki gerçek kayıt */
export const CONTRACTOR_DISPLAY_BASE = 17;

export type LiveStats = {
  /** Ekranda gösterilen müteahhit (17 + db) */
  contractors: number;
  /** Sadece DB’deki müteahhit firma sayısı */
  contractorsDb: number;
  /** Kaldırılmamış ilanlar */
  listings: number;
  /** Malik profilleri */
  owners: number;
  /** Anlaşma sağlandı */
  agreed: number;
  /** Teklife açık (yayinda + teklif_saglaniyor) */
  openOffers: number;
  updatedAt: string;
};

export async function getLiveStats(): Promise<LiveStats> {
  const admin = createServiceClient();

  const [
    contractorsRes,
    ownersRes,
    listingsRes,
    agreedRes,
    openOffersRes,
  ] = await Promise.all([
    admin
      .from("contractor_profiles")
      .select("*", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "malik"),
    admin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .neq("status", "kaldirildi"),
    admin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "anlasildi"),
    admin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .in("status", ["yayinda", "teklif_saglaniyor"]),
  ]);

  if (contractorsRes.error)
    console.error("[live-stats] contractors:", contractorsRes.error.message);
  if (ownersRes.error)
    console.error("[live-stats] owners:", ownersRes.error.message);
  if (listingsRes.error)
    console.error("[live-stats] listings:", listingsRes.error.message);
  if (agreedRes.error)
    console.error("[live-stats] agreed:", agreedRes.error.message);
  if (openOffersRes.error)
    console.error("[live-stats] openOffers:", openOffersRes.error.message);

  const contractorsDb = contractorsRes.count ?? 0;
  const owners = ownersRes.count ?? 0;
  const listings = listingsRes.count ?? 0;
  const agreed = agreedRes.count ?? 0;
  const openOffers = openOffersRes.count ?? 0;

  return {
    contractorsDb,
    contractors: CONTRACTOR_DISPLAY_BASE + contractorsDb,
    listings,
    owners,
    agreed,
    openOffers,
    updatedAt: new Date().toISOString(),
  };
}

export const EMPTY_LIVE_STATS: LiveStats = {
  contractors: CONTRACTOR_DISPLAY_BASE,
  contractorsDb: 0,
  listings: 0,
  owners: 0,
  agreed: 0,
  openOffers: 0,
  updatedAt: new Date(0).toISOString(),
};
