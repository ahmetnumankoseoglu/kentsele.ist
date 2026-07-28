import { NextResponse } from "next/server";
import { getListingByManageToken } from "@/lib/listings/queries";
import { updateListingByToken } from "@/lib/listings/mutations";
import { updateListingByOwnerSchema } from "@/lib/validations/listing";
import { normalizeTrPhone } from "@/lib/phone";
import { getCurrentProfile } from "@/lib/auth/session";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json(
        {
          error: "auth_required",
          message: "İlan düzenlemek için giriş yapmalısınız.",
        },
        { status: 401 }
      );
    }

    const { token } = await ctx.params;
    const existing = await getListingByManageToken(token);
    if (!existing || existing.status === "kaldirildi") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    // Must own listing or claim first
    if (
      existing.owner_user_id &&
      existing.owner_user_id !== profile.id
    ) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    // Auto-claim if unowned
    if (!existing.owner_user_id) {
      const { createServiceClient } = await import("@/lib/supabase/admin");
      const admin = createServiceClient();
      await admin
        .from("listings")
        .update({ owner_user_id: profile.id })
        .eq("id", existing.id);
    }

    const body = await req.json();
    const parsed = updateListingByOwnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }

    const patch: Record<string, unknown> = { ...parsed.data };
    delete patch.request_agreement;
    if (typeof patch.telefon === "string") {
      const n = normalizeTrPhone(patch.telefon);
      if (!n) return NextResponse.json({ error: "phone" }, { status: 400 });
      patch.telefon = n;
    }
    if (parsed.data.request_agreement) {
      patch.agreement_requested_at = new Date().toISOString();
    }
    delete patch.status;

    const listing = await updateListingByToken(token, patch);
    return NextResponse.json({ listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
