// Generates the remaining component specs (nav, mobile menu, testimonials,
// footer, and the three overlays). Computed values come from the browser capture;
// the behaviour sections are the ones verified by
// scripts/qa-behaviour-upkeepmedspa.mjs against the clone.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ART = "docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const OUT = `${ART}/components`;
const S = {};
for (const w of [1440, 768, 390]) S[w] = JSON.parse(readFileSync(`${ART}/extracted/styles-${w}.json`, "utf8"));

const NOISE = new Set(["borderTop","borderRight","borderBottom","borderLeft","objectFit","objectPosition",
  "transformOrigin","fill","stroke","transitionTimingFunction","animationTimingFunction","animationFillMode",
  "animationIterationCount","pointerEvents","textDecoration","textOverflow","verticalAlign","float","flexBasis",
  "flexShrink","gridAutoFlow","placeItems","whiteSpace","mixBlendMode","backdropFilter","transform","opacity",
  "visibility","cursor","outline","outlineOffset","aspectRatio","maxWidth"]);
const KEEP = ["display","position","top","right","bottom","left","zIndex","width","height","minHeight",
  "padding","paddingTop","paddingBottom","margin","marginTop","marginBottom","flexDirection","flexWrap",
  "justifyContent","alignItems","gap","rowGap","columnGap","gridTemplateColumns","fontFamily","fontSize",
  "fontWeight","fontStyle","lineHeight","letterSpacing","textTransform","textAlign","color","backgroundColor",
  "backgroundImage","borderRadius","boxShadow","overflow","filter","transition","animationName","animationDuration"];

function cssBlock(name, w = 1440, nodes = 1) {
  const v = S[w][name];
  if (!v || v.error) return `_no probe for \`${name}\`_\n`;
  let out = "";
  for (const n of v.nodes.slice(0, nodes)) {
    const label = n.cls ? n.cls.split(/\s+/).map((c) => "." + c).join("") : n.tag;
    out += `\n**${label}** — ${n.rect.w}×${n.rect.h}px, ${n.childCount} child element(s)\n`;
    if (n.text) out += `\n> \`${n.text.slice(0, 100)}\`\n`;
    const parts = KEEP.filter((k) => n.style[k] !== undefined && !NOISE.has(k)).map((k) => `- \`${k}\`: \`${n.style[k]}\``);
    if (parts.length) out += "\n" + parts.join("\n") + "\n";
  }
  return out;
}
function respTable(probes) {
  let out = "| element | 1440 | 768 | 390 |\n| --- | --- | --- | --- |\n";
  for (const p of probes) {
    const cells = [1440, 768, 390].map((w) => {
      const v = S[w][p];
      if (!v || v.error) return "n/a";
      const n = v.nodes[0];
      if (!n) return "n/a";
      const b = [];
      if (n.style.display === "none") b.push("**display:none**");
      if (n.style.fontSize) b.push(n.style.fontSize);
      if (n.style.gridTemplateColumns) b.push("cols " + n.style.gridTemplateColumns);
      if (n.rect.w) b.push("w " + Math.round(n.rect.w));
      if (n.rect.h) b.push("h " + Math.round(n.rect.h));
      return b.join(" · ") || "—";
    });
    out += `| \`${p}\` | ${cells[0]} | ${cells[1]} | ${cells[2]} |\n`;
  }
  return out;
}
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "_not captured_");

const COMMON = `## Styling contract (read this first)

The target's own stylesheet is already ported to
\`src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css\` and imported **unlayered** by
\`src/app/globals.css\`, so it beats Tailwind preflight and wins the cascade. That sheet also
contains the site's own **utility classes** and its full widget styling (including the
\`#a11y-menu-*\` rules), so the class strings below resolve with zero new CSS.

**Use the ported class names and captured IDs verbatim and write no new CSS.** Combine classes
with \`cn()\` from \`@/lib/utils\` when you need a conditional.

- Icons: \`@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons\`
- Content: \`@/lib/upkeepmedspa-data\` — every string, href and image path is the live site's.
- Types: \`@/types/upkeepmedspa\`
- Images: \`next/image\`. In Next 16 \`priority\` is **deprecated** — use \`loading="eager"\` +
  \`fetchPriority="high"\` above the fold, default lazy below it. Always pass \`sizes\` with \`fill\`.
- **Before you finish:** \`npx.cmd tsc --noEmit\` must pass (PowerShell blocks \`npx.ps1\`).
`;

