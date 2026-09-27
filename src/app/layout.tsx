import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { upkeepFontVariables } from "@/lib/upkeep-fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: site.seo.title,
  description: site.seo.description,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: "website",
    url: site.seo.url,
    siteName: site.name,
    locale: site.seo.locale,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.seo.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior="smooth" restores smooth scrolling for client-side
    // navigation, which Next 16 no longer enables by default. The ported
    // stylesheet sets `html { scroll-behavior: smooth }` with
    // `scroll-padding-top: 80px` to clear the fixed nav.
    <html lang="en" data-scroll-behavior="smooth" className={upkeepFontVariables}>
      <body>{children}</body>
    </html>
  );
}
