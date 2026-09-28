// ---------------------------------------------------------------------------
// build-upkeep-css.mjs — generates upkeep.css, the design system for this site.
//
// upkeep.css is NOT hand-edited. It is produced here from two files downloaded
// verbatim from the reference site:
//
//   base.css  — reset, body typography, global transitions, reduced motion.
//               Ported in full.
//   style.css — design tokens + component styles. Filtered down to the rules the
//               site actually uses (home page + every subpage), so ~200KB of
//               rules for other pages are dropped.
//
// A rule is kept when its selector touches a class or id this site uses, or when
// it is a global rule (:root/html/body/*/::selection/:focus-visible/.skip-link/
// .sr-only). @media and @supports wrappers are kept only if something inside
// them survives.
//
// The script ends with a hard coverage assertion: every class and id used by the
// captured markup must resolve to a rule here IF AND ONLY IF the source has one.
// That assertion exists because an earlier revision silently dropped every
// `#a11y-menu-*` rule, which shipped an unstyled accessibility widget.
//
// Usage: node scripts/build-upkeep-css.mjs
// ---------------------------------------------------------------------------
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const ART = "docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const SRC = `${ART}/source/style.css`;
const BASE = `${ART}/source/base.css`;
const OUT = "src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css";

const css = readFileSync(SRC, "utf8").replace(/\r\n/g, "\n");
const base = readFileSync(BASE, "utf8").replace(/\r\n/g, "\n");

/** Classes/ids this site renders. Prefixes match BEM elements (`loc-card__name`),
 *  but a following `-` is rejected, so BEM modifiers are listed individually. */
const TOKENS = [
  // layout / type / utilities
  "section","section--tight","container","split","eyebrow","heading-hero","heading-section","body-text",
  "text-center","mx-auto","flex","mb-4","mb-6","mb-8","grid-3","grid-4","overflow-hidden","container--narrow",
  // buttons
  "btn","btn--arrow","btn--pink","btn--filled","btn--small","btn--accent",
  // nav
  "nav","nav__inner","nav__logo","nav__logo-img","nav__links","nav__link","nav__link--active",
  "nav__dropdown","nav__dropdown-trigger","nav__dropdown-menu","nav__dropdown-item","nav__cta-group",
  "nav__events","nav__book","nav__book--desktop","nav__hamburger","nav--scrolled",
  "mobile-menu","mobile-menu__close","mobile-menu__link","mobile-menu--open",
  // hero
  "hero","hero__bg","hero__overlay","hero__content","hero__ctas","hero__ctas--specials","hero__scroll-hint",
  // services
  "services-row","svc-tile","svc-tile__img","svc-tile__title","svc-tile__desc","pricing-disclosure",
  // testimonials
  "testimonial__stars","testimonial__quote","testimonial__name","testimonial-dots","testimonial-dot",
  // locations
  "location-card","location-card__bg","location-card__overlay","location-card__content","location-card__name","location-card__address",
  // press
  "press-bar","press-bar__item",
  // journal cards
  "blog-card","blog-card__image","blog-card__content","blog-card__category","blog-card__title","blog-card__excerpt",
  // booking cta
  "booking-cta","booking-cta__bg","booking-cta__content",
  // footer
  "footer","footer__grid","footer__brand-logo","footer__logo-img","footer__tagline","footer__socials",
  "footer__social-link","footer__heading","footer__link","footer__bottom","footer__legal-links","footer__a11y-notice",
  // motion
  "fade-in","reveal-up","parallax-bg","skip-link",
  // newsletter overlay
  "signup-popup","signup-popup__backdrop","signup-popup__card","signup-popup__close","signup-popup__form",
  "signup-popup__inner","signup-popup__title","signup-popup__eyebrow","signup-popup__lede","signup-popup__label",
  "signup-popup__req","signup-popup__optional","signup-popup__fineprint","signup-popup__inner--success",
  // consent bar
  "upkeep-consent-banner","upkeep-consent__inner","upkeep-consent__text","upkeep-consent__actions",
  "upkeep-consent__btn",
  // accessibility widget (a bare `a11y-menu` token covers the BEM classes; the
  // ID selectors are hyphenated so each needs its own token)
  "a11y-menu","a11y-menu-root","a11y-menu-button","a11y-menu-panel","a11y-menu-heading",
  "a11y-toggle-text","a11y-toggle-motion","a11y-reset",
  "a11y-notice","a11y-large-text","a11y-reduce-motion",

  /* ---------------- subpage styles ---------------- */
  // universal subpage hero
  "page-hero","page-hero__bg","page-hero__content","page-hero__overlay",
  // service / treatment menu pages
  "menu-nav","menu-nav__pill","menu-nav__pill--active",
  "menu-category","menu-category__header","menu-category__title","menu-category__subtitle",
  "menu-group-label","menu-highlight",
  "menu-item","menu-item--expandable","menu-item__header","menu-item__chevron",
  "menu-item__pricing","menu-item__toggle","menu-item__detail",
  "menu-simple","menu-nested","menu-accordion","menu-accordion__trigger",
  "menu-accordion__icon","menu-accordion__body","menu-accordion__brand",
  "menu-accordion__range","menu-accordion__note","is-open",
  // locations page
  "loc-region-tabs","loc-region-tab","loc-region-tab--active",
  "loc-pills","loc-pill","loc-pill--active",
  "loc-card","loc-card--active",
  // gallery page
  "gallery-filters","gallery-filter","gallery-filter--active",
  "gallery-grid","gallery-card","gallery-instagram","lightbox","lightbox--open",
  // blog article pages
  "blog-post-hero","blog-post-hero__bg","blog-post-hero__content","blog-post-hero__date",
  "blog-post-hero__overlay","blog-post-content","blog-nav","blog-cta","blog-post-cta",
  // about / manifesto
  "manifesto","manifesto__text",
  // subpage heading
  "heading-2",
  // utility classes the subpage blocks rely on
  "flex-col","items-center","justify-center","gap-4","gap-8",
  "mb-12","mb-2","mt-4","mt-8","relative","text-left",

  // global selectors handled by GLOBAL_SEL, not the token regex
  "sr-only",
];

