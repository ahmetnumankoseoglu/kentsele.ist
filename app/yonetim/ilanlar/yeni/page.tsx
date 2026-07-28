import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { AdminCreateListingForm } from "@/components/yonetim/AdminCreateListingForm";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export default async function YonetimIlanYeniPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/yonetim");
  }

  return (
    <AdminShell>
      <Link
        href="/yonetim/ilanlar"
        className="text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        ← İlan listesi
      </Link>
      <h1 className="mt-1 text-xl font-semibold">Yeni ilan</h1>
      <p className="mt-1 text-sm text-slate-600">
        Admin olarak ilan oluştur. Durumu doğrudan “Teklife açık” seçebilirsin.
      </p>
      <div className="mt-4">
        <AdminCreateListingForm />
      </div>
    </AdminShell>
  );
}
