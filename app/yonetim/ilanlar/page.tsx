import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { AdminListingsTable } from "@/components/yonetim/AdminListingsTable";
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
    <AdminShell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">İlan yönetimi</h1>
        <p className="mt-1 text-sm text-slate-600">
          {listings.length} ilan
          {pending > 0 ? ` · ${pending} incelemede` : ""}
          {agreementRequests > 0
            ? ` · ${agreementRequests} anlaşma talebi`
            : ""}
        </p>
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
    </AdminShell>
  );
}
