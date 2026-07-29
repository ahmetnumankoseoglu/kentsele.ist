"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import type { EmailOtpType } from "@supabase/supabase-js";

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("otp_expired") ||
    m.includes("expired") ||
    m.includes("invalid") ||
    m.includes("access_denied")
  ) {
    return "Bu sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı iste.";
  }
  return message || "Bağlantı doğrulanamadı.";
}

export default function SifreYenilePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createBrowserSupabase();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setError(null);
        setChecking(false);
      }
    });

    (async () => {
      try {
        if (typeof window === "undefined") return;

        const url = new URL(window.location.href);

        // Eski / bozulmuş redirect: #error=...&error_code=otp_expired
        const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
        if (hash) {
          const hp = new URLSearchParams(hash);
          const errCode = hp.get("error_code") || hp.get("error");
          const errDesc = hp.get("error_description");
          if (errCode || errDesc) {
            if (!cancelled) {
              setReady(false);
              setError(
                mapAuthError(
                  errDesc?.replace(/\+/g, " ") || errCode || "otp_expired"
                )
              );
              setChecking(false);
              window.history.replaceState({}, "", url.pathname);
            }
            return;
          }
        }

        // Asıl akış: ?token_hash=...&type=recovery → verifyOtp
        // (Supabase action_link kullanmıyoruz; e-posta prefetch token tüketmez)
        const tokenHash = url.searchParams.get("token_hash");
        const typeParam = (url.searchParams.get("type") ||
          "recovery") as EmailOtpType;

        if (tokenHash) {
          const { data, error: vErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: typeParam,
          });
          // Query’yi temizle (yenilemede tekrar verify denemesin)
          url.searchParams.delete("token_hash");
          url.searchParams.delete("type");
          window.history.replaceState(
            {},
            "",
            url.pathname + (url.search ? url.search : "")
          );

          if (vErr) {
            console.error("[sifre-yenile] verifyOtp", vErr);
            if (!cancelled) {
              setReady(false);
              setError(mapAuthError(vErr.message));
              setChecking(false);
            }
            return;
          }
          if (data.session && !cancelled) {
            setReady(true);
            setError(null);
            setChecking(false);
            return;
          }
        }

        // PKCE: ?code=
        const code = url.searchParams.get("code");
        if (code) {
          const { error: exErr } =
            await supabase.auth.exchangeCodeForSession(code);
          url.searchParams.delete("code");
          window.history.replaceState({}, "", url.pathname);
          if (exErr) {
            console.error("[sifre-yenile] exchangeCode", exErr);
            if (!cancelled) {
              setReady(false);
              setError(mapAuthError(exErr.message));
              setChecking(false);
            }
            return;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!cancelled) {
          if (session) {
            setReady(true);
            setError(null);
          } else {
            setReady(false);
            setError(
              "Geçerli bir sıfırlama oturumu yok. E-postadaki bağlantıyı kullan veya yeni istek oluştur."
            );
          }
        }
      } catch {
        if (!cancelled) {
          setError("Oturum kontrol edilemedi.");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(
          err.message.includes("session")
            ? "Oturum süresi dolmuş. Şifre sıfırlamayı yeniden iste."
            : "Şifre güncellenemedi. Tekrar dene."
        );
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => {
        router.push("/hesabim");
        router.refresh();
      }, 1500);
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-2xl font-bold text-[#111321]">Yeni şifre belirle</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        E-postadaki bağlantıdan geldiysen buradan yeni şifreni kaydedebilirsin.
      </p>

      {checking ? (
        <p className="card mt-6 p-5 text-sm text-[#6b7280]">
          Bağlantı doğrulanıyor…
        </p>
      ) : done ? (
        <div className="card-elevated mt-6 p-5">
          <p className="text-sm font-bold text-[#168f43]">Şifren güncellendi</p>
          <p className="mt-1 text-sm text-[#6b7280]">
            Hesabına yönlendiriliyorsun…
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card-elevated mt-6 space-y-3 p-5">
          {!ready && error && (
            <p className="rounded-[3px] bg-amber-50 px-3 py-2 text-sm text-amber-950">
              {error}{" "}
              <Link
                href="/sifremi-unuttum"
                className="font-bold text-[#168f43] underline"
              >
                Yeni bağlantı iste
              </Link>
            </p>
          )}
          <input
            className="input-field"
            type="password"
            placeholder="Yeni şifre (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            disabled={!ready}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Yeni şifre (tekrar)"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            disabled={!ready}
          />
          {ready && error && (
            <p className="text-sm text-[#ee401d]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !ready}
            className="btn-primary w-full"
          >
            {loading ? "Kaydediliyor…" : "Şifreyi kaydet"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-[#6b7280]">
        <Link href="/giris" className="font-bold text-[#168f43]">
          Giriş sayfası
        </Link>
      </p>
    </AppShell>
  );
}
