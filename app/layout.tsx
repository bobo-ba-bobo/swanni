import type { Metadata, Viewport } from "next";
import { Black_Han_Sans, IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

const display = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const sans = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "swanni × bobo — 욕심부리기",
    template: "%s — swanni × bobo",
  },
  description: "우리가 욕심내는 것들. want it all, till grey and old.",
};

export const viewport: Viewport = {
  themeColor: "#ece7dd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${mono.variable} ${sans.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
