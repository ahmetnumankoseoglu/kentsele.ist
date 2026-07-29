"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsArticle } from "@/types/news";
import { RichTextEditor } from "@/components/yonetim/RichTextEditor";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold text-[#6b7280]">{label}</p>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > 4 * 1024 * 1024) {
            alert("Görsel en fazla 4 MB olabilir.");
            return;
          }
          const data = await fileToDataUrl(f);
          onChange(data);
        }}
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center rounded-[3px] border-2 border-dashed border-[#e3e4e6] bg-[#f8f8f8] px-3 py-5 text-center hover:border-[#2cb34f]/40"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="mb-2 max-h-36 w-full rounded object-cover"
          />
        ) : (
          <span className="text-2xl text-[#2cb34f]">↑</span>
        )}
        <span className="text-xs font-bold text-[#111321]">
          {value ? "Görseli değiştir" : "Görsel yükle"}
        </span>
        <span className="mt-0.5 text-[11px] text-[#9ca3af]">
          Banner ve kapak olarak kullanılır · JPG/PNG/WebP · max 4 MB
        </span>
      </label>
      {value ? (
        <button
          type="button"
          className="mt-1.5 text-xs font-bold text-[#ee401d]"
          onClick={() => onChange("")}
        >
          Görseli kaldır
        </button>
      ) : null}
    </div>
  );
}

export function NewsAdminForm({ edit }: { edit?: NewsArticle }) {
  const router = useRouter();
  // Tek görsel: cover = banner
  const initialImage =
    edit?.cover_image_url || edit?.banner_image_url || "";
  const [title, setTitle] = useState(edit?.title ?? "");
  const [description, setDescription] = useState(edit?.description ?? "");
  const [body, setBody] = useState(edit?.body ?? "");
  const [image, setImage] = useState(initialImage);
  const [status, setStatus] = useState(edit?.status ?? "draft");
  const [tags, setTags] = useState((edit?.tags ?? []).join(", "));
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const plain = body.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    if (plain.length < 20) {
      setError("İçerik en az ~20 karakter olmalı (zengin metin editörü).");
      return;
    }
    setLoading(true);
    setMsg(null);
    setError(null);
    // Banner ve kapak aynı görsel
    const payload = {
      title,
      description,
      body,
      banner_image_url: image || null,
      cover_image_url: image || null,
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      const res = await fetch(
        edit ? `/api/haberler/${edit.id}` : "/api/haberler",
        {
          method: edit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Kaydedilemedi");
        setLoading(false);
        return;
      }
      setMsg(edit ? "Güncellendi" : "Oluşturuldu");
      if (!edit && data.item?.id) {
        router.replace(`/yonetim/haberler/${data.item.id}`);
        router.refresh();
        return;
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası");
    }
    setLoading(false);
  }

  async function remove() {
    if (!edit) return;
    if (
      !confirm(
        `"${edit.title}" haberi kalıcı silinsin mi?\n\nBu işlem geri alınamaz.`
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/haberler/${edit.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Silinemedi");
        setLoading(false);
        return;
      }
      router.replace("/yonetim/haberler");
      router.refresh();
    } catch {
      setError("Bağlantı hatası");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card-elevated space-y-3 p-4">
      <input
        className="input-field"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="input-field"
        placeholder="Kısa açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div>
        <p className="mb-1.5 text-xs font-bold text-[#6b7280]">
          İçerik (zengin metin)
        </p>
        <RichTextEditor
          value={body}
          onChange={setBody}
          placeholder="Haberi WordPress gibi biçimlendir: başlık, liste, kalın, link…"
        />
      </div>
      <ImagePicker
        label="Haber görseli (banner + kapak)"
        value={image}
        onChange={setImage}
      />
      <input
        className="input-field"
        placeholder="Etiketler (virgülle)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <select
        className="input-field"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "draft" | "published" | "archived")
        }
      >
        <option value="draft">Taslak</option>
        <option value="published">Yayında</option>
        <option value="archived">Arşiv</option>
      </select>
      {error ? (
        <p className="text-xs font-medium text-[#ee401d]">{error}</p>
      ) : null}
      {msg ? (
        <p className="text-xs font-medium text-[#168f43]">{msg}</p>
      ) : null}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "…" : edit ? "Güncelle" : "Kaydet"}
        </button>
        {edit ? (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={loading}
            className="btn-secondary text-[#ee401d]"
          >
            Sil
          </button>
        ) : null}
      </div>
    </form>
  );
}
