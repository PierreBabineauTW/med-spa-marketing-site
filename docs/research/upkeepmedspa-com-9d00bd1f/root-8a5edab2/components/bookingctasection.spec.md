# BookingCtaSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/BookingCtaSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-08-booking-cta.png`
- **Interaction model:** static (one `fade-in` reveal)
- **Export:** named `BookingCtaSection`, **no props** — read content from `bookingCta` in `@/lib/upkeepmedspa-data`.
## Styling contract (read this first)

The target's own stylesheet is already ported to
`src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css` and imported **unlayered** by
`src/app/globals.css`, so it beats Tailwind preflight and wins the cascade.

**Use the ported class names verbatim and write no new CSS.** Do not add Tailwind colour,
spacing, font-size or font-family utilities — the type scale, palette and easings live in the
ported sheet (`--color-accent`, `--text-hero`, `--ease-out`, `--content-wide`, …).
Combine classes with `cn()` from `@/lib/utils` when you need a conditional.

- Icons: `@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons`
- Content: `@/lib/upkeepmedspa-data` — every string, href and image path is already the live
  site's. Read from it; do not hardcode copy.
- Types: `@/types/upkeepmedspa`
- Images: `next/image`. In Next 16 `priority` is **deprecated** — use
  `loading="eager"` + `fetchPriority="high"` above the fold and default lazy loading below it.
  Wrap every `fill` image in a parent you make `relative` (a bare grid/flex child is not
  positioned, and `fill` needs a positioned ancestor). Always pass `sizes` with `fill`.
  A global rule in the ported sheet already colour-grades all images
  (`filter: sepia(0.06) saturate(1.05)…`) — do not add filters yourself.
- **Before you finish:** `npx tsc --noEmit` must pass.

## DOM Structure — captured verbatim from the live page

```text
<section .booking-cta aria-label="Book your visit">
  <div .booking-cta__bg>
    <img alt="Floral beauty editorial" src="./assets/hero-home.jpg">
  <div .booking-cta__content.fade-in>
    <p .eyebrow.text-center "Your Visit Starts Here">
    <h2 .heading-section.text-center.mb-4 "Ready to Glow?">
    <p .body-text.text-center.mx-auto.mb-8 "Expert care, clear pricing, and treatments designed for real results. Book your complimentary consul…">
    <div .text-center>
      <a .btn.btn--filled "Book Your Visit" href="https://www.joinblvd.com/b/upkeep-medspa/widget#/locations">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `ctaSection`

**.booking-cta** — 1440×413px, 2 child element(s)

> `Your Visit Starts Here Ready to Glow? Expert care, clear pricing, and treatments designed for real results. Bo`

- `display`: `block`
- `position`: `relative`
- `width`: `1440px`
- `height`: `413.297px`
- `padding`: `80px 0px`
- `paddingTop`: `80px`
- `paddingBottom`: `80px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `hidden`
- `transition`: `all`
- children: `div.booking-cta__bg`, `div.booking-cta__content.fade-in`

### `ctaBg`

**.booking-cta__bg** — 1440×413px, 1 child element(s)

- `display`: `block`
- `position`: `absolute`
- `width`: `1440px`
- `height`: `413.297px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `img.`

### `ctaContent`

**.booking-cta__content.fade-in** — 1440×253px, 4 child element(s)

> `Your Visit Starts Here Ready to Glow? Expert care, clear pricing, and treatments designed for real results. Bo`

- `display`: `block`
- `position`: `relative`
- `width`: `1440px`
- `height`: `253.297px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- `animationName`: `revealFade`
- children: `p.eyebrow.text-center`, `h2.heading-section.text-center.mb-4`, `p.body-text.text-center.mx-auto`, `div.text-center`

### `ctaH2`

**.heading-section.text-center.mb-4** — 1440×61px, 0 child element(s)

> `Ready to Glow?`

- `display`: `block`
- `width`: `1440px`
- `height`: `60.7188px`
- `margin`: `0px 0px 16px`
- `marginBottom`: `16px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `55.2px`
- `fontWeight`: `300`
- `lineHeight`: `60.72px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `ctaText`

**.body-text.text-center.mx-auto.mb-8** — 588×58px, 0 child element(s)

> `Expert care, clear pricing, and treatments designed for real results. Book your complimentary consultation tod`

