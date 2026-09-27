# IntroSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/IntroSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-02-intro.png`
- **Interaction model:** static (one `fade-in` reveal on the inner `.split`)
- **Export:** named `IntroSection`, **no props** — read content from `intro` in `@/lib/upkeepmedspa-data`.
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
<section .section aria-label="Signature treatments">
  <div .container>
    <div .split.fade-in>
      <div>
        <img alt="Close-up of radiant skin after facial treatment" src="./assets/section-results.jpg" style="width:100%;height:auto;object-fit:cover;">
      <div>
        <p .eyebrow "Refined Results">
        <h2 .heading-section.mb-4 "Treatments That Speak for Themselves">
        <p .body-text.mb-6 "We combine medical expertise with an artist's eye. Every treatment is tailored to enhance your natur…">
        <a .btn.btn--arrow "View Our Results" href="/gallery">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `split`

**.split.fade-in** — 1256×337px, 2 child element(s)

> `Refined Results Treatments That Speak for Themselves We combine medical expertise with an artist's eye. Every `

- `display`: `grid`
- `width`: `1256px`
- `height`: `337.109px`
- `alignItems`: `center`
- `gap`: `48px`
- `rowGap`: `48px`
- `columnGap`: `48px`
- `gridTemplateColumns`: `604px 604px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- `animationName`: `revealFade`
- children: `div.`, `div.`

### `introEyebrow`

**.eyebrow** — 604×21px, 0 child element(s)

> `Refined Results`

- `display`: `block`
- `width`: `604px`
- `height`: `20.7969px`
- `margin`: `0px 0px 16px`
- `marginBottom`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `500`
- `lineHeight`: `20.8px`
- `letterSpacing`: `3.25px`
- `textTransform`: `uppercase`
- `color`: `rgb(212, 160, 144)`
- `transition`: `all`

### `introH2`

**.heading-section.mb-4** — 604×121px, 0 child element(s)

> `Treatments That Speak for Themselves`

- `display`: `block`
- `width`: `604px`
- `height`: `121.438px`
- `margin`: `0px 0px 16px`
- `marginBottom`: `16px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `55.2px`
- `fontWeight`: `300`
- `lineHeight`: `60.72px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `introText`

**.body-text.mb-6** — 588×58px, 0 child element(s)

> `We combine medical expertise with an artist's eye. Every treatment is tailored to enhance your natural feature`

- `display`: `block`
- `width`: `587.516px`
- `height`: `57.7812px`
- `maxWidth`: `587.52px`
- `margin`: `0px 0px 24px`
- `marginBottom`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `300`
- `lineHeight`: `28.9px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `all`

### `introBtn`

**.btn.btn--arrow** — 265×50px, 0 child element(s)

> `View Our Results`

- `display`: `inline-flex`
- `width`: `264.609px`
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
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `introSection`

**.section** — 1440×567px, 1 child element(s)

> `Refined Results Treatments That Speak for Themselves We combine medical expertise with an artist's eye. Every `

- `display`: `block`
- `position`: `relative`
- `width`: `1440px`
- `height`: `567.484px`
- `padding`: `115.2px 0px`
- `paddingTop`: `115.2px`
- `paddingBottom`: `115.2px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `div.container`

## States & Behaviors
### Entrance reveal
- Elements marked `fade-in` animate via **native CSS scroll-driven animation** already in the
  ported sheet: `opacity: 0` + `animation: revealFade linear both` with
  `animation-timeline: view()` and `animation-range: entry 0% entry 80%`, ending at `opacity: 1`.
- **Add the class and stop.** No IntersectionObserver, no framer-motion, no opacity state.
  Where `animation-timeline` is unsupported the sheet keeps `opacity: 1`, so content is
  visible without JS. Do not fight that.

### Grid behaviour
- `.split` is `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: center`.
  At **max-width: 768px** the ported sheet collapses it to `grid-template-columns: 1fr; gap: var(--space-8)`.
  The two child `<div>`s are plain grid items — the left one wraps the image, the right one the copy.
- The source marks the image `<img>` with an inline `style="width:100%;height:auto;object-fit:cover"`.
  In React, put `className="relative"` on the wrapper `<div>` and use `fill` +
  `className="object-cover"` on `<Image>` with an appropriate `sizes`. Do not copy the inline style.

### Section
- `<section class="section" aria-label="Signature treatments">`
- `.section` = `padding-block: clamp(var(--space-16), 8vw, var(--space-32))` → 115.2px top and
  bottom at 1440. That is why the section is 567px tall.
- `<div class="container">` wraps the `.split`. `.container` is `max-width: var(--content-wide)`
  (1320px) with `padding-inline: var(--gutter)` (32px at 1440).

### Copy (verbatim, from `intro`)
- eyebrow `Refined Results` → `.eyebrow`
- heading `Treatments That Speak for Themselves` → `.heading-section.mb-4`
- body `We combine medical expertise with an artist's eye. Every treatment is tailored to enhance
  your natural features — never overdone, always intentional.` → `.body-text.mb-6`
- CTA `View Our Results` → `<a class="btn btn--arrow" href="/gallery">` (`/gallery`)
- image alt: `Close-up of radiant skin after facial treatment`

### Hover
- `.btn--arrow`'s arrow is a `::after` in the ported sheet and appears on its own. Hover is
  CSS-only (180ms brand curve). No JS.
## Responsive Behavior
- **1440:** two columns side by side, image left / copy right, `h2` 55.2px.
- **768:** single column, image above copy, `gap: var(--space-8)`.
- **390:** single column, `h2` 48px, button full-width.
- **Breakpoint: 768px** (ported sheet's `.split` media query).

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
