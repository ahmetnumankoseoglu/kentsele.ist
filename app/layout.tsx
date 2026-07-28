import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
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
    <html
      lang="tr"
      className={`${raleway.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111321]">
        {children}
      </body>
    </html>
  );
}
