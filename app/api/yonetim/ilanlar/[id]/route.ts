import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import {
  adminDeleteListing,
  adminUpdateListing,
} from "@/lib/listings/mutations";
import { getListingById } from "@/lib/listings/queries";
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
    const existing = await getListingById(id);
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const prevStatus = existing.status;

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

    if (typeof patch.status === "string" && patch.status !== prevStatus) {
      try {
        const { emailOnListingStatusChange } = await import("@/lib/email/send");
        await emailOnListingStatusChange(
          listing,
          prevStatus,
          String(patch.status)
        );
      } catch (mailErr) {
        console.error("[email] listing status:", mailErr);
      }
      try {
        const { pushOnListingStatus } = await import("@/lib/push/send");
        await pushOnListingStatus(
          listing,
          prevStatus,
          String(patch.status)
        );
      } catch (pushErr) {
        console.error("[push] listing status:", pushErr);
      }
    }

    return NextResponse.json({ listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

/** Kalıcı sil — “Kaldır” durumundan farklı */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { id } = await ctx.params;
    const existing = await getListingById(id);
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    await adminDeleteListing(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin listing DELETE]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
