"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/content/faq";

export function FaqAccordion({
  items = FAQ_ITEMS,
}: {
  items?: readonly { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            data-open={isOpen}
            className="faq-item card animate-fade-up overflow-hidden"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isOpen
                      ? "bg-[#2cb34f] text-white"
                      : "bg-[#eaf8ee] text-[#168f43]"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm font-semibold leading-snug text-[#111321]">
                  {item.q}
                </span>
              </span>
              <span
                className={`faq-chevron flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                  isOpen
                    ? "bg-[#2cb34f] text-white"
                    : "bg-[#f8f8f8] text-[#6b7280]"
                }`}
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
            </button>
            <div className="faq-panel" data-open={isOpen}>
              <div className="faq-panel-inner">
                <div className="border-t border-[#e3e4e6] px-4 pb-4 pt-3">
                  <p className="pl-10 text-sm leading-relaxed text-[#6b7280]">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
