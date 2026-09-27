# LocationsSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/LocationsSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-05-locations.png`
- **Interaction model:** static (`fade-in` on the header, grid and CTA wrapper)
- **Export:** named `LocationsSection`, **no props** — read content from `locations` in `@/lib/upkeepmedspa-data`.
## Styling contract (read this first)

The target's own stylesheet is already ported to
`src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css` and imported **unlayered** by
`src/app/globals.css`, so it beats Tailwind preflight and wins the cascade. That sheet also
contains the site's own **utility classes** (`.text-center`, `.mx-auto`, `.mb-4`, `.mb-6`,
`.mb-8`, `.flex`, `.overflow-hidden`), so the class strings in the captured DOM resolve
without any Tailwind at all.

**Use the ported class names verbatim and write no new CSS.** Do not add Tailwind colour,
spacing, font-size or font-family utilities — the type scale, palette and easings live in the
ported sheet. Combine classes with `cn()` from `@/lib/utils` when you need a conditional.

- Icons: `@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons`
- Content: `@/lib/upkeepmedspa-data` — every string, href and image path (with intrinsic
  `width`/`height`) is already the live site's. Read from it; do not hardcode copy.
- Types: `@/types/upkeepmedspa`
- Images: `next/image`. In Next 16 `priority` is **deprecated** — use
  `loading="eager"` + `fetchPriority="high"` above the fold, default lazy below it.
  `fill` requires a positioned parent; where the ported sheet already gives the wrapper
  `position: absolute` (e.g. `.location-card__bg`) `fill` works directly. Where the class
  carries its own `aspect-ratio` (e.g. `.svc-tile__img`, `.blog-card__image`) prefer explicit
  `width`/`height` props from the data. Always pass `sizes` with `fill`.
  A global rule in the sheet already colour-grades images — do not add filters.
- **Before you finish:** `npx tsc --noEmit` must pass. On this machine run it as
  `npx.cmd tsc --noEmit` (PowerShell blocks `npx.ps1`).

## DOM Structure — captured verbatim from the live page

Repeated sibling cards are collapsed to the first instance plus a count; their text,
hrefs and image paths all come from `locations`.

```text
<section .section aria-label="Our locations" style="background:var(--color-surface);">
  <div .container>
    <div .text-center.mb-8.fade-in>
      <p .eyebrow "Find Your Nearest Studio">
      <h2 .heading-section.mb-4 "7 Locations Across NYC & Dallas">
    <div .grid-4.fade-in style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
      <a .location-card href="/locations#ues" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Upper East Side" src="./assets/locations/ues-wix.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Upper East Side">
          <p .location-card__address "330 East 76th St, New York">
      <a .location-card href="/locations#gv" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Greenwich Village" src="./assets/locations/gv-wix.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Greenwich Village">
          <p .location-card__address "33 Bedford St, New York">
      <a .location-card href="/locations#bk" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Brooklyn" src="./assets/locations/brooklyn-wix.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Brooklyn">
          <p .location-card__address "480 5th Ave, Brooklyn">
      <a .location-card href="/locations#ch" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Chelsea" src="./assets/locations/chelsea-wix.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Chelsea">
          <p .location-card__address "224 W 18th St, New York">
      <a .location-card href="/locations#li" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Long Island" src="./assets/loc-li.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Long Island">
          <p .location-card__address "39 Great Neck Rd, Great Neck">
      <a .location-card href="/locations#dal" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Dallas" src="./assets/locations/dallas-wix.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Dallas">
          <p .location-card__address "5207 Bonita Ave, Dallas">
      <a .location-card href="/locations#add" style="text-decoration:none;">
        <div .location-card__bg>
          <img alt="Addison" src="./assets/locations/north-dallas-wix.jpg">
        <div .location-card__overlay>
        <div .location-card__content>
          <h3 .location-card__name "Addison">
          <p .location-card__address "5100 Belt Line Rd, Addison">
    <div .text-center.fade-in style="margin-top:var(--space-8);">
      <a .btn.btn--arrow "View All Locations" href="/locations">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `locSection`

**.section** — 1440×1259px, 1 child element(s)

> `Find Your Nearest Studio 7 Locations Across NYC & Dallas Upper East Side330 East 76th St, New York G`

- `display`: `block`
- `position`: `relative`
- `width`: `1440px`
- `height`: `1259.2px`
- `padding`: `115.2px 0px`
- `paddingTop`: `115.2px`
- `paddingBottom`: `115.2px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgb(17, 17, 17)`
- `transition`: `all`
- children: `div.container`

### `locGrid`

**.grid-4.fade-in** — 1256×817px, 7 child element(s)

> `Upper East Side330 East 76th St, New York Greenwich Village33 Bedford St, New York Brooklyn480 5th A`

- `display`: `grid`
- `width`: `1256px`
- `height`: `817.312px`
- `gap`: `20px`
- `rowGap`: `20px`
- `columnGap`: `20px`
- `gridTemplateColumns`: `299px 299px 299px 299px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- `animationName`: `revealFade`
- children: `a.location-card`, `a.location-card`, `a.location-card`, `a.location-card`, `a.location-card`, `a.location-card`, `a.location-card`

### `locCard`

**.location-card** — 299×399px, 3 child element(s)

> `Upper East Side330 East 76th St, New York`

