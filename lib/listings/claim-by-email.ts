import { createServiceClient } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/listings/normalize-email";

/**
 * Sahipsiz (owner_user_id null) ilanları, iletişim e-postası eşleşince
 * kullanıcıya bağlar.
 *
 * Strateji (sırayla):
 * 1) Postgres RPC (varsa) — lower(trim(email))
 * 2) Doğrudan update: email.eq normalize (lowercase kayıtlar)
 * 3) Sahipsiz ilanları çekip JS ile eşleştir (ilike / encoding tuzakları yok)
 */
export async function linkUnownedListingsByEmail(
  userId: string,
  email: string | null | undefined
): Promise<{ linked: number; ids: string[] }> {
  const normalized = normalizeEmail(email);
  if (!userId || !normalized) {
    return { linked: 0, ids: [] };
  }

  const admin = createServiceClient();

  // Profil yoksa FK patlar — yoksa minimal profil aç
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    const { error: insErr } = await admin.from("profiles").insert({
      id: userId,
      role: "malik",
      full_name: "",
    });
    if (insErr) {
      console.error("[claim-by-email] profile ensure", insErr);
      // devam et — trigger geçmiş olabilir
    }
  }

  // 1) RPC (migration 011)
  try {
    const rpc = await admin.rpc("link_listings_by_email", {
      p_user_id: userId,
      p_email: normalized,
    });
    if (!rpc.error && rpc.data != null) {
      const ids = Array.isArray(rpc.data)
        ? rpc.data.map((x) => String(x))
        : [String(rpc.data)];
      const clean = ids.filter(Boolean);
      if (clean.length > 0) {
        return { linked: clean.length, ids: clean };
      }
      // 0 linked — yine de fallback dene (RPC eski / boş)
    } else if (rpc.error) {
      // function missing is expected until 011 runs
      const msg = rpc.error.message || "";
      if (
        !msg.includes("Could not find") &&
        !msg.includes("function") &&
        !msg.includes("schema cache")
      ) {
        console.error("[claim-by-email] rpc", rpc.error);
      }
    }
  } catch (e) {
    console.error("[claim-by-email] rpc throw", e);
  }

  // 2) Exact match on already-normalized emails
  const exact = await admin
    .from("listings")
    .update({ owner_user_id: userId })
    .is("owner_user_id", null)
    .eq("email", normalized)
    .select("id");

  if (!exact.error && (exact.data?.length ?? 0) > 0) {
    const ids = exact.data!.map((r) => r.id as string);
    return { linked: ids.length, ids };
  }

  // 3) Scan unowned listings — case / whitespace mismatches
  const { data: candidates, error: selErr } = await admin
    .from("listings")
    .select("id, email, owner_user_id")
    .is("owner_user_id", null)
    .not("email", "is", null)
    .limit(2000);

  if (selErr) {
    console.error("[claim-by-email] select", selErr);
    throw selErr;
  }

  const ids = (candidates ?? [])
    .filter((row) => {
      if (row.owner_user_id) return false;
      return normalizeEmail(row.email as string) === normalized;
    })
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

export type AccountListingRow = {
  id: string;
  slug: string;
  ilce: string;
  mahalle: string | null;
  status: string;
  manage_token: string;
  kat_sayisi: string;
  daire_sayisi: string;
};

type ListingScanRow = AccountListingRow & {
  email: string | null;
  owner_user_id: string | null;
};

/**
 * Hesabım listesi: owner_user_id VEYA (henüz bağlanmamış) e-posta eşleşmesi.
 * Eşleşenleri anında owner'a yazar.
 */
export async function getListingsForAccount(
  userId: string,
  email: string | null | undefined
): Promise<AccountListingRow[]> {
  const admin = createServiceClient();
  const normalized = normalizeEmail(email);

  // Önce bağla
  try {
    const result = await linkUnownedListingsByEmail(userId, email);
    if (result.linked > 0) {
      console.info(
        "[getListingsForAccount] linked",
        result.linked,
        "for",
        normalized
      );
    }
  } catch (e) {
    console.error("[getListingsForAccount] link", e);
  }

  const selectCols =
    "id, slug, ilce, mahalle, status, manage_token, kat_sayisi, daire_sayisi, email, owner_user_id";

  const { data: owned, error: ownedErr } = await admin
    .from("listings")
    .select(selectCols)
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });

  if (ownedErr) {
    console.error("[getListingsForAccount] owned", ownedErr);
  }

  const byId = new Map<string, ListingScanRow>();
  for (const row of (owned ?? []) as ListingScanRow[]) {
    byId.set(row.id, row);
  }

  // Emniyet ağı: e-posta eşleşen ama hâlâ owner null
  if (normalized) {
    const { data: byEmail, error: emErr } = await admin
      .from("listings")
      .select(selectCols)
      .not("email", "is", null)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (emErr) {
      console.error("[getListingsForAccount] byEmail", emErr);
    } else {
      const toClaim: string[] = [];
      for (const row of (byEmail ?? []) as ListingScanRow[]) {
        if (normalizeEmail(row.email) !== normalized) continue;
        // Başka kullanıcıya aitse dokunma
        if (row.owner_user_id && row.owner_user_id !== userId) continue;
        if (!row.owner_user_id) {
          toClaim.push(row.id);
        }
        byId.set(row.id, row);
      }
      if (toClaim.length > 0) {
        const { error: claimErr } = await admin
          .from("listings")
          .update({ owner_user_id: userId })
          .in("id", toClaim)
          .is("owner_user_id", null);
        if (claimErr) {
          console.error("[getListingsForAccount] claim patch", claimErr);
        }
      }
    }
  }

  return Array.from(byId.values()).map((r) => ({
    id: r.id,
    slug: r.slug,
    ilce: r.ilce,
    mahalle: r.mahalle,
    status: r.status,
    manage_token: r.manage_token,
    kat_sayisi: r.kat_sayisi,
    daire_sayisi: r.daire_sayisi,
  }));
}
