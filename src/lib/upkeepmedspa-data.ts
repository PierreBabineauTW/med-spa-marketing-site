/**
 * Real content for the UPKEEP Med Spa home page clone, copied verbatim from
 * https://upkeepmedspa.com/ — not paraphrased, not placeholdered.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Every string, href and image path matches the live page. Image paths point at
 * the downloaded assets in public/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/.
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

const A = "/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const img = (file: string) => `${A}/images/${file}`;

export const BOOKING_URL = "https://www.joinblvd.com/b/upkeep-medspa/widget#/locations";

export const nav: NavData = {
  logo: { src: img("logo.png"), alt: "UPKEEP", width: 509, height: 92 },
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
  items: [
    {
      stars: "★★★★★",
      quote:
        "I have come to see Naz for a few years now and adore her work so much I've sent quite a handful of friends in as well. Upkeep has many artists under their roof(s) with different aesthetics. Their facials, hair removal etc are all awesome too. I've done microneedling RF with them several times. I fly in to come to upkeep. I live in Miami. That says a lot.",
      name: "— Jessie K. · Greenwich Village",
    },
    {
      stars: "★★★★★",
      quote:
        "I had a wonderful visit to Upkeep clinic in Brooklyn today. Injector Collin is incredibly knowledgeable, exceptionally pleasant, professional, and helpful. I have a low pain tolerance — we did Botox and lip fillers today and I did not feel any pain or discomfort. I highly recommend Collin and the entire team. I'm definitely going back.",
      name: "— Henga B. · Brooklyn",
    },
    {
      stars: "★★★★★",
      quote:
        "Best quick lip and Botox I've ever received from Lana. I've moved around over the years to various metropolitan cities (Los Angeles, Chicago, Philadelphia). My experience at Upkeep was by far the best. The office was pleasant, clean and classy. So happy I found my place here.",
      name: "— Michele S. · Dallas · Knox Henderson",
    },
    {
      stars: "★★★★★",
      quote:
        "Nazeli made my dreams come true. She was thorough, kind, and made me feel at ease with the entire process. I had never done lip filler before and she answered all my silly questions and made me feel fantastic.",
      name: "— Chael M. · Greenwich Village",
    },
    {
      stars: "★★★★★",
      quote:
        "Izzy is my injector and she is perfect. She is so reassuring if I'm trying something new and she explains everything you need to know. I did want to do jawline contouring but we decided to do chin and cheeks instead and the results came out great.",
      name: "— Sarah R. · Addison",
    },
    {
      stars: "★★★★★",
      quote:
        "I have done RF microneedling and Botox at Upkeep and highly recommend. RF microneedling was with Aleigha and she was amazing. Then Botox was with Anna and she did a great job too. They make you feel comfortable and make sure you have all of your questions answered.",
      name: "— Alison T. · Addison",
    },
  ],
  note: {
    before: "Verified reviews from",
    link: { label: "Yelp", href: "https://www.yelp.com/biz/upkeep-new-york-2" },
    // non-breaking space, middot, non-breaking space — as rendered by the source
    after: " ·  Reviewer names as publicly listed",
  },
};

export const locations: LocationsData = {
  eyebrow: "Find Your Nearest Studio",
  heading: "7 Locations Across NYC & Dallas",
  cards: [
    { name: "Upper East Side", address: "330 East 76th St, New York", href: "/locations#ues", image: { src: img("loc-ues.jpg"), alt: "Upper East Side", width: 1200, height: 520 } },
    { name: "Greenwich Village", address: "33 Bedford St, New York", href: "/locations#gv", image: { src: img("loc-gv.jpg"), alt: "Greenwich Village", width: 1200, height: 520 } },
    { name: "Brooklyn", address: "480 5th Ave, Brooklyn", href: "/locations#bk", image: { src: img("loc-brooklyn.jpg"), alt: "Brooklyn", width: 1200, height: 520 } },
    { name: "Chelsea", address: "224 W 18th St, New York", href: "/locations#ch", image: { src: img("loc-chelsea.jpg"), alt: "Chelsea", width: 1080, height: 1399 } },
    { name: "Long Island", address: "39 Great Neck Rd, Great Neck", href: "/locations#li", image: { src: img("loc-li.jpg"), alt: "Long Island", width: 1178, height: 659 } },
    { name: "Dallas", address: "5207 Bonita Ave, Dallas", href: "/locations#dal", image: { src: img("loc-dallas.jpg"), alt: "Dallas", width: 1200, height: 520 } },
    { name: "Addison", address: "5100 Belt Line Rd, Addison", href: "/locations#add", image: { src: img("loc-addison.jpg"), alt: "Addison", width: 1200, height: 520 } },
  ],
  cta: { label: "View All Locations", href: "/locations" },
};

export const press: PressData = {
  eyebrow: "As Seen In",
  items: ["Allure", "Vogue", "The Cut", "Byrdie", "Well+Good", "Cosmopolitan"],
};

export const journal: JournalData = {
  eyebrow: "Expert Insights",
  heading: "How to UPKEEP",
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
  logo: { src: img("logo.png"), alt: "UPKEEP", width: 509, height: 92 },
  tagline: "Not your mother's med spa. Making aesthetics accessible since 2019.",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/upkeepmedspa", icon: "instagram" },
    { label: "TikTok", href: "https://www.tiktok.com/@upkeepmedspa", icon: "tiktok" },
    { label: "Facebook", href: "https://www.facebook.com/Upkeepmedspa/", icon: "facebook" },
  ],
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
    phone: "(833) 875-3377",
    phoneHref: "tel:+18338753377",
    email: "info@upkeepmedspa.com",
    emailHref: "mailto:info@upkeepmedspa.com",
    note: "7 locations across NYC & Dallas",
    cta: { label: "Book Now", href: BOOKING_URL },
  },
  bottom: {
    copyright: "© 2026 Upkeep Med Spa. All rights reserved. Women-owned & operated.",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "Safety & Prescribing", href: "/safety-prescribing" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  accessibilityNotice:
    "Accessibility: If you are visually impaired or have any other impairment and you wish to discuss potential accommodations related to using this website, please contact our office at (833) 875-3377 or info@upkeepmedspa.com. Read our full Accessibility Statement.",
};

export const consentBanner: ConsentBannerData = {
  before:
    "We use cookies to improve your experience and, with your permission, to show relevant ads and measure marketing performance. See our ",
  link: { label: "Privacy Policy", href: "/privacy-policy.html" },
  after: ".",
  declineLabel: "Decline",
  acceptLabel: "Allow marketing cookies",
  storageKey: "upkeep-consent-v1",
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
  storageKey: "upkeep_signup_v1",
  autoOpenDelayMs: 12000,
};
