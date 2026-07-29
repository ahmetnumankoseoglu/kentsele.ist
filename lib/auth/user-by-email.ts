import { createServiceClient } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/listings/normalize-email";

/**
 * auth.users içinde e-posta var mı?
 * 1) RPC public.auth_user_id_by_email (migration 012) — tercih
 * 2) listUsers sayfalama — yedek
 */
export async function authUserExistsByEmail(
  email: string | null | undefined
): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  const admin = createServiceClient();

  try {
    const rpc = await admin.rpc("auth_user_id_by_email", {
      p_email: normalized,
    });
    if (!rpc.error && rpc.data) {
      return true;
    }
    // function missing → fallback
  } catch {
    /* fallback */
  }

  try {
    // Admin API: sayfa sayfa tara (küçük/orta kullanıcı tabanı)
    for (let page = 1; page <= 20; page++) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) {
        console.error("[authUserExistsByEmail] listUsers", error);
        break;
      }
      const users = data?.users ?? [];
      if (users.some((u) => normalizeEmail(u.email) === normalized)) {
        return true;
      }
      if (users.length < 200) break;
    }
  } catch (e) {
    console.error("[authUserExistsByEmail]", e);
  }

  return false;
}
