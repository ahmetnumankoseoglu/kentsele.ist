"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/yonetim/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        let msg = "Giriş yapılamadı. Tekrar dene.";
        if (res.status === 401) {
          msg = "Şifre hatalı.";
        } else {
          try {
            const data = (await res.json()) as { message?: string };
            if (data?.message) msg = data.message;
          } catch {
            /* ignore */
          }
        }
        setError(msg);
        return;
      }
      router.replace("/yonetim/ilanlar");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Yönetim girişi</h1>
        <p className="mt-1 text-sm text-slate-600">
          İlan moderasyonu, yeni ilan ve müteahhit onayı için giriş yapın.
        </p>
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Şifre
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !password}
        className="h-12 w-full rounded-xl bg-[#2cb34f] hover:bg-[#1ca03e] text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
