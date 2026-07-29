import { createServiceClient } from "@/lib/supabase/admin";
import { emailsMatch } from "@/lib/listings/ownership";

/** Escape `%` `_` `\` for PostgREST ilike exact match */
function escapeIlikeExact(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

/**
 * Sahipsiz (owner_user_id null) ilanları, iletişim e-postası eşleşince
 * kullanıcıya bağlar. Kayıt / giriş / Hesabım için.
 *
 * - Yalnızca owner_user_id IS NULL olanlar
 * - E-posta trim + case-insensitive
 * - Başka hesaba ait ilanlara dokunmaz
 */
export async function linkUnownedListingsByEmail(
  userId: string,
  email: string | null | undefined
): Promise<{ linked: number; ids: string[] }> {
  const normalized = email?.trim().toLowerCase();
  if (!userId || !normalized) {
    return { linked: 0, ids: [] };
  }

  const admin = createServiceClient();

  // Case-insensitive adaylar (ilike); sonra JS ile kesin eşleşme
  const { data: candidates, error } = await admin
    .from("listings")
    .select("id, email, owner_user_id")
    .is("owner_user_id", null)
    .ilike("email", escapeIlikeExact(normalized));

  if (error) {
    console.error("[claim-by-email] select", error);
    throw error;
  }

  const ids = (candidates ?? [])
    .filter((row) => !row.owner_user_id && emailsMatch(row.email, normalized))
    .map((row) => row.id as string);

  if (ids.length === 0) {
    return { linked: 0, ids: [] };
  }

  const { data: updated, error: upErr } = await admin
    .from("listings")
    .update({ owner_user_id: userId })
    .in("id", ids)
    .is("owner_user_id", null)
    .select("id");

  if (upErr) {
    console.error("[claim-by-email] update", upErr);
    throw upErr;
  }

  const linkedIds = (updated ?? []).map((r) => r.id as string);
  return { linked: linkedIds.length, ids: linkedIds };
}
