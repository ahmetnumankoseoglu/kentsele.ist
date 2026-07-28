"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { safeInternalPath } from "@/lib/auth/safe-next";

export default function GirisPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = safeInternalPath(sp.get("next"), "/hesabim");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { createBrowserSupabase } = await import("@/lib/supabase/browser");
      const supabase = createBrowserSupabase();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError("E-posta veya şifre hatalı.");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Giriş yapılamadı. Lütfen tekrar dene.");
      setLoading(false);
    }
  }

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">Giriş yap</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        İlan düzenlemek, müteahhit paneli veya yorum için hesabına gir.
      </p>

      <form onSubmit={onSubmit} className="card-elevated mt-6 space-y-3 p-5">
        <input
          className="input-field"
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <Link
            href="/sifremi-unuttum"
            className="text-xs font-semibold text-[#168f43] hover:underline"
          >
            Şifremi unuttum
          </Link>
        </div>
        {error && <p className="text-sm text-[#ee401d]">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Giriş…" : "Giriş yap"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[#6b7280]">
        Hesabın yok mu?{" "}
        <Link
          href={`/kayit${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-bold text-[#168f43]"
        >
          Kayıt ol
        </Link>
      </p>
    </AppShell>
  );
}
