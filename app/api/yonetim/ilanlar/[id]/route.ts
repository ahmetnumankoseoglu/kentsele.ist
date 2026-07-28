import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { adminUpdateListing } from "@/lib/listings/mutations";
import { adminUpdateListingSchema } from "@/lib/validations/listing";
import { normalizeTrPhone } from "@/lib/phone";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = adminUpdateListingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const patch: Record<string, unknown> = { ...parsed.data };

    if (typeof patch.telefon === "string") {
      const n = normalizeTrPhone(patch.telefon);
      if (!n) {
        return NextResponse.json({ error: "phone" }, { status: 400 });
      }
      patch.telefon = n;
    }

    if (patch.email === "") {
      patch.email = null;
    }
    if (typeof patch.mahalle === "string" && patch.mahalle.trim() === "") {
      patch.mahalle = null;
    }

    // Anlaşma onayı: isteğe bağlı olarak agreement_requested_at temizlenir
    if (patch.status === "anlasildi") {
      patch.agreement_requested_at = null;
    }

    const listing = await adminUpdateListing(id, patch);
    return NextResponse.json({ listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