- `display`: `block`
- `width`: `587.516px`
- `height`: `57.7812px`
- `maxWidth`: `587.52px`
- `margin`: `0px 426.25px 32px 426.234px`
- `marginRight`: `426.25px`
- `marginBottom`: `32px`
- `marginLeft`: `426.234px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `300`
- `lineHeight`: `28.9px`
- `textAlign`: `center`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `all`

### `btnFilled`

**.btn.btn--filled** — 215×50px, 0 child element(s)

> `Book Your Visit`

- `display`: `inline-flex`
- `width`: `214.859px`
- `height`: `50px`
- `minHeight`: `48px`
- `padding`: `12px 32px`
- `paddingTop`: `12px`
- `paddingRight`: `32px`
- `paddingBottom`: `12px`
- `paddingLeft`: `32px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `gap`: `8px`
- `rowGap`: `8px`
- `columnGap`: `8px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `15px`
- `fontWeight`: `400`
- `lineHeight`: `24px`
- `letterSpacing`: `1.8px`
- `textTransform`: `uppercase`
- `textAlign`: `center`
- `color`: `rgb(10, 10, 10)`
- `backgroundColor`: `rgb(212, 160, 144)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

## States & Behaviors
### Entrance reveal
- Elements marked `fade-in` animate via **native CSS scroll-driven animation** already in the
  ported sheet: `opacity: 0` + `animation: revealFade linear both` with
  `animation-timeline: view()` and `animation-range: entry 0% entry 80%`, ending at `opacity: 1`.
- **Add the class and stop.** No IntersectionObserver, no framer-motion, no opacity state.
  Where `animation-timeline` is unsupported the sheet keeps `opacity: 1`, so content is
  visible without JS. Do not fight that.

### Layered composition — exactly two layers
1. `<div class="booking-cta__bg">` — absolutely positioned, contains the `<Image>`
2. `<div class="booking-cta__content fade-in">` — the copy, `position: relative`

The darkening over the photo is the gradient on `.booking-cta__bg` in the ported sheet.
**Do not add a third overlay div** (unlike the hero, which has a separate `.hero__overlay`).

### Image
- Reuses the hero's photo: `bookingCta.background.src` → `hero-home.jpg` (natural 1193×1080).
  `alt` is `Floral beauty editorial`. Lazy — it is below the fold. `fill` + `object-cover`.
- `.booking-cta__bg` is already `position: absolute` in the sheet, so `fill` works there;
  still pass `sizes` (`100vw`).

### Copy (verbatim, from `bookingCta`)
- eyebrow `Your Visit Starts Here` → `.eyebrow.text-center`
- `<h2 class="heading-section mb-4 text-center">` `Ready to Glow?`
- `<p class="body-text text-center mx-auto mb-8">` `Expert care, clear pricing, and treatments
  designed for real results. Book your complimentary consultation today.`
- `<a class="btn btn--filled">` `Book Your Visit` → the booking URL

### Button
- `.btn--filled` is a filled rose-gold button: `background-color: #d4a090`, `color: #0a0a0a`,
  `border: 1px solid #d4a090`, `padding: 12px 32px`, `min-height: 48px`, uppercase,
  `letter-spacing: 1.8px`. Hover is CSS-only.
## Responsive Behavior
- **1440:** section 398px tall; copy centred and width-capped (~588px on the `p`).
- **768:** unchanged structurally; copy caps out.
- **390:** `h2` 48px, button full-width.
- No layout switch — only the fluid type scale and button width change.

Page-wide responsive facts, all handled by the ported sheet:
| Property | 1440 | 768 | 390 |
| --- | --- | --- |
| `.container` max-width | `1320px` | `1320px` | `1320px` |
| `.split` direction | `row` | `row` | `row` |
| `.services-row` columns | `296px 296px 296px 296px` | `341.281px 341.281px` | `171px 171px` |
| `.grid-4` columns | `299px 299px 299px 299px` | `343.281px 343.281px` | `173px 173px` |
| `.grid-3` columns | `402.656px 402.672px 402.656px` | `341.281px 341.281px` | `358px` |
| `.footer__grid` columns | `454.391px 227.203px 227.203px 227.188px` | `337.281px 337.281px` | `358px` |
| `.nav__links` | `flex visible` | `none visible` | `none visible` |
| `.nav__hamburger` | `none visible` | `flex visible` | `flex visible` |
| reference `h1` font-size | `108.8px` | `61.76px` | `48px` |
