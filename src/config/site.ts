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

/**
 * Local aliases so derived strings (copyright, accessibility statement, share
 * image alt text) are built from the fields above instead of re-typing them.
 * Change a value once and every derived string follows.
 */
const siteName = "Aperture Studio";
const sitePhone = "(555) 010-0100";
const siteEmail = "hello@example.com";

export const site = {
  /** Brand name. Used in metadata, the logo alt text and the legal line. */
  name: siteName,
  /**
   * Wordmark. The reference file is the source site's logo — swap it for your
   * own at the same intrinsic size, or set `src` to "" to fall back to the
   * brand name rendered in the display serif.
   */
  logo: {
    src: "/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/images/logo.png",
    alt: siteName,
    width: 509,
    height: 92,
  },

  /**
   * Short descriptor used in the footer tagline.
   * Deliberately makes no "since YEAR" claim — `content.foundedYear` is null
   * until the business confirms it.
   */
  tagline: "Not your mother's med spa. Making aesthetics accessible.",

  contact: {
    phone: sitePhone,
    phoneHref: "tel:+15550100100",
    email: siteEmail,
    emailHref: "mailto:hello@example.com",
    /** Locations summary line shown above the booking button. */
    locationsSummary: "7 locations across NYC & Dallas",
  },

  /**
   * Ownership claim shown after the copyright line. `null` renders nothing —
   * a template must not assert who owns a business it knows nothing about.
   * Set it once you have the facts ("Women-owned & operated").
   */
  ownership: null as string | null,

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
    copyright: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
    /**
     * Accessible-accommodations statement. Built from the contact fields above
     * so it can never go stale when the phone or email changes.
     */
    accessibility: `Accessibility: If you are visually impaired or have any other impairment and you wish to discuss potential accommodations related to using this website, please contact our office at ${sitePhone} or ${siteEmail}. Read our full Accessibility Statement.`,
  },

  /** Internal routes the footer, a11y widget and overlays link to. */
  routes: {
    accessibility: "/accessibility",
    privacy: "/privacy-policy",
    cancellation: "/cancellation-policy",
    safety: "/safety-prescribing",
    services: "/services",
    contact: "/contact",
    locations: "/locations",
    gallery: "/gallery",
    blog: "/blog",
    about: "/about",
  },

  seo: {
    title: "Aperture Studio — Not Your Mother's Med Spa | NYC & Dallas",
    // Describes what the business does, not who owns it or how long it has
    // existed. Those are claims a template cannot make; `ownership` and
    // `content.foundedYear` are the documented places to add them.
    description:
      "Medical spa treatments — injectables, dermal fillers, facials, laser and body contouring. Every visit starts with a consultation, not a prescription.",
    /**
     * The site's own origin. Drives metadataBase, every canonical URL, the
     * sitemap and robots.txt, so it must be the real public origin in
     * production — a wrong value produces wrong absolute URLs site-wide.
     *
     * Override with `NEXT_PUBLIC_SITE_URL` so a deploy does not need a code
     * change. The `NEXT_PUBLIC_` prefix is required: it is inlined at build
     * time, so this stays safe to reference from client components.
     */
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
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
