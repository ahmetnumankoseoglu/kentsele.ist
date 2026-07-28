import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { buildNewsSlug, slugifyTr } from "@/lib/slug";

const schema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(500),
  body: z.string().min(40),
  // URL veya data:image yüklemesi
  cover_image_url: z.string().max(6_000_000).optional().nullable().or(z.literal("")),
  banner_image_url: z.string().max(6_000_000).optional().nullable().or(z.literal("")),
  author_name: z.string().min(2).max(80).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  slug: z.string().optional(),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }
    const d = parsed.data;
    const slug =
      d.slug && d.slug.length > 2
        ? slugifyTr(d.slug)
        : buildNewsSlug(d.title);
    const status = d.status ?? "draft";
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("news")
      .insert({
        slug,
        title: d.title,
        description: d.description,
        body: d.body,
        cover_image_url: d.cover_image_url || null,
        banner_image_url: d.banner_image_url || null,
        author_name: d.author_name || "kentsele.ist Editör",
        tags: d.tags ?? [],
        status,
        published_at:
          status === "published" ? new Date().toISOString() : null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
