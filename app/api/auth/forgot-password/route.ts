import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/seo/site";
import { normalizeEmail } from "@/lib/listings/normalize-email";

const schema = z.object({
  email: z.string().email(),
});

/**
 * Şifre sıfırlama: Supabase generateLink (recovery) + Resend mail.
 * Supabase’in kendi “Reset password” SMTP mailini kullanmaz.
 * Kullanıcı var/yok ayırt etmez (gizlilik).
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

    const admin = createServiceClient();

    // Recovery link üret — maili Supabase göndermez
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (error) {
      // Kullanıcı yok / rate limit — yine genel başarı dön
      console.error("[forgot-password] generateLink", error.message);
      return NextResponse.json({ ok: true });
    }

    const actionLink =
      data?.properties?.action_link ||
      (data as { action_link?: string } | null)?.action_link;

    if (!actionLink) {
      console.error("[forgot-password] no action_link in generateLink response");
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

    try {
      const { emailPasswordReset } = await import("@/lib/email/send");
      const sent = await emailPasswordReset({
        email,
        resetUrl: actionLink,
        name,
      });
      if (!sent.ok) {
        console.error("[forgot-password] resend", sent.error);
        return NextResponse.json(
          {
            error: "email",
            message:
              "E-posta gönderilemedi. RESEND_API_KEY ve EMAIL_FROM ayarlarını kontrol et.",
          },
          { status: 502 }
        );
      }
    } catch (mailErr) {
      console.error("[forgot-password] mail", mailErr);
      return NextResponse.json(
        { error: "email", message: "E-posta gönderilemedi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
