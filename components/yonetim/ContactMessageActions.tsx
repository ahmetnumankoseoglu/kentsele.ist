"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactMessageActions({
  id,
  status,
  hasReply,
}: {
  id: string;
  status: string;
  hasReply?: boolean;
}) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function setStatus(next: "yeni" | "okundu" | "arsiv") {
    setError(null);
    await fetch("/api/yonetim/iletisim", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    router.refresh();
  }

  async function sendReply() {
    if (reply.trim().length < 2) {
      setError("Cevap en az 2 karakter olmalı.");
      return;
    }
    setLoading(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch("/api/yonetim/iletisim", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reply: reply.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Gönderilemedi.");
        setLoading(false);
        return;
      }
      if (data.warning === "reply_saved_email_failed") {
        setOkMsg(data.message || "Kaydedildi; e-posta başarısız.");
      } else {
        setOkMsg("Cevap e-posta ile gönderildi.");
        setReply("");
        setOpen(false);
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary !py-1.5 !text-xs"
          onClick={() => {
            setOpen((v) => !v);
            setError(null);
            setOkMsg(null);
          }}
        >
          {hasReply ? "Tekrar yanıtla" : "E-posta ile yanıtla"}
        </button>
        {status !== "okundu" && (
          <button
            type="button"
            className="btn-secondary !py-1.5 !text-xs"
            onClick={() => setStatus("okundu")}
          >
            Okundu
          </button>
        )}
        {status !== "arsiv" && (
          <button
            type="button"
            className="btn-secondary !py-1.5 !text-xs"
            onClick={() => setStatus("arsiv")}
          >
            Arşivle
          </button>
        )}
        {status !== "yeni" && (
          <button
            type="button"
            className="btn-secondary !py-1.5 !text-xs"
            onClick={() => setStatus("yeni")}
          >
            Yeni yap
          </button>
        )}
      </div>

      {open && (
        <div className="rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-3">
          <label className="mb-1 block text-xs font-bold text-[#111321]">
            Kullanıcıya e-posta cevabı
          </label>
          <textarea
            className="input-field min-h-[100px] w-full text-sm"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Cevabınızı yazın…"
            maxLength={5000}
          />
          {error && <p className="mt-1 text-xs text-[#ee401d]">{error}</p>}
          {okMsg && <p className="mt-1 text-xs text-[#168f43]">{okMsg}</p>}
          <button
            type="button"
            disabled={loading || reply.trim().length < 2}
            className="btn-primary mt-2 !py-2 !text-sm"
            onClick={sendReply}
          >
            {loading ? "Gönderiliyor…" : "Cevabı gönder"}
          </button>
        </div>
      )}
    </div>
  );
}
