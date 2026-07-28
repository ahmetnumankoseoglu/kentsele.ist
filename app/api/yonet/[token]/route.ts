import { NextResponse } from "next/server";
import { getListingByManageToken } from "@/lib/listings/queries";
import { updateListingByToken } from "@/lib/listings/mutations";
import { updateListingByOwnerSchema } from "@/lib/validations/listing";
import { normalizeTrPhone } from "@/lib/phone";
import { getCurrentProfile, getSessionUser } from "@/lib/auth/session";
import { canOwnerEditListing } from "@/lib/listings/ownership";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  try {
    const user = await getSessionUser();
    const profile = await getCurrentProfile();
    if (!user || !profile) {
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

    // Token yetmez: e-posta hesabı ile eşleşme zorunlu
    if (
      !canOwnerEditListing({
        profileId: profile.id,
        userEmail: user.email,
        listing: existing,
      })
    ) {
      return NextResponse.json(
        {
          error: "forbidden",
          message:
            "Bu ilan, oluşturulurken girilen e-posta hesabına aittir. O e-posta ile giriş yapmalısınız.",
        },
        { status: 403 }
      );
    }

    // E-posta eşleşince owner bağla
    if (!existing.owner_user_id || existing.owner_user_id !== profile.id) {
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

    // E-posta değiştirilse bile sahiplik bozulmasın — e-posta güncellemesi serbest
    // ama başka hesabın e-postasını yazmak karışıklık yaratır; yine de malik kendi
    // e-postasını düzeltebilir.

    const isFieldEdit = Object.keys(patch).some(
      (k) => k !== "agreement_requested_at"
    );
    if (isFieldEdit) {
      patch.status = "incelemede";
      patch.published_at = null;
    }

    const listing = await updateListingByToken(token, patch);
    return NextResponse.json({ listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
