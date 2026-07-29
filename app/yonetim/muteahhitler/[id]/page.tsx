import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { AdminDeleteUserButton } from "@/components/yonetim/AdminDeleteUserButton";
import { ContractorAdminActions } from "@/components/yonetim/ContractorAdminActions";
import { ContractorDocuments } from "@/components/yonetim/ContractorDocuments";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { displayPhone } from "@/lib/yonetim/admin-users";

export default async function AdminMuteahhitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");
  const { id } = await params;

  const admin = createServiceClient();
  const { data: contractor, error } = await admin
    .from("contractor_profiles")
    .select(
      "user_id, company_name, verification_status, rejection_reason, tax_number, city, about, created_at, profiles(full_name, phone)"
    )
    .eq("user_id", id)
    .maybeSingle();

  if (error || !contractor) notFound();

  const p = contractor.profiles as
    | { full_name?: string; phone?: string | null }
    | { full_name?: string; phone?: string | null }[]
    | null;
  const profile = Array.isArray(p) ? p[0] : p;
  const fullName = (profile?.full_name ?? "").trim() || "—";
  const company =
    String(contractor.company_name ?? "").trim() || "Firma yok";
  const status = String(contractor.verification_status ?? "pending");

  let email: string | null = null;
  try {
    const { data: userData } = await admin.auth.admin.getUserById(id);
    email = userData.user?.email ?? null;
  } catch {
    /* ignore */
  }

  const statusLabel =
    status === "approved"
      ? "Onaylı"
      : status === "rejected"
        ? "Reddedildi"
        : "Bekleyen";

  return (
    <AdminShell>
      <Link
        href="/yonetim/muteahhitler"
        className="text-xs font-bold text-[#168f43]"
      >
        ← Müteahhitler
      </Link>
      <h1 className="mt-2 text-xl font-bold text-[#111321]">{company}</h1>
      <p className="mt-1 text-sm text-slate-600">{fullName}</p>

      <div className="card mt-4 space-y-2 border border-black/5 bg-white p-4 text-sm">
        <Row label="Firma / unvan" value={company} />
        <Row label="Yetkili" value={fullName} />
        <Row label="E-posta" value={email ?? "—"} />
        <Row
          label="Telefon"
          value={displayPhone(profile?.phone ?? null)}
        />
        <Row label="Şehir" value={String(contractor.city ?? "—")} />
        <Row
          label="Vergi no"
          value={String(contractor.tax_number ?? "—") || "—"}
        />
        <Row label="Durum" value={statusLabel} />
        {contractor.rejection_reason ? (
          <Row
            label="Red gerekçesi"
            value={String(contractor.rejection_reason)}
          />
        ) : null}
        <Row
          label="Kayıt"
          value={new Date(
            contractor.created_at as string
          ).toLocaleString("tr-TR")}
        />
      </div>

      {contractor.about ? (
        <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
          {String(contractor.about)}
        </p>
      ) : null}

      <section className="mt-5">
        <h2 className="text-sm font-bold text-[#111321]">Belgeler</h2>
        <ContractorDocuments userId={id} />
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-bold text-[#111321]">Onay işlemleri</h2>
        <ContractorAdminActions userId={id} />
      </section>

      <AdminDeleteUserButton
        userId={id}
        label={company}
        redirectTo="/yonetim/muteahhitler"
      />
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#f0f0f0] py-2 last:border-0">
      <span className="shrink-0 text-[#6b7280]">{label}</span>
      <span className="break-all text-right font-semibold text-[#111321]">
        {value}
      </span>
    </div>
  );
}
