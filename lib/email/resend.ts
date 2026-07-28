import { Resend } from "resend";
import templateIds from "./resend-template-ids.json";

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
    "Kentsele.ist <noreply@kentsele.ist>"
  );
}

export function getAdminNotifyEmail(): string | null {
  const e = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  return e || null;
}

/** Resend dashboard template id by alias (from import script) */
export function getTemplateId(alias: string): string | null {
  const map = (templateIds as { byAlias?: Record<string, string> }).byAlias;
  return map?.[alias] ?? null;
}

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/**
 * Prefer published Resend Template by alias; fall back to inline HTML.
 */
export async function sendTemplateEmail(opts: {
  to: string | string[];
  alias: string;
  variables: Record<string, string | number>;
  /** Used only if template id missing — inline fallback */
  fallback?: SendEmailInput;
  replyTo?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skip:", opts.alias);
    return { ok: false, error: "resend_not_configured" };
  }

  const templateId = getTemplateId(opts.alias);
  if (templateId) {
    try {
      // Resend requires all template variables to be strings (not numbers)
      const variables: Record<string, string> = {
        YEAR: String(new Date().getFullYear()),
      };
      for (const [k, v] of Object.entries(opts.variables)) {
        variables[k] = v == null ? "" : String(v);
      }

      const { data, error } = await resend.emails.send({
        from: getEmailFrom(),
        to: opts.to,
        replyTo: opts.replyTo,
        template: {
          id: templateId,
          variables,
        },
      });
      if (error) {
        console.error("[email] template send error:", error);
        // fall through to HTML if provided
      } else {
        return { ok: true, id: data?.id };
      }
    } catch (e) {
      console.error("[email] template send failed:", e);
    }
  }

  if (opts.fallback) {
    return sendEmail(opts.fallback);
  }
  return { ok: false, error: "template_missing" };
}

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
