/**
 * Page content for the UPKEEP-style home page.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Section copy and imagery come from the reference site and are intentionally
 * preserved, because they ARE the design. Business identity — brand name,
 * contact details, addresses, social profiles, booking and review links, legal
 * entity — lives in `src/config/site.ts` and is referenced from here, so it can
 * be changed in one place.
 *
 * Image paths point at the downloaded assets in
 * public/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/.
 */

import type {
  BookingCtaData,
  ConsentBannerData,
  EyebrowText,
  FooterData,
  HeroData,
  JournalData,
  LocationsData,
  MobileMenuData,
  NavData,
  PressData,
  ServicesData,
  SignupPopupData,
  TestimonialsData,
} from "@/types/upkeepmedspa";
import { site } from "@/config/site";

const A = "/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const img = (file: string) => `${A}/images/${file}`;

export const BOOKING_URL = site.bookingUrl;

export const nav: NavData = {
  logo: { ...site.logo, src: site.logo.src || img("logo.png") },
  items: [
    { label: "Home", href: "/", active: true },
    {
      label: "Services",
      href: "/services/neurotoxins",
      children: [
        { label: "Neurotoxins", href: "/services/neurotoxins" },
        { label: "Lip Enhancement", href: "/services/lip-enhancement" },
        { label: "Dermal Fillers", href: "/services/dermal-fillers" },
        { label: "Regenerative", href: "/services/regenerative" },
        { label: "Specialty", href: "/services/specialty" },
        { label: "Facials & Skin", href: "/services/facials" },
        { label: "Laser", href: "/services/laser" },
        { label: "Body Contouring", href: "/services/body-contouring" },
      ],
    },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    {
      label: "Locations",
      href: "/locations",
      children: [
        { label: "Upper East Side", href: "/locations#ues" },
        { label: "Greenwich Village", href: "/locations#gv" },
        { label: "Brooklyn", href: "/locations#bk" },
        { label: "Chelsea", href: "/locations#ch" },
        { label: "Long Island", href: "/locations#li" },
        { label: "Dallas", href: "/locations#dal" },
        { label: "Addison", href: "/locations#add" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
  events: { label: "Upcoming Events", href: "/events" },
  book: { label: "Book Now", href: BOOKING_URL },
};

export const mobileMenu: MobileMenuData = {
  links: [
    { label: "Home", href: "/" },
    { label: "Neurotoxins", href: "/services/neurotoxins" },
    { label: "Lip Enhancement", href: "/services/lip-enhancement" },
    { label: "Dermal Fillers", href: "/services/dermal-fillers" },
    { label: "Specialty Injections", href: "/services/specialty" },
    { label: "Facials & Skin", href: "/services/facials" },
    { label: "Regenerative", href: "/services/regenerative" },
    { label: "Laser Treatments", href: "/services/laser" },
    { label: "Body Contouring", href: "/services/body-contouring" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Locations", href: "/locations" },
    { label: "Upcoming Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ],
  book: { label: "Book Now", href: BOOKING_URL },
};

export const hero: HeroData = {
  eyebrow: "Making Aesthetics Accessible",
  titleLines: ["Not Your Mother's", "Med Spa"],
  ctas: [
    { label: "Explore Our Services", href: "#services" },
    { label: "Schedule Your Visit", href: BOOKING_URL },
  ],
  specials: { label: "Explore Current Specials", href: "/specials" },
  background: {
    src: img("hero-home.jpg"),
    alt: "Woman surrounded by pink peonies and botanical florals — editorial beauty photography",
    width: 1193,
    height: 1080,
  },
  scrollHint: "Scroll",
};

export const intro: EyebrowText = {
  eyebrow: "Refined Results",
  heading: "Treatments That Speak for Themselves",
  body: "We combine medical expertise with an artist's eye. Every treatment is tailored to enhance your natural features — never overdone, always intentional.",
  cta: { label: "View Our Results", href: "/gallery" },
  image: { src: img("section-results.jpg"), alt: "Close-up of radiant skin after facial treatment", width: 2752, height: 1536 },
};

export const services: ServicesData = {
  eyebrow: "What We Offer",
  heading: "Our Services",
  tiles: [
    {
      title: "Neurotoxins",
      description: "Botox, Dysport & Xeomin — starting at $5/unit",
      highlights: ["$5/unit"],
      href: "/services/neurotoxins",
      image: { src: img("svc-neurotoxins.jpg"), alt: "Neurotoxin treatment", width: 1080, height: 1350 },
    },
    {
      title: "Lip Enhancement",
      description: "Quick Lips from $275 — full syringes from $550",
      highlights: ["$275", "$550"],
      href: "/services/lip-enhancement",
      image: { src: img("svc-lips.jpg"), alt: "Lip enhancement treatment", width: 2752, height: 1536 },
    },
    {
      title: "Dermal Fillers",
      description: "Cheeks, jawline, chin & smile lines",
      href: "/services/dermal-fillers",
      image: { src: img("svc-fillers.jpg"), alt: "Dermal filler treatment", width: 1080, height: 1619 },
    },
    {
      title: "Facials & Skin",
      description: "HydraFacial, microneedling & more",
      href: "/services/facials",
      image: { src: img("svc-facials.jpg"), alt: "Facial treatment", width: 1080, height: 1610 },
    },
    {
      title: "Regenerative",
      description: "PRP, Sculptra, Kybella & threads",
      href: "/services/regenerative",
      image: { src: img("svc-regenerative.jpg"), alt: "Regenerative treatment", width: 1080, height: 1610 },
    },
    {
      title: "Specialty",
      description: "Under-eye filler, rhinoplasty & more",
      href: "/services/specialty",
      image: { src: img("svc-specialty.jpg"), alt: "Specialty injectable treatment", width: 1080, height: 1610 },
    },
    {
      title: "Laser",
      description: "Resurfacing, tattoo removal & tightening",
      href: "/services/laser",
      image: { src: img("svc-laser.jpg"), alt: "Laser skin treatment", width: 2752, height: 1536 },
    },
    {
      title: "Body Contouring",
      description: "Sculpting, cellulite & skin tightening",
      href: "/services/body-contouring",
      image: { src: img("svc-body.jpg"), alt: "Body contouring treatment", width: 1080, height: 1610 },
    },
  ],
  pricingDisclosure:
    "Prices shown are our cash/debit prices. Credit card payments include a 3% surcharge that does not exceed our cost of acceptance. Cash, debit card and gift card payments are not surcharged.",
  cta: { label: "View All Services", href: "/services/neurotoxins" },
};

export const testimonials: TestimonialsData = {
  eyebrow: "Real Clients, Real Words",
  heading: "What Our Clients Say",
  /*
   * Placeholder reviews. Six entries of roughly the original length so the
   * carousel panel and dot row keep their measured proportions — replace with
   * real, consented client quotes.
   */
  items: [
    {
      stars: "★★★★★",
      quote:
        "Placeholder review one. Replace this with a real client quote of about this length so the carousel panel keeps its current proportions and the dot row does not shift.",
      name: "— Client One · Location A",
    },
    {
      stars: "★★★★★",
      quote:
        "Placeholder review two. Replace this with a real client quote of about this length so the carousel panel keeps its current proportions and the dot row does not shift.",
      name: "— Client Two · Location B",
    },
    {
      stars: "★★★★★",
      quote:
        "Placeholder review three. Replace this with a real client quote of about this length so the carousel panel keeps its current proportions and the dot row does not shift.",
      name: "— Client Three · Location C",
    },
    {
      stars: "★★★★★",
      quote:
        "Placeholder review four. Replace this with a real client quote of about this length so the carousel panel keeps its current proportions and the dot row does not shift.",
      name: "— Client Four · Location D",
    },
    {
      stars: "★★★★★",
      quote:
        "Placeholder review five. Replace this with a real client quote of about this length so the carousel panel keeps its current proportions and the dot row does not shift.",
      name: "— Client Five · Location E",
    },
    {
      stars: "★★★★★",
      quote:
        "Placeholder review six. Replace this with a real client quote of about this length so the carousel panel keeps its current proportions and the dot row does not shift.",
      name: "— Client Six · Location F",
    },
  ],
  note: {
    before: "Verified reviews from",
    link: { label: site.review.label, href: site.review.href },
    // non-breaking space, middot, non-breaking space — as rendered by the source
    after: " ·  Reviewer names as publicly listed",
  },
};

export const locations: LocationsData = {
  eyebrow: "Find Your Nearest Studio",
  heading: "7 Locations Across NYC & Dallas",
  cards: [
    { name: "Upper East Side", address: "100 Example Ave, New York", href: "/locations#ues", image: { src: img("loc-ues.jpg"), alt: "Upper East Side", width: 1200, height: 520 } },
    { name: "Greenwich Village", address: "100 Sample St, New York", href: "/locations#gv", image: { src: img("loc-gv.jpg"), alt: "Greenwich Village", width: 1200, height: 520 } },
    { name: "Brooklyn", address: "100 Demo Ave, Brooklyn", href: "/locations#bk", image: { src: img("loc-brooklyn.jpg"), alt: "Brooklyn", width: 1200, height: 520 } },
    { name: "Chelsea", address: "100 Place St, New York", href: "/locations#ch", image: { src: img("loc-chelsea.jpg"), alt: "Chelsea", width: 1080, height: 1399 } },
    { name: "Long Island", address: "100 Road Lane, Great Neck", href: "/locations#li", image: { src: img("loc-li.jpg"), alt: "Long Island", width: 1178, height: 659 } },
    { name: "Dallas", address: "100 Bonita Ave, Dallas", href: "/locations#dal", image: { src: img("loc-dallas.jpg"), alt: "Dallas", width: 1200, height: 520 } },
    { name: "Addison", address: "100 Belt Line Rd, Addison", href: "/locations#add", image: { src: img("loc-addison.jpg"), alt: "Addison", width: 1200, height: 520 } },
  ],
  cta: { label: "View All Locations", href: "/locations" },
};

export const press: PressData = {
  eyebrow: "As Seen In",
  items: ["Allure", "Vogue", "The Cut", "Byrdie", "Well+Good", "Cosmopolitan"],
};

export const journal: JournalData = {
  eyebrow: "Expert Insights",
  heading: `How to ${site.name.replace(/\. /g, " ").toUpperCase()}`,
  cta: { label: "Read All Articles", href: "/blog" },
  cards: [
    {
      category: "Neurotoxin",
      title: "The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin",
      excerpt:
        "How the Nefertiti Lift and DAO neurotoxin work together to subtly lift and define the lower face.",
      href: "/blog/nefertiti-lift",
      image: { src: img("blog-nefertiti-lift.jpg"), alt: "The Nefertiti Lift", width: 500, height: 649 },
    },
    {
      category: "Filler",
      title: "Under Eye Filler: The Secret to Looking Well-Rested",
      excerpt:
        "Under eye filler with Restylane® L helps smooth hollow tear troughs and reduce shadowing for a refreshed appearance.",
      href: "/blog/under-eye-filler",
      image: { src: img("blog-under-eye-filler.jpg"), alt: "Under Eye Filler", width: 500, height: 745 },
    },
    {
      category: "Skin Health",
      title: "Microneedling vs. Laser: Which Treatment Is Right for You?",
      excerpt:
        "Both are powerful options for boosting collagen and refining your skin — but they work in very different ways.",
      href: "/blog/microneedling-vs-laser",
      image: { src: img("blog-microneedling-vs-laser.jpg"), alt: "Microneedling vs Laser", width: 500, height: 750 },
    },
  ],
};

export const bookingCta: BookingCtaData = {
  eyebrow: "Your Visit Starts Here",
  heading: "Ready to Glow?",
  body: "Expert care, clear pricing, and treatments designed for real results. Book your complimentary consultation today.",
  cta: { label: "Book Your Visit", href: BOOKING_URL },
  background: { src: img("hero-home.jpg"), alt: "Floral beauty editorial", width: 1193, height: 1080 },
};

export const footer: FooterData = {
  logo: { ...site.logo, src: site.logo.src || img("logo.png") },
  tagline: site.tagline,
  socials: [...site.socials],
  columns: [
    {
      heading: "Navigate",
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services/neurotoxins" },
        { label: "Gallery", href: "/gallery" },
        { label: "Current Specials", href: "/specials" },
        { label: "Upcoming Events", href: "/events" },
        { label: "Financing", href: "/financing" },
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Neurotoxins", href: "/services/neurotoxins" },
        { label: "Lip Enhancement", href: "/services/lip-enhancement" },
        { label: "Dermal Fillers", href: "/services/dermal-fillers" },
        { label: "Facials & Skin", href: "/services/facials" },
        { label: "Regenerative", href: "/services/regenerative" },
        { label: "Specialty Injections", href: "/services/specialty" },
        { label: "Laser Treatments", href: "/services/laser" },
        { label: "Body Contouring", href: "/services/body-contouring" },
      ],
    },
  ],
  contact: {
    phone: site.contact.phone,
    phoneHref: site.contact.phoneHref,
    email: site.contact.email,
    emailHref: site.contact.emailHref,
    note: site.contact.locationsSummary,
    cta: { label: "Book Now", href: BOOKING_URL },
  },
  bottom: {
    // The ownership claim is appended only when configured; a template must not
    // assert who owns a business it knows nothing about.
    copyright: site.ownership ? `${site.legal.copyright} ${site.ownership}.` : site.legal.copyright,
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "Safety & Prescribing", href: "/safety-prescribing" },
      { label: "Accessibility", href: site.routes.accessibility },
    ],
  },
  accessibilityNotice: site.legal.accessibility,
};

export const consentBanner: ConsentBannerData = {
  before:
    "We use cookies to improve your experience and, with your permission, to show relevant ads and measure marketing performance. See our ",
  link: { label: "Privacy Policy", href: site.routes.privacy },
  after: ".",
  declineLabel: "Decline",
  acceptLabel: "Allow marketing cookies",
  storageKey: site.storageKeys.consent,
};

export const signupPopup: SignupPopupData = {
  eyebrow: "Stay In Bloom",
  titleLines: ["Keep Up", "With Us"],
  lede: "New services, seasonal offers, and a little editorial inspiration — straight to your inbox.",
  emailLabel: "Email",
  phoneLabel: "Phone",
  phoneOptionalLabel: "(optional)",
  emailPlaceholder: "you@example.com",
  phonePlaceholder: "(555) 000-0000",
  submitLabel: "Sign Me Up",
  fineprint: "By signing up you agree to receive occasional marketing messages. Unsubscribe anytime.",
  success: {
    eyebrow: "You're In",
    titleLines: ["See You", "Soon"],
    lede: "Thanks for joining the list. Keep an eye on your inbox.",
    closeLabel: "Close",
  },
  storageKey: site.storageKeys.signup,
  autoOpenDelayMs: 12000,
};
