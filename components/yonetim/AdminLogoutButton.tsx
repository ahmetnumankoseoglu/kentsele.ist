"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/yonetim/logout", { method: "POST" });
      router.replace("/yonetim");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={
        className ??
        "text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline disabled:opacity-60"
      }
    >
      {loading ? "Çıkış…" : "Çıkış"}
    </button>
  );
}
