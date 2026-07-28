import { NextResponse } from "next/server";
import {
  checkAdminPassword,
  setAdminSession,
} from "@/lib/auth/admin-session";

export async function POST(req: Request) {
  try {
    if (!process.env.ADMIN_PASSWORD?.trim()) {
      console.error("[admin-login] ADMIN_PASSWORD is not set");
      return NextResponse.json(
        {
          error: "misconfigured",
          message: "ADMIN_PASSWORD tanımlı değil (Vercel env).",
        },
        { status: 500 }
      );
    }
    if (!process.env.ADMIN_SESSION_SECRET?.trim()) {
      console.error("[admin-login] ADMIN_SESSION_SECRET is not set");
      return NextResponse.json(
        {
          error: "misconfigured",
          message: "ADMIN_SESSION_SECRET tanımlı değil (Vercel env).",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin-login]", e);
    return NextResponse.json(
      {
        error: "server",
        message: e instanceof Error ? e.message : "server_error",
      },
      { status: 500 }
    );
  }
}
