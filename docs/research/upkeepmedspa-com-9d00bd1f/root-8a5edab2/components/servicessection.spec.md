# ServicesSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ServicesSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-03-services.png`
- **Interaction model:** static (four `fade-in` blocks: header, grid, CTA wrapper)
- **Export:** named `ServicesSection`, **no props** — read content from `services` in `@/lib/upkeepmedspa-data`.
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
hrefs and image paths all come from `services`.

```text
<section #services .section--tight aria-label="Service categories">
  <div .container>
    <div .text-center.mb-8.fade-in>
      <p .eyebrow "What We Offer">
      <h2 .heading-section.mb-4 "Our Services">
    <div .services-row.fade-in>
      <a .svc-tile href="/services/neurotoxins">
        <div .svc-tile__img>
          <img alt="Neurotoxin treatment" src="./assets/svc-neurotoxins.jpg">
        <h3 .svc-tile__title "Neurotoxins">
        <p .svc-tile__desc "Botox, Dysport & Xeomin — starting at">
          <span "$5/unit" style="color:#d4a090">
      <a .svc-tile href="/services/lip-enhancement">
        <div .svc-tile__img>
          <img alt="Lip enhancement treatment" src="./assets/svc-lips.jpg">
        <h3 .svc-tile__title "Lip Enhancement">
        <p .svc-tile__desc "Quick Lips from — full syringes from">
          <span "$275" style="color:#d4a090">
          … and 1 more sibling with the same tag and classes as the above (their text/href/src differ and come from the data module)
      <a .svc-tile href="/services/dermal-fillers">
        <div .svc-tile__img>
          <img alt="Dermal filler treatment" src="./assets/svc-fillers.jpg">
        <h3 .svc-tile__title "Dermal Fillers">
        <p .svc-tile__desc "Cheeks, jawline, chin & smile lines">
      <a .svc-tile href="/services/facials">
        <div .svc-tile__img>
          <img alt="Facial treatment" src="./assets/svc-facials.jpg">
        <h3 .svc-tile__title "Facials & Skin">
        <p .svc-tile__desc "HydraFacial, microneedling & more">
      <a .svc-tile href="/services/regenerative">
        <div .svc-tile__img>
          <img alt="Regenerative treatment" src="./assets/svc-regenerative.jpg">
        <h3 .svc-tile__title "Regenerative">
        <p .svc-tile__desc "PRP, Sculptra, Kybella & threads">
      <a .svc-tile href="/services/specialty">
        <div .svc-tile__img>
          <img alt="Specialty injectable treatment" src="./assets/svc-specialty.jpg">
        <h3 .svc-tile__title "Specialty">
        <p .svc-tile__desc "Under-eye filler, rhinoplasty & more">
      <a .svc-tile href="/services/laser">
        <div .svc-tile__img>
          <img alt="Laser skin treatment" src="./assets/svc-laser.jpg">
        <h3 .svc-tile__title "Laser">
        <p .svc-tile__desc "Resurfacing, tattoo removal & tightening">
      <a .svc-tile href="/services/body-contouring">
        <div .svc-tile__img>
          <img alt="Body contouring treatment" src="./assets/svc-body.jpg">
        <h3 .svc-tile__title "Body Contouring">
        <p .svc-tile__desc "Sculpting, cellulite & skin tightening">
    <div .pricing-disclosure>
      <p "Prices shown are our cash/debit prices. Credit card payments include a 3% surcharge that does not ex…">
    <div .text-center.fade-in style="margin-top:var(--space-8);">
      <a .btn.btn--arrow "View All Services" href="/services/neurotoxins">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `servicesSection`

**.section--tight** — 1440×1441px, 1 child element(s)

> `What We Offer Our Services Neurotoxins Botox, Dysport & Xeomin — starting at $5/unit Lip Enhancement`

- `display`: `block`
- `width`: `1440px`
- `height`: `1440.86px`
- `padding`: `57.6px 0px`
- `paddingTop`: `57.6px`
- `paddingBottom`: `57.6px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `div.container`

