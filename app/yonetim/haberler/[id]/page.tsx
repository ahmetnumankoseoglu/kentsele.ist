import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { NewsAdminForm } from "@/components/yonetim/NewsAdminForm";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import type { NewsArticle } from "@/types/news";

export default async function AdminHaberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");
  const { id } = await params;

  const admin = createServiceClient();
  const { data, error } = await admin
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();
  const article = data as NewsArticle;

  return (
    <AdminShell>
      <Link
        href="/yonetim/haberler"
        className="text-xs font-bold text-[#168f43]"
      >
        ← Haberler
      </Link>
      <h1 className="mt-2 text-xl font-bold text-[#111321]">Haberi düzenle</h1>
      <p className="mt-1 text-xs text-[#6b7280]">/{article.slug}</p>
      {article.status === "published" ? (
        <Link
          href={`/haberler/${article.slug}`}
          className="mt-2 inline-block text-xs font-bold text-[#168f43]"
          target="_blank"
        >
          Sitede gör ↗
        </Link>
      ) : null}
      <div className="mt-4">
        <NewsAdminForm edit={article} />
      </div>
    </AdminShell>
  );
}
