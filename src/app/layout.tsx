import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/constants/config";
import "./globals.css";
import { ProgressProvider } from "@/components/providers/progress-provider";
import WhatsAppButton from "@/components/cream-grade/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Just Stock Trading Limited | Strategic Sourcing & Wholesale Export",
  description:
    "UK-based procurement and wholesale export company delivering used clothing, premium cream grade clothing and liquidation stock to international buyers across Africa, the Middle East, and Eastern Europe.",
  keywords: [
    "wholesale export UK",
    "cream grade clothing",
    "used clothing wholesale",
    "liquidation stock UK",
    "procurement services UK",
    "clothing export Africa",
    "wholesale clothing bales",
    "strategic sourcing partner",
  ],
  authors: [{ name: "Just Stock Trading Limited" }],
  openGraph: {
    title: "Just Stock Trading Limited | Strategic Sourcing & Export",
    description:
      "UK-based procurement and wholesale export company delivering premium cream grade clothing to international buyers.",
    url: "https://juststocktrading.com",
    siteName: "Just Stock Trading Limited",
    images: [
      {
        url: "/images/bags-of-clothing.png",
        width: 1200,
        height: 630,
        alt: "Just Stock Trading Limited - Wholesale Export & Sourcing",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Just Stock Trading Limited | Strategic Sourcing & Export",
    description:
      "UK-based procurement and wholesale export company delivering premium cream grade clothing to international buyers.",
    images: ["/images/bags-of-clothing.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} 
        ${playfair.variable} 
        font-sans antialiased 
        bg-transparent 
        relative 
        min-h-screen`}
      >
        <Providers>
          <ProgressProvider />
          <div className="relative z-10">{children}</div>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
