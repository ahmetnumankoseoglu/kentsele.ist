import { NextResponse } from "next/server";
import { createListingSchema } from "@/lib/validations/listing";
import { createListing } from "@/lib/listings/mutations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createListingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { listing, manageUrlPath } = await createListing(parsed.data);
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    return NextResponse.json({
      id: listing.id,
      slug: listing.slug,
      managePath: manageUrlPath,
      manageUrl: site ? `${site}${manageUrlPath}` : manageUrlPath,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