// BEM-aware: `_` may follow a token (so `loc-card` matches `.loc-card__name`) but
// `-` may not (so modifiers need their own token).
const RE = new RegExp(
  `(?:^|[\\s,>+~(]):?\\s*(?:\\.|#)(${TOKENS.map((t) => t.replace(/[-]/g, "\\-")).join("|")})(?![a-zA-Z0-9-])`
);
const GLOBAL_SEL =
  /(^|,|\s)(html|body|\*|::selection|:focus-visible|:root|\.skip-link|\.sr-only|html\.[\w-]+|body\.[\w-]+)(?![\w-])/;

function shouldKeep(prelude) {
  const p = prelude.trim();
  if (!p) return false;
  if (p.startsWith("@keyframes") || p.startsWith("@font-face") || p.startsWith("@-webkit-keyframes")) return true;
  if (p.startsWith("@media") || p.startsWith("@supports")) return null; // recurse
  if (p.startsWith("@")) return false;
  return RE.test(p) || GLOBAL_SEL.test(p);
}

function readBlock(start) {
  let depth = 0, j = start;
  for (; j < css.length; j++) {
    if (css[j] === "{") depth++;
    else if (css[j] === "}") { depth--; if (depth === 0) return [css.slice(start + 1, j), j + 1]; }
  }
  return [css.slice(start + 1), css.length];
}

