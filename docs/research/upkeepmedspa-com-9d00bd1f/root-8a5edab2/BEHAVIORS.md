# BEHAVIORS — upkeepmedspa.com (home)

Every behavior below was read off the live site's own inline scripts and
`*.js` files, or measured by diffing computed styles across a state change.
`scripts/qa-behaviour-upkeepmedspa.mjs` asserts all of it against the clone
(54 checks, all passing).

---

## 1. Scroll-driven entrance reveals — CSS only, no JS

**Mechanism:** native CSS scroll-driven animation, not IntersectionObserver.
There is no reveal library and no observer anywhere in the page's JavaScript.

```css
.fade-in  { opacity: 1; }                        /* fallback: visible */
@supports (animation-timeline: scroll()) {
  .fade-in {
    opacity: 0;
    animation: revealFade linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 80%;
  }
}
@keyframes revealFade { to { opacity: 1; } }

.reveal-up { clip-path: inset(0 0 0 0); }         /* fallback */
@supports (animation-timeline: scroll()) {
  .reveal-up {
    clip-path: inset(30% 0 0 0);
    opacity: 0;
    animation: revealClipUp linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 80%;
  }
}
@keyframes revealClipUp { to { clip-path: inset(0 0 0 0); opacity: 1; } }
```

- **Trigger:** the element entering the viewport (`view()` timeline).
- **Range:** animates across `entry 0%` → `entry 80%` (i.e. it finishes
  completing slightly *before* the element is fully in view).
- **Before:** `opacity: 0` (and `clip-path: inset(30% 0 0 0)` for `.reveal-up`).
- **After:** `opacity: 1` (and `clip-path: inset(0 0 0 0)`).
- **Easing:** `linear` — the motion is driven entirely by scroll position, so an
  ease curve would make it feel wrong.
- **Progressive enhancement is load-bearing:** where `animation-timeline` is
  unsupported the base rule keeps the element at `opacity: 1`, so content is
  fully visible with no JS. Do not "fix" this with a JS fallback — it would
  change the no-JS experience the site deliberately relies on.
- **Consequence for tooling:** a full-page screenshot of a *lazy* capture renders
  every below-the-fold reveal at `opacity: 0`. Both the reference capture and
  the clone QA neutralize this (`.fade-in { opacity: 1 !important; animation: none !important }`)
  so screenshots show the settled design.

Elements carrying the class on the home page: hero content, the intro `.split`,
the services header/grid/CTA, the locations header/grid/CTA, the journal header
and cards, the booking CTA content, the press bar.

`prefers-reduced-motion: reduce` collapses all animation/transition durations to
`0.01ms` and sets `scroll-behavior: auto` (from `base.css`).

## 2. Fixed nav — scroll-driven class toggle (JS)

```js
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { nav.classList.add('nav--scrolled'); }
  else { nav.classList.remove('nav--scrolled'); }
}, { passive: true });
```

| Property | At scrollY 0 | At scrollY > 60 |
| --- | --- | --- |
| class | `nav` | `nav nav--scrolled` |
| `padding-block` | `var(--space-4)` = 16px | `var(--space-3)` = 12px |
| `background` | `rgba(10,10,10,0.85)` | `rgba(10,10,10,0.95)` |
| transition | `background var(--transition-med), padding var(--transition-med` (350ms `cubic-bezier(0.16,1,0.3,1)`) |

- **Threshold is strictly `> 60`**, not `>= 60`. Measured: no class at 40, class
  at 61.
- The bar **shrinks** on scroll (16px → 12px vertical padding), so its height goes
  77px → ~69px. It does not grow or gain a shadow.
- `position: fixed`, `z-index: 100`, `backdrop-filter: blur(20px)`.
- `html { scroll-padding-top: 80px }` (from `base.css`) clears the fixed bar for
  in-page anchors such as the hero's `#services` CTA.

## 3. Nav dropdowns — hover-driven, pure CSS, zero JS

```css
.nav__dropdown { position: relative; }
.nav__dropdown-menu { position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
                      min-width: 220px; opacity: 0; visibility: hidden; /* + transition */ }
.nav__dropdown:hover .nav__dropdown-menu { opacity: 1; visibility: visible; }
.nav__dropdown-trigger svg { width: 10px; height: 10px; transition: transform var(--transition-fast); }
.nav__dropdown:hover .nav__dropdown-trigger svg { transform: rotate(180deg); }
```

- **INTERACTION MODEL: hover only.** There is no click handler, no
  `aria-expanded`, and no keyboard/touch path for the dropdowns in the source.
  Reproduce as-is — adding JS would diverge from the target.
