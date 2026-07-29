import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { z } from "zod";

const schema = z.object({
  verification_status: z.enum(["pending", "approved", "rejected"]),
  rejection_reason: z.string().optional().nullable(),
});

function migrationHint(message?: string) {
  const base =
    "Supabase SQL Editor’da migrations/010_admin_set_contractor_verification.sql dosyasının tamamını çalıştırıp tekrar dene.";
  if (!message) return base;
  if (
    message.includes("verification fields") ||
    message.includes("admin_set_contractor_verification") ||
    message.includes("Could not find the function") ||
    message.includes("schema cache")
  ) {
    return `${message} — ${base}`;
  }
  return message;
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "auth", message: "Oturum geçersiz. /yonetim’den yeniden giriş yap." },
      { status: 401 }
    );
  }
  try {
    const { id } = await ctx.params;
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", message: "Geçersiz istek." },
        { status: 400 }
      );
    }

    const admin = createServiceClient();
    const status = parsed.data.verification_status;
    const reason =
      status === "rejected"
        ? (parsed.data.rejection_reason ?? "Belgeler yetersiz")
        : null;

    // Prefer RPC (bypass flag + SECURITY DEFINER). Fallback to direct update.
    let data: Record<string, unknown> | null = null;
    let errorMessage: string | null = null;

    const rpc = await admin.rpc("admin_set_contractor_verification", {
      p_user_id: id,
      p_status: status,
      p_rejection_reason: reason,
    });

    if (!rpc.error && rpc.data) {
      data = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
    } else {
      if (rpc.error) {
        console.error("[muteahhit PATCH] rpc", rpc.error);
        errorMessage = rpc.error.message;
      }

      const direct = await admin
        .from("contractor_profiles")
        .update({
          verification_status: status,
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq("user_id", id)
        .select("*")
        .single();

      if (direct.error) {
        console.error("[muteahhit PATCH] direct", direct.error);
        return NextResponse.json(
          {
            error: "db",
            message: migrationHint(direct.error.message || errorMessage || undefined),
          },
          { status: 500 }
        );
      }
      data = direct.data;
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "db",
          message: migrationHint(errorMessage || "Güncelleme sonucu boş."),
        },
        { status: 500 }
      );
    }

    // Notify contractor by email (Auth user email + profile name)
    try {
      if (status === "approved" || status === "rejected") {
        const { data: userData } = await admin.auth.admin.getUserById(id);
        const email = userData.user?.email;
        const { data: profile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("id", id)
          .maybeSingle();
        if (email) {
          const { emailOnContractorStatus } = await import("@/lib/email/send");
          await emailOnContractorStatus({
            email,
            name: profile?.full_name || "Müteahhit",
            status,
            reason,
          });
        }
      }
    } catch (mailErr) {
      console.error("[email] contractor status:", mailErr);
    }

    try {
      if (status === "approved" || status === "rejected") {
        const { pushOnContractorStatus } = await import("@/lib/push/send");
        await pushOnContractorStatus(id, status);
      }
    } catch (pushErr) {
      console.error("[push] contractor status:", pushErr);
    }

    return NextResponse.json({
      item: data,
      verification_status: status,
    });
  } catch (e) {
    console.error("[muteahhit PATCH]", e);
    const msg =
      e instanceof Error && e.message.includes("Missing Supabase")
        ? "Sunucuda SUPABASE_SERVICE_ROLE_KEY eksik."
        : e instanceof Error
          ? e.message
          : "Sunucu hatası";
    return NextResponse.json({ error: "server", message: msg }, { status: 500 });
  }
}
