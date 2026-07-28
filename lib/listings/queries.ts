import { createAnonClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import type { PublicListing, Listing } from "@/types/listing";
import type { ListingStatus } from "@/lib/constants/listing";

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

export async function getPublicListingBySlug(slug: string): Promise<PublicListing | null> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("listings_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as PublicListing | null;
}

export async function getListingByManageToken(token: string): Promise<Listing | null> {
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

export async function getAdminListings(filter?: {
  status?: ListingStatus;
}): Promise<Listing[]> {
  const supabase = createServiceClient();
  let q = supabase.from("listings").select("*").order("created_at", { ascending: false });
  if (filter?.status) q = q.eq("status", filter.status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Listing[];
}
