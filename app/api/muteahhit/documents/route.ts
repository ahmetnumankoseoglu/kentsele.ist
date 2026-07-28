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
    return NextResponse.json(
      { error: "auth", message: "Müteahhit girişi gerekli." },
      { status: 401 }
    );
  }
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const doc_type = String(form.get("doc_type") ?? "diger");
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "file", message: "Dosya seçin." },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "file", message: "Dosya en fazla 10 MB olabilir." },
        { status: 400 }
      );
    }
    if (!DOC_TYPES.includes(doc_type as (typeof DOC_TYPES)[number])) {
      return NextResponse.json(
        { error: "doc_type", message: "Geçersiz belge türü." },
        { status: 400 }
      );
    }

    const admin = createServiceClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `${profile.id}/${Date.now()}-${doc_type}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    const mime = file.type || "application/octet-stream";
    if (!allowed.includes(mime)) {
      return NextResponse.json(
        {
          error: "file",
          message: "Yalnızca PDF, JPG veya PNG yükleyebilirsiniz.",
        },
        { status: 400 }
      );
    }

    const { error: upErr } = await admin.storage
      .from("contractor-docs")
      .upload(path, buf, {
        contentType: mime,
        upsert: false,
      });
    if (upErr) {
      console.error("storage upload:", upErr.message);
      return NextResponse.json(
        {
          error: "storage",
          message:
            "Dosya depolanamadı. Storage bucket (contractor-docs) yapılandırmasını kontrol edin.",
        },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: "server", message: "Yükleme başarısız." },
      { status: 500 }
    );
  }
}
