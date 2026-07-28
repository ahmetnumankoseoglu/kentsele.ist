import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { getAdminNews } from "@/lib/news/queries";
import { NewsAdminForm } from "@/components/yonetim/NewsAdminForm";

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
    <AppShell showBottomCta={false}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Haber yönetimi</h1>
        <Link href="/yonetim/ilanlar" className="text-sm font-bold text-[#168f43]">
          ← İlanlar
        </Link>
      </div>
      {err && (
        <p className="mb-4 rounded-[3px] bg-[#fff7e6] p-3 text-sm text-[#b45309]">
          {err}
        </p>
      )}
      <NewsAdminForm />
      <ul className="mt-8 space-y-2">
        {items.map((n) => (
          <li key={n.id} className="card p-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-bold">{n.title}</span>
              <span className="shrink-0 text-xs text-[#6b7280]">{n.status}</span>
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">/{n.slug}</p>
            <NewsAdminForm edit={n} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
