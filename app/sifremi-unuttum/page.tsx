"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.message ||
            "E-posta gönderilemedi. Adresi kontrol et veya daha sonra dene."
        );
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">Şifremi unuttum</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        Kayıtlı e-posta adresine kentsele.ist üzerinden şifre sıfırlama
        bağlantısı göndeririz.
      </p>

      {sent ? (
        <div className="card-elevated mt-6 space-y-3 p-5">
          <p className="text-sm font-bold text-[#168f43]">E-posta gönderildi</p>
          <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
            <strong>{email}</strong> adresi kayıtlıysa bir bağlantı gönderdik.
            Gelen kutusunu (ve spam klasörünü) kontrol et; bağlantıya tıklayınca
            yeni şifreni belirleyebilirsin.
          </p>
          <Link href="/giris" className="btn-primary mt-2 w-full">
            Giriş sayfasına dön
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card-elevated mt-6 space-y-3 p-5">
          <input
            className="input-field"
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {error && <p className="text-sm text-[#ee401d]">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="btn-primary w-full"
          >
            {loading ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-[#6b7280]">
        <Link href="/giris" className="font-bold text-[#168f43]">
          ← Girişe dön
        </Link>
      </p>
    </AppShell>
  );
}
