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
            className="mb-2 max-h-28 w-full rounded object-cover"
          />
        ) : (
          <span className="text-2xl text-[#2cb34f]">↑</span>
        )}
        <span className="text-xs font-bold text-[#111321]">
          {value ? "Görseli değiştir" : "Görsel yükle"}
        </span>
        <span className="mt-0.5 text-[11px] text-[#9ca3af]">
          JPG, PNG, WebP · max 4 MB
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
  const [title, setTitle] = useState(edit?.title ?? "");
  const [description, setDescription] = useState(edit?.description ?? "");
  const [body, setBody] = useState(edit?.body ?? "");
  const [banner, setBanner] = useState(edit?.banner_image_url ?? "");
  const [cover, setCover] = useState(edit?.cover_image_url ?? "");
  const [status, setStatus] = useState(edit?.status ?? "draft");
  const [tags, setTags] = useState((edit?.tags ?? []).join(", "));
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const plain = body.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    if (plain.length < 20) {
      setMsg("İçerik en az ~20 karakter olmalı (zengin metin editörü).");
      return;
    }
    setLoading(true);
    setMsg(null);
    const payload = {
      title,
      description,
      body,
      banner_image_url: banner || null,
      cover_image_url: cover || null,
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
      if (!res.ok) {
        setMsg("Kaydedilemedi");
        setLoading(false);
        return;
      }
      setMsg(edit ? "Güncellendi" : "Oluşturuldu");
      if (!edit) {
        setTitle("");
        setDescription("");
        setBody("");
        setBanner("");
        setCover("");
      }
      router.refresh();
    } catch {
      setMsg("Hata");
    }
    setLoading(false);
  }

  async function remove() {
    if (!edit || !confirm("Silinsin mi?")) return;
    await fetch(`/api/haberler/${edit.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className={`space-y-3 ${edit ? "mt-3 border-t border-[#e3e4e6] pt-3" : "card-elevated p-4"}`}
    >
      {!edit && (
        <p className="text-sm font-bold text-[#111321]">Yeni haber</p>
      )}
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
      <ImagePicker label="Banner görsel" value={banner} onChange={setBanner} />
      <ImagePicker label="Kapak görsel" value={cover} onChange={setCover} />
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
      {msg && <p className="text-xs text-[#168f43]">{msg}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "…" : edit ? "Güncelle" : "Kaydet"}
        </button>
        {edit && (
          <button
            type="button"
            onClick={remove}
            className="btn-secondary text-[#ee401d]"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  );
}
