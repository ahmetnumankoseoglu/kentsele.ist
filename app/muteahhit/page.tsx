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
import { LogoutButton } from "@/components/auth/LogoutButton";

const DOC_LABELS: Record<string, string> = {
  vergi_levhasi: "Vergi levhası",
  ticaret_sicil: "Ticaret sicil",
  imza_sirkuleri: "İmza sirküleri",
  yetki_belgesi: "Yetki belgesi",
  diger: "Diğer",
};

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
          <Link href="/kayit?next=/muteahhit" className="btn-primary mt-4 w-full">
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111321]">Müteahhit paneli</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Belgelerini yükle; onay sonrası malik numaralarını görebilirsin.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="card-elevated mt-5 p-5">
        <p className="text-sm font-bold text-[#111321]">
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
        {contractor?.rejection_reason ? (
          <p className="mt-2 text-xs text-[#ee401d]">
            {contractor.rejection_reason}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-[#6b7280]">
          {contractor?.company_name || profile.full_name || "Firma adı"}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="section-title">Belge yükle</h2>
        <DocumentUploadForm />
      </section>

      <section className="mt-8">
        <h2 className="section-title">Yüklenen belgeler</h2>
        {docs.length === 0 ? (
          <div className="card p-4 text-sm text-[#6b7280]">
            Henüz belge yok. Yukarıdan vergi levhası veya diğer belgeleri
            yükleyebilirsin.
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-[3px] border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-relaxed text-amber-950">
              Yüklenen belgeler inceleme için admin paneline düştü. Onay
              sürecini burada takip edebilirsin.
            </div>
            <ul className="space-y-2">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="card flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#111321]">
                      {DOC_LABELS[d.doc_type] ?? d.doc_type}
                    </p>
                    <p className="truncate text-xs text-[#6b7280]">
                      {d.file_name}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                    İncelemede
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <Link href="/ilanlar" className="btn-primary mt-8 w-full">
        İlanlara git
      </Link>
    </AppShell>
  );
}