- Two dropdowns: **Services** (8 items) and **Locations** (7 items).
- Menu: `rgba(17,17,17,0.97)` + `backdrop-filter: blur(20px)` + `1px solid var(--color-border)`.

## 4. Mobile menu — click-driven class toggle (JS)

- `.mobile-menu` is `position: fixed; inset: 0; z-index: 200`,
  `background: rgba(10,10,10,0.98)`, `backdrop-filter: blur(24px)`, laid out as a
  centered `flex-direction: column` with `gap: var(--space-6)`.
- Closed: `opacity: 0; visibility: hidden`, transition `400ms var(--ease-out)`.
- Open (`.mobile-menu--open`): `opacity: 1; visibility: visible`.
- **The class is the entire mechanism.** The hamburger in the nav toggles it.
- Escape closes it; so does activating any link.
- 15 links + a `Book Now` button (`.btn--accent`).
- Links are Cormorant Garamond `var(--text-xl)` weight 300,
  `color: var(--color-text-muted)`, `letter-spacing: 0.05em`; hover turns them
  `var(--color-accent)` over 180ms.
- Because the closed state is `visibility: hidden`, the panel is out of the tab
  order and the a11y tree while closed — no `inert` needed.

## 5. Testimonial carousel — click-driven **and** time-driven (not scroll-driven)

```js
function showTestimonial(i) {
  testimonials.forEach(t => t.style.display = 'none');
  dots.forEach(d => { d.style.background = 'transparent'; });
  if (testimonials[i]) { testimonials[i].style.display = ''; }
  if (dots[i]) { dots[i].style.background = 'var(--color-accent)'; }
  currentTestimonial = i;
}
dots.forEach(dot => dot.addEventListener('click', () => showTestimonial(parseInt(dot.dataset.dot))));
if (testimonials.length) { setInterval(() => { showTestimonial((currentTestimonial + 1) % testimonials.length); }, 6000); }
```

- **6** panels (`[data-testimonial="0".."5"]`) and **6** dots
  (`.testimonial-dot[data-dot="0".."5"]`, `aria-label="Show testimonial 1".."6"`).
- All panels stay in the DOM; visibility is an inline `display` toggle. **There is
  no transition, fade or slide on the swap** — it is instantaneous.
- Auto-advance every **6000 ms**, wrapping `(current + 1) % 6`. A dot click sets
  the index directly and does **not** reset the interval.
- `.testimonial-dot`, `.testimonial-dots` and `.testimonial__name` have **no CSS
  rules at all** in the stylesheet — they are styled purely by inline `style`
  attributes, and the active dot's background is set imperatively by the script.
- **The section's height changes with the visible quote** (measured 859px with
  panel 2 out, 913px with panel 1 out). That is expected, not a layout bug.
- The rating line above the panels reads `★★★★★  5.0 average across verified
  reviews` — stars in `var(--color-accent)`, two `&nbsp;` between.

## 6. Newsletter signup popup — time-driven + click-driven

- **Hidden on load**, auto-opens **12000 ms** after load, and only when
  `localStorage["upkeep_signup_v1"]` is unset.
- `openPopup()`: add `is-open`, `aria-hidden="false"`, `document.body.style.overflow = "hidden"`,
  then focus the email input after **250 ms**.
- `closePopup()`: remove `is-open`, `aria-hidden="true"`, restore body overflow,
  write `localStorage["upkeep_signup_v1"] = "dismissed:" + Date.now()` (in
  `try/catch`), restore focus to `lastFocus`.
