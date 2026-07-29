import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { formatPhoneDisplay } from "@/lib/phone";

type MalikRow = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  listing_count: number;
};

function displayPhone(phone: string | null): string {
  if (!phone) return "—";
  if (phone.startsWith("+") || phone.replace(/\D/g, "").startsWith("90")) {
    return formatPhoneDisplay(phone.startsWith("+") ? phone : `+${phone}`);
  }
  return phone;
}

export default async function AdminMaliklerPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  let rows: MalikRow[] = [];
  let err: string | null = null;

  try {
    const admin = createServiceClient();
    const { data: profiles, error } = await admin
      .from("profiles")
      .select("id, full_name, phone, created_at")
      .eq("role", "malik")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const ids = (profiles ?? []).map((p) => p.id as string);

    // Listing counts by owner
    const countMap = new Map<string, number>();
    if (ids.length > 0) {
      const { data: listings } = await admin
        .from("listings")
        .select("owner_user_id")
        .in("owner_user_id", ids);
      for (const l of listings ?? []) {
        const oid = l.owner_user_id as string | null;
        if (!oid) continue;
        countMap.set(oid, (countMap.get(oid) ?? 0) + 1);
      }
    }

    // Auth emails (service role)
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
      /* email opsiyonel */
    }

    rows = (profiles ?? []).map((p) => ({
      id: p.id as string,
      full_name: (p.full_name as string) || "İsimsiz",
      phone: (p.phone as string | null) ?? null,
      email: emailMap.get(p.id as string) ?? null,
      created_at: p.created_at as string,
      listing_count: countMap.get(p.id as string) ?? 0,
    }));
  } catch {
    err = "Malik listesi okunamadı.";
  }

  return (
    <AdminShell>
      <h1 className="text-xl font-bold text-[#111321]">Malikler</h1>
      <p className="mt-1 text-sm text-slate-600">
        Kayıtlı malik hesapları ve bağlı ilan sayıları
        {rows.length > 0 ? ` · ${rows.length} malik` : ""}
      </p>
      {err && (
        <p className="mb-4 mt-3 rounded-[3px] bg-[#fff7e6] p-3 text-sm text-[#b45309]">
          {err}
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li
            key={r.id}
            className="card border border-black/5 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111321]">{r.full_name}</p>
                <p className="mt-0.5 break-all text-xs text-[#6b7280]">
                  {r.email ?? "E-posta yok"}
                  {" · "}
                  {displayPhone(r.phone)}
                </p>
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  Kayıt:{" "}
                  {new Date(r.created_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  r.listing_count > 0
                    ? "bg-[#eaf8ee] text-[#168f43]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {r.listing_count} ilan
              </span>
            </div>
            {r.listing_count > 0 ? (
              <Link
                href="/yonetim/ilanlar"
                className="mt-3 inline-block text-xs font-bold text-[#168f43]"
              >
                İlanlar paneline git →
              </Link>
            ) : null}
          </li>
        ))}
        {rows.length === 0 && !err && (
          <p className="text-sm text-[#6b7280]">Henüz malik kaydı yok.</p>
        )}
      </ul>
    </AdminShell>
  );
}
