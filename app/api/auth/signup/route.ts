import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2).max(80),
  phone: z.string().optional(),
  role: z.enum(["malik", "muteahhit"]),
  company_name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }
    const { email, password, full_name, phone, role, company_name } =
      parsed.data;

    if (role === "muteahhit" && !company_name?.trim()) {
      return NextResponse.json(
        { error: "company_required" },
        { status: 400 }
      );
    }

    const admin = createServiceClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        full_name,
        phone: phone ?? null,
        company_name: company_name ?? "",
      },
    });
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const userId = data.user?.id;
    let linkedListings = 0;
    if (userId) {
      try {
        // Trigger profile oluşturmayabilir; FK için emin ol
        const { data: existingProfile } = await admin
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .maybeSingle();
        if (!existingProfile) {
          await admin.from("profiles").insert({
            id: userId,
            role,
            full_name,
            phone: phone ?? null,
          });
          if (role === "muteahhit") {
            await admin.from("contractor_profiles").upsert(
              {
                user_id: userId,
                company_name: company_name?.trim() || "",
              },
              { onConflict: "user_id" }
            );
          }
        }

        const { linkUnownedListingsByEmail } = await import(
          "@/lib/listings/claim-by-email"
        );
        const linked = await linkUnownedListingsByEmail(userId, email);
        linkedListings = linked.linked;
        console.info(
          "[signup] linked listings for",
          email.trim().toLowerCase(),
          linkedListings
        );
      } catch (linkErr) {
        console.error("[signup] claim-by-email:", linkErr);
      }
    }

    try {
      const { emailOnSignup } = await import("@/lib/email/send");
      await emailOnSignup({
        email,
        full_name,
        role,
        company_name: company_name ?? undefined,
      });
    } catch (mailErr) {
      console.error("[email] signup:", mailErr);
    }

    return NextResponse.json({
      userId,
      linkedListings,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
