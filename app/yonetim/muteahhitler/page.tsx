import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import {
  AdminSearchList,
  type AdminSearchItem,
} from "@/components/yonetim/AdminSearchList";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { loadAuthEmailMap } from "@/lib/yonetim/admin-users";

export default async function AdminMuteahhitlerPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  let items: AdminSearchItem[] = [];
  let err: string | null = null;

  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contractor_profiles")
      .select(
        "user_id, company_name, verification_status, profiles(full_name, phone)"
      )
      .order("created_at", { ascending: false });
    if (error) throw error;

    const emailMap = await loadAuthEmailMap();

    items = (data ?? []).map((r: Record<string, unknown>) => {
      const userId = String(r.user_id);
      const p = r.profiles as
        | { full_name?: string; phone?: string | null }
        | { full_name?: string; phone?: string | null }[]
        | null;
      const profile = Array.isArray(p) ? p[0] : p;
      const company = String(r.company_name ?? "").trim();
      const fullName = (profile?.full_name ?? "").trim();
      const title = company || fullName || "İsimsiz müteahhit";
      const status = String(r.verification_status ?? "pending");
      const badge =
        status === "approved"
          ? "Onaylı"
          : status === "rejected"
            ? "Red"
            : "Bekleyen";
      const email = emailMap.get(userId) ?? "";
      const phone = profile?.phone ?? "";

      return {
        id: userId,
        title,
        href: `/yonetim/muteahhitler/${userId}`,
        searchText: `${fullName} ${company} ${email} ${phone} ${badge}`,
        badge,
      };
    });
  } catch {
    err = "Müteahhit listesi okunamadı.";
  }

  return (
    <AdminShell>
      <h1 className="text-xl font-bold text-[#111321]">Müteahhitler</h1>
      <p className="mt-1 text-sm text-slate-600">
        Firma / unvan listesi — detay için tıkla
        {items.length > 0 ? ` · ${items.length}` : ""}
      </p>
      {err && (
        <p className="mb-4 mt-3 rounded-[3px] bg-[#fff7e6] p-3 text-sm text-[#b45309]">
          {err}
        </p>
      )}
      {!err && (
        <AdminSearchList
          items={items}
          placeholder="Müteahhit ara (firma, ad, e-posta)…"
          emptyLabel="Kayıt yok."
        />
      )}
    </AdminShell>
  );
}
