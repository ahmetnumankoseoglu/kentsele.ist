import { NextResponse } from "next/server";
import {
  checkAdminPassword,
  setAdminSession,
} from "@/lib/auth/admin-session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
