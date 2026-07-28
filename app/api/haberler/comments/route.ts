import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/session";

const schema = z.object({
  news_id: z.string().uuid(),
  body: z.string().trim().min(2).max(2000),
});

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json(
        { error: "auth", message: "Yorum için giriş yapın." },
        { status: 401 }
      );
    }
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }

    const admin = createServiceClient();
    const { data: news } = await admin
      .from("news")
      .select("id, status")
      .eq("id", parsed.data.news_id)
      .maybeSingle();
    if (!news || news.status !== "published") {
      return NextResponse.json({ error: "news" }, { status: 404 });
    }

    const { data, error } = await admin
      .from("news_comments")
      .insert({
        news_id: parsed.data.news_id,
        user_id: profile.id,
        body: parsed.data.body,
        status: "published",
      })
      .select("*, profiles(full_name, role)")
      .single();
    if (error) throw error;
    return NextResponse.json({ comment: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
