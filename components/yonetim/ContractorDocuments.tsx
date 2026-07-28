"use client";

import { useEffect, useState } from "react";

const DOC_LABELS: Record<string, string> = {
  vergi_levhasi: "Vergi levhası",
  ticaret_sicil: "Ticaret sicil",
  imza_sirkuleri: "İmza sirküleri",
  yetki_belgesi: "Yetki belgesi",
  diger: "Diğer",
};

type DocItem = {
  id: string;
  doc_type: string;
  file_name: string;
  mime_type: string | null;
  created_at: string;
  view_url: string | null;
};

export function ContractorDocuments({ userId }: { userId: string }) {
  const [items, setItems] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<DocItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/yonetim/muteahhitler/${encodeURIComponent(userId)}/documents`
        );
        const data = await res.json();
        if (!cancelled && res.ok) setItems(data.items ?? []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <p className="mt-3 text-xs text-[#6b7280]">Belgeler yükleniyor…</p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="mt-3 text-xs text-[#9ca3af]">Henüz yüklenmiş belge yok.</p>
    );
  }

  const isImage = (d: DocItem) => {
    const n = d.file_name.toLowerCase();
    const m = d.mime_type ?? "";
    return (
      m.startsWith("image/") ||
      n.endsWith(".jpg") ||
      n.endsWith(".jpeg") ||
      n.endsWith(".png") ||
      n.endsWith(".webp") ||
      n.endsWith(".gif")
    );
  };

  const isPdf = (d: DocItem) => {
    const n = d.file_name.toLowerCase();
    return (d.mime_type ?? "").includes("pdf") || n.endsWith(".pdf");
  };

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6b7280]">
        Yüklenen belgeler
      </p>
      <ul className="space-y-2">
        {items.map((d) => (
          <li
            key={d.id}
            className="flex items-center justify-between gap-2 rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#111321]">
                {DOC_LABELS[d.doc_type] ?? d.doc_type}
              </p>
              <p className="truncate text-[11px] text-[#6b7280]">
                {d.file_name}
              </p>
            </div>
            {d.view_url ? (
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  className="rounded bg-white px-2 py-1 text-[11px] font-bold text-[#168f43] ring-1 ring-[#e3e4e6]"
                  onClick={() => setPreview(d)}
                >
                  Görüntüle
                </button>
                <a
                  href={d.view_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white px-2 py-1 text-[11px] font-bold text-[#6b7280] ring-1 ring-[#e3e4e6]"
                >
                  Aç
                </a>
              </div>
            ) : (
              <span className="text-[11px] text-[#9ca3af]">Dosya yok</span>
            )}
          </li>
        ))}
      </ul>

      {preview && preview.view_url ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e3e4e6] px-4 py-3">
              <p className="truncate text-sm font-bold text-[#111321]">
                {preview.file_name}
              </p>
              <button
                type="button"
                className="text-sm font-bold text-[#6b7280]"
                onClick={() => setPreview(null)}
              >
                Kapat
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-[#f8f8f8] p-2">
              {isImage(preview) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.view_url}
                  alt={preview.file_name}
                  className="mx-auto max-h-[70vh] w-auto max-w-full object-contain"
                />
              ) : isPdf(preview) ? (
                <iframe
                  title={preview.file_name}
                  src={preview.view_url}
                  className="h-[70vh] w-full rounded border-0 bg-white"
                />
              ) : (
                <div className="p-6 text-center text-sm text-[#6b7280]">
                  Bu dosya türü önizlenemiyor.{" "}
                  <a
                    href={preview.view_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#168f43]"
                  >
                    Yeni sekmede aç
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
