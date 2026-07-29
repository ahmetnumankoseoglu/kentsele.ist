import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createServiceClient } from "@/lib/supabase/admin";

/**
 * Admin: üyelik sil (auth user → profiles cascade)
 * listings.owner_user_id SET NULL (FK)
 */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "id" }, { status: 400 });
  }

  try {
    const admin = createServiceClient();

    // Optional: wipe contractor docs from storage
    try {
      const { data: files } = await admin.storage
        .from("contractor-docs")
        .list(id, { limit: 100 });
      if (files && files.length > 0) {
        const paths = files.map((f) => `${id}/${f.name}`);
        await admin.storage.from("contractor-docs").remove(paths);
      }
    } catch {
      /* storage optional */
    }

    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) {
      console.error("[admin delete user]", error);
      return NextResponse.json(
        { error: "delete_failed", message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
