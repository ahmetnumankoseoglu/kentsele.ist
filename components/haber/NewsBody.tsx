import {
  looksLikeHtml,
  sanitizeNewsHtml,
} from "@/lib/sanitize/news-html";

/** Haber gövdesi: HTML (TipTap) veya eski düz metin paragrafları */
export function NewsBody({ body }: { body: string }) {
  if (looksLikeHtml(body)) {
    return (
      <div
        className="prose-article mt-6"
        dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(body) }}
      />
    );
  }

  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="prose-article mt-6 space-y-4">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="animate-fade-up text-sm leading-relaxed text-[#374151]"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
