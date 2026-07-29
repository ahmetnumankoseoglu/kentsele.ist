import { NextResponse } from "next/server";
import { EMPTY_LIVE_STATS, getLiveStats } from "@/lib/stats/live";

export const dynamic = "force-dynamic";

/** Public canlı yayın istatistikleri — kısa önbellek */
export async function GET() {
  try {
    const stats = await getLiveStats();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (e) {
    console.error("[api/canli]", e);
    return NextResponse.json(
      { ...EMPTY_LIVE_STATS, updatedAt: new Date().toISOString(), error: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  }
}
