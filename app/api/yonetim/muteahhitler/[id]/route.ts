import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { z } from "zod";

const schema = z.object({
  verification_status: z.enum(["pending", "approved", "rejected"]),
  rejection_reason: z.string().optional().nullable(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }

    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contractor_profiles")
      .update({
        verification_status: parsed.data.verification_status,
        rejection_reason: parsed.data.rejection_reason ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("user_id", id)
      .select("*")
      .single();
    if (error) {
      console.error("[muteahhit PATCH]", error);
      return NextResponse.json(
        {
          error: "db",
          message:
            error.message?.includes("verification fields")
              ? "DB trigger admin güncellemesini engelliyor. Supabase SQL Editor’da migrations/009_admin_verification_trigger.sql dosyasını çalıştır."
              : error.message || "Güncelleme başarısız",
        },
        { status: 500 }
      );
    }

    // Notify contractor by email (Auth user email + profile name)
    try {
      if (
        parsed.data.verification_status === "approved" ||
        parsed.data.verification_status === "rejected"
      ) {
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
            status: parsed.data.verification_status,
            reason: parsed.data.rejection_reason,
          });
        }
      }
    } catch (mailErr) {
      console.error("[email] contractor status:", mailErr);
    }

    return NextResponse.json({ item: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
