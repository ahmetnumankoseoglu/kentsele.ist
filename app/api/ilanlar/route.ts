import { NextResponse } from "next/server";
import { createListingSchema } from "@/lib/validations/listing";
import { createListing } from "@/lib/listings/mutations";
import { getCurrentProfile } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    // Müteahhitler ilan veremez
    const profile = await getCurrentProfile();
    if (profile?.role === "muteahhit") {
      return NextResponse.json(
        {
          error: "forbidden_role",
          message:
            "Müteahhit hesapları ilan veremez. İlan yalnızca malikler içindir.",
        },
        { status: 403 }
      );
    }

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
