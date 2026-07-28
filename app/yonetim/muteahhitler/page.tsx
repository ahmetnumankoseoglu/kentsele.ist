import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { ContractorAdminActions } from "@/components/yonetim/ContractorAdminActions";
import { ContractorDocuments } from "@/components/yonetim/ContractorDocuments";

export default async function AdminMuteahhitlerPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  type Row = {
    user_id: string;
    company_name: string;
    verification_status: string;
    full_name: string;
    phone: string | null;
    email?: string;
  };
  let rows: Row[] = [];
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
    rows = (data ?? []).map((r: Record<string, unknown>) => {
      const p = r.profiles as
        | { full_name?: string; phone?: string | null }
        | { full_name?: string; phone?: string | null }[]
        | null;
      const profile = Array.isArray(p) ? p[0] : p;
      return {
        user_id: String(r.user_id),
        company_name: String(r.company_name ?? ""),
        verification_status: String(r.verification_status ?? "pending"),
        full_name: profile?.full_name ?? "",
        phone: profile?.phone ?? null,
      };
    });
  } catch {
    err = "Müteahhit listesi okunamadı.";
  }

  return (
    <AdminShell>
      <h1 className="text-xl font-bold text-[#111321]">Müteahhit onayları</h1>
      <p className="mt-1 text-sm text-slate-600">
        Bekleyen ve onaylı müteahhitleri yönet.
      </p>
      {err && (
        <p className="mb-4 mt-3 rounded-[3px] bg-[#fff7e6] p-3 text-sm text-[#b45309]">
          {err}
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.user_id} className="card border border-black/5 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold">
                  {r.company_name || "Firma yok"}
                </p>
                <p className="text-xs text-[#6b7280]">
                  {r.full_name}
                  {r.phone ? ` · ${r.phone}` : ""}
                  {r.email ? ` · ${r.email}` : ""}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  r.verification_status === "approved"
                    ? "bg-[#eaf8ee] text-[#168f43]"
                    : r.verification_status === "rejected"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-800"
                }`}
              >
                {r.verification_status === "approved"
                  ? "Onaylı"
                  : r.verification_status === "rejected"
                    ? "Red"
                    : "Bekleyen"}
              </span>
            </div>
            <ContractorDocuments userId={r.user_id} />
            <ContractorAdminActions userId={r.user_id} />
          </li>
        ))}
        {rows.length === 0 && !err && (
          <p className="text-sm text-[#6b7280]">Kayıt yok.</p>
        )}
      </ul>
    </AdminShell>
  );
}
