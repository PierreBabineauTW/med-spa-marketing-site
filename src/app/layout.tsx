import type { Metadata, Viewport } from "next";

import { AccessibilityMenu } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/AccessibilityMenu";
import { ConsentBanner } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ConsentBanner";
import { SignupPopup } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SignupPopup";
import { SiteFooter } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SiteFooter";
import { SiteNav } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SiteNav";
import { site } from "@/config/site";
import { upkeepFontVariables } from "@/lib/upkeep-fonts";
import { absoluteUrl } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: {
    default: site.seo.title,
    template: `%s | ${site.name}`,
  },
  description: site.seo.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    url: site.seo.url,
    locale: site.seo.locale,
    // Subpages set their own via pageMetadata(); the home page inherits this.
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.seo.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [absoluteUrl("/og-image.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.seo.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior="smooth" restores smooth scrolling for client-side
    // navigation, which Next 16 no longer enables by default. The ported
    // stylesheet sets `html { scroll-behavior: smooth }` with
    // `scroll-padding-top: 80px` to clear the fixed nav.
    <html lang="en" data-scroll-behavior="smooth" className={upkeepFontVariables}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <SiteNav />

        {children}

        <SiteFooter />

        <ConsentBanner />
        <SignupPopup />
        <AccessibilityMenu />
      </body>
    </html>
  );
}
