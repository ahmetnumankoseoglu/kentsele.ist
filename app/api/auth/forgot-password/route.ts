import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/seo/site";
import { normalizeEmail } from "@/lib/listings/normalize-email";
import { templatePasswordReset } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/resend";

const schema = z.object({
  email: z.string().email(),
});

/**
 * Şifre sıfırlama:
 * 1) Supabase Admin generateLink — SADECE token/link üretir, mail GÖNDERMEZ
 * 2) Markalı HTML mail Resend ile gider (Supabase Auth şablonu kullanılmaz)
 *
 * Asla supabase.auth.resetPasswordForEmail kullanma — o Supabase şablonunu yollar.
 */
export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", message: "Geçerli bir e-posta gir." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email) ?? parsed.data.email.trim();
    const site = getSiteUrl();
    const redirectTo = `${site}/sifre-yenile`;

    let admin;
    try {
      admin = createServiceClient();
    } catch (e) {
      console.error("[forgot-password] supabase env", e);
      return NextResponse.json(
        {
          error: "config",
          message: "Sunucu yapılandırması eksik (Supabase).",
        },
        { status: 500 }
      );
    }

    // Link üret — e-posta göndermez
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (error) {
      // Kullanıcı yok / rate limit: güvenlik için yine genel mesaj
      console.error("[forgot-password] generateLink:", error.message);
      return NextResponse.json({ ok: true });
    }

    const props = data?.properties as
      | {
          action_link?: string;
          hashed_token?: string;
          redirect_to?: string;
        }
      | undefined;

    // Prefer action_link; fallback build verify URL from hashed_token
    let resetUrl = props?.action_link?.trim() || "";
    if (!resetUrl && props?.hashed_token) {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
      if (base) {
        const q = new URLSearchParams({
          token: props.hashed_token,
          type: "recovery",
          redirect_to: redirectTo,
        });
        resetUrl = `${base}/auth/v1/verify?${q.toString()}`;
      }
    }

    if (!resetUrl) {
      console.error(
        "[forgot-password] no recovery link in generateLink response",
        JSON.stringify(props ?? null)
      );
      return NextResponse.json({ ok: true });
    }

    let name: string | null = null;
    try {
      const userId = data.user?.id;
      if (userId) {
        const { data: profile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .maybeSingle();
        name = profile?.full_name ?? null;
      }
    } catch {
      /* ignore */
    }

    // Her zaman inline HTML (Resend dashboard template gerekmez)
    const mail = templatePasswordReset({ name, resetUrl });
    const sent = await sendEmail({
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    if (!sent.ok) {
      console.error("[forgot-password] resend failed:", sent.error);
      return NextResponse.json(
        {
          error: "email",
          message:
            sent.error === "resend_not_configured"
              ? "RESEND_API_KEY tanımlı değil (Vercel env)."
              : "E-posta gönderilemedi. RESEND_API_KEY / EMAIL_FROM kontrol et.",
        },
        { status: 502 }
      );
    }

    console.info("[forgot-password] sent via Resend", sent.id, email);
    return NextResponse.json({ ok: true, via: "resend" });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
