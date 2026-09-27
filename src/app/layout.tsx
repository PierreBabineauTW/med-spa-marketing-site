import type { Metadata, Viewport } from "next";
import { upkeepFontVariables } from "@/lib/upkeep-fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.upkeepmedspa.com"),
  title: "UPKEEP Med Spa — Not Your Mother's Med Spa | NYC & Dallas",
  description:
    "UPKEEP Med Spa is a women-owned medical spa with 7 locations across NYC and Dallas. Injectables, laser treatments, body contouring, and more. Making aesthetics accessible.",
  openGraph: {
    title: "UPKEEP Med Spa — Not Your Mother's Med Spa",
    description:
      "High-quality aesthetic care made accessible. Botox, fillers, laser treatments, body contouring at 7 locations in NYC & Dallas.",
    type: "website",
    url: "https://www.upkeepmedspa.com",
    siteName: "UPKEEP Med Spa",
    locale: "en_US",
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
  themeColor: "#0a0a0a",
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
