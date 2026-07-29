import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/yonetim/AdminShell";
import { AdminDeleteUserButton } from "@/components/yonetim/AdminDeleteUserButton";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { displayPhone } from "@/lib/yonetim/admin-users";

export default async function AdminMalikDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/yonetim");
  const { id } = await params;

  const admin = createServiceClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .eq("id", id)
    .eq("role", "malik")
    .maybeSingle();

  if (error || !profile) notFound();

  let email: string | null = null;
  try {
    const { data: userData } = await admin.auth.admin.getUserById(id);
    email = userData.user?.email ?? null;
  } catch {
    /* ignore */
  }

  const { data: listings } = await admin
    .from("listings")
    .select("id, slug, ilce, mahalle, status, created_at")
    .eq("owner_user_id", id)
    .order("created_at", { ascending: false });

  const name = (profile.full_name as string)?.trim() || "İsimsiz malik";

  return (
    <AdminShell>
      <Link
        href="/yonetim/malikler"
        className="text-xs font-bold text-[#168f43]"
      >
        ← Malikler
      </Link>
      <h1 className="mt-2 text-xl font-bold text-[#111321]">{name}</h1>
      <p className="mt-1 text-sm text-slate-600">Malik detayı</p>

      <div className="card mt-4 space-y-2 border border-black/5 bg-white p-4 text-sm">
        <Row label="Ad soyad" value={name} />
        <Row label="E-posta" value={email ?? "—"} />
        <Row label="Telefon" value={displayPhone(profile.phone as string | null)} />
        <Row
          label="Kayıt"
          value={new Date(profile.created_at as string).toLocaleString("tr-TR")}
        />
        <Row label="Bağlı ilan" value={String(listings?.length ?? 0)} />
      </div>

      {(listings?.length ?? 0) > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold text-[#111321]">İlanları</h2>
          <ul className="mt-2 space-y-2">
            {(listings ?? []).map((l) => (
              <li key={l.id as string}>
                <Link
                  href={`/yonetim/ilanlar/${l.id}`}
                  className="card flex items-center justify-between gap-2 border border-black/5 bg-white px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold text-[#111321]">
                    {l.ilce as string}
                    {l.mahalle ? ` · ${l.mahalle}` : ""}
                  </span>
                  <span className="text-xs font-bold text-[#6b7280]">
                    {String(l.status)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdminDeleteUserButton
        userId={id}
        label={name}
        redirectTo="/yonetim/malikler"
      />
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#f0f0f0] py-2 last:border-0">
      <span className="text-[#6b7280]">{label}</span>
      <span className="break-all text-right font-semibold text-[#111321]">
        {value}
      </span>
    </div>
  );
}
