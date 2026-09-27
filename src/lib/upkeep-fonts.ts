import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";

/**
 * Switzer — the target's body face. Served from Fontshare (Indian Type Foundry,
 * free for commercial use) and self-hosted here; there is no Google Fonts
 * equivalent. Colocated next to this module because next/font/local resolves
 * `src` paths relative to the file that calls it.
 */
export const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-switzer",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

/**
 * Cormorant Garamond — the target's display/heading face, loaded from Google
 * Fonts. The live site requests the non-variable set (300/400/500 plus 300/400
 * italics), so weights and styles are both listed explicitly.
 */
export const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Class list for <html> that activates both font variables. */
export const upkeepFontVariables = `${switzer.variable} ${cormorant.variable}`;
