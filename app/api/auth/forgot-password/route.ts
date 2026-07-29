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
 * 1) generateLink → hashed_token (mail göndermez)
 * 2) Link doğrudan sitemize: /sifre-yenile?token_hash=...&type=recovery
 *    (Supabase /auth/v1/verify action_link KULLANMA — e-posta tarayıcıları
 *     GET ile token’ı tüketir → otp_expired)
 * 3) Resend ile markalı HTML
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

    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (error) {
      console.error("[forgot-password] generateLink:", error.message);
      // Kullanıcı yok: güvenlik için genel başarı
      return NextResponse.json({ ok: true });
    }

    const props = data?.properties as
      | {
          action_link?: string;
          hashed_token?: string;
          email_otp?: string;
        }
      | undefined;

    const tokenHash = props?.hashed_token?.trim();
    if (!tokenHash) {
      console.error(
        "[forgot-password] no hashed_token",
        JSON.stringify(props ?? null)
      );
      return NextResponse.json({ ok: true });
    }

    // Kendi domain — client verifyOtp ile oturum açar (prefetch token tüketmez)
    const resetUrl = `${site}/sifre-yenile?${new URLSearchParams({
      token_hash: tokenHash,
      type: "recovery",
    }).toString()}`;

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

    console.info("[forgot-password] sent via Resend", sent.id);
    return NextResponse.json({ ok: true, via: "resend" });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
