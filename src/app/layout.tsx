import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Hanken_Grotesk, Newsreader } from "next/font/google";
import { BRAND_FULL_TITLE, BRAND_LOGO_PATH } from "@/lib/brand";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: BRAND_FULL_TITLE,
  description: "Corporate sustainability portal for monitoring tree-planting projects",
  icons: {
    icon: BRAND_LOGO_PATH,
    apple: BRAND_LOGO_PATH,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hanken.variable} ${ibmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
