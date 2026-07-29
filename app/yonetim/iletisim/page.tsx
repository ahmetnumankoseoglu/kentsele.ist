import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  status: "yeni" | "okundu" | "arsiv";
  created_at: string;
  admin_reply?: string | null;
};

export default async function AdminIletisimPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  let items: ContactRow[] = [];
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contact_messages")
      .select(
        "id, name, email, phone, subject, body, status, created_at, admin_reply"
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    items = (data ?? []) as ContactRow[];
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

      <ul className="mt-4 space-y-2">
        {items.map((m) => {
          const preview =
            m.body.length > 90 ? `${m.body.slice(0, 90)}…` : m.body;
          return (
            <li key={m.id}>
              <Link
                href={`/yonetim/iletisim/${m.id}`}
                className={`card block border bg-white p-3 transition hover:border-[#2cb34f]/40 ${
                  m.status === "yeni" ? "border-amber-200" : "border-black/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#111321]">
                      {m.subject}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#6b7280]">
                      {m.name} · {m.email}
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
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6b7280]">
                  {preview}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#9ca3af]">
                  <span>
                    {new Date(m.created_at).toLocaleString("tr-TR")}
                  </span>
                  <span className="font-bold text-[#168f43]">Detay →</span>
                </div>
              </Link>
            </li>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-[#6b7280]">Henüz mesaj yok.</p>
        )}
      </ul>
    </AdminShell>
  );
}