const out = [];
function orderedRender(from, to, pad = 0) {
  let k = from;
  while (k < to) {
    const open = css.indexOf("{", k);
    if (open === -1 || open >= to) break;
    const prelude = css.slice(k, open).trim();
    const [body, end] = readBlock(open);
    const keep = shouldKeep(prelude);
    if (keep === null) {
      const mark = out.length;
      out.push({ type: "open", prelude, pad });
      orderedRender(open + 1, end - 1, pad + 1);
      let any = false;
      for (let j = mark + 1; j < out.length; j++) if (out[j].type === "rule" || out[j].type === "open") { any = true; break; }
      if (any) out.push({ type: "close", pad });
      else out.length = mark;
    } else if (keep) {
      out.push({ type: "rule", prelude, body, pad });
    }
    k = end;
  }
}
orderedRender(0, css.length);

const ind = (p) => "  ".repeat(p);
let body2 = "";
for (const item of out) {
  if (item.type === "open") body2 += `\n${ind(item.pad)}${item.prelude} {\n`;
  else if (item.type === "close") body2 += `${ind(item.pad)}}\n`;
  else body2 += `${ind(item.pad)}${item.prelude} {\n${ind(item.pad + 1)}${item.body.trim().replace(/\n/g, `\n${ind(item.pad + 1)}`)}\n${ind(item.pad)}}\n`;
}

const header = `/* ========================================================================
   UPKEEP — design system. GENERATED FILE — do not hand-edit.
   Regenerate with: node scripts/build-upkeep-css.mjs

   Ported from the reference site's own two stylesheets, both downloaded
   verbatim to docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/source/ :
     - base.css  (reset, body typography, global transitions, reduced motion)
     - style.css (design tokens + component styles)

   Part 1 is base.css verbatim. Part 2 is style.css filtered to the rules this
   site uses — home page plus every subpage. Rules belonging to pages this
   template does not ship are dropped. The script's coverage assertion at the end
   guarantees nothing needed was dropped by accident.
   ======================================================================== */

/* ===================== PART 1 — base.css (verbatim) ===================== */

${base.trim()}

/* ===================== PART 2 — style.css (used rules only) ===================== */
`;

writeFileSync(OUT, header + body2);
console.log(
  `wrote ${OUT}: ${(body2.length / 1024).toFixed(1)} KB style.css part (+${(base.length / 1024).toFixed(1)} KB base.css), ` +
  `${out.filter((o) => o.type === "rule").length} rules, ${out.filter((o) => o.type === "open").length} at-rule blocks`
);

// ---------------------------------------------------------------------------
// Coverage assertion
// ---------------------------------------------------------------------------
const used = new Set();
for (const dir of [`${ART}/sections`, `${ART}/overlays`]) {
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith(".html")); } catch { /* dir may be absent */ }
  for (const f of files) {
    const html = readFileSync(`${dir}/${f}`, "utf8");
    for (const m of html.matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => c && used.add(c));
    for (const m of html.matchAll(/\bid="([^"]+)"/g)) used.add("#" + m[1]);
  }
}

const missingFromPort = [];
const missingFromSource = [];
for (const sel of used) {
  const bare = sel.startsWith("#") ? sel.slice(1) : sel;
  const esc = bare.replace(/[-[\]]/g, "\\$&");
  const re = new RegExp(`(?:^|[\\s,>+~(])(?:\\.|#)${esc}(?![a-zA-Z0-9-])`);
  if (!re.test(css)) { missingFromSource.push(sel); continue; }
  if (!re.test(body2)) missingFromPort.push(sel);
}

console.log(`\nselectors used by the captured markup: ${used.size}`);
console.log(`  styled in SOURCE, MISSING from port: ${missingFromPort.length}`);
if (missingFromPort.length) console.log("   !! " + missingFromPort.join(", "));
console.log(`  no rule in SOURCE either (intentionally unstyled): ${missingFromSource.length}`);
if (missingFromSource.length) console.log("   - " + missingFromSource.join(", "));
if (missingFromPort.length) {
  console.error("\nCOVERAGE FAILURE: add the missing selectors to TOKENS and re-run.");
  process.exitCode = 1;
}
