import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";

/** Admin: müteahhitin yüklediği belgeler + görüntüleme URL */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id: userId } = await ctx.params;

  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contractor_documents")
      .select("id, doc_type, file_name, file_path, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const items = await Promise.all(
      (data ?? []).map(async (d) => {
        let view_url: string | null = null;
        if (d.file_path) {
          const { data: signed } = await admin.storage
            .from("contractor-docs")
            .createSignedUrl(d.file_path, 60 * 30);
          view_url = signed?.signedUrl ?? null;
        }
        return {
          id: d.id,
          doc_type: d.doc_type,
          file_name: d.file_name,
          mime_type: null as string | null,
          created_at: d.created_at,
          view_url,
        };
      })
    );

    return NextResponse.json({ items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
