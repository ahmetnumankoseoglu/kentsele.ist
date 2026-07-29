import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { ContactMessageActions } from "@/components/yonetim/ContactMessageActions";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminIletisimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");
  const { id } = await params;

  const admin = createServiceClient();
  const { data: m, error } = await admin
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !m) notFound();

  // İlk açılışta yeni → okundu (best-effort)
  if (m.status === "yeni") {
    await admin
      .from("contact_messages")
      .update({ status: "okundu" })
      .eq("id", id);
    m.status = "okundu";
  }

  const statusLabel =
    m.status === "yeni"
      ? "Yeni"
      : m.status === "okundu"
        ? "Okundu"
        : "Arşiv";

  return (
    <AdminShell>
      <Link
        href="/yonetim/iletisim"
        className="text-xs font-bold text-[#168f43]"
      >
        ← Mesajlar
      </Link>
      <h1 className="mt-2 text-xl font-bold text-[#111321]">{m.subject}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {statusLabel} ·{" "}
        {new Date(m.created_at as string).toLocaleString("tr-TR")}
      </p>

      <div className="card mt-4 space-y-2 border border-black/5 bg-white p-4 text-sm">
        <Row label="Ad" value={String(m.name)} />
        <Row label="E-posta" value={String(m.email)} />
        <Row label="Telefon" value={String(m.phone ?? "—")} />
        <Row label="Konu" value={String(m.subject)} />
      </div>

      <section className="mt-4">
        <h2 className="text-sm font-bold text-[#111321]">Mesaj</h2>
        <div className="card mt-2 border border-black/5 bg-white p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#374151]">
            {String(m.body)}
          </p>
        </div>
      </section>

      {m.admin_reply ? (
        <section className="mt-4">
          <h2 className="text-sm font-bold text-[#111321]">Gönderilen cevap</h2>
          <div className="mt-2 rounded-[3px] border border-[#eaf8ee] bg-[#f8fdf9] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#168f43]">
              {m.replied_at
                ? new Date(m.replied_at as string).toLocaleString("tr-TR")
                : "Cevaplandı"}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-[#374151]">
              {String(m.admin_reply)}
            </p>
          </div>
        </section>
      ) : null}

      <section className="mt-5">
        <h2 className="text-sm font-bold text-[#111321]">İşlemler</h2>
        <ContactMessageActions
          id={m.id as string}
          status={String(m.status)}
          hasReply={Boolean(m.admin_reply)}
        />
      </section>
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
