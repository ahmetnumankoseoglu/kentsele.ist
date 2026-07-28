import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { sendEmail } from "@/lib/email/resend";
import { templateWelcomeMalik } from "@/lib/email/templates";

/** Admin: Resend bağlantısını dene */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = z
    .object({
      to: z.string().email(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", message: "Geçerli bir 'to' e-postası gerekli." },
      { status: 400 }
    );
  }

  const mail = templateWelcomeMalik({ name: "Test" });
  const result = await sendEmail({
    to: parsed.data.to,
    subject: `[Test] ${mail.subject}`,
    html: mail.html,
    text: mail.text,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        message:
          result.error === "resend_not_configured"
            ? "RESEND_API_KEY eksik veya hâlâ re_xxxxxxxxx placeholder."
            : "Gönderim başarısız.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
