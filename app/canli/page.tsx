import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LiveStatsPanel, formatLiveUpdatedAt } from "@/components/canli/LiveStatsPanel";
import { getLiveStats } from "@/lib/stats/live";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import { LivePageAutoRefresh } from "@/components/canli/LivePageAutoRefresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = istanbulGeoMetadata({
  title: "Canlı Yayın | Site İstatistikleri",
  description:
    "Anlık özet: müteahhit, malik, ilan, anlaşma ve teklife açık kayıtlar. 30 sn’de yenilenir.",
  path: "/canli",
  keywords: ["canlı yayın", "istatistik", "müteahhit", "ilan"],
});

export default async function CanliPage() {
  let stats;
  try {
    stats = await getLiveStats();
  } catch {
    stats = null;
  }

  return (
    <AppShell showBottomCta={false}>
      <LivePageAutoRefresh />
      <Breadcrumbs
        items={[
          { name: "Ana sayfa", href: "/" },
          { name: "Canlı yayın" },
        ]}
      />

      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2cb34f] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2cb34f]" />
        </span>
        <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
          Canlı yayın
        </p>
      </div>

      <h1 className="text-2xl font-bold text-[#111321]">
        kentsele.ist canlı özet
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        Müteahhit, malik ve ilan hareketleri anlık yansır. Müteahhit sayısı 17
        baz + veritabanındaki üye firmalar ile gösterilir.
      </p>

      {stats ? (
        <div className="mt-6">
          <LiveStatsPanel stats={stats} />
          <p className="mt-4 text-center text-xs text-[#9ca3af]">
            Son güncelleme {formatLiveUpdatedAt(stats.updatedAt)} · sayfa ~30 sn’de
            yenilenir
          </p>
        </div>
      ) : (
        <div className="card mt-6 p-6 text-center text-sm text-[#be3317]">
          İstatistikler şu an yüklenemedi. Biraz sonra tekrar dene.
        </div>
      )}

      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        <Link href="/ilanlar" className="btn-primary w-full text-center">
          İlanları gör
        </Link>
        <Link href="/ilan-ver" className="btn-secondary w-full text-center">
          Ücretsiz ilan ver
        </Link>
      </div>
    </AppShell>
  );
}
