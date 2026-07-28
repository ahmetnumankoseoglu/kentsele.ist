"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  { id: "vergi_levhasi", label: "Vergi levhası" },
  { id: "ticaret_sicil", label: "Ticaret sicil" },
  { id: "imza_sirkuleri", label: "İmza sirküleri" },
  { id: "yetki_belgesi", label: "Yetki belgesi" },
  { id: "diger", label: "Diğer" },
];

export function DocumentUploadForm() {
  const router = useRouter();
  const [docType, setDocType] = useState("vergi_levhasi");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setMsg("Dosya seçin");
    setLoading(true);
    setMsg(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("doc_type", docType);
    try {
      const res = await fetch("/api/muteahhit/documents", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        setMsg("Yükleme başarısız (Supabase storage bucket: contractor-docs)");
        setLoading(false);
        return;
      }
      setMsg("Yüklendi — onay için incelenecek.");
      setFile(null);
      router.refresh();
    } catch {
      setMsg("Hata");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <select
        className="input-field"
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
      >
        {TYPES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept=".pdf,image/*"
        className="block w-full text-sm"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      {msg && <p className="text-xs text-[#6b7280]">{msg}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Yükleniyor…" : "Belgeyi gönder"}
      </button>
    </form>
  );
}
