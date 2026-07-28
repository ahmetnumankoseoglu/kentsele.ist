import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key.includes("re_xxxxxxxxx") || key === "re_xxx") {
    return null;
  }
  if (!client) client = new Resend(key);
  return client;
}

export function getEmailFrom(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "Kentsele <onboarding@resend.dev>"
  );
}

export function getAdminNotifyEmail(): string | null {
  const e = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  return e || null;
}

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/**
 * Fire-and-forget safe send. Returns { ok, id? } — never throws to callers
 * that should not fail the main business action.
 */
export async function sendEmail(
  input: SendEmailInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY missing or placeholder — skip send:",
      input.subject
    );
    return { ok: false, error: "resend_not_configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getEmailFrom(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    console.error("[email] send failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "send_failed",
    };
  }
}
