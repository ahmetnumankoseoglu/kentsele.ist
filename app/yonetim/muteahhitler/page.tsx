import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { ContractorAdminActions } from "@/components/yonetim/ContractorAdminActions";

export default async function AdminMuteahhitlerPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  type Row = {
    user_id: string;
    company_name: string;
    verification_status: string;
    full_name: string;
    phone: string | null;
  };
  let rows: Row[] = [];
  let err: string | null = null;
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contractor_profiles")
      .select("user_id, company_name, verification_status, profiles(full_name, phone)")
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
    err = "Müteahhit listesi okunamadı. Migration 002 gerekli.";
  }

  return (
    <AppShell showBottomCta={false}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Müteahhit onayları</h1>
        <Link href="/yonetim/ilanlar" className="text-sm font-bold text-[#168f43]">
          ← Panel
        </Link>
      </div>
      {err && (
        <p className="mb-4 rounded-[3px] bg-[#fff7e6] p-3 text-sm text-[#b45309]">
          {err}
        </p>
      )}
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.user_id} className="card p-4">
            <p className="font-bold text-sm">
              {r.company_name || "Firma yok"}
            </p>
            <p className="text-xs text-[#6b7280]">
              {r.full_name} · {r.phone}
            </p>
            <p className="mt-1 text-xs font-semibold">
              Durum: {r.verification_status}
            </p>
            <ContractorAdminActions userId={r.user_id} />
          </li>
        ))}
        {rows.length === 0 && !err && (
          <p className="text-sm text-[#6b7280]">Kayıt yok.</p>
        )}
      </ul>
    </AppShell>
  );
}
