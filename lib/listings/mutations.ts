import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import type { CreateListingInput } from "@/lib/validations/listing";
import { buildListingSlug, randomShortId } from "@/lib/slug";
import type { Listing } from "@/types/listing";

export async function createListing(
  input: CreateListingInput
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
  const email =
    input.email && String(input.email).trim() !== "" ? String(input.email) : null;

  const { data, error } = await supabase
    .from("listings")
    .insert({
      slug,
      ilce: input.ilce,
      mahalle: input.mahalle?.trim() || null,
      kat_sayisi: input.kat_sayisi,
      daire_sayisi: input.daire_sayisi,
      odeme_tercihi: input.odeme_tercihi,
      aciklama: input.aciklama,
      iletisim_adi: input.iletisim_adi,
      telefon: input.telefon,
      email,
      status: "incelemede",
      manage_token,
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
