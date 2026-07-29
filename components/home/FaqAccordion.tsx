"use client";

import { FAQ_ITEMS } from "@/lib/content/faq";

/**
 * FAQ: native details/summary so answers stay in HTML for crawlers
 * (FAQPage schema + görünür içerik eşleşmesi).
 */
export function FaqAccordion({
  items = FAQ_ITEMS,
}: {
  items?: readonly { q: string; a: string }[];
}) {
  return (
    <div className="space-y-2.5" itemScope itemType="https://schema.org/FAQPage">
      {items.map((item, i) => (
        <details
          key={item.q}
          className="faq-item card animate-fade-up group overflow-hidden open:shadow-[var(--card-shadow)]"
          style={{ animationDelay: `${i * 60}ms` }}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
          open={i === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-left marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf8ee] text-xs font-bold text-[#168f43] group-open:bg-[#2cb34f] group-open:text-white">
                {i + 1}
              </span>
              <span
                className="pt-0.5 text-sm font-semibold leading-snug text-[#111321]"
                itemProp="name"
              >
                {item.q}
              </span>
            </span>
            <span
              className="faq-chevron flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f8] text-sm text-[#6b7280] group-open:bg-[#2cb34f] group-open:text-white"
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 5l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>
          <div
            className="border-t border-[#e3e4e6] px-4 pb-4 pt-3"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <p
              className="pl-10 text-sm leading-relaxed text-[#6b7280]"
              itemProp="text"
            >
              {item.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