- `display`: `flex`
- `position`: `relative`
- `width`: `299px`
- `height`: `398.656px`
- `alignItems`: `flex-end`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `hidden`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`
- children: `div.location-card__bg`, `div.location-card__overlay`, `div.location-card__content`

### `locCardBg`

**.location-card__bg** — 297×397px, 1 child element(s)

- `display`: `block`
- `position`: `absolute`
- `width`: `297px`
- `height`: `396.656px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `img.`

### `locCardBgImg`

**img** — 297×397px, 0 child element(s)

- `display`: `block`
- `width`: `297px`
- `height`: `396.656px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `clip`
- `filter`: `sepia(0.06) saturate(1.05) brightness(0.98) contrast(1.02)`
- `transition`: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`

### `locCardOverlay`

**.location-card__overlay** — 297×397px, 0 child element(s)

- `display`: `block`
- `position`: `absolute`
- `width`: `297px`
- `height`: `396.656px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundImage`: `linear-gradient(rgba(0, 0, 0, 0) 40%, rgba(10, 10, 10, 0.9) 100%)`
- `transition`: `all`

### `locCardContent`

**.location-card__content** — 297×116px, 2 child element(s)

> `Upper East Side330 East 76th St, New York`

- `display`: `block`
- `position`: `relative`
- `width`: `297px`
- `height`: `115.594px`
- `padding`: `24px`
- `paddingTop`: `24px`
- `paddingRight`: `24px`
- `paddingBottom`: `24px`
- `paddingLeft`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `h3.location-card__name`, `p.location-card__address`

### `locCardName`

**.location-card__name** — 249×40px, 0 child element(s)

> `Upper East Side`

- `display`: `block`
- `width`: `249px`
- `height`: `39.5938px`
- `margin`: `0px 0px 4px`
- `marginBottom`: `4px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `36px`
- `fontWeight`: `400`
- `lineHeight`: `39.6px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `locCardAddr`

**.location-card__address** — 249×24px, 0 child element(s)

> `330 East 76th St, New York`

- `display`: `block`
- `width`: `249px`
- `height`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `15px`
- `fontWeight`: `300`
- `lineHeight`: `24px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `all`

## States & Behaviors
### Entrance reveal — CSS only
`fade-in` elements animate via **native CSS scroll-driven animation already in the ported
sheet**: `opacity: 0` + `animation: revealFade linear both`, `animation-timeline: view()`,
`animation-range: entry 0% entry 80%`, ending at `opacity: 1`. **Add the class and stop.**
No IntersectionObserver, no framer-motion, no opacity state. Where `animation-timeline` is
unsupported the sheet keeps `opacity: 1`, so content stays visible without JS.

### Three-layer card (important — all three layers exist)
```
<a class="location-card" href={card.href}>
  <div class="location-card__bg">
    <img />                                  <- fill, object-cover
  <div class="location-card__overlay">        <- bottom-up darkening gradient
  <div class="location-card__content">
    <h3 class="location-card__name">…
    <p class="location-card__address">…
```
- The overlay is `linear-gradient(rgba(0,0,0,0) 40%, rgba(10,10,10,0.9) 100%)` — a real element
  in the markup, not a CSS-only gradient. Do not merge or drop it.
- `.location-card__bg` is `position: absolute; inset: 0`, so it is already a valid parent for
  `next/image` `fill` + `className="object-cover"` + `sizes`.
- The card has a fixed height and the text is anchored to the **bottom** via
  `.location-card__content` — do not add flex wrappers of your own.

### Grid
- `.grid-4` columns measured: **4** at 1440 (299px each), **2** at 768 (343.28px),
  **2** at 390 (173px). Seven cards, so row 1 has 4 and row 2 has 3 — that ragged second row is
  the target's real layout. Do not force a 3+4 split.

### Content
- `locations.cards` is in source order: Upper East Side, Greenwich Village, Brooklyn, Chelsea,
  Long Island, Dallas, Addison — with the exact address strings and the anchor hrefs
  (`/locations#ues`, `#gv`, `#bk`, `#ch`, `#li`, `#dal`, `#add`).
- CTA after the grid: `<a class="btn btn--arrow">` "View All Locations" → `/locations`.

### Hover
- `.location-card__bg img` has `transition: transform 800ms var(--ease-out)` and the card
  scales the photo on hover. CSS-only in the sheet — add no JS.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `grid4` | n/a | n/a | n/a |
| `locCardName` | 36px · lh 39.6px · w 249 | 28.416px · lh 31.2576px · w 293 | 24px · lh 26.4px · w 123 |
| `locCardAddr` | 15px · lh 24px · w 249 | 14.304px · lh 22.8864px · w 293 | 13.17px · lh 21.072px · w 123 |
| `btnArrow` | 15px · lh 24px · ls 1.8px · w 265 | 14.304px · lh 22.8864px · ls 1.71648px · w 256 | 13.17px · lh 21.072px · ls 1.5804px · w 242 |
| `headingSection` | 55.2px · lh 60.72px · w 604 | 38.4px · lh 42.24px · w 707 | 32px · lh 35.2px · w 358 |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type
scale. Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`
(matches the source) and internal hrefs as plain `<a>`. Do **not** use `next/link` — the target
is a static site with plain anchors and the ported CSS styles bare `a`.