import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/admin-session";

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
