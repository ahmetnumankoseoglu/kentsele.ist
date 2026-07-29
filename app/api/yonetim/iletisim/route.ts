import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { z } from "zod";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = z
    .object({
      id: z.string(),
      status: z.enum(["yeni", "okundu", "arsiv"]).optional(),
      reply: z.string().trim().min(2).max(5000).optional(),
    })
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (!parsed.data.status && !parsed.data.reply) {
    return NextResponse.json(
      { error: "validation", message: "status veya reply gerekli." },
      { status: 400 }
    );
  }

  try {
    const admin = createServiceClient();

    // Load existing for reply email
    const { data: existing, error: getErr } = await admin
      .from("contact_messages")
      .select("*")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (getErr) throw getErr;
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const patch: Record<string, unknown> = {};
    if (parsed.data.status) patch.status = parsed.data.status;

    if (parsed.data.reply) {
      patch.admin_reply = parsed.data.reply;
      patch.replied_at = new Date().toISOString();
      if (!parsed.data.status) patch.status = "okundu";
    }

    const { data, error } = await admin
      .from("contact_messages")
      .update(patch)
      .eq("id", parsed.data.id)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (parsed.data.reply) {
      try {
        const { emailContactAdminReply } = await import("@/lib/email/send");
        await emailContactAdminReply({
          name: existing.name,
          email: existing.email,
          subject: existing.subject,
          originalBody: existing.body,
          reply: parsed.data.reply,
        });
      } catch (mailErr) {
        console.error("[email] contact reply:", mailErr);
        return NextResponse.json(
          {
            item: data,
            warning: "reply_saved_email_failed",
            message:
              "Cevap kaydedildi ama e-posta gönderilemedi. RESEND ayarlarını kontrol et.",
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ item: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

/** Kalıcı sil */
export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const id =
      typeof body?.id === "string"
        ? body.id
        : new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "validation", message: "id gerekli." },
        { status: 400 }
      );
    }
    const admin = createServiceClient();
    const { error } = await admin
      .from("contact_messages")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact DELETE]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
