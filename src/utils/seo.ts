import { Metadata } from "next";
import { siteConfig } from "@/constants/config";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  type = "website",
  noIndex = false,
}: SeoProps = {}): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description,
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      type: type as any,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      siteName: siteConfig.name,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      images: [image],
      creator: "@thriftfactory", // Replace with actual handle
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
