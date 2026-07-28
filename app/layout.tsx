import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "kentsele.ist — İstanbul Kentsel Dönüşüm İlanları",
    template: "%s · kentsele.ist",
  },
  description:
    "İstanbul kentsel dönüşüm ilanları. Malikler ilan verir, müteahhitler ücretsiz inceler ve arar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-[#111321]">
        {children}
      </body>
    </html>
  );
}
