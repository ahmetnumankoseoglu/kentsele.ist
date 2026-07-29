import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import {
  AdminSearchList,
  type AdminSearchItem,
} from "@/components/yonetim/AdminSearchList";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { loadAuthEmailMap } from "@/lib/yonetim/admin-users";

export default async function AdminMaliklerPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  let items: AdminSearchItem[] = [];
  let err: string | null = null;

  try {
    const admin = createServiceClient();
    const { data: profiles, error } = await admin
      .from("profiles")
      .select("id, full_name, phone")
      .eq("role", "malik")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const emailMap = await loadAuthEmailMap();

    items = (profiles ?? []).map((p) => {
      const id = p.id as string;
      const name = ((p.full_name as string) || "").trim() || "İsimsiz malik";
      const email = emailMap.get(id) ?? "";
      const phone = (p.phone as string | null) ?? "";
      return {
        id,
        title: name,
        href: `/yonetim/malikler/${id}`,
        searchText: `${email} ${phone}`,
      };
    });
  } catch {
    err = "Malik listesi okunamadı.";
  }

  return (
    <AdminShell>
      <h1 className="text-xl font-bold text-[#111321]">Malikler</h1>
      <p className="mt-1 text-sm text-slate-600">
        Kayıtlı malik hesapları
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
          placeholder="Malik ara (ad, e-posta, telefon)…"
          emptyLabel="Henüz malik kaydı yok."
        />
      )}
    </AdminShell>
  );
}
