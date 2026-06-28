import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Gowun_Dodum } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Gowun_Dodum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "swanni & bobo",
  description: "우리 둘만의 버킷리스트 — to finish all of them till grey and old",
};

export const viewport: Viewport = {
  themeColor: "#eaf3fb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
