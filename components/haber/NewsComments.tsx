"use client";

import { useState } from "react";
import Link from "next/link";
import type { NewsComment } from "@/types/news";

export function NewsComments({
  newsId,
  initialComments,
  isLoggedIn,
  isSeed,
}: {
  newsId: string;
  initialComments: NewsComment[];
  isLoggedIn: boolean;
  isSeed: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isSeed) {
      setError(
        "Örnek haberlerde yorum kapalı. Admin panelinden gerçek haber yayınlayın."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/haberler/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ news_id: newsId, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.message ||
            (res.status === 401
              ? "Yorum için giriş yapın."
              : "Yorum gönderilemedi")
        );
        setLoading(false);
        return;
      }
      setComments((c) => [data.comment, ...c]);
      setBody("");
    } catch {
      setError("Bağlantı hatası");
    }
    setLoading(false);
  }

  return (
    <div>
      {isLoggedIn ? (
        <form onSubmit={submit} className="card mb-4 space-y-2 p-4">
          <textarea
            className="input-field min-h-24"
            placeholder="Yorumunu yaz…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            minLength={2}
          />
          {error && <p className="text-xs text-[#ee401d]">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Gönderiliyor…" : "Yorum gönder"}
          </button>
        </form>
      ) : (
        <div className="card mb-4 p-4 text-sm text-[#6b7280]">
          Yorum yapmak için{" "}
          <Link href="/giris" className="font-bold text-[#168f43]">
            giriş yap
          </Link>{" "}
          veya{" "}
          <Link href="/kayit" className="font-bold text-[#168f43]">
            kayıt ol
          </Link>
          .
        </div>
      )}

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-[#6b7280]">Henüz yorum yok. İlk yorumu sen yaz.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="card animate-fade-up p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf8ee] text-xs font-bold text-[#168f43]">
                {(c.profiles?.full_name || "?").slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-xs font-bold text-[#111321]">
                  {c.profiles?.full_name || "Kullanıcı"}
                </p>
                <time className="text-[10px] text-[#9ca3af]">
                  {new Date(c.created_at).toLocaleString("tr-TR")}
                </time>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#374151]">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
