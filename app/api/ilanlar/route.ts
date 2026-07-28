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
    const { getSiteUrl } = await import("@/lib/seo/site");
    const site = getSiteUrl();

    // Transactional email (non-blocking for client if Resend fails)
    try {
      const { emailOnListingCreated } = await import("@/lib/email/send");
      await emailOnListingCreated(listing);
    } catch (mailErr) {
      console.error("[email] listing create:", mailErr);
    }

    return NextResponse.json({
      id: listing.id,
      slug: listing.slug,
      managePath: manageUrlPath,
      manageUrl: `${site}${manageUrlPath}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
