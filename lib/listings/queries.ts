import { createAnonClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { canViewListingContact } from "@/lib/auth/session";
import type { PublicListing, Listing } from "@/types/listing";
import type { ListingStatus } from "@/lib/constants/listing";

/** Onaylı müteahhit için public listeye ada/parsel ekler */
export async function getPublicListingsForViewer(
  ilce?: string
): Promise<PublicListing[]> {
  const listings = await getPublicListings(ilce);
  if (!(await canViewListingContact())) return listings;

  try {
    const supabase = createServiceClient();
    const ids = listings.map((l) => l.id);
    if (ids.length === 0) return listings;
    const { data, error } = await supabase
      .from("listings")
      .select("id, ada, parsel")
      .in("id", ids);
    if (error) throw error;
    const map = new Map(
      (data ?? []).map(
        (r: { id: string; ada: string | null; parsel: string | null }) => [
          r.id,
          r,
        ]
      )
    );
    return listings.map((l) => {
      const f = map.get(l.id);
      return f ? { ...l, ada: f.ada, parsel: f.parsel } : l;
    });
  } catch {
    return listings;
  }
}

export async function getPublicListings(ilce?: string): Promise<PublicListing[]> {
  const supabase = createAnonClient();
  let q = supabase
    .from("listings_public")
    .select("*")
    .order("published_at", { ascending: false });
  if (ilce) q = q.eq("ilce", ilce);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PublicListing[];
}

export async function getPublicListingBySlug(
  slug: string
): Promise<PublicListing | null> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("listings_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as PublicListing | null;
}

export async function getListingByManageToken(
  token: string
): Promise<Listing | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("manage_token", token)
    .maybeSingle();
  if (error) throw error;
  return data as Listing | null;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Listing | null;
}

/** Tam kayıt (manage_token dahil) — sahiplik / düzenle butonu için */
export async function getListingBySlugFull(
  slug: string
): Promise<Listing | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Listing | null;
}

export async function getAdminListings(filter?: {
  status?: ListingStatus;
}): Promise<Listing[]> {
  const supabase = createServiceClient();
  let q = supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter?.status) q = q.eq("status", filter.status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Listing[];
}