- Close triggers: any `[data-signup-close]` (the backdrop, the ✕ button, and the
  success state's Close button) and **Escape**, the latter bound only while open.
- Manual trigger: any `[data-open-signup]` element, with `preventDefault()`.
  *No element on the home page uses this attribute* — same as the source.
- Two states swapped via `[data-signup-state="form" | "success"]`; the success
  block is `hidden` until submitted.
- The source posts to Mailchimp's JSONP endpoint. **Out of scope for the clone** —
  submission is handled client-side with no network call.
- Closed: `opacity: 0; visibility: hidden`; open: `opacity: 1; visibility: visible`
  (`z-index: 2000`).

## 7. Marketing cookie consent banner — visible on load, persisted

- Injected by `consent-banner.js`. **Visible immediately** (not delayed, not
  scroll-triggered). `position: fixed; bottom: 0; z-index: 9999`, 78px tall.
- Two buttons: `[data-consent="decline"]` (secondary) and
  `[data-consent="accept"]` (primary, "Allow marketing cookies").
- The choice is written to `localStorage`; on a later visit the bar is not
  rendered at all. All storage access is in `try/catch`.

## 8. Accessibility widget — click-driven, persisted

- `accessibility-menu.js`. Visible on load, `position: fixed; bottom: 20px;
  left: 20px; z-index: 9998`, **52×52px** (16px/16px on small screens).
- `#a11y-menu-button` toggles `#a11y-menu-panel`'s `hidden` attribute and syncs
  `aria-expanded`. Escape closes and returns focus; outside click also closes.
  Focus moves to `<h2 id="a11y-menu-heading" tabindex="-1">` on open.
- Two checkbox rows, each a `<label class="a11y-menu__toggle">` wrapping a
  **visually hidden** checkbox plus a decorative switch span (the "on" look is
  `:checked ~ .a11y-menu__toggle-switch`). Clicking the row toggles it — native
  label behavior, not a div with a handler.
- `Larger text` → `html.a11y-large-text` + `localStorage["upkeep-a11y-large-text"]="1"`
- `Reduce motion` → `html.a11y-reduce-motion` + `localStorage["upkeep-a11y-reduce-motion"]="1"`
- `Reset preferences` clears both classes and both keys and unchecks both boxes.
- The target re-applies the persisted classes **before first paint**; in React
  this must happen in an effect, so a returning visitor can see a one-frame flash
  of the base text size. Accepted trade-off of hydration.

## 9. Global transition model (`base.css`)

```css
a, button, [role='button'], [role='link'], input, textarea, select {
  transition: color 180ms cubic-bezier(0.16,1,0.3,1),
              background 180ms cubic-bezier(0.16,1,0.3,1),
              border-color 180ms cubic-bezier(0.16,1,0.3,1),
              box-shadow 180ms cubic-bezier(0.16,1,0.3,1),
              opacity 180ms cubic-bezier(0.16,1,0.3,1),
              transform 180ms cubic-bezier(0.16,1,0.3,1);
}
```

One curve everywhere: **`cubic-bezier(0.16, 1, 0.3, 1)`** (`--ease-out`).
Durations: 180ms `--transition-fast`, 350ms `--transition-med`, 600ms
`--transition-slow`. The two deliberate exceptions are `.btn--pink`
(`background/border-color/color 0.2s` ease — not the brand curve) and the mobile
menu (400ms).

`.hero__scroll-hint` carries `animation: float 3s ease-in-out infinite`
unconditionally.

## 10. Smooth scroll

`html { scroll-behavior: smooth; scroll-padding-top: 80px }`. No Lenis,
Locomotive Scroll or any other smooth-scroll library — `.lenis` /
`.locomotive-scroll` are absent. Next 16 no longer forces its own
`scroll-behavior`, so `data-scroll-behavior="smooth"` is set on `<html>` in the
layout to preserve the behavior for client-side navigation.

## 11. Editorial image color grading (CSS, permanent)

```css
img:not(.nav__logo-img):not(.footer__logo-img):not(.gallery-grid__img) {
  filter: sepia(0.06) saturate(1.05) brightness(0.98) contrast(1.02);
}
.hero__bg img, ... { filter: sepia(0.08) saturate(1.08) brightness(0.96) contrast(1.03); }
```

Applies to every image, always — this is what makes the photography read as one
shoot. The logo is excluded. Do not add filters per-image.

---

## Bugs reproduced on purpose (do NOT fix)

These are real defects in the target. The clone reproduces them so it is
behaviorally identical; each was verified against the live site.

1. **The consent bar covers the accessibility button.** The bar is
   `position: fixed; bottom: 0; height: 78px; z-index: 9999`; the a11y button is
   `bottom: 20px; height: 52px; z-index: 9998`. They overlap by 50px, and
   `document.elementFromPoint` at the button's centre returns the banner — so the
   button is **not clickable while the banner is shown**. Verified: live target
   `reachable: false`, clone `reachable: false`.
2. **The flash-sale overlay swallows pointer events.** The target carries a
   `.upk-flash-overlay.upk-pop-open` fixed full-viewport element at
   `opacity: 0` that still hit-tests, so it also sits over the a11y button
   (`reachable: false` on the live site). Not cloned (see KNOWN_GAPS.md).
3. **The newsletter popup does not reset.** Reopening after a successful submit
   still shows the "See You Soon" success state, because the source never resets
   the two blocks.
4. **`aria-labelledby="signupHeading"` points at a hidden heading** while the
   success block is shown, because the id lives on the form block's `<h2>`.
5. **Dropdowns are keyboard-inaccessible** — hover-only, no `aria-expanded`, no
   focus path.
