import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AdminListingsTable } from "@/components/yonetim/AdminListingsTable";
import { AdminLogoutButton } from "@/components/yonetim/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { getAdminListings } from "@/lib/listings/queries";
import type { Listing } from "@/types/listing";

export default async function YonetimIlanlarPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/yonetim");
  }

  let listings: Listing[] = [];
  try {
    listings = await getAdminListings();
  } catch {
    listings = [];
  }

  const pending = listings.filter((l) => l.status === "incelemede").length;
  const agreementRequests = listings.filter(
    (l) => l.agreement_requested_at && l.status !== "anlasildi"
  ).length;

  return (
    <AppShell showBottomCta={false}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">İlan yönetimi</h1>
          <p className="mt-1 text-sm text-slate-600">
            {listings.length} ilan
            {pending > 0 ? ` · ${pending} incelemede` : ""}
            {agreementRequests > 0
              ? ` · ${agreementRequests} anlaşma talebi`
              : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AdminLogoutButton />
          <Link href="/yonetim/haberler" className="text-xs font-bold text-[#168f43]">
            Haberler
          </Link>
          <Link href="/yonetim/muteahhitler" className="text-xs font-bold text-[#168f43]">
            Müteahhitler
          </Link>
        </div>
      </div>

      {pending > 0 || agreementRequests > 0 ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Dikkat gereken ilanlar sarı ile vurgulanır
          {pending > 0 ? ` (${pending} onay bekliyor)` : ""}
          {agreementRequests > 0
            ? ` (${agreementRequests} anlaşma talebi)`
            : ""}
          .
        </div>
      ) : null}

      <AdminListingsTable listings={listings} />

      <p className="mt-6 text-center text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-600">
          Ana sayfaya dön
        </Link>
      </p>
    </AppShell>
  );
}
