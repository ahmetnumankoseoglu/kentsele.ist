"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** /canli sayfasını periyodik yenile — SSR istatistik taze kalsın */
export function LivePageAutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = window.setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [router, intervalMs]);
  return null;
}
