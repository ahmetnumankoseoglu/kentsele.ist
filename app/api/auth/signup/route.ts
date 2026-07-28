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
    return NextResponse.json({ userId: data.user?.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
