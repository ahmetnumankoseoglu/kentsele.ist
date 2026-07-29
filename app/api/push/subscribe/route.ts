import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/auth/session";

const schema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }
    const user = await getSessionUser();
    const admin = createServiceClient();
    const ua = req.headers.get("user-agent")?.slice(0, 300) ?? null;

    const { error } = await admin.from("push_subscriptions").upsert(
      {
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
        user_id: user?.id ?? null,
        user_agent: ua,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    );
    if (error) {
      console.error("[push/subscribe]", error);
      return NextResponse.json(
        {
          error: "db",
          message:
            "Abonelik kaydı başarısız. Supabase’te 013_push_subscriptions.sql çalıştırıldı mı?",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[push/subscribe]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
