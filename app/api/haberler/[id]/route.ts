import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { slugifyTr } from "@/lib/slug";

const schema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(500).optional(),
  body: z.string().min(40).optional(),
  cover_image_url: z.string().optional().nullable(),
  banner_image_url: z.string().optional().nullable(),
  author_name: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  slug: z.string().optional(),
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
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }
    const patch: Record<string, unknown> = { ...parsed.data };
    if (typeof patch.slug === "string") {
      patch.slug = slugifyTr(patch.slug);
    }
    if (patch.status === "published") {
      // set published_at if missing — done via fetch existing optional
      const admin = createServiceClient();
      const { data: cur } = await admin
        .from("news")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      if (!cur?.published_at) {
        patch.published_at = new Date().toISOString();
      }
    }
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("news")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const admin = createServiceClient();
    const { error } = await admin.from("news").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
