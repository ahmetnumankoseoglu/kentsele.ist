import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { canViewListingContact } from "@/lib/auth/session";

/** Only approved contractors (or admin) get malik phone + ada/parsel */
export async function GET(req: Request) {
  try {
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "slug" }, { status: 400 });
    }

    const allowed = await canViewListingContact();
    if (!allowed) {
      return NextResponse.json(
        {
          error: "forbidden",
          message:
            "Malik iletişim ve ada/parsel yalnızca onaylı müteahhit hesaplarına açıktır.",
        },
        { status: 403 }
      );
    }

    const admin = createServiceClient();
    const { data, error } = await admin
      .from("listings")
      .select("telefon, email, iletisim_adi, status, ada, parsel, mahalle")
      .eq("slug", slug)
      .in("status", ["yayinda", "teklif_saglaniyor"])
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      telefon: data.telefon,
      email: data.email,
      iletisim_adi: data.iletisim_adi,
      ada: data.ada ?? null,
      parsel: data.parsel ?? null,
      mahalle: data.mahalle,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
