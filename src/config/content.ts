import type { SiteConfig } from "./site";

/**
 * ---------------------------------------------------------------------------
 * CONTENT CONFIGURATION
 * ---------------------------------------------------------------------------
 *
 * Everything a business in this sector would need to fill in, beyond the
 * identity fields in `site.ts`.
 *
 * ## No fabricated business data
 *
 * Anything that would be a factual claim about a real business is either a
 * `null` (shown as a clear "not set" state) or an explicitly-flagged sample.
 * Specifically:
 *
 *   - `hours`            -> null until you know them
 *   - `foundedYear`      -> null; the tagline therefore makes no year claim
 *   - `phone` per studio -> null; the UI omits the row instead of faking it
 *   - `mapUrl`           -> null until a real listing exists
 *   - `posts[].sample`   -> true, so the article page can say so honestly
 *   - service pricing    -> only what the reference site publicly states, and
 *                           it lives in `pricing` so it is easy to delete
 *
 * Nothing here invents reviews, clients, awards, certifications, staff,
 * statistics, opening hours or performance claims.
 */

export type Service = {
  slug: string;
  name: string;
  /** Short line used on cards and under the page hero. */
  tagline: string;
  /**
   * One or two sentences describing the service. Used as the page's meta
   * description and as the Service schema description, so it must be a real
   * summary of the page — not the tagline, which is too short to stand alone in
   * a search result.
   */
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  /** "What to expect" bullets. Generic, non-prescriptive, no outcome claims. */
  whatToExpect: string[];
  /** Short, honest FAQ. Answers describe process, not results. */
  faq: { q: string; a: string }[];
  /**
   * Published pricing, if any. Empty array renders no pricing table.
   * The reference site publishes cash/debit prices; keep or clear as suits you.
   */
  pricing: { label: string; amount: string; unit?: string }[];
  /** Set true once you have written the real page copy for this service. */
  sample: boolean;
};

export type Studio = {
  /** Anchor id, so /locations#ues style deep links keep working. */
  id: string;
  name: string;
  address: string;
  city: string;
  /** null → the phone row is omitted rather than faked. */
  phone: string | null;
  /** null → the hours row is omitted rather than faked. */
  hours: string | null;
  /** null → the directions button is omitted. */
  mapUrl: string | null;
  image: { src: string; alt: string; width: number; height: number };
  region: "nyc" | "texas";
};

export type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  title: string;
  caption: string;
};

export type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: { src: string; alt: string; width: number; height: number };
  /**
   * Article body. `body` blocks render in order; the page shows a visible
   * sample-content notice when `sample` is true, so a half-written article is
   * never mistaken for finished copy.
   */
  sample: boolean;
  body: { type: "p" | "h3" | "ul"; text?: string; items?: string[] }[];
};

const A = "/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const img = (file: string) => `${A}/images/${file}`;

