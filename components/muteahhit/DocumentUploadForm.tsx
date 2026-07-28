"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  { id: "vergi_levhasi", label: "Vergi levhası" },
  { id: "ticaret_sicil", label: "Ticaret sicil gazetesi" },
  { id: "imza_sirkuleri", label: "İmza sirküleri" },
  { id: "yetki_belgesi", label: "Yetki belgesi" },
  { id: "diger", label: "Diğer" },
] as const;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadForm() {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<string>("vergi_levhasi");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function pickFile(f: File | null) {
    setError(null);
    setMsg(null);
    if (!f) {
      setFile(null);
      return;
    }
    const max = 10 * 1024 * 1024;
    if (f.size > max) {
      setFile(null);
      setError("Dosya en fazla 10 MB olabilir.");
      return;
    }
    setFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Önce bir dosya seçin.");
      return;
    }
    setLoading(true);
    setError(null);
    setMsg(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("doc_type", docType);
    try {
      const res = await fetch("/api/muteahhit/documents", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.message ||
            (res.status === 401
              ? "Oturum gerekli. Tekrar giriş yapın."
              : "Yükleme başarısız. Tekrar deneyin.")
        );
        setLoading(false);
        return;
      }
      setMsg(
        "Belge yüklendi. İnceleme için admin paneline düştü; onay sürecini bekleyin."
      );
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-4">
      <div>
        <label
          htmlFor={`${inputId}-type`}
          className="mb-1.5 block text-xs font-bold text-[#6b7280]"
        >
          Belge türü
        </label>
        <select
          id={`${inputId}-type`}
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
      </div>

      <div>
        <p className="mb-1.5 text-xs font-bold text-[#6b7280]">Dosya</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center justify-center rounded-[3px] border-2 border-dashed border-[#e3e4e6] bg-[#f8f8f8] px-4 py-8 text-center transition-colors hover:border-[#2cb34f]/50 hover:bg-[#eaf8ee]/40"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[#2cb34f] shadow-sm">
            ↑
          </span>
          <span className="mt-3 text-sm font-bold text-[#111321]">
            {file ? "Dosyayı değiştir" : "Dosya seç veya sürükle"}
          </span>
          <span className="mt-1 text-xs text-[#6b7280]">
            PDF, JPG veya PNG · en fazla 10 MB
          </span>
        </label>

        {file ? (
          <div className="mt-3 flex items-center justify-between gap-2 rounded-[3px] border border-[#e3e4e6] bg-white px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111321]">
                {file.name}
              </p>
              <p className="text-xs text-[#6b7280]">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              className="shrink-0 text-xs font-bold text-[#ee401d]"
              onClick={() => {
                pickFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Kaldır
            </button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm font-medium text-[#ee401d]" role="alert">
          {error}
        </p>
      ) : null}
      {msg ? (
        <p className="text-sm font-medium text-[#168f43]" role="status">
          {msg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !file}
        className="btn-primary w-full disabled:opacity-40"
      >
        {loading ? "Yükleniyor…" : "Belgeyi gönder"}
      </button>
    </form>
  );
}
