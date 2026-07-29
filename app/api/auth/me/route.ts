import { NextResponse } from "next/server";
import { getCurrentProfile, getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getSessionUser();
    const profile = await getCurrentProfile();
    if (!user || !profile) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      role: profile.role,
      full_name: profile.full_name,
      phone: profile.phone ?? null,
      email: user.email ?? null,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
