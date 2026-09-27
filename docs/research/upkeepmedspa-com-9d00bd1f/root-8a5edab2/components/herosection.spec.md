# HeroSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/HeroSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-01-hero.png`
- **Interaction model:** static (one entrance reveal). No clicks, no scroll-driven state, no timer.
- **Export:** named export `HeroSection`, no props (reads `hero` from `@/lib/upkeepmedspa-data`).

## Styling contract (important)

The target's own stylesheet is already ported to
`src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css` and imported **unlayered** by
`src/app/globals.css`, so it beats Tailwind preflight and wins the cascade.

**Use the ported class names verbatim and write no new CSS.** Do not add Tailwind
color/spacing/font utilities — the type scale and palette live in the ported sheet.
`className` may combine the ported classes with `cn()` from `@/lib/utils`.

## DOM Structure

```
<section class="hero">
  <div class="hero__bg">
    <Image fill … />            // next/image
  </div>
  <div class="hero__overlay" />
  <div class="hero__content fade-in text-center">
    <p class="eyebrow text-center">…</p>
    <h1 class="heading-hero text-center">…</h1>
    <div class="hero__ctas">
      <a class="btn">Explore Our Services</a>
      <a class="btn">Schedule Your Visit</a>
    </div>
    <div class="hero__ctas--specials">
      <a class="btn btn--pink">Explore Current Specials</a>
    </div>
  </div>
  <div class="hero__scroll-hint">
    <ScrollArrowIcon width={16} height={24} />
    <span>Scroll</span>
  </div>
</section>
```

Exact element order inside `.hero__content` is: eyebrow → h1 → `.hero__ctas` → `.hero__ctas--specials`.
The `<h1>` contains a literal `<br />` between its two lines: `Not Your Mother's` / `Med Spa`
(from `hero.titleLines[0]` and `hero.titleLines[1]`).

`.hero__bg`, `.hero__overlay` and `.hero__scroll-hint` are all absolutely positioned by the
ported CSS — render them as direct children, in that order, after/before as shown.

## Computed Styles (measured at 1440×900, getComputedStyle)

### `.hero`
- height: **900px** (= 100vh), width 1440, `display: flex`, `position: relative`, overflow hidden

### `.hero__bg img`
- `object-fit: cover`, `position: absolute`, inset 0
- source image natural size 1193×1080
- **Edit filter** (global rule, already ported): `filter: sepia(0.08) saturate(1.08) brightness(0.96) contrast(1.03)`

### `.hero__overlay`
- `background-image: linear-gradient(rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.5) 80%, rgba(10,10,10,0.85) 100%)`

### `.hero__content`
- `position: relative`, `text-align: center`, width 765px (fills container)
- top offset within hero ≈ 108px

### `.eyebrow` (hero variant)
- font-family: Switzer; `font-size: 13px`; `font-weight: 500`; `line-height: 20.8px`
- `letter-spacing: 3.25px`; `text-transform: uppercase`; `text-align: center`
- `color: rgb(255,255,255)` and `text-shadow: rgba(0,0,0,0.6) 0 1px 8px`  ← hero-specific
- `margin-bottom: 16px`
- text: `Making Aesthetics Accessible`

### `.heading-hero` (the `<h1>`)
- font-family: **Cormorant Garamond**; `font-size: 108.8px`; `font-weight: 300`
- `line-height: 108.8px`; `letter-spacing: -1.088px`; `color: #f5f0eb`; `text-align: center`
- 2 lines → height 217.6px

### `.hero__ctas .btn` (×2)
- `display: flex`, `align-items/justify-content: center`, `gap: 8px`
- `padding: 12px 32px`; `min-height: 48px`; height 50px
- `font-family: Switzer`; `font-size: 15px`; `font-weight: 400`; `line-height: 24px`
- `letter-spacing: 1.8px`; `text-transform: uppercase`
- `color: #f5f0eb`; `border: 1px solid #f5f0eb`; transparent background
- widths: 271.9px ("Explore Our Services") and 271.9px ("Schedule Your Visit")
- transition: `color, background, border-color, box-shadow, opacity, transform` 180ms `cubic-bezier(0.16,1,0.3,1)`

### `.hero__ctas--specials .btn--pink`
- `background-color: #d4a090`; `color: #1a1410`; `border: 1px solid #d4a090`
- `font-weight: 500`; `letter-spacing: 2.7px`; `padding: 12px 40px`; `min-height: 52px`; height 52px
- width 354.25px
- transition: `background 0.2s, border-color 0.2s, color 0.2s` (linear/ease — **not** the brand curve)

### `.hero__scroll-hint`
- `position: absolute`, bottom area, `display: flex`, column layout, centered
- label `Scroll` in Switzer, ~11–13px, uppercase, `letter-spacing` ~2px, muted
- icon 16×24, `stroke: currentColor`, `stroke-width: 1`

## States & Behaviors

### Entrance reveal
- **Trigger:** page load / element entering the viewport
- **Mechanism:** native CSS scroll-driven animation — `class="fade-in"` sets `opacity: 0` and
  `animation: revealFade linear both` with `animation-timeline: view()` and
  `animation-range: entry 0% entry 80%`, ending at `opacity: 1`.
- **No JS is required or wanted here.** The ported CSS already implements this. Just add the
  `fade-in` class; do not add IntersectionObserver, framer-motion, or opacity state.
- Progressive enhancement: where `animation-timeline` is unsupported the ported sheet keeps
  the element at `opacity: 1`, so it is visible without JS. Do not fight that.

### Hover states (CSS-only, already ported — do not add JS)
- `.btn` (the two hero CTAs): inverts to a filled state on hover (background/border/colour change over 180ms)
- `.btn--pink`: background/border/colour transition over 200ms

## Assets
- Background: `hero.background.src` → `/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/images/hero-home.jpg`
  (natural 1193×1080, already downloaded)
- Icon: `ScrollArrowIcon` from `@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons`
- No layered overlay images — the darkening is the CSS gradient `.hero__overlay` only

## Text Content (verbatim)

- eyebrow: `Making Aesthetics Accessible`
- h1 line 1: `Not Your Mother's`
- h1 line 2: `Med Spa`
- CTA 1: `Explore Our Services` → `#services`  (same-page anchor to the services section)
- CTA 2: `Schedule Your Visit` → `https://www.joinblvd.com/b/upkeep-medspa/widget#/locations`
- CTA 3: `Explore Current Specials` → `/specials`
- scroll hint label: `Scroll`

## `next/image` requirements
- Hero background is the LCP element: use `fill` (parent `.hero__bg` is positioned by the
  ported CSS) and `loading="eager"` with `fetchPriority="high"`.
  **Do not use `preload` and do not use `priority`** — `priority` is deprecated in Next 16.
- Provide a `sizes` string; the image spans the full viewport width.
- `alt` = the real alt text from `hero.background.alt`.

## Responsive Behavior
- **Desktop (1440):** h1 108.8px, both CTAs side by side, specials button 354px centred below.
- **Tablet (768):** h1 **61.76px**; CTAs remain a row.
- **Mobile (390):** h1 **48px**; the two outline CTAs stack full-width; the pink specials
  button goes full-width. Vertical padding tightens.
- **Breakpoint:** the fluid `--text-hero` clamp drives the h1 (48px → 112px); the CTA stacking
  switches around **~600px** (port the site's own media query behaviour — do not hardcode a
  Tailwind breakpoint; the sheet already handles it).
