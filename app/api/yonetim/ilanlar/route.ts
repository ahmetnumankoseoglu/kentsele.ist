import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { createListing } from "@/lib/listings/mutations";
import { createListingSchema } from "@/lib/validations/listing";
import { LISTING_STATUSES } from "@/lib/constants/listing";
import { z } from "zod";

const adminCreateSchema = createListingSchema.and(
  z.object({
    status: z.enum(LISTING_STATUSES).optional(),
  })
);

/** Admin: yeni ilan oluştur */
export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = adminCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status, ...listingInput } = parsed.data;
    const { listing, manageUrlPath } = await createListing(listingInput, {
      status: status ?? "incelemede",
    });

    return NextResponse.json({
      listing,
      managePath: manageUrlPath,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
