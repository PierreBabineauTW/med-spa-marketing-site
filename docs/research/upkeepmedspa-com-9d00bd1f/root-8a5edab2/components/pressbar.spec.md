# PressBar Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/PressBar.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-06-press.png`
- **Interaction model:** static (one `fade-in` reveal)
- **Export:** named `PressBar`, **no props** — read content from `press` in `@/lib/upkeepmedspa-data`.
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
<section .section--tight aria-label="Press mentions" style="padding-block:var(--space-10);">
  <div .container>
    <p .eyebrow.text-center.mb-6 "As Seen In" style="color:var(--color-text-faint);">
    <div .press-bar.fade-in>
      <span .press-bar__item "Allure">
      <span .press-bar__item "Vogue" style="font-style:italic;">
      <span .press-bar__item "The Cut">
      <span .press-bar__item "Byrdie" style="font-style:italic;">
      <span .press-bar__item "Well+Good">
      <span .press-bar__item "Cosmopolitan" style="font-style:italic;">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `pressSection`

**.section--tight** — 1440×160px, 1 child element(s)

> `As Seen In Allure Vogue The Cut Byrdie Well+Good Cosmopolitan`

- `display`: `block`
- `width`: `1440px`
- `height`: `159.984px`
- `padding`: `40px 0px`
- `paddingTop`: `40px`
- `paddingBottom`: `40px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `div.container`

### `pressBar`

**.press-bar.fade-in** — 1256×35px, 6 child element(s)

> `Allure Vogue The Cut Byrdie Well+Good Cosmopolitan`

- `display`: `flex`
- `width`: `1256px`
- `height`: `35.1875px`
- `flexWrap`: `wrap`
- `justifyContent`: `center`
- `alignItems`: `center`
- `gap`: `57.6px`
- `rowGap`: `57.6px`
- `columnGap`: `57.6px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- `animationName`: `revealFade`
- children: `span.press-bar__item`, `span.press-bar__item`, `span.press-bar__item`, `span.press-bar__item`, `span.press-bar__item`, `span.press-bar__item`

### `pressItem`

**.press-bar__item** — 61×35px, 0 child element(s)

> `Allure`

- `display`: `block`
- `width`: `60.9688px`
- `height`: `35.1875px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `22px`
- `fontWeight`: `400`
- `lineHeight`: `35.2px`
- `letterSpacing`: `1.1px`
- `color`: `rgba(245, 240, 235, 0.65)`
- `transition`: `all`

**.press-bar__item** — 52×35px, 0 child element(s)

> `Vogue`

- `display`: `block`
- `width`: `52.0156px`
- `height`: `35.1875px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `22px`
- `fontWeight`: `400`
- `fontStyle`: `italic`
- `lineHeight`: `35.2px`
- `letterSpacing`: `1.1px`
- `color`: `rgba(245, 240, 235, 0.65)`
- `transition`: `all`

### `eyebrow`

**.eyebrow.text-center** — 765×21px, 0 child element(s)

> `Making Aesthetics Accessible`

- `display`: `block`
- `width`: `764.656px`
- `height`: `20.7969px`
- `margin`: `0px 0px 16px`
- `marginBottom`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `500`
- `lineHeight`: `20.8px`
- `letterSpacing`: `3.25px`
- `textTransform`: `uppercase`
- `textAlign`: `center`
- `textShadow`: `rgba(0, 0, 0, 0.6) 0px 1px 8px`
- `color`: `rgb(255, 255, 255)`
- `transition`: `all`

## States & Behaviors
### Entrance reveal
- Elements marked `fade-in` animate via **native CSS scroll-driven animation** already in the
  ported sheet: `opacity: 0` + `animation: revealFade linear both` with
  `animation-timeline: view()` and `animation-range: entry 0% entry 80%`, ending at `opacity: 1`.
- **Add the class and stop.** No IntersectionObserver, no framer-motion, no opacity state.
  Where `animation-timeline` is unsupported the sheet keeps `opacity: 1`, so content is
  visible without JS. Do not fight that.

### Structure
- `<section class="section--tight">` → `<div class="container">` → `<p class="eyebrow text-center mb-6">`
  → `<div class="press-bar fade-in">` holding six `<span class="press-bar__item">`.
- `.section--tight` = `padding-block: clamp(var(--space-8), 4vw, var(--space-16))`.

### Content — text only, not links
- Eyebrow: `As Seen In`
- Items, in order: `Allure`, `Vogue`, `The Cut`, `Byrdie`, `Well+Good`, `Cosmopolitan`
- In the source these are plain `<span>`s with **no `href`**. Do not turn them into links or
  buttons. Read them from `press.items`.
- They are wordmarks rendered as styled text — there are no logo images.

### Hover
- None in the source. `.press-bar__item` has no hover rule. Do not invent one.
## Responsive Behavior
- **1440:** single row of 6, evenly spaced by `justify-content`/`gap` in the sheet.
- **768:** still one row, smaller.
- **390:** **wraps to two rows of 3** via `flex-wrap` in the ported sheet.
- Do not add a grid or Tailwind breakpoints — the sheet already wraps.

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
