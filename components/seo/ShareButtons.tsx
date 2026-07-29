"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

type Props = {
  /** Absolute page URL */
  url: string;
  title: string;
  className?: string;
};

export function ShareButtons({ url, title, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const btnBase =
    "inline-flex h-10 items-center justify-center gap-2 rounded-[3px] border border-[#e3e4e6] bg-white px-3 text-xs font-bold text-[#374151] transition hover:border-[#2cb34f] hover:bg-[#f8fdf9] hover:text-[#168f43]";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
        Paylaş
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${t}%20${u}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} hover:!border-[#25D366] hover:!text-[#128C7E]`}
          aria-label="WhatsApp ile paylaş"
        >
          <FaWhatsapp className="h-4 w-4 shrink-0 text-[#25D366]" aria-hidden />
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnBase}
          aria-label="X (Twitter) ile paylaş"
        >
          <FaXTwitter className="h-3.5 w-3.5 shrink-0" aria-hidden />
          X’te paylaş
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} hover:!border-[#1877F2] hover:!text-[#1877F2]`}
          aria-label="Facebook ile paylaş"
        >
          <FaFacebookF className="h-3.5 w-3.5 shrink-0 text-[#1877F2]" aria-hidden />
          Facebook
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} hover:!border-[#0A66C2] hover:!text-[#0A66C2]`}
          aria-label="LinkedIn ile paylaş"
        >
          <FaLinkedinIn className="h-4 w-4 shrink-0 text-[#0A66C2]" aria-hidden />
          LinkedIn
        </a>
        <button
          type="button"
          onClick={copy}
          className={btnBase}
          aria-label={copied ? "Link kopyalandı" : "Linki kopyala"}
        >
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-[#168f43]" strokeWidth={2.5} aria-hidden />
          ) : (
            <Link2 className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
          )}
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
    </div>
  );
}
