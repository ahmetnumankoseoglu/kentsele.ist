import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/session";

/** Link manage_token listing to logged-in user (malik) */
export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "auth" }, { status: 401 });
    }

    const { token } = (await req.json()) as { token?: string };
    if (!token) {
      return NextResponse.json({ error: "token" }, { status: 400 });
    }

    const admin = createServiceClient();
    const { data: listing, error } = await admin
      .from("listings")
      .select("*")
      .eq("manage_token", token)
      .maybeSingle();
    if (error) throw error;
    if (!listing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (listing.owner_user_id && listing.owner_user_id !== profile.id) {
      return NextResponse.json({ error: "owned" }, { status: 403 });
    }

    const { data: updated, error: upErr } = await admin
      .from("listings")
      .update({ owner_user_id: profile.id })
      .eq("id", listing.id)
      .select("*")
      .single();
    if (upErr) throw upErr;

    return NextResponse.json({ listing: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
