"use client";

import { useState } from "react";

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

  const btn =
    "inline-flex items-center justify-center rounded-[3px] border border-[#e3e4e6] bg-white px-3 py-2 text-xs font-bold text-[#374151] transition hover:border-[#2cb34f] hover:text-[#168f43]";

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
          className={btn}
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          Facebook
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          LinkedIn
        </a>
        <button type="button" onClick={copy} className={btn}>
          {copied ? "Kopyalandı" : "Linki kopyala"}
        </button>
      </div>
    </div>
  );
}
