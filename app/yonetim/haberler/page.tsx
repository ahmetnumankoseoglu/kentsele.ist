import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { getAdminNews } from "@/lib/news/queries";

const STATUS_TR: Record<string, string> = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
};

export default async function AdminHaberlerPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  let items: Awaited<ReturnType<typeof getAdminNews>> = [];
  let err: string | null = null;
  try {
    items = await getAdminNews();
  } catch {
    err =
      "Haber tablosu okunamadı. Supabase’te 002_auth_news_contractors.sql çalıştırın.";
  }

  return (
    <AdminShell>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#111321]">Haber yönetimi</h1>
          <p className="mt-1 text-sm text-slate-600">
            {items.length} haber · detaydan düzenle / sil
          </p>
        </div>
        <Link
          href="/yonetim/haberler/yeni"
          className="shrink-0 rounded-[3px] bg-[#2cb34f] px-3 py-2 text-xs font-bold text-white"
        >
          + Yeni
        </Link>
      </div>

      {err ? (
        <p className="mb-4 rounded-[3px] bg-[#fff7e6] p-3 text-sm text-[#b45309]">
          {err}
        </p>
      ) : null}

      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id}>
            <Link
              href={`/yonetim/haberler/${n.id}`}
              className="card flex items-start gap-3 border border-black/5 bg-white p-3 transition hover:border-[#2cb34f]/40"
            >
              {n.cover_image_url || n.banner_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.cover_image_url || n.banner_image_url || ""}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-[#f0f0f0] text-xs text-[#9ca3af]">
                  —
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-bold text-[#111321]">
                    {n.title}
                  </p>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                    {STATUS_TR[n.status] ?? n.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[#6b7280]">
                  /{n.slug}
                </p>
                <p className="mt-1 text-[11px] font-bold text-[#168f43]">
                  Düzenle →
                </p>
              </div>
            </Link>
          </li>
        ))}
        {items.length === 0 && !err ? (
          <p className="text-sm text-[#6b7280]">
            Henüz haber yok.{" "}
            <Link href="/yonetim/haberler/yeni" className="font-bold text-[#168f43]">
              İlk haberi ekle
            </Link>
          </p>
        ) : null}
      </ul>
    </AdminShell>
  );
}
