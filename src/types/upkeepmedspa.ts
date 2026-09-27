/**
 * Content types for the UPKEEP Med Spa home page clone.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Every field here mirrors a structure that actually exists in the target's
 * markup, so components can be typed without inventing structure.
 */

export type NavChild = {
  label: string;
  href: string;
};

/**
 * Every downloaded asset, with its intrinsic pixel size measured in the browser
 * off the live page. `width`/`height` are required by `next/image` for
 * non-`fill` usage and drive the generated `srcset`; where the ported stylesheet
 * forces a box (`aspect-ratio`, absolute inset) the CSS wins over these numbers.
 */
export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type NavItem = {
  label: string;
  href: string;
  /** Present only on items that open a dropdown. */
  children?: NavChild[];
  /** True for the item matching the current route. */
  active?: boolean;
};

export type NavCta = {
  label: string;
  href: string;
};

export type NavData = {
  logo: Img;
  items: NavItem[];
  /** Secondary CTA, e.g. "Upcoming Events". */
  events: NavCta;
  /** Primary CTA, e.g. "Book Now". Usually an off-site booking URL. */
  book: NavCta;
};

export type MobileMenuData = {
  links: NavChild[];
  book: NavCta;
};

export type HeroData = {
  eyebrow: string;
  /** Rendered with a <br/> after the first line. */
  titleLines: [string, string];
  ctas: { label: string; href: string }[];
  specials: { label: string; href: string };
  background: Img;
  scrollHint: string;
};

export type EyebrowText = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
  image: Img;
};

export type ServiceTile = {
  title: string;
  description: string;
  /**
   * Substrings of `description` that the source wraps in a rose-gold
   * `<span style="color:#d4a090">` to highlight a price. Split `description` on
   * these and wrap the matches; do not inject markup into `description` itself.
   */
  highlights?: string[];
  href: string;
  image: Img;
};

export type ServicesData = {
  eyebrow: string;
  heading: string;
  tiles: ServiceTile[];
  /** Fine-print pricing disclaimer rendered between the grid and the CTA. */
  pricingDisclosure: string;
  cta: { label: string; href: string };
};

export type Testimonial = {
  /** Literal five-star glyphs, as the source renders them. */
  stars: string;
  quote: string;
  name: string;
};

/**
 * The review disclaimer under the carousel. The source renders it as
 * "Verified reviews from <a>Yelp</a> · Reviewer names as publicly listed", so the
 * link is part of the copy rather than trailing text.
 */
export type TestimonialNote = {
  before: string;
  link: { label: string; href: string };
  /** Starts with a non-breaking space, then "·", then another. */
  after: string;
};

export type TestimonialsData = {
  eyebrow: string;
  heading: string;
  items: Testimonial[];
  note: TestimonialNote;
};

export type LocationCard = {
  name: string;
  address: string;
  href: string;
  image: Img;
};

export type LocationsData = {
  eyebrow: string;
  heading: string;
  cards: LocationCard[];
  cta: { label: string; href: string };
};

export type PressData = {
  eyebrow: string;
  /** Publication wordmarks, rendered as text. */
  items: string[];
};

export type BlogCard = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  image: Img;
};

export type JournalData = {
  eyebrow: string;
  heading: string;
  cta: { label: string; href: string };
  cards: BlogCard[];
};

export type BookingCtaData = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
  background: Img;
};

export type FooterColumn = {
  heading: string;
  links: NavChild[];
};

export type FooterData = {
  logo: Img;
  tagline: string;
  socials: { label: string; href: string; icon: "instagram" | "tiktok" | "facebook" }[];
  columns: FooterColumn[];
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    note: string;
    cta: NavCta;
  };
  bottom: { copyright: string; links: NavChild[] };
  accessibilityNotice: string;
};

/**
 * Marketing cookie consent bar. Injected at runtime by the target's
 * `consent-banner.js`; the copy links the privacy policy mid-sentence, so the
 * link is modelled separately rather than embedded in `text`.
 */
export type ConsentBannerData = {
  /** Sentence before the privacy-policy link, including its trailing space. */
  before: string;
  link: { label: string; href: string };
  /** Sentence after the link, starting with its trailing period. */
  after: string;
  declineLabel: string;
  acceptLabel: string;
  /** localStorage key recording the visitor's answer. */
  storageKey: string;
};

/**
 * Newsletter popup. Auto-opens 12s after load unless the visitor has already
 * engaged; the form posts to the target's Mailchimp JSONP endpoint, which is out
 * of scope for a clone, so submission is handled client-side.
 */
export type SignupPopupData = {
  eyebrow: string;
  /** Rendered with a <br /> between the two lines. */
  titleLines: [string, string];
  lede: string;
  emailLabel: string;
  phoneLabel: string;
  phoneOptionalLabel: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  submitLabel: string;
  fineprint: string;
  success: {
    eyebrow: string;
    titleLines: [string, string];
    lede: string;
    closeLabel: string;
  };
  /** localStorage key storing "dismissed:<timestamp>" once closed. */
  storageKey: string;
  /** Delay in ms before the popup auto-opens. */
  autoOpenDelayMs: number;
};