const EXTERNAL = `Render \`https://…\` links with \`target="_blank" rel="noopener noreferrer"\`;
internal hrefs as plain \`<a>\`. Do **not** use \`next/link\` — the target is a static site with plain
anchors and the ported CSS styles bare \`a\`. (\`@next/next/no-html-link-for-pages\` is disabled for
\`src/components/sites/**\` in \`eslint.config.mjs\` for exactly this reason.)`;

const SPECS = [
  {
    file: "sitenav", component: "SiteNav", outline: `${ART}/dom-outlines/00-nav.txt`,
    shot: "state-nav-scrolled-1440.png",
    model: "**scroll-driven** (a `nav--scrolled` class past a 60px threshold) for the bar itself; the two dropdowns are **hover-driven in pure CSS**; the hamburger is **click-driven**",
    probes: [["nav", 1], ["navInner", 1], ["navLogo", 1], ["navLogoImg", 1], ["navLinks", 1], ["navLinkA", 1], ["navLinkActive", 1], ["navDropdownTrigger", 1], ["navDropdownMenu", 1], ["navDropdownItem", 1], ["navCtaGroup", 1], ["navEvents", 1], ["navBookDesktop", 1], ["navHamburger", 1]],
    respProbes: ["navLinks", "navCtaGroup", "navBookDesktop", "navEvents", "hamburger", "navLinkA", "navEvents", "navBookDesktop"],
    behaviour: `### Scroll state — JS REQUIRED (the only scroll behaviour)
The target's inline script:
\`\`\`js
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { nav.classList.add('nav--scrolled'); }
  else { nav.classList.remove('nav--scrolled'); }
}, { passive: true });
\`\`\`
Reproduce exactly: threshold is **strictly greater than 60**, and the class is **removed** on the
way back up. Register with \`{ passive: true }\`. Apply via \`cn("nav", scrolled && "nav--scrolled")\`.

### Dropdowns — CSS ONLY, zero JavaScript
The sheet does it with \`:hover\`:
- \`.nav__dropdown:hover .nav__dropdown-menu { opacity: 1; visibility: visible }\` (closed state is
  \`opacity: 0; visibility: hidden\` plus a transition)
- \`.nav__dropdown:hover .nav__dropdown-trigger svg { transform: rotate(180deg) }\`
**Do not add click handlers, state, \`onMouseEnter\`/\`onMouseLeave\` or \`aria-expanded\` to the
dropdowns** — the target has none, and adding JS would break parity.

### Mobile menu — JS REQUIRED
The hamburger (\`aria-label="Open menu"\`, shown only at the sheet's small-screen breakpoint)
toggles \`MobileMenu\`'s \`open\` prop. \`MobileMenu\` owns its own Escape handling and link-click
closing; you just pass \`open\` and \`onClose\`. Render \`<MobileMenu>\` as a sibling **after**
\`</nav>\` (inside a fragment) so \`.nav__inner\`'s children still match the captured DOM.

### Hover — CSS only
Nav links, dropdown items and CTA buttons have hover states in the sheet (180ms brand curve). Add
no JS and no transition utilities.`,
    extra: `## Accessibility notes (preserve them)
- \`role="navigation"\` + \`aria-label="Main navigation"\` on \`<nav>\`; \`role="list"\` on the \`<ul>\`.
- \`role="menu"\` on each \`.nav__dropdown-menu\`; \`role="menuitem"\` on each \`.nav__dropdown-item\`.
- \`aria-label="UPKEEP Med Spa home"\` on the logo link, \`aria-label="Upcoming Events"\` on the
  events link, \`aria-label="Open menu"\` on the hamburger.
- The source's SVGs carry no \`aria-hidden\`; render them as-is.

## Verified behaviour
\`scripts/qa-behaviour-upkeepmedspa.mjs\` asserts all of the above against the running clone:
6/6 nav-scroll assertions, 4/4 dropdown assertions, and 0 console errors.`,
  },
  {
    file: "mobilemenu", component: "MobileMenu", outline: null,
    inlineDom: `MobileMenu takes props \`{ open: boolean; onClose: () => void }\` — it is a controlled
component, so the hamburger that owns the state lives in SiteNav.

\`\`\`
<div class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden={!open}>
  <button type="button" class="mobile-menu__close" aria-label="Close menu">
    <svg width="24" height="24">…X…</svg>          (CloseIcon)
  <a class="mobile-menu__link" href="…">Home</a>     (15 links, source order)
  …
  <a class="mobile-menu__link" href="/contact">Contact</a>
  <a class="btn btn--accent" href="…">Book Now</a>
</div>
\`\`\`
\`mobileMenu.links\` in \`@/lib/upkeepmedspa-data\` is already in source order: Home, Neurotoxins,
Lip Enhancement, Dermal Fillers, Specialty Injections, Facials & Skin, Regenerative, Laser
Treatments, Body Contouring, Gallery, About, Blog, Locations, Upcoming Events, Contact — followed
by \`mobileMenu.book\` ("Book Now" → the booking URL).

The whole overlay is one absolutely-positioned flex column; the links are direct children, not
wrapped in a list.`,
    shot: "sec-00-nav.png",
    model: "**click-driven** — the visibility toggle is the \`mobile-menu--open\` class, driven by the parent nav's hamburger",
    probes: [["mobileMenu", 1], ["mobileMenuClose", 1], ["mobileMenuLink", 1]],
    respProbes: ["mobileMenu", "mobileMenuClose", "mobileMenuLink"],
    behaviour: `### Open/close — CSS only, class-driven
The base \`.mobile-menu\` is \`opacity: 0; visibility: hidden\` with
\`transition: opacity 400ms var(--ease-out), visibility 400ms var(--ease-out)\`.
\`.mobile-menu--open\` sets \`opacity: 1; visibility: visible\`. **That class is the entire
open/close mechanism** — toggle it and the ported sheet animates. Do not add opacity state,
transitions or a motion library.

### Escape to close — JS
Listen for \`keydown\` on \`document\` **only while open** and call \`onClose()\` on \`Escape\`.
Add the listener in a \`useEffect\` gated on \`open\` and return the removal as cleanup.

### Link clicks close the menu
Every \`.mobile-menu__link\` and the "Book Now" button call \`onClose()\` on click, so following a
link dismisses the overlay.

### Accessibility
- Set \`aria-hidden={!open}\` on the overlay.
- The close button carries \`aria-label="Close menu"\`.
- The overlay carries \`aria-label="Mobile navigation"\`.
- Because the panel is \`visibility: hidden\` when closed it is already out of the a11y tree and
  the tab order; do not add \`inert\` or focus-trap code the target does not have.`,
    extra: `## Verified behaviour
\`scripts/qa-behaviour-upkeepmedspa.mjs\`: the menu is closed initially, the hamburger opens it, the
open state is fully opaque, it contains exactly **15** \`.mobile-menu__link\` elements, and the close
button shuts it — all passing.

## Note on \`id="mobile-menu"\`
The target's \`.mobile-menu\` carries no \`id\`. One was added here so the overlay is addressable;
it has no styling attached and does not affect rendering.`,
  },
  {
    file: "testimonialssection", component: "TestimonialsSection", outline: `${ART}/dom-outlines/04-testimonials.txt`,
    shot: "sec-04-testimonials.png",
    model: "**click-driven (dots) AND time-driven (6s auto-advance)** — explicitly *not* scroll-driven",
    probes: [["testiSection", 1], ["testiContainer", 1], ["testiPanel", 1], ["testiStars", 1], ["testiQuote", 1], ["testiName", 1], ["testiDots", 1], ["testiDot", 1]],
    respProbes: ["testiQuote", "testiStars", "testiName", "headingSection", "btnArrow"],
    behaviour: `### The target's carousel script
\`\`\`js
const dots = document.querySelectorAll('.testimonial-dot');
const testimonials = document.querySelectorAll('[data-testimonial]');
let currentTestimonial = 0;
function showTestimonial(i) {
  testimonials.forEach(t => t.style.display = 'none');
  dots.forEach(d => { d.style.background = 'transparent'; });
  if (testimonials[i]) { testimonials[i].style.display = ''; }
  if (dots[i]) { dots[i].style.background = 'var(--color-accent)'; }
  currentTestimonial = i;
}
dots.forEach(dot => dot.addEventListener('click', () => showTestimonial(parseInt(dot.dataset.dot))));
if (testimonials.length) { setInterval(() => { showTestimonial((currentTestimonial + 1) % testimonials.length); }, 6000); }
\`\`\`
Required behaviour:
- **6 panels** matching \`testimonials.items\` in order, each carrying \`data-testimonial={index}\`.
- **6 dots** as \`<button>\`s with \`data-dot={index}\` and \`aria-label={\`Show testimonial \${index + 1}\`}\`.
- All six panels stay **in the DOM**; only the active one is visible (the source toggles \`display\`
  rather than unmounting, and the \`data-testimonial\` attribute is part of the captured markup).
- Clicking a dot shows that panel and makes that dot active.
- A \`setInterval\` at **6000 ms** advances \`(current + 1) % 6\`, wrapping. A dot click sets the index
  directly and does **not** restart the timer — same as the source.
- **No transition on the swap.** It is an instant \`display\` toggle. Do not add framer-motion, CSS
  transitions or fades.
- Needs \`"use client"\`.

### The dots are NOT styled by the ported sheet
\`.testimonial-dot\`, \`.testimonial-dots\` and \`.testimonial__name\` have **no rules at all** in
\`upkeep.css\` — they are styled purely by inline \`style\` attributes, and the active dot's
background is set imperatively. Reproduce that: each dot carries
\`width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent);
background: transparent; cursor: pointer; padding: 0\`, and the **active** dot's \`background\` is set
to \`var(--color-accent)\`.

### Non-breaking spaces in the names
Each \`testimonials.items[i].name\` uses the entity form \`— Name &nbsp;·&nbsp; Location\`. Render the
real U+00A0 characters, not the literal \`&nbsp;\` text (e.g. replace \`"&nbsp;"\` with \`"\\u00a0"\`
once per name). \`Michele S. · Dallas · Knox Henderson\` has a **second, plain-space** middot — only the
first is non-breaking. \`testimonial__name\` has no sheet rule, so nothing styles it beyond the class.

### The review note
Rendered after the dots, inside the same container, as an unclassed \`<p>\` with
\`style={{ marginTop: "var(--space-6)", fontSize: "var(--text-xs)", letterSpacing: "0.08em",
textTransform: "uppercase", color: "var(--color-text-muted)" }}\` containing
\`{testimonials.note.before}\`, a link to \`testimonials.note.link.href\` with the label
\`testimonials.note.link.label\`, then \`{testimonials.note.after}\`. The link's own inline style is
\`color: var(--color-text-muted); text-decoration: underline; text-underline-offset: 3px\`.

### Height varies with the visible quote
The section is 859–913px tall depending on which quote is showing — that is expected, not a bug.`,
    extra: `## Verified behaviour
\`scripts/qa-behaviour-upkeepmedspa.mjs\`: 6 panels, 6 dots, exactly one panel visible, the active
dot always matches the visible panel, and clicking dot 5 shows panel 4 — all passing.

## Height variance (measured)
- live site showing panel 2: section 859px, visible panel 372px
- clone showing panel 1: section 913px, visible panel 426px
Both are legitimate renderings of the same section; the difference is the quote length.`,
  },
  {
    file: "sitefooter", component: "SiteFooter", outline: `${ART}/dom-outlines/09-footer.txt`,
    shot: "sec-09-footer.png",
    model: "static — no JavaScript at all",
    probes: [["footer", 1], ["footerGrid", 1], ["footerBrandLogo", 1], ["footerLogoImg", 1], ["footerTagline", 1], ["footerSocials", 1], ["footerSocialLink", 1], ["footerHeading", 1], ["footerLink", 1], ["footerBottom", 1], ["footerLegalLinks", 1], ["a11yNotice", 1]],
    respProbes: ["footerGrid", "footerTagline", "footerHeading", "footerLink", "btnSmall"],
    behaviour: `### Transcribe the captured markup, not a plausible reconstruction
\`docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sections/09-footer.html\` is the source of
truth. Four details that a "sensible" rewrite gets wrong:
1. The four \`.footer__grid\` cells are **unclassed \`<div>\`s** — there is no \`.footer__brand\` or
   \`.footer__col\` class in the sheet, so adding one would be dead weight.
2. The column headings are **\`<p class="footer__heading">\`**, not \`<h3>\`. The sheet styles the
   class, not the tag. The third column's heading literal is **\`Contact\`**.
3. The logo is wrapped in **\`<a class="footer__brand-logo" href="/">\`** — that class carries
   \`display: inline-block; margin-bottom: var(--space-4)\` and is load-bearing for the 598px
   footer height.
4. The phone and email are **bare \`<a class="footer__link">\` siblings**, not \`<p>\` wrappers
   containing anchors. The phone text keeps its non-breaking space so the number cannot wrap
   mid-number.

### Icons
Pick from \`footer.socials[i].icon\` (\`"instagram" | "tiktok" | "facebook"\`) and render at
**18×18**. All three source SVGs use \`fill="none" stroke="currentColor"\` or \`fill="currentColor"\`,
so colour comes from CSS. Do not substitute a generic icon for any of the three.

### The accessibility notice
\`footer.accessibilityNotice\` is stored as one flat string, but the source links the phone, the
email and "Accessibility Statement" **inside** it. Split the string on those three fragments and
re-attach the anchors from \`footer.contact.phoneHref\` / \`emailHref\` (the statement link is
\`/accessibility\`), so the rendered paragraph is byte-identical to the source. Reproduce the
source's inline styles on the notice and its link.

### Preserved inline styles
- \`margin-top: var(--space-3)\` + \`color: var(--color-text-faint)\` on the "7 locations across NYC &
  Dallas" line.
- \`margin-top: var(--space-4)\` on the Book Now button.

### No JavaScript
Server component. No \`"use client"\`, no state, no handlers. Hover on \`.footer__link\`,
\`.footer__social-link\` and \`.btn--accent\` is CSS-only in the sheet.`,
    extra: `## Measured height
The footer is **598px** tall at 1440 and the \`.footer__grid\` is 328px — both matched exactly by the
clone. Reproducing \`.footer__brand-logo\` is what keeps it at 598 rather than growing.`,
  },
  {
    file: "consentbanner", component: "ConsentBanner", outline: `${ART}/overlays/consent-banner.html`,
    shot: "sec-09-footer.png",
    model: "**click-driven** dismissal, persisted to \`localStorage\`; visible immediately on load",
    probes: [["consentBanner", 1], ["consentInner", 1], ["consentText", 1], ["consentActions", 1]],
    respProbes: ["consentInner", "consentText", "consentActions"],
    behaviour: `### Visible on load
Not delayed, not scroll-triggered — the target shows it immediately.

### Dismissal is persistent
Clicking either button hides the bar and records the choice in \`localStorage\` under
\`consentBanner.storageKey\` (\`"accepted"\` / \`"declined"\`), so it stays gone on later visits. On
mount, read the key and skip rendering when a value is present.

### Hydration safety
The persisted check must not run during render, or SSR and the client will disagree. Read
\`localStorage\` inside an effect (or a \`useSyncExternalStore\` with a \`false\` server snapshot) so
the first paint matches on both sides. Wrap every access in \`try/catch\` — private-mode browsers
throw, and the target does the same.

**Note on this repo's lint config:** \`react-hooks/set-state-in-effect\` is enabled, so the naive
\`useState\` + mount-effect-\`setState\` pattern fails \`eslint\`. \`useSyncExternalStore\` with a
\`false\` server snapshot is the approach that satisfies both the rule and hydration.

### No focus trap, no Escape, no scroll lock
It is a passive bar. The privacy-policy link inside it navigates normally.

### Sentences
Assemble the paragraph as \`{consentBanner.before}\` + \`<a href={consentBanner.link.href}>\` +
\`{consentBanner.link.label}\` + \`</a>\` + \`{consentBanner.after}\` so the sentence matches the
source exactly, including the link mid-sentence.

### Hover
CSS-only in the sheet for both button variants. Add no transition utilities and no JS.`,
    extra: `## Verified behaviour
\`scripts/qa-behaviour-upkeepmedspa.mjs\`: banner visible on a fresh visit, \`[data-consent="accept"]\`
hides it, and it stays dismissed after a reload — all passing.

## Parity note (do not "fix")
The banner is \`position: fixed; bottom: 0; z-index: 9999\` and 78px tall, which **overlaps** the
floating accessibility button (\`bottom: 20px; z-index: 9998\`). Verified identical on the live
target — both report the a11y button as unreachable while the banner is up. This is target
behaviour, so the clone reproduces it.`,
  },
  {
    file: "signuppopup", component: "SignupPopup", outline: `${ART}/overlays/signup-popup.html`,
    shot: "overlay-signup-popup-open.png",
    model: "**time-driven** (auto-opens 12s after load) **and click-driven** (close triggers, form submit); Escape-driven while open",
    probes: [["signupPopup", 1], ["signupCard", 1], ["signupClose", 1]],
    respProbes: ["signupCard", "signupClose"],
    behaviour: `### Open/close — the \`is-open\` class is the whole mechanism
Closed: \`position: fixed; inset: 0; z-index: 2000; display: flex; opacity: 0; visibility: hidden\`.
\`#signupPopup.is-open\` sets \`opacity: 1; visibility: visible\`, and the sheet owns the transition.
Your state should only toggle that class (plus \`aria-hidden\`).

### The target's script, reproduced
\`\`\`js
function openPopup() {
  lastFocus = document.activeElement;
  popup.classList.add('is-open');
  popup.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const f = popup.querySelector('input[type="email"]'); if (f) f.focus(); }, 250);
}
function closePopup() {
  popup.classList.remove('is-open');
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  try { localStorage.setItem(STORAGE_KEY, 'dismissed:' + Date.now()); } catch(e) {}
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
popup.querySelectorAll('[data-signup-close]').forEach(el => el.addEventListener('click', closePopup));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup(); });
if (!stored) { setTimeout(openPopup, 12000); }
document.querySelectorAll('[data-open-signup]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); openPopup(); });
});
\`\`\`
Required:
- **Hidden on load**; auto-opens after \`signupPopup.autoOpenDelayMs\` (**12000 ms**) only when
  \`localStorage[signupPopup.storageKey]\` is unset. All storage access in \`try/catch\`.
- Opening adds \`is-open\`, sets \`aria-hidden="false"\`, **locks body scroll**, and focuses the email
  input after **250 ms**.
- Closing removes \`is-open\`, sets \`aria-hidden="true"\`, **restores body scroll**, writes
  \`"dismissed:" + Date.now()\`, and **restores focus** to the previously focused element.
- Close triggers: the backdrop, the close button, and the success state's Close button — all carry
  \`data-signup-close\` — plus **Escape**, bound only while open. A single mount-time
  \`querySelectorAll('[data-signup-close]')\` pass attaching native listeners reproduces the source
  exactly and sidesteps \`jsx-a11y\` complaints about a click handler on the non-interactive
  backdrop \`<div>\`.
- **Manual trigger:** wire a delegated \`document\` click listener for \`[data-open-signup]\` calling
  \`preventDefault()\` then open. Nothing on the home page uses the attribute (same as the source),
  but the behaviour must exist.
- **Submit makes no network request.** The target posts to Mailchimp's JSONP endpoint; that backend
  is explicitly out of scope. \`preventDefault()\`, require a non-empty email, then swap the two
  \`[data-signup-state]\` blocks — hide \`form\`, show \`success\`. The captured markup keeps
  \`novalidate\` on the form; keep it and check the field yourself (calling the input's native
  \`reportValidity()\` for the empty case gives the required-field feedback with no new CSS).
- Keep an effect cleanup that releases the scroll lock and cancels the pending focus timer, so
  unmounting while open cannot strand the page.
- The source never resets the form/success view on reopen, so a reopen after a successful submit
  still shows "See You Soon". Preserve that.

### Accessibility notes preserved
\`role="dialog"\`, \`aria-modal="true"\`, \`aria-labelledby="signupHeading"\`, \`aria-label="Close"\`
on the close button. The source's own quirk — \`aria-labelledby\` pointing at the form block's \`h2\`,
which is hidden while the success block shows — is reproduced verbatim rather than "fixed".`,
    extra: `## Measured
Card is **460×639px** when open; backdrop is \`rgba(10,10,10,0.78)\`; the submit button is a
\`.btn--filled\` (\`#d4a090\` on \`#0a0a0a\`, \`min-height: 48px\`, \`width: 100%\`).

## Verified behaviour
\`scripts/qa-behaviour-upkeepmedspa.mjs\`: auto-opens on the timer, \`aria-hidden=false\`, body scroll
locked, email focused after 250 ms, Escape closes, \`aria-hidden=true\`, scroll restored,
\`upkeep_signup_v1\` written as \`dismissed:<ts>\`, \`[data-open-signup]\` reopens it, submit swaps to
the success state, and **no Mailchimp request is made** — all passing.`,
  },
  {
    file: "accessibilitymenu", component: "AccessibilityMenu", outline: `${ART}/overlays/a11y-menu.html`,
    shot: "sec-09-footer.png",
    model: "**click-driven** (button toggles the panel; the two toggles persist) **and storage-driven** (preferences restore on load); Escape and outside-click also close",
    probes: [["a11yRoot", 1], ["a11yButton", 1], ["a11yPanel", 1]],
    respProbes: ["a11yRoot", "a11yButton", "a11yPanel"],
    behaviour: `### The target's script
- Visible on load, pinned bottom-left, \`z-index: 9998\`, **52×52px**.
- \`#a11y-menu-button\` toggles the panel's \`hidden\` attribute and keeps \`aria-expanded\` in sync
  (\`"false"\`/\`"true"\`). Escape closes it and returns focus to the button; outside click closes too.
  Focus moves to the \`<h2 id="a11y-menu-heading">\` on open, which the target makes focusable
  (\`tabIndex={-1}\`) — the sheet styles \`#a11y-menu-heading:focus-visible\`.
- **"Larger text"** adds/removes \`a11y-large-text\` on **\`<html>\`** and persists to
  \`localStorage["upkeep-a11y-large-text"] = "1"\` (remove the key when off).
- **"Reduce motion"** adds/removes \`a11y-reduce-motion\` on \`<html>\`, persisted under
  \`localStorage["upkeep-a11y-reduce-motion"] = "1"\`.
  Both classes are already handled by the ported sheet — \`html.a11y-reduce-motion\` forces
  \`.fade-in\`/\`.reveal-up\` to \`opacity: 1 !important\` and neutralises transitions, which is the
  entire point. **Do not implement the visual effect yourself.**
- **"Reset preferences"** removes both classes from \`<html>\`, clears both keys, and unchecks both
  boxes.
- **Restore on load:** re-apply the persisted classes to \`<html>\`. The target does this pre-paint;
  in React it must happen in an effect, so a returning visitor may see a one-frame flash of the base
  text size. That trade-off is inherent to hydration — a pre-hydration inline script would close it
  at the cost of a \`next/script\` in the layout.
- Wrap every \`localStorage\` access in \`try/catch\`.

**Lint note:** \`react-hooks/set-state-in-effect\` is enabled in this repo, so the naive
\`useState\` + mount-effect-\`setState\` pattern fails \`eslint\`. Read the two preferences through
\`useSyncExternalStore\` with a \`false\` server snapshot (which also syncs across tabs via the
\`storage\` event), and apply the \`<html>\` classes from effects that only mutate the DOM.

### Toggle rows are labels, not checkboxes
Each row is a \`<label class="a11y-menu__toggle">\` wrapping a **visually hidden** checkbox, a label
span and a decorative switch span. Clicking anywhere on the row toggles it — that is native
\`<label>\` behaviour, so keep the input inside the label rather than faking it with a div. The
switch's "on" look comes from
\`.a11y-menu__toggle input[type="checkbox"]:checked ~ .a11y-menu__toggle-switch\`, so the DOM order
(input → switch span) matters.

### All of the widget's CSS is already ported
\`#a11y-menu-root\`, \`#a11y-menu-button\` (and its \`:hover\`, \`:focus-visible\`, \`svg\` rules),
\`#a11y-menu-panel\` (and \`[hidden]\`), \`#a11y-menu-heading\` (and \`:focus\`, \`:focus-visible\`) and
every \`.a11y-menu__*\` class are in \`upkeep.css\`. Verified by the coverage assertion in
\`scripts/tmp-extract-css.mjs\`: 0 selectors styled in the source are missing from the port.

### Contact details
Reuse \`footer.contact\` from \`@/lib/upkeepmedspa-data\` for the email/phone. The statement link points
at \`./accessibility.html\` in the source; this clone uses \`/accessibility\`, the same destination the
footer uses.`,
    extra: `## Verified behaviour
\`scripts/qa-behaviour-upkeepmedspa.mjs\`: button present on load and 52×52, panel hidden initially,
button opens it, \`aria-expanded=true\`, clicking each toggle row checks the box, both add their
\`<html>\` class and persist \`"1"\`, reset clears both classes and both keys, and
\`html.a11y-reduce-motion\` genuinely forces \`.fade-in\` to \`opacity: 1\` — all passing.

## Parity note (do not "fix")
The fixed consent bar overlaps this button (see \`consentbanner.spec.md\`). Verified identical on
the live target.`,
  },
];

for (const s of SPECS) {
  const dom = s.inlineDom ? s.inlineDom : read(s.outline);
  const css = s.probes.map(([n, k]) => `### \`${n}\`\n${cssBlock(n, 1440, k)}`).join("\n");
  const md = `# ${s.component} Specification

## Overview
- **Target file:** \`src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/${s.component}.tsx\`
- **Screenshot:** \`docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/${s.shot}\`
- **Interaction model:** ${s.model}
- **Export:** named \`${s.component}\`${s.component === "MobileMenu" ? ", props `{ open, onClose }`" : ", no props — read content from `@/lib/upkeepmedspa-data`"}.
${COMMON}
## DOM Structure — captured verbatim from the live page

\`\`\`text
${dom}
\`\`\`

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
${css}
## States & Behaviors
${s.behaviour}
## Responsive — measured at all three widths (not estimated)

${respTable(s.respProbes)}
All of the above is driven by the ported sheet's own media queries and fluid \`clamp()\` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
${EXTERNAL}
${s.extra}`;
  writeFileSync(`${OUT}/${s.file}.spec.md`, md);
  console.log(`${s.file}.spec.md  ${(md.length / 1024).toFixed(1)} KB  ${md.split("\n").length} lines`);
}
console.log("done");
