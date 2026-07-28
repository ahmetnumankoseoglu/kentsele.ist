"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsArticle } from "@/types/news";

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
      className={`space-y-2 ${edit ? "mt-3 border-t border-[#e3e4e6] pt-3" : "card-elevated p-4"}`}
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
        placeholder="Kısa açıklama (SEO description)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <textarea
        className="input-field min-h-32"
        placeholder="Gövde (paragrafları boş satırla ayır)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <input
        className="input-field"
        placeholder="Banner görsel URL"
        value={banner}
        onChange={(e) => setBanner(e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Kapak görsel URL"
        value={cover}
        onChange={(e) => setCover(e.target.value)}
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
