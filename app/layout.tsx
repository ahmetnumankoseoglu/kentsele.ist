import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "kentsele.ist — İstanbul Kentsel Dönüşüm İlanları",
    template: "%s · kentsele.ist",
  },
  description:
    "İstanbul kentsel dönüşüm ilanları. Malikler ilan verir, müteahhitler teklif için arar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F6F3] text-slate-900">
        {children}
      </body>
    </html>
  );
}
