"use client";

import { useState } from "react";
import { formatPhoneInput } from "@/lib/phone";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          subject,
          body,
        }),
      });
      if (!res.ok) {
        setError("Gönderilemedi. Alanları kontrol edip tekrar deneyin.");
        setLoading(false);
        return;
      }
      setOk(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setBody("");
    } catch {
      setError("Bağlantı hatası.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-3 p-5">
      <input
        className="input-field"
        placeholder="Ad soyad"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
      />
      <input
        className="input-field"
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="input-field tabular-nums"
        placeholder="Telefon"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
      />
      <input
        className="input-field"
        placeholder="Konu"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        minLength={3}
      />
      <textarea
        className="input-field min-h-32 resize-y"
        placeholder="Mesajınız"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        minLength={10}
      />
      {error ? (
        <p className="text-sm font-medium text-[#ee401d]">{error}</p>
      ) : null}
      {ok ? (
        <p className="text-sm font-medium text-[#168f43]">
          Mesajınız alındı. En kısa sürede dönüş yapacağız.
        </p>
      ) : null}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
