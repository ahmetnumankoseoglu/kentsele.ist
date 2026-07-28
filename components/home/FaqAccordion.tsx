"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "İlan vermek ücretli mi?",
    a: "Hayır. kentsele.ist üzerinden kentsel dönüşüm ilanı oluşturmak, yayınlatmak ve müteahhitlerle iletişime geçmek tamamen ücretsizdir.",
  },
  {
    q: "İlanım ne zaman yayınlanır?",
    a: "İlanın inceleme sürecine alınır. Ekibimiz teyit için seni arayabilir. Onaylandıktan sonra İstanbul ilan listesinde görünür.",
  },
  {
    q: "Telefon numaram herkese açık mı?",
    a: "Yayındaki ilanlarda telefon ve WhatsApp görünür; böylece müteahhitler seni arayabilir. Anlaşma sağlandığında numaran kapatılır, ilan listede kalır.",
  },
  {
    q: "Müteahhit misiniz? Nasıl ilan bulursunuz?",
    a: "Üyelik gerekmez. Ana sayfadan ilçeye göre ilanları gezebilir, detayda Ara veya WhatsApp ile malikle iletişime geçebilirsin.",
  },
  {
    q: "Sadece İstanbul mu?",
    a: "Evet. kentsele.ist yalnızca İstanbul kentsel dönüşüm ilanları içindir. 39 ilçenin tamamı listelenir ve filtrelenebilir.",
  },
  {
    q: "İlanımı nasıl düzenlerim veya anlaşma bildiririm?",
    a: "İlan gönderildikten sonra sana özel bir yönetim linki verilir. Bu linkle ilanı güncelleyebilir, anlaşma sağlandığını admin paneline bildirebilirsin.",
  },
] as const;

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-[#111321]">
                {i + 1}. {item.q}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg font-medium leading-none ${
                  isOpen
                    ? "bg-[#2cb34f] text-white"
                    : "bg-[#f8f8f8] text-[#6b7280]"
                }`}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-[#e3e4e6] px-4 py-3">
                <p className="text-sm leading-relaxed text-[#6b7280]">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
