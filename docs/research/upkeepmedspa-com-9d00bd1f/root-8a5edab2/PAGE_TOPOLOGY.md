# PAGE_TOPOLOGY — upkeepmedspa.com (home)

Assembly blueprint. Section order, layering, z-index ladder and measured geometry,
all read off the live page at 1440×900.

## Page shell

- **Scroll container:** the document (`body { overflow-x: hidden }`). No custom
  scroll container, no `scroll-snap`, no smooth-scroll library.
- **Column structure:** single column of full-width `<section>`s inside
  `<main id="main-content">`, each with a `.container` (max-width 1320px,
  `padding-inline: clamp(1rem, 4vw, 2rem)`).
- **Assets:** served from `/assets/…` on the target; all downloaded to
  `public/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/`.

## z-index ladder (bottom → top)

| Layer | z-index | Notes |
| --- | --- | --- |
| Page content | auto / 0 | normal flow |
| `.nav` | 100 | `position: fixed`, top 0 |
| `.mobile-menu` | 200 | `position: fixed; inset: 0`, only at ≤ the small breakpoint |
| `#signupPopup` | 2000 | `position: fixed; inset: 0` |
| `#a11y-menu-root` | 9998 | fixed bottom-left, 52×52 |
| `#upkeep-consent-banner` | 9999 | fixed bottom, full width, 78px |
| `.upk-flash-overlay` (target only) | 10001 | see KNOWN_GAPS.md |

## Body children (source order)

```
a.skip-link                     absolute, off-screen until focused  → #main-content
nav.nav                         fixed, 77px → 69px scrolled
div.mobile-menu                 fixed, hidden until --open          (inside SiteNav)
main#main-content               the 8 sections
footer.footer
div#upkeep-consent-banner       fixed bottom
div#signupPopup                 fixed, hidden until .is-open
div#a11y-menu-root              fixed bottom-left
```

## Sections (top → bottom, measured at 1440×900)

| # | Class / id | Eyebrow | Heading | y | h | Interaction |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `section.hero` | Making Aesthetics Accessible | **Not Your Mother's** ⏎ **Med Spa** | 0 | 900 | static + `fade-in`; two stacked layers |
| 1 | `section.section` `aria-label="Signature treatments"` | Refined Results | Treatments That Speak for Themselves | 900 | 567 | static + `fade-in` |
| 2 | `section#services.section--tight` | What We Offer | Our Services | 1467 | 1441 | static + `fade-in` |
| 3 | `section.section` `aria-label="Client testimonials"` | Real Clients, Real Words | What Our Clients Say | 2908 | 913¹ | **click + 6s auto-advance** |
| 4 | `section.section` `aria-label="Our locations"` | Find Your Nearest Studio | 7 Locations Across NYC & Dallas | 3767 | 1259 | static + `fade-in` |
| 5 | `section.section--tight` `aria-label="Press mentions"` | As Seen In | — | 5027 | 160 | static + `fade-in` |
| 6 | `section.section` `aria-label="Latest from the blog"` | Expert Insights | How to UPKEEP | 5187 | 818 | static + `fade-in` |
| 7 | `section.booking-cta` `aria-label="Book your visit"` | Your Visit Starts Here | Ready to Glow? | 6005 | 413 | static + `fade-in` |
| — | `footer.footer` | — | — | 6418 | 598 | static, no JS |

¹ 859–913px depending on which testimonial quote is visible.

> **Selector warning.** `section#services` also carries `.section--tight`, so
> class-based selectors are ambiguous. `main > section:nth-of-type(n)` is the
> only reliable addressing: 1 hero, 2 intro, 3 services, 4 testimonials,
> 5 locations, 6 press, 7 journal, 8 booking-cta.

## Internal layout per section

**0 · Hero** — `display: flex`, `min-height: 100dvh`. Three positioned children:
`.hero__bg` (image, absolute inset 0, `object-fit: cover`) → `.hero__overlay`
(`linear-gradient(rgba(10,10,10,.4) 0%, .15 40%, .5 80%, .85 100%)`) →
`.hero__content.fade-in` (relative, centred). Inside: eyebrow → `h1` with a `<br>` →
`.hero__ctas` (2 outline buttons) → `.hero__ctas--specials` (pink filled button).
`.hero__scroll-hint` absolute at the bottom. `h1` is `clamp(3rem, 0.5rem + 7vw, 7rem)`
→ 108.8px at 1440, 61.76px at 768, 48px at 390.

**1 · Intro** — `.container` → `.split.fade-in`, a 2-column grid
(`1fr 1fr`, `gap: var(--space-12)`, `align-items: center`) that collapses to one
column at **≤768px**. Left = image (intrinsic 2752×1536, `height: auto`),
right = eyebrow + `h2` + `.body-text` + `.btn--arrow`.

