"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPhoneInput } from "@/lib/phone";

export type ContactPrefill = {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export function ContactForm({ prefill }: { prefill?: ContactPrefill | null }) {
  const fromAccount = Boolean(
    prefill?.email || prefill?.full_name || prefill?.phone
  );

  const [name, setName] = useState(prefill?.full_name?.trim() || "");
  const [email, setEmail] = useState(prefill?.email?.trim() || "");
  const [phone, setPhone] = useState(
    prefill?.phone ? formatPhoneInput(prefill.phone) : ""
  );
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
      setSubject("");
      setBody("");
      // Hesaptan gelen kimlik alanlarını koru
      if (!fromAccount) {
        setName("");
        setEmail("");
        setPhone("");
      }
    } catch {
      setError("Bağlantı hatası.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-3 p-5">
      {fromAccount ? (
        <p className="rounded-[3px] bg-[#eaf8ee] px-3 py-2 text-xs font-medium text-[#168f43]">
          Giriş yaptığın için ad, e-posta ve telefon hesabından dolduruldu.
        </p>
      ) : null}
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-xs font-bold text-[#6b7280]">
          Ad soyad
        </label>
        <input
          id="contact-name"
          className="input-field"
          name="name"
          autoComplete="name"
          placeholder="Ad soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          readOnly={Boolean(prefill?.full_name?.trim())}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-xs font-bold text-[#6b7280]">
          E-posta
        </label>
        <input
          id="contact-email"
          className="input-field"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          readOnly={Boolean(prefill?.email?.trim())}
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-xs font-bold text-[#6b7280]">
          Telefon
        </label>
        <input
          id="contact-phone"
          className="input-field tabular-nums"
          name="phone"
          placeholder="Telefon"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          readOnly={Boolean(prefill?.phone?.trim())}
        />
      </div>
      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-xs font-bold text-[#6b7280]">
          Konu
        </label>
        <input
          id="contact-subject"
          className="input-field"
          name="subject"
          placeholder="Konu"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          minLength={3}
        />
      </div>
      <div>
        <label htmlFor="contact-body" className="mb-1 block text-xs font-bold text-[#6b7280]">
          Mesaj
        </label>
        <textarea
          id="contact-body"
          className="input-field min-h-32 resize-y"
          name="body"
          placeholder="Mesajınız"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={10}
        />
      </div>
      <p className="text-xs leading-relaxed text-[#6b7280]">
        Göndererek{" "}
        <Link href="/gizlilik" className="font-semibold text-[#168f43]">
          KVKK ve Gizlilik Politikası
        </Link>
        ’nı okuduğunu kabul edersin.
      </p>
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