### `servicesRow`

**.services-row.fade-in** — 1256×1009px, 8 child element(s)

> `Neurotoxins Botox, Dysport & Xeomin — starting at $5/unit Lip Enhancement Quick Lips from $275 — ful`

- `display`: `grid`
- `width`: `1256px`
- `height`: `1008.66px`
- `gap`: `24px`
- `rowGap`: `24px`
- `columnGap`: `24px`
- `gridTemplateColumns`: `296px 296px 296px 296px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- `animationName`: `revealFade`
- children: `a.svc-tile`, `a.svc-tile`, `a.svc-tile`, `a.svc-tile`, `a.svc-tile`, `a.svc-tile`, `a.svc-tile`, `a.svc-tile`

### `svcTile`

**.svc-tile** — 296×494px, 3 child element(s)

> `Neurotoxins Botox, Dysport & Xeomin — starting at $5/unit`

- `display`: `flex`
- `width`: `296px`
- `height`: `493.828px`
- `flexDirection`: `column`
- `alignItems`: `center`
- `gap`: `16px`
- `rowGap`: `16px`
- `columnGap`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`
- children: `div.svc-tile__img`, `h3.svc-tile__title`, `p.svc-tile__desc`

### `svcTileImg`

**.svc-tile__img** — 296×395px, 1 child element(s)

- `display`: `block`
- `width`: `296px`
- `height`: `394.656px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `borderRadius`: `8px`
- `overflow`: `hidden`
- `transition`: `all`
- children: `img.`

### `svcTileImgEl`

**img** — 296×395px, 0 child element(s)

- `display`: `block`
- `width`: `296px`
- `height`: `394.656px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `clip`
- `filter`: `sepia(0.06) saturate(1.05) brightness(0.98) contrast(1.02)`
- `transition`: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`

### `svcTileTitle`

**.svc-tile__title** — 98×22px, 0 child element(s)

> `Neurotoxins`

- `display`: `block`
- `width`: `97.6406px`
- `height`: `22.1719px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `20.16px`
- `fontWeight`: `400`
- `lineHeight`: `22.176px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `svcTileDesc`

**.svc-tile__desc** — 296×45px, 1 child element(s)

> `Botox, Dysport & Xeomin — starting at $5/unit`

- `display`: `block`
- `width`: `296px`
- `height`: `45px`
- `minHeight`: `42px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `15px`
- `fontWeight`: `300`
- `lineHeight`: `22.5px`
- `textAlign`: `center`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `all`
- children: `span.`

### `pricingDisclosure`

**.pricing-disclosure** — 720×82px, 1 child element(s)

> `Prices shown are our cash/debit prices. Credit card payments include a 3% surcharge that does not ex`