**2 · Services** — header block, then `.services-row` grid: **4** columns at 1440
(296px), **2** at 768, **2** at 390 (171px) → 8 tiles in a 4+4 block. Each tile is
an `<a class="svc-tile">`: `.svc-tile__img` (`aspect-ratio: 3/4`, radius 8px,
`object-fit: cover`) + `.svc-tile__title` + `.svc-tile__desc`. Then
`.pricing-disclosure` (fine print, bordered box), then a centred `.btn--arrow`.
Two tiles highlight a price in a rose-gold span.

**3 · Testimonials** — centred column. Rating line, then a
`max-width: 760px; margin: 0 auto` box holding all 6 panels, then the dots, then
the review-attribution `<p>`.

**4 · Locations** — header, then `.grid-4` with
`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` — **`auto-fill`**
produces 4 / 2 / 2 columns and a ragged 4+3 second row. Each card is an
`<a class="location-card">` with three layers: `.location-card__bg` (absolute,
image), `.location-card__overlay` (bottom-up darkening gradient), and
`.location-card__content` (name + address, bottom-anchored). Section carries
`background: var(--color-surface)` (#111), the only lighter band on the page.

**5 · Press** — eyebrow + `.press-bar`, a centred `flex-wrap: wrap` row of six
publication wordmarks with `gap: clamp(var(--space-8), 4vw, var(--space-16))`.
Wraps to 2×3 at 390. **Vogue, Byrdie and Cosmopolitan are italic** (inline
`font-style`), alternating. The eyebrow is `--color-text-faint`, not rose-gold.
The `<section>` also carries an inline `padding-block: var(--space-10)`.

**6 · Journal** — a `.flex` header row (inline `space-between` / `flex-end` /
`wrap` / `gap: var(--space-4)`) with eyebrow + `h2` left and
`.btn--small.btn--arrow` right; then `.grid-3`: **3** columns at 1440, **1** at
768 and 390. Each card: `<div class="overflow-hidden">` wrapping
`img.blog-card__image` (`aspect-ratio: 16/10`, `object-fit: cover`), then
`.blog-card__content` with category / title / excerpt. The three photos are
**portrait originals cropped to 16:10** — a heavy centre crop, reproduced as-is.

**7 · Booking CTA** — two layers: `.booking-cta__bg` (absolute, image;
`opacity: 0.3` on the img provides the dim — there is no separate overlay here)
then `.booking-cta__content.fade-in` (relative, centred, copy capped ~588px).

**Footer** — `.footer__grid`: **4** columns at 1440 (the brand cell is double
width: 454.39px vs 227.2px), **2** at 768, **1** at 390. Cells: brand (logo in
`.footer__brand-logo`, italic tagline, 3 socials at 18×18), Navigate (9 links),
Services (8 links), Contact (phone, email, note, Book Now). Then
`.footer__bottom` (copyright + 4 legal links) and `.footer__a11y-notice`.

## Dependencies between sections

- The fixed nav overlays the hero; the hero is `min-height: 100dvh` and starts at
  y=0, so its top third sits **behind** the nav. `scroll-padding-top: 80px` keeps
  `#services` anchors clear of it.
- `.booking-cta__bg` reuses `hero-home.jpg` — the same photo as the hero.
- The consent bar and the a11y button overlap each other (see BEHAVIORS.md §11).
- No section depends on another's JS. Each is independently static except the
  testimonial carousel.

## Responsive summary (measured, not estimated)

| Element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `h1` (hero) | 108.8px | 61.76px | 48px |
| `h2` (`.heading-section`) | 55.2px | 38.4px | 32px |
| `.body-text` | 17px | 15.94px | 15.18px |
| `.btn` | 15px | 14.3px | 13.17px |
| `.testimonial__quote` | 36px | 28.42px | 24px |
| `.location-card__name` | 36px | 28.42px | 24px |
| `.nav__links` | flex | **none** | **none** |
| `.nav__hamburger` | **none** | flex | flex |
| `.nav__book--desktop` | flex | **none** | **none** |
| `.split` | 2 cols | 2 cols | 1 col (≤768px) |
| `.services-row` | 4 cols | 2 cols | 2 cols |
| `.grid-4` (locations) | 4 cols | 2 cols | 2 cols |
| `.grid-3` (journal) | 3 cols | 1 col | 1 col |
| `.footer__grid` | 4 cols | 2 cols | 1 col |
| `.press-bar` | 6 in a row | 6 in a row | 2 rows of 3 |

Document scroll height: 7016px (target) vs 7071px (clone) at 1440; the delta is
the testimonial quote length. No horizontal overflow at 1440, 768 or 390.
