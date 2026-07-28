import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/session";

const DOC_TYPES = [
  "vergi_levhasi",
  "ticaret_sicil",
  "imza_sirkuleri",
  "yetki_belgesi",
  "diger",
] as const;

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "muteahhit") {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("contractor_documents")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "muteahhit") {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const doc_type = String(form.get("doc_type") ?? "diger");
    if (!file) {
      return NextResponse.json({ error: "file" }, { status: 400 });
    }
    if (!DOC_TYPES.includes(doc_type as (typeof DOC_TYPES)[number])) {
      return NextResponse.json({ error: "doc_type" }, { status: 400 });
    }

    const admin = createServiceClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `${profile.id}/${Date.now()}-${doc_type}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await admin.storage
      .from("contractor-docs")
      .upload(path, buf, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (upErr) {
      // bucket may not exist yet — still record metadata with path
      console.warn("storage upload:", upErr.message);
    }

    const { data, error } = await admin
      .from("contractor_documents")
      .insert({
        user_id: profile.id,
        doc_type,
        file_path: path,
        file_name: file.name,
      })
      .select("*")
      .single();
    if (error) throw error;

    // reset verification to pending after new docs
    await admin
      .from("contractor_profiles")
      .update({
        verification_status: "pending",
        rejection_reason: null,
      })
      .eq("user_id", profile.id);

    return NextResponse.json({ item: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