- `display`: `block`
- `width`: `720px`
- `height`: `81.5px`
- `padding`: `16px 20px`
- `paddingTop`: `16px`
- `paddingRight`: `20px`
- `paddingBottom`: `16px`
- `paddingLeft`: `20px`
- `margin`: `24px 268px 0px`
- `marginTop`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `left`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgba(212, 160, 144, 0.12)`
- `borderRadius`: `4px`
- `transition`: `all`
- children: `p.`

## States & Behaviors
### Entrance reveal — CSS only
`fade-in` elements animate via **native CSS scroll-driven animation already in the ported
sheet**: `opacity: 0` + `animation: revealFade linear both`, `animation-timeline: view()`,
`animation-range: entry 0% entry 80%`, ending at `opacity: 1`. **Add the class and stop.**
No IntersectionObserver, no framer-motion, no opacity state. Where `animation-timeline` is
unsupported the sheet keeps `opacity: 1`, so content stays visible without JS.

### Grid
- `.services-row` is a CSS grid. Columns measured: **4** at 1440 (296px each), **2** at 768
  (341.28px), **2** at 390 (171px). The sheet owns the breakpoint — do not add Tailwind grid
  classes. Render all **8** tiles in source order:
  `services.tiles` is already in order (Neurotoxins, Lip Enhancement, Dermal Fillers,
  Facials & Skin, Regenerative, Specialty, Laser, Body Contouring).

### Service tile anatomy
- `<a class="svc-tile" href={tile.href}>` wrapping `<div class="svc-tile__img">` +
  `<h3 class="svc-tile__title">` + `<p class="svc-tile__desc">`.
- `.svc-tile__img` = `width: 100%; aspect-ratio: 3/4; border-radius: 8px; overflow: hidden`
  and its inner `img` is `width:100%; height:100%; object-fit:cover`. So the **wrapper is the
  aspect box**: add `relative` to it and use `<Image fill className="object-cover">`, or pass the
  data's `width`/`height`. Either is fine — the sheet's `aspect-ratio` governs the box.
  The source images are a mix of portrait (1080×1610) and landscape (2752×1536) originals,
  all cropped to 3:4 by `object-fit: cover`. Reproduce the crop.
- Note the source images have **different intrinsic ratios on purpose**; do not normalise them.

### Price highlighting (easy to miss — two tiles only)
The source wraps prices in a rose-gold span **inside** `.svc-tile__desc`:
- `<p class="svc-tile__desc">` for **Neurotoxins**:
  `Botox, Dysport & Xeomin — starting at <span style="color:#d4a090">$5/unit</span>`
- for **Lip Enhancement**:
  `Quick Lips from <span style="color:#d4a090">$275</span> — full syringes from <span style="color:#d4a090">$550</span>`

Do **not** hand-write that markup into the string. Each `ServiceTile` carries an optional
`highlights: string[]` listing the substrings to emphasise (`["$5/unit"]` and
`["$275", "$550"]`; the other six tiles have none). Split `tile.description` on those
substrings and wrap each match in `<span style={{ color: "#d4a090" }}>`. Keep the em dash and
spacing exactly as-is.

### Pricing disclosure
- `.pricing-disclosure` sits **between** the grid and the CTA, as its own block. Full text is
  in `services.pricingDisclosure` — reproduce it verbatim, including the "3% surcharge" wording.
- It is `font-size: 17px; line-height: 27.2px; width: 720px` at 1440 and wraps to ~111px tall
  at 390. Do not shorten it.

### CTA
- `<div class="text-center fade-in">` containing `<a class="btn btn--arrow">` "View All Services".
  `.btn--arrow`'s arrow glyph is a `::after` in the sheet and renders itself.

### Hover
- The whole tile is a link; hover states are CSS-only in the sheet (image scale / title colour
  over 180–800ms). Add no JS, no transition utilities.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `servicesRow` | 17px · lh 27.2px · cols 296px 296px 296px 296px · w 1256 | 15.936px · lh 25.4976px · cols 341.281px 341.281px · w 707 | 15.18px · lh 24.288px · cols 171px 171px · w 358 |
| `svcTileTitle` | 20.16px · lh 22.176px · w 98 | 17.6px · lh 19.36px · w 85 | 15.18px · lh 16.698px · w 74 |
| `svcTileDesc` | 15px · lh 22.5px · w 296 | 14.304px · lh 21.456px · w 288 | 11.18px · lh 16.77px · w 171 |
| `pricingDisclosure` | 17px · lh 27.2px · w 720 | 15.936px · lh 25.4976px · w 707 | 15.18px · lh 24.288px · w 358 |
| `btnArrow` | 15px · lh 24px · ls 1.8px · w 265 | 14.304px · lh 22.8864px · ls 1.71648px · w 256 | 13.17px · lh 21.072px · ls 1.5804px · w 242 |
| `headingSection` | 55.2px · lh 60.72px · w 604 | 38.4px · lh 42.24px · w 707 | 32px · lh 35.2px · w 358 |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type
scale. Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`
(matches the source) and internal hrefs as plain `<a>`. Do **not** use `next/link` — the target
is a static site with plain anchors and the ported CSS styles bare `a`.