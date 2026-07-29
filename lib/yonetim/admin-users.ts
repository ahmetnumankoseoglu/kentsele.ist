import { createServiceClient } from "@/lib/supabase/admin";
import { formatPhoneDisplay } from "@/lib/phone";

export function displayPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  if (phone.startsWith("+") || phone.replace(/\D/g, "").startsWith("90")) {
    return formatPhoneDisplay(phone.startsWith("+") ? phone : `+${phone}`);
  }
  return phone;
}

export async function loadAuthEmailMap(): Promise<Map<string, string>> {
  const admin = createServiceClient();
  const emailMap = new Map<string, string>();
  try {
    let page = 1;
    const perPage = 200;
    for (;;) {
      const { data: authPage, error: authErr } =
        await admin.auth.admin.listUsers({ page, perPage });
      if (authErr) throw authErr;
      for (const u of authPage.users) {
        if (u.email) emailMap.set(u.id, u.email);
      }
      if (authPage.users.length < perPage) break;
      page += 1;
      if (page > 20) break;
    }
  } catch {
    /* optional */
  }
  return emailMap;
}
