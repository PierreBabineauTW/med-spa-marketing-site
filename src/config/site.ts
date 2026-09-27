/**
 * ---------------------------------------------------------------------------
 * SITE CONFIGURATION — the single place to change the business
 * ---------------------------------------------------------------------------
 *
 * Everything business-specific lives here. Replace the values below and the
 * whole page follows: brand name, logo, contact details, addresses, social
 * profiles, booking and review links, legal entity and SEO metadata.
 *
 * The values ship as neutral placeholders so this stays a reusable template.
 *
 * A note on the design lineage: the *visual* system — palette, Cormorant
 * Garamond + Switzer type pairing, the editorial photography, the section
 * rhythm, the card language — is intentionally preserved from the reference
 * site. Only the identifying data is configurable.
 *
 * Design tokens that would need changing for a different brand are already in
 * `src/app/globals.css` (`--color-accent` and friends) and the generated
 * `src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css` `:root` block.
 */

export const site = {
  /** Brand name. Used in metadata, the logo alt text and the legal line. */
  name: "Aperture Studio",
  /**
   * Wordmark. The reference file is the source site's logo — swap it for your
   * own at the same intrinsic size, or set `src` to "" to fall back to the
   * brand name rendered in the display serif.
   */
  logo: {
    src: "/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/images/logo.png",
    alt: "Aperture Studio",
    width: 509,
    height: 92,
  },

  /** Short descriptor used in the footer tagline. */
  tagline: "Not your mother's med spa. Making aesthetics accessible since 2019.",

  contact: {
    phone: "(555) 010-0100",
    phoneHref: "tel:+15550100100",
    email: "hello@example.com",
    emailHref: "mailto:hello@example.com",
    /** Locations summary line shown above the booking button. */
    locationsSummary: "7 locations across NYC & Dallas",
  },

  /** Where the "Book Now" / "Book Your Visit" buttons go. */
  bookingUrl: "https://example.com/book",

  socials: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" as const },
    { label: "TikTok", href: "https://tiktok.com/", icon: "tiktok" as const },
    { label: "Facebook", href: "https://facebook.com/", icon: "facebook" as const },
  ],

  /** Review platform credited under the testimonial carousel. */
  review: {
    label: "Google",
    href: "https://www.google.com/",
  },

  legal: {
    /** Shown at the bottom of the footer. */
    copyright: "© 2026 Aperture Studio. All rights reserved. Women-owned & operated.",
    /** Accessible-accommodations statement. */
    accessibility:
      "Accessibility: If you are visually impaired or have any other impairment and you wish to discuss potential accommodations related to using this website, please contact our office at (555) 010-0100 or hello@example.com. Read our full Accessibility Statement.",
  },

  /** Internal routes the footer and a11y widget link to. */
  routes: {
    accessibility: "/accessibility",
  },

  seo: {
    title: "Aperture Studio — Not Your Mother's Med Spa | NYC & Dallas",
    description:
      "A women-owned medical spa with 7 locations across NYC and Dallas. Injectables, laser treatments, body contouring, and more. Making aesthetics accessible.",
    url: "https://example.com",
    locale: "en_US",
    themeColor: "#0a0a0a",
  },

  /** localStorage keys — change the suffix to re-prompt returning visitors. */
  storageKeys: {
    consent: "upkeep-consent-v1",
    signup: "upkeep_signup_v1",
    largeText: "upkeep-a11y-large-text",
    reduceMotion: "upkeep-a11y-reduce-motion",
  },
} as const;

export type SiteConfig = typeof site;
