"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export type AdminSearchItem = {
  id: string;
  title: string;
  href: string;
  /** Arama için ek metin (e-posta, telefon, firma vb.) — listede gösterilmez */
  searchText?: string;
  badge?: string;
};

export function AdminSearchList({
  items,
  placeholder = "Ara…",
  emptyLabel = "Kayıt yok.",
}: {
  items: AdminSearchItem[];
  placeholder?: string;
  emptyLabel?: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLocaleLowerCase("tr-TR");
    if (!s) return items;
    return items.filter((it) => {
      const hay = `${it.title} ${it.searchText ?? ""} ${it.badge ?? ""}`
        .toLocaleLowerCase("tr-TR");
      return hay.includes(s);
    });
  }, [items, q]);

  return (
    <div className="mt-4">
      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="input-field w-full !pl-10"
          autoComplete="off"
        />
      </label>

      <ul className="mt-3 space-y-2">
        {filtered.map((it) => (
          <li key={it.id}>
            <Link
              href={it.href}
              className="card flex items-center justify-between gap-3 border border-black/5 bg-white px-4 py-3.5 transition hover:border-[#2cb34f]/40 hover:shadow-sm"
            >
              <span className="min-w-0 truncate text-sm font-bold text-[#111321]">
                {it.title}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {it.badge ? (
                  <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[11px] font-bold text-[#6b7280]">
                    {it.badge}
                  </span>
                ) : null}
                <span className="text-sm font-bold text-[#168f43]" aria-hidden>
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-[#6b7280]">
            {q.trim() ? "Sonuç bulunamadı." : emptyLabel}
          </p>
        )}
      </ul>
    </div>
  );
}
