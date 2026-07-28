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
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf8ee] text-2xl text-[#2cb34f]">
        ✓
      </div>
      <h1 className="mt-4 text-[22px] font-bold text-[#111321]">
        İlanın alındı
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        İnceleme sonrası teyit için aranabilirsin. Yayınlanınca listede
        görünür.
      </p>

      {managePath && (
        <div className="card-elevated mt-6 p-4">
          <p className="text-sm font-bold text-[#111321]">
            Yönetim linkin — sakla
          </p>
          <p className="mt-2 break-all rounded-[3px] bg-[#f8f8f8] p-3 text-xs text-[#6b7280]">
            {managePath}
          </p>
          <button
            type="button"
            className="btn-primary mt-3 w-full"
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
            className="mt-3 flex h-11 items-center justify-center text-sm font-bold text-[#168f43]"
          >
            İlanımı yönet
          </Link>
        </div>
      )}

      <Link
        href="/"
        className="mt-6 block text-center text-sm font-bold text-[#6b7280]"
      >
        Ana sayfaya dön
      </Link>
    </AppShell>
  );
}
