"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { safeInternalPath } from "@/lib/auth/safe-next";
import { formatPhoneInput, normalizeTrPhone } from "@/lib/phone";

export default function KayitPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = safeInternalPath(sp.get("next"), "/hesabim");
  // /muteahhit paneline giden kayıtta varsayılan rol müteahhit
  const defaultRole =
    next.includes("muteahhit") || sp.get("role") === "muteahhit"
      ? "muteahhit"
      : "malik";
  const [role, setRole] = useState<"malik" | "muteahhit">(defaultRole);
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let phoneNormalized: string | undefined;
    if (phone.trim()) {
      const n = normalizeTrPhone(phone);
      if (!n) {
        setError("Geçerli bir cep telefonu girin (05xx…)");
        setLoading(false);
        return;
      }
      phoneNormalized = n;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone: phoneNormalized,
          role,
          company_name: company,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "company_required"
          ? "Firma adı gerekli"
          : data.error || "Kayıt başarısız");
        setLoading(false);
        return;
      }
      const supabase = createBrowserSupabase();
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginErr) {
        router.push("/giris");
        return;
      }
      // Signup zaten e-posta ile ilan bağlar; oturum sonrası bir kez daha dene
      try {
        await fetch("/api/ilanlar/claim-by-email", {
          method: "POST",
          credentials: "same-origin",
        });
      } catch {
        /* ignore */
      }
      router.push(role === "muteahhit" ? "/muteahhit" : next);
      router.refresh();
    } catch {
      setError("Kayıt hatası");
      setLoading(false);
    }
  }

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">Kayıt ol</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        İlan vermek ücretsiz ve kayıtsız. Düzenlemek veya müteahhit olarak numara
        görmek için hesap gerekir.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(
          [
            { id: "malik" as const, label: "Malik / ilan sahibi" },
            { id: "muteahhit" as const, label: "Müteahhit" },
          ] as const
        ).map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            data-selected={role === r.id}
            className="option-chip px-3 py-3 text-sm font-semibold"
          >
            {r.label}
          </button>
        ))}
      </div>

      {role === "muteahhit" && (
        <p className="mt-3 rounded-[3px] bg-[#fff7e6] px-3 py-2 text-xs text-[#b45309]">
          Müteahhitler ilan veremez; yalnızca ilanları inceler. Belge + onay
          sonrası malik numarası görünür.
        </p>
      )}
      {role === "malik" && (
        <p className="mt-3 rounded-[3px] bg-[#eaf8ee] px-3 py-2 text-xs text-[#168f43]">
          İlan vermek için kayıt zorunlu değildir. Düzenlemek için hesap
          gerekir.
        </p>
      )}

      <form onSubmit={onSubmit} className="card-elevated mt-5 space-y-3 p-5">
        <input
          className="input-field"
          placeholder="Ad soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        {role === "muteahhit" && (
          <input
            className="input-field"
            placeholder="Firma / unvan"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        )}
        <input
          className="input-field tabular-nums"
          placeholder="Cep telefonu"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
        />
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
          placeholder="Şifre (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="text-sm text-[#ee401d]">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Kaydediliyor…" : "Kayıt ol"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[#6b7280]">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-bold text-[#168f43]">
          Giriş yap
        </Link>
      </p>
    </AppShell>
  );
}
