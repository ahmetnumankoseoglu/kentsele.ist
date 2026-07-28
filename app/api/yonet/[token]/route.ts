import { NextResponse } from "next/server";
import { getListingByManageToken } from "@/lib/listings/queries";
import { updateListingByToken } from "@/lib/listings/mutations";
import { updateListingByOwnerSchema } from "@/lib/validations/listing";
import { normalizeTrPhone } from "@/lib/phone";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await ctx.params;
    const existing = await getListingByManageToken(token);
    if (!existing || existing.status === "kaldirildi") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateListingByOwnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const patch: Record<string, unknown> = { ...parsed.data };
    delete patch.request_agreement;
    // Owner cannot set status
    delete patch.status;

    if (typeof patch.telefon === "string") {
      const n = normalizeTrPhone(patch.telefon);
      if (!n) return NextResponse.json({ error: "phone" }, { status: 400 });
      patch.telefon = n;
    }

    if (parsed.data.request_agreement) {
      patch.agreement_requested_at = new Date().toISOString();
    }

    if (patch.email === "") {
      patch.email = null;
    }
    if (typeof patch.mahalle === "string" && patch.mahalle.trim() === "") {
      patch.mahalle = null;
    }

    const listing = await updateListingByToken(token, patch);
    return NextResponse.json({ listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
