import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  getContractorProfile,
  getCurrentProfile,
  getSessionUser,
} from "@/lib/auth/session";
import { DocumentUploadForm } from "@/components/muteahhit/DocumentUploadForm";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function MuteahhitPage() {
  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/muteahhit");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/giris");
  if (profile.role !== "muteahhit") {
    return (
      <AppShell showBottomCta={false}>
        <div className="card p-6 text-center">
          <p className="text-sm font-bold">Bu sayfa müteahhit hesapları içindir.</p>
          <Link href="/kayit" className="btn-primary mt-4 inline-flex">
            Müteahhit olarak kayıt ol
          </Link>
        </div>
      </AppShell>
    );
  }

  const contractor = await getContractorProfile(profile.id);
  let docs: { id: string; doc_type: string; file_name: string }[] = [];
  try {
    const admin = createServiceClient();
    const { data } = await admin
      .from("contractor_documents")
      .select("id, doc_type, file_name")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });
    docs = data ?? [];
  } catch {
    docs = [];
  }

  const status = contractor?.verification_status ?? "pending";

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">Müteahhit paneli</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        Belgelerini yükle; onay sonrası malik numaralarını görebilirsin.
      </p>

      <div className="card-elevated mt-5 p-5">
        <p className="text-sm font-bold">
          Durum:{" "}
          <span
            className={
              status === "approved"
                ? "text-[#168f43]"
                : status === "rejected"
                  ? "text-[#ee401d]"
                  : "text-[#b45309]"
            }
          >
            {status === "approved"
              ? "Onaylı — iletişim açık"
              : status === "rejected"
                ? "Reddedildi"
                : "İncelemede"}
          </span>
        </p>
        {contractor?.rejection_reason && (
          <p className="mt-2 text-xs text-[#ee401d]">
            {contractor.rejection_reason}
          </p>
        )}
        <p className="mt-2 text-sm text-[#6b7280]">
          {contractor?.company_name || "Firma adı"}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="section-title">Belge yükle</h2>
        <DocumentUploadForm />
      </section>

      <section className="mt-8">
        <h2 className="section-title">Yüklenen belgeler</h2>
        {docs.length === 0 ? (
          <p className="text-sm text-[#6b7280]">Henüz belge yok.</p>
        ) : (
          <ul className="space-y-2">
            {docs.map((d) => (
              <li key={d.id} className="card px-3 py-2 text-sm">
                <span className="font-semibold">{d.doc_type}</span>
                <span className="ml-2 text-[#6b7280]">{d.file_name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/ilanlar" className="btn-primary mt-8 w-full">
        İlanlara git
      </Link>
    </AppShell>
  );
}
