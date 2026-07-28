import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { ContactMessageActions } from "@/components/yonetim/ContactMessageActions";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  status: "yeni" | "okundu" | "arsiv";
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
};

export default async function AdminIletisimPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  let items: ContactMessage[] = [];
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    items = (data ?? []) as ContactMessage[];
  } catch {
    items = [];
  }

  const yeni = items.filter((m) => m.status === "yeni").length;

  return (
    <AdminShell>
      <h1 className="text-xl font-bold text-[#111321]">İletişim mesajları</h1>
      <p className="mt-1 text-sm text-slate-600">
        Site formundan gelen mesajlar
        {yeni > 0 ? ` · ${yeni} yeni` : ""}
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((m) => (
          <li
            key={m.id}
            className={`card border bg-white p-4 ${
              m.status === "yeni" ? "border-amber-200" : "border-black/5"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#111321]">{m.subject}</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">
                  {m.name} · {m.email}
                  {m.phone ? ` · ${m.phone}` : ""}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  m.status === "yeni"
                    ? "bg-amber-50 text-amber-800"
                    : m.status === "okundu"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-[#f0f0f0] text-[#9ca3af]"
                }`}
              >
                {m.status === "yeni"
                  ? "Yeni"
                  : m.status === "okundu"
                    ? "Okundu"
                    : "Arşiv"}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#374151]">
              {m.body}
            </p>
            {m.admin_reply ? (
              <div className="mt-3 rounded-[3px] border border-[#eaf8ee] bg-[#f8fdf9] p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#168f43]">
                  Gönderilen cevap
                  {m.replied_at
                    ? ` · ${new Date(m.replied_at).toLocaleString("tr-TR")}`
                    : ""}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[#374151]">
                  {m.admin_reply}
                </p>
              </div>
            ) : null}
            <p className="mt-2 text-[11px] text-[#9ca3af]">
              {new Date(m.created_at).toLocaleString("tr-TR")}
            </p>
            <ContactMessageActions
              id={m.id}
              status={m.status}
              hasReply={Boolean(m.admin_reply)}
            />
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-[#6b7280]">Henüz mesaj yok.</p>
        )}
      </ul>
    </AdminShell>
  );
}
