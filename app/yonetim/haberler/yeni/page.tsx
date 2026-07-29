import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { NewsAdminForm } from "@/components/yonetim/NewsAdminForm";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export default async function AdminHaberYeniPage() {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");

  return (
    <AdminShell>
      <Link
        href="/yonetim/haberler"
        className="text-xs font-bold text-[#168f43]"
      >
        ← Haberler
      </Link>
      <h1 className="mt-2 text-xl font-bold text-[#111321]">Yeni haber</h1>
      <div className="mt-4">
        <NewsAdminForm />
      </div>
    </AdminShell>
  );
}