export const content = {
  /** Null until you know it — the tagline makes no year claim. */
  foundedYear: null as number | null,

  /** Null until you know them. */
  hours: null as { label: string; value: string }[] | null,

  services: [
    {
      slug: "neurotoxins",
      name: "Neurotoxins",
      tagline: "Botox, Dysport & Xeomin — starting at $5/unit",
      description:
        "Medical neurotoxin injections with Botox, Dysport and Xeomin, from $5 per unit. A consultation comes before any treatment.",
      image: { src: img("svc-neurotoxins.jpg"), alt: "Neurotoxin treatment", width: 1080, height: 1350 },
      whatToExpect: [
        "A consultation to talk through what you want to change and what is realistic.",
        "The injector maps the muscles they plan to treat before anything is done.",
        "Treatment itself is a series of small injections; most people are in and out quickly.",
        "A follow-up plan, including when to expect results and when to come back.",
      ],
      faq: [
        { q: "What happens at a first appointment?", a: "You start with a consultation. The injector explains the options, maps the treatment area and only proceeds if you both agree on a plan." },
        { q: "How long do results last?", a: "It varies by person, the area treated and the dose. Your injector will give you a realistic window at your consultation rather than a fixed promise." },
        { q: "Is there downtime?", a: "Most people return to work the same day. You may notice small bumps where injections were placed, which usually settle within a few hours." },
      ],
      pricing: [
        { label: "Per unit", amount: "from $5", unit: "cash / debit" },
      ],
      sample: false,
    },
    {
      slug: "lip-enhancement",
      name: "Lip Enhancement",
      tagline: "Quick Lips from $275 — full syringes from $550",
      description:
        "Lip filler from $275 for a quick treatment, with full syringes from $550. Planned around proportion and symmetry, with a top-up included.",
      image: { src: img("svc-lips.jpg"), alt: "Lip enhancement treatment", width: 2752, height: 1536 },
      whatToExpect: [
        "A conversation about proportion and symmetry rather than a target number.",
        "Numbing, then careful placement — lip work is unforgiving and is done slowly.",
        "Instructions for the first few days, including what is normal and what is not.",
        "A planned top-up appointment, which is standard practice for lip filler.",
      ],
      faq: [
        { q: "Do lips swell afterwards?", a: "Yes, some swelling is normal and usually peaks within a day. Most of it settles over the following few days." },
        { q: "Why is a top-up needed?", a: "Lip filler often settles unevenly as it integrates. A planned top-up lets the injector balance the result." },
        { q: "Can I bring a reference photo?", a: "Yes. It is one of the most useful things you can bring to a lip consultation." },
      ],
      pricing: [
        { label: "Quick Lips", amount: "from $275" },
        { label: "Full syringe", amount: "from $550" },
      ],
      sample: false,
    },
    {
      slug: "dermal-fillers",
      name: "Dermal Fillers",
      tagline: "Cheeks, jawline, chin & smile lines",
      description: "Dermal filler for cheeks, jawline, chin and smile lines. We treat the supporting structure before adding volume, which is what keeps the result looking natural.",
      image: { src: img("svc-fillers.jpg"), alt: "Dermal filler treatment", width: 1080, height: 1619 },
      whatToExpect: [
        "Facial assessment covering bone structure, not just surface lines.",
        "A plan that treats the supporting structure before adding volume.",
        "Treatment in stages, with the option to stop and reassess.",
        "A follow-up to check how the filler has settled.",
      ],
      faq: [
        { q: "Which areas do you treat?", a: "Cheeks, jawline, chin and smile lines are the most common. Your injector will confirm what suits your face." },
        { q: "Why do you treat structure first?", a: "Volume added without support tends to look heavy. Treating structure first is what keeps the result natural." },
        { q: "How long does filler last?", a: "It depends on the product and the area. Expect a range at your consultation, not a single number." },
      ],
      pricing: [],
      sample: false,
    },
    {
      slug: "facials",
      name: "Facials & Skin",
      tagline: "HydraFacial, microneedling & more",
      description:
        "Facials and skin treatments including HydraFacial and microneedling, matched to what your skin needs that day, with aftercare and a suggested interval.",
      image: { src: img("svc-facials.jpg"), alt: "Facial treatment", width: 1080, height: 1610 },
      whatToExpect: [
        "A skin consultation and, where relevant, a patch test for actives.",
        "A treatment matched to what your skin is doing that day, not a fixed menu.",
        "Clear aftercare, including what to avoid in the days either side.",
        "A suggested interval, with the option to book the next one before you leave.",
      ],
      faq: [
        { q: "Do I need a patch test?", a: "For stronger actives, yes — usually 48 hours before. Your practitioner will tell you at the consultation." },
        { q: "How often should I come in?", a: "It depends on the treatment and your skin. Many people start monthly and adjust from there." },
        { q: "Can I wear makeup after?", a: "Usually yes, but not immediately — let the skin settle for a few hours first." },
      ],
      pricing: [],
      sample: false,
    },
    {
      slug: "regenerative",
      name: "Regenerative",
      tagline: "PRP, Sculptra, Kybella & threads",
      description: "Regenerative treatments including PRP, Sculptra, Kybella and threads. These work over months rather than weeks, so they are planned and assessed in stages.",
      image: { src: img("svc-regenerative.jpg"), alt: "Regenerative treatment", width: 1080, height: 1610 },
      whatToExpect: [
        "An honest conversation about what regenerative treatments can and cannot do.",
        "A staged plan — these treatments work over months, not weeks.",
        "Clear expectations on the number of sessions involved.",
        "Follow-up booked around your schedule rather than a fixed package.",
      ],
      faq: [
        { q: "How long until I see anything?", a: "Regenerative treatments are slow by nature. Expect to be assessed again at around three months, not three weeks." },
        { q: "Do these replace surgery?", a: "No. They are an option for some concerns and are not a substitute for a surgical consultation where one is advised." },
        { q: "Can I combine them?", a: "Sometimes. Your practitioner will tell you what is sensible to do together and what is better separated." },
      ],
      pricing: [],
      sample: false,
    },
    {
      slug: "specialty",
      name: "Specialty",
      tagline: "Under-eye filler, rhinoplasty & more",
      description: "Specialty injectable treatments including under-eye filler and liquid rhinoplasty. A careful, conservative approach to areas where less is usually safer.",
      image: { src: img("svc-specialty.jpg"), alt: "Specialty injectable treatment", width: 1080, height: 1610 },
      whatToExpect: [
        "A consultation focused on the specific concern you came in with.",
        "A frank discussion of risk — under-eye and nose work both carry real considerations.",
        "A conservative starting approach where the area is unforgiving.",
        "A follow-up, because this is an area where less is usually safer.",
      ],
      faq: [
        { q: "Is under-eye filler risky?", a: "It carries more considerations than filler elsewhere, which is why the starting dose is conservative and follow-up is standard." },
        { q: "Do you treat liquid rhinoplasty?", a: "Yes, as a non-surgical option. A full surgical consultation is the right route for some changes." },
        { q: "What if I do not like the result?", a: "Tell us. Follow-up is part of the treatment, not an upsell." },
      ],
      pricing: [],
      sample: false,
    },
    {
      slug: "laser",
      name: "Laser",
      tagline: "Resurfacing, tattoo removal & tightening",
      description: "Laser resurfacing, tattoo removal and skin tightening. Planned in sessions rather than one aggressive treatment, with recovery explained before you commit.",
      image: { src: img("svc-laser.jpg"), alt: "Laser skin treatment", width: 2752, height: 1536 },
      whatToExpect: [
        "A consultation that starts with skin type and sun exposure.",
        "A plan built in sessions rather than a single aggressive treatment.",
        "A recovery window explained before you commit to a date.",
        "Clear advice on sun protection afterwards, which does most of the work.",
      ],
      faq: [
        { q: "How many sessions will I need?", a: "It depends on the treatment and the concern. You will get a realistic range at your consultation." },
        { q: "Can I go to work the next day?", a: "Often yes for lighter treatments. Deeper resurfacing needs a longer recovery and we will tell you honestly which you are looking at." },
        { q: "Does it hurt?", a: "Most people describe it as heat and a quick snap. Comfort measures are available — ask at your consultation." },
      ],
      pricing: [],
      sample: false,
    },
    {
      slug: "body-contouring",
      name: "Body Contouring",
      tagline: "Sculpting, cellulite & skin tightening",
      description: "Body contouring for sculpting, cellulite and skin tightening. Planned across the whole area, with a realistic view of what can and cannot be improved.",
      image: { src: img("svc-body.jpg"), alt: "Body contouring treatment", width: 1080, height: 1610 },
      whatToExpect: [
        "An assessment that treats body contouring as a whole, not a single spot.",
        "A realistic conversation about what can be improved and what cannot.",
        "A session plan with spacing built in.",
        "A maintenance conversation, because results are not permanent.",
      ],
      faq: [
        { q: "Is this a weight-loss treatment?", a: "No. It targets contour and skin texture, not fat loss overall." },
        { q: "How often will I need to come in?", a: "A maintenance schedule is normal for this category of treatment." },
        { q: "Can you treat a specific area?", a: "Yes, though contour work usually reads best when it is planned across the whole area." },
      ],
      pricing: [],
      sample: false,
    },
  ] as Service[],

  studios: [
    { id: "ues", name: "Upper East Side", address: "100 Example Ave", city: "New York, NY", phone: null, hours: null, mapUrl: null, image: { src: img("loc-ues.jpg"), alt: "Upper East Side studio entrance", width: 1200, height: 520 }, region: "nyc" },
    { id: "gv", name: "Greenwich Village", address: "100 Sample St", city: "New York, NY", phone: null, hours: null, mapUrl: null, image: { src: img("loc-gv.jpg"), alt: "Greenwich Village studio entrance", width: 1200, height: 520 }, region: "nyc" },
    { id: "bk", name: "Brooklyn", address: "100 Demo Ave", city: "Brooklyn, NY", phone: null, hours: null, mapUrl: null, image: { src: img("loc-brooklyn.jpg"), alt: "Brooklyn studio entrance", width: 1200, height: 520 }, region: "nyc" },
    { id: "ch", name: "Chelsea", address: "100 Place St", city: "New York, NY", phone: null, hours: null, mapUrl: null, image: { src: img("loc-chelsea.jpg"), alt: "Chelsea studio entrance", width: 1080, height: 1399 }, region: "nyc" },
    { id: "li", name: "Long Island", address: "100 Road Lane", city: "Great Neck, NY", phone: null, hours: null, mapUrl: null, image: { src: img("loc-li.jpg"), alt: "Long Island studio entrance", width: 1178, height: 659 }, region: "nyc" },
    { id: "dal", name: "Dallas", address: "100 Bonita Ave", city: "Dallas, TX", phone: null, hours: null, mapUrl: null, image: { src: img("loc-dallas.jpg"), alt: "Dallas studio entrance", width: 1200, height: 520 }, region: "texas" },
    { id: "add", name: "Addison", address: "100 Belt Line Rd", city: "Addison, TX", phone: null, hours: null, mapUrl: null, image: { src: img("loc-addison.jpg"), alt: "Addison studio entrance", width: 1200, height: 520 }, region: "texas" },
  ] as Studio[],

  regions: [
    { id: "nyc", label: "New York" },
    { id: "texas", label: "Texas" },
  ],

  galleryCategories: ["All", "Injectables", "Skin", "Bodies", "Studio"],

  gallery: [
    { src: img("svc-neurotoxins.jpg"), alt: "Close-up of skin after a neurotoxin appointment", width: 1080, height: 1350, category: "Injectables", title: "Neurotoxin", caption: "A consultation-led approach to softening expression lines." },
    { src: img("svc-lips.jpg"), alt: "Close-up of finished lip enhancement", width: 2752, height: 1536, category: "Injectables", title: "Lip enhancement", caption: "Proportion first — the goal is balance, not volume." },
    { src: img("svc-fillers.jpg"), alt: "Cheek and mid-face contouring detail", width: 1080, height: 1619, category: "Injectables", title: "Cheek contour", caption: "Structure before volume, every time." },
    { src: img("svc-facials.jpg"), alt: "Skin after a facial treatment", width: 1080, height: 1610, category: "Skin", title: "Facial", caption: "Treatments matched to what your skin is doing that day." },
    { src: img("svc-regenerative.jpg"), alt: "Regenerative treatment in progress", width: 1080, height: 1610, category: "Skin", title: "Regenerative", caption: "Slow treatments, assessed in months rather than weeks." },
    { src: img("svc-laser.jpg"), alt: "Laser resurfacing on the face", width: 2752, height: 1536, category: "Skin", title: "Laser resurfacing", caption: "Planned in sessions, with recovery explained up front." },
    { src: img("svc-specialty.jpg"), alt: "Precision injectable treatment", width: 1080, height: 1610, category: "Injectables", title: "Precision work", caption: "Conservative dosing where the area is unforgiving." },
    { src: img("svc-body.jpg"), alt: "Body contouring treatment area", width: 1080, height: 1610, category: "Bodies", title: "Body contouring", caption: "Planned across the whole area, not a single spot." },
    { src: img("section-results.jpg"), alt: "Radiant skin after a facial", width: 2752, height: 1536, category: "Skin", title: "After a facial", caption: "The unglamorous middle of a good skin day." },
    { src: img("hero-home.jpg"), alt: "Editorial portrait with botanical florals", width: 1193, height: 1080, category: "Studio", title: "In the studio", caption: "Our reference imagery, kept for the template." },
    { src: img("loc-gv.jpg"), alt: "Greenwich Village studio frontage", width: 1200, height: 520, category: "Studio", title: "Greenwich Village", caption: "One of seven studios." },
    { src: img("loc-brooklyn.jpg"), alt: "Brooklyn studio frontage", width: 1200, height: 520, category: "Studio", title: "Brooklyn", caption: "One of seven studios." },
  ] as GalleryItem[],

  posts: [
    {
      slug: "nefertiti-lift",
      title: "The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin",
      category: "Neurotoxin",
      excerpt: "How the Nefertiti Lift and DAO neurotoxin work together to subtly lift and define the lower face.",
      image: { src: img("blog-nefertiti-lift.jpg"), alt: "Portrait used for the Nefertiti lift article", width: 500, height: 649 },
      sample: true,
      body: [
        { type: "p", text: "Replace this with your own article. The layout, typography and reading width are already set — this block exists so the page never ships half-written." },
        { type: "h3", text: "A suggested structure" },
        { type: "ul", items: ["What the treatment actually targets", "Who it tends to suit", "What the appointment involves", "What to expect afterwards"] },
        { type: "h3", text: "Before you publish" },
        { type: "p", text: "Set `sample: false` in src/config/content.ts once the copy is yours. The notice above disappears and the article reads as finished." },
      ],
    },
    {
      slug: "under-eye-filler",
      title: "Under Eye Filler: The Secret to Looking Well-Rested",
      category: "Filler",
      excerpt: "Under eye filler with Restylane® L helps smooth hollow tear troughs and reduce shadowing for a refreshed appearance.",
      image: { src: img("blog-under-eye-filler.jpg"), alt: "Portrait used for the under-eye filler article", width: 500, height: 745 },
      sample: true,
      body: [
        { type: "p", text: "Replace this with your own article. The layout, typography and reading width are already set — this block exists so the page never ships half-written." },
        { type: "h3", text: "A suggested structure" },
        { type: "ul", items: ["What tear trough filler can and cannot do", "Why conservative dosing matters here", "What the appointment involves", "Follow-up and aftercare"] },
        { type: "h3", text: "Before you publish" },
        { type: "p", text: "Set `sample: false` in src/config/content.ts once the copy is yours." },
      ],
    },
    {
      slug: "microneedling-vs-laser",
      title: "Microneedling vs. Laser: Which Treatment Is Right for You?",
      category: "Skin Health",
      excerpt: "Both are powerful options for boosting collagen and refining your skin — but they work in very different ways.",
      image: { src: img("blog-microneedling-vs-laser.jpg"), alt: "Portrait used for the microneedling versus laser article", width: 500, height: 750 },
      sample: true,
      body: [
        { type: "p", text: "Replace this with your own article. The layout, typography and reading width are already set — this block exists so the page never ships half-written." },
        { type: "h3", text: "A suggested structure" },
        { type: "ul", items: ["How each treatment works", "Downtime compared honestly", "Skin types each suits", "How a plan is usually built"] },
        { type: "h3", text: "Before you publish" },
        { type: "p", text: "Set `sample: false` in src/config/content.ts once the copy is yours." },
      ],
    },
  ] as Post[],

  /**
   * Legal copy. Kept as configuration because the specifics are jurisdiction
   * dependent and must be reviewed by whoever owns the business — the text here
   * is deliberately generic and names no legal entity or regulator.
   */
  legal: {
    privacy: {
      title: "Privacy Policy",
      intro:
        "This policy explains what personal information this website collects, why it is collected, and what choices you have. Replace this text with a policy reviewed for your own jurisdiction before launch.",
      sections: [
        { h: "What we collect", p: "Contact details you give us through the contact form or by phone, and basic technical information such as browser type and pages visited." },
        { h: "Why we collect it", p: "To answer enquiries, schedule appointments and improve the website. We do not sell personal information." },
        { h: "Cookies", p: "This site sets a small cookie preference in your browser to remember whether you dismissed the notice. No advertising or cross-site tracking cookies are set by default." },
        { h: "Your choices", p: "You can ask to see, correct or delete the information we hold about you by using the contact details on this site." },
      ],
    },
    cancellation: {
      title: "Cancellation Policy",
      intro:
        "Appointments can usually be rearranged with reasonable notice. Replace this text with your own terms, including any fees, before launch — this is a summary, not a legal agreement.",
      sections: [
        { h: "Rearranging", p: "Contact the studio as early as you can if you need a different time. We will always try to find you another slot." },
        { h: "Late cancellations", p: "A short notice window may mean a portion of the treatment cost is charged, because the slot cannot be refilled. Confirm the exact window with your studio." },
        { h: "Late arrivals", p: "If you arrive very late we may need to shorten or reschedule the appointment so the next person is not kept waiting." },
      ],
    },
    safety: {
      title: "Safety & Prescribing",
      intro:
        "All prescriptive treatment is delivered by a qualified, licensed practitioner who will assess you before any procedure. Replace this text with the standards your business works to.",
      sections: [
        { h: "Who treats you", p: "Every appointment is delivered by a licensed practitioner. You will be told who is treating you and what they are licensed to perform." },
        { h: "Assessment first", p: "No prescriptive treatment is carried out without a consultation and medical history. If something is not appropriate for you, we will say so." },
        { h: "Prescriptions", p: "Where a prescription is required it is issued to you directly. We do not sell prescription products on site." },
        { h: "Aftercare and problems", p: "You are given aftercare instructions and a way to reach us if something does not settle as expected. Please contact your studio rather than waiting." },
      ],
    },
    accessibility: {
      title: "Accessibility Statement",
      intro:
        "We want this website to be usable by everyone. This page describes what we have done and how to tell us if something is not working for you.",
      sections: [
        { h: "What we have done", p: "The site is keyboard navigable, works with reduced motion turned on, uses real headings and labels, and meets a minimum 24px touch target for interactive controls on touch devices." },
        { h: "Known limitations", p: "Some imagery is decorative. If you need information from an image in another format, contact us and we will provide it." },
        { h: "Tell us", p: "If you hit a barrier, use the contact details on this site and tell us what you were trying to do and which page you were on. We treat reports as bugs and will work on them." },
        { h: "Adjusting your browser", p: "A built-in menu in the corner of the screen can enlarge text or reduce motion. Your choice is remembered on this device." },
      ],
    },
  },
} as const;

export type ContentConfig = typeof content;

export type { SiteConfig };
