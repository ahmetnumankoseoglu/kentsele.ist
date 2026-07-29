import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { linkUnownedListingsByEmail } from "@/lib/listings/claim-by-email";

/**
 * Oturum e-postasıyla eşleşen sahipsiz ilanları hesaba bağlar.
 * Giriş / kayıt sonrası istemci veya Hesabım sunucusu çağırır.
 */
export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user?.id || !user.email) {
      return NextResponse.json(
        { error: "auth", message: "Giriş gerekli." },
        { status: 401 }
      );
    }

    const result = await linkUnownedListingsByEmail(user.id, user.email);
    return NextResponse.json({
      linked: result.linked,
      ids: result.ids,
    });
  } catch (e) {
    console.error("[claim-by-email]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
