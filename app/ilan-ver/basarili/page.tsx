"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function BasariliPage() {
  const [managePath, setManagePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("kentsele_manage");
    if (raw) {
      const parsed = JSON.parse(raw) as { managePath: string };
      setManagePath(parsed.managePath);
    }
  }, []);

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-xl font-semibold">İlanın alındı</h1>
      <p className="mt-2 text-sm text-slate-600">
        İnceleme sonrası teyit için aranabilirsin. Yayınlanınca listede görünür.
      </p>
      {managePath && (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-4">
          <p className="text-sm font-medium">Yönetim linkin (sakla)</p>
          <p className="mt-2 break-all text-xs text-slate-600">{managePath}</p>
          <button
            type="button"
            className="mt-3 h-11 w-full rounded-xl bg-slate-900 text-sm font-medium text-white"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${window.location.origin}${managePath}`
              );
              setCopied(true);
            }}
          >
            {copied ? "Kopyalandı" : "Linki kopyala"}
          </button>
          <Link
            href={managePath}
            className="mt-2 flex h-11 items-center justify-center text-sm font-medium text-[#0B6E4F]"
          >
            İlanımı yönet
          </Link>
        </div>
      )}
      <Link href="/" className="mt-6 block text-center text-sm text-slate-500">
        Ana sayfaya dön
      </Link>
    </AppShell>
  );
}
