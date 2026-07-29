import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import type { CreateListingInput } from "@/lib/validations/listing";
import { buildListingSlug, randomShortId } from "@/lib/slug";
import type { Listing } from "@/types/listing";
import type { ListingStatus } from "@/lib/constants/listing";
import { normalizeEmail } from "@/lib/listings/normalize-email";

export async function createListing(
  input: CreateListingInput,
  opts?: { status?: ListingStatus; ownerUserId?: string | null }
): Promise<{ listing: Listing; manageUrlPath: string }> {
  const supabase = createServiceClient();
  const shortId = randomShortId(4);
  const slug = buildListingSlug({
    ilce: input.ilce,
    katSayisi: input.kat_sayisi,
    daireSayisi: input.daire_sayisi,
    odemeTercihi: input.odeme_tercihi,
    shortId,
  });
  const manage_token = randomBytes(24).toString("base64url");
  // Normalize so later signup/login can match (case / whitespace)
  const email =
    normalizeEmail(String(input.email)) ?? String(input.email).trim();
  const status = opts?.status ?? "incelemede";

  const { data, error } = await supabase
    .from("listings")
    .insert({
      slug,
      ilce: input.ilce,
      mahalle: input.mahalle?.trim() || null,
      ada: input.ada?.trim() || null,
      parsel: input.parsel?.trim() || null,
      kat_sayisi: input.kat_sayisi,
      daire_sayisi: input.daire_sayisi,
      odeme_tercihi: input.odeme_tercihi,
      aciklama: input.aciklama,
      iletisim_adi: input.iletisim_adi,
      telefon: input.telefon,
      email,
      status,
      manage_token,
      owner_user_id: opts?.ownerUserId ?? null,
      published_at: status === "yayinda" ? new Date().toISOString() : null,
      belge_aplikasyon: input.belge_aplikasyon ?? false,
      belge_imar_durum: input.belge_imar_durum ?? false,
      belge_istikamet_roleve: input.belge_istikamet_roleve ?? false,
      belge_kot_kesit: input.belge_kot_kesit ?? false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return {
    listing: data as Listing,
    manageUrlPath: `/yonet/${manage_token}`,
  };
}

export async function updateListingByToken(
  token: string,
  patch: Record<string, unknown>
): Promise<Listing> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .update(patch)
    .eq("manage_token", token)
    .select("*")
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function adminUpdateListing(
  id: string,
  patch: Record<string, unknown>
): Promise<Listing> {
  const supabase = createServiceClient();
  if (patch.status === "yayinda" && !patch.published_at) {
    patch.published_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from("listings")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Listing;
}
