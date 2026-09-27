# MobileMenu Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/MobileMenu.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-00-nav.png`
- **Interaction model:** **click-driven** — the visibility toggle is the `mobile-menu--open` class, driven by the parent nav's hamburger
- **Export:** named `MobileMenu`, props `{ open, onClose }`.
## Styling contract (read this first)

The target's own stylesheet is already ported to
`src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css` and imported **unlayered** by
`src/app/globals.css`, so it beats Tailwind preflight and wins the cascade. That sheet also
contains the site's own **utility classes** and its full widget styling (including the
`#a11y-menu-*` rules), so the class strings below resolve with zero new CSS.

**Use the ported class names and captured IDs verbatim and write no new CSS.** Combine classes
with `cn()` from `@/lib/utils` when you need a conditional.

- Icons: `@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons`
- Content: `@/lib/upkeepmedspa-data` — every string, href and image path is the live site's.
- Types: `@/types/upkeepmedspa`
- Images: `next/image`. In Next 16 `priority` is **deprecated** — use `loading="eager"` +
  `fetchPriority="high"` above the fold, default lazy below it. Always pass `sizes` with `fill`.
- **Before you finish:** `npx.cmd tsc --noEmit` must pass (PowerShell blocks `npx.ps1`).

## DOM Structure — captured verbatim from the live page

```text
MobileMenu takes props `{ open: boolean; onClose: () => void }` — it is a controlled
component, so the hamburger that owns the state lives in SiteNav.

```
<div class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden={!open}>
  <button type="button" class="mobile-menu__close" aria-label="Close menu">
    <svg width="24" height="24">…X…</svg>          (CloseIcon)
  <a class="mobile-menu__link" href="…">Home</a>     (15 links, source order)
  …
  <a class="mobile-menu__link" href="/contact">Contact</a>
  <a class="btn btn--accent" href="…">Book Now</a>
</div>
```
`mobileMenu.links` in `@/lib/upkeepmedspa-data` is already in source order: Home, Neurotoxins,
Lip Enhancement, Dermal Fillers, Specialty Injections, Facials & Skin, Regenerative, Laser
Treatments, Body Contouring, Gallery, About, Blog, Locations, Upcoming Events, Contact — followed
by `mobileMenu.book` ("Book Now" → the booking URL).

The whole overlay is one absolutely-positioned flex column; the links are direct children, not
wrapped in a list.
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `mobileMenu`

**.mobile-menu** — 1440×900px, 17 child element(s)

> `Home Neurotoxins Lip Enhancement Dermal Fillers Specialty Injections Facials & Skin Regenerative Las`

- `display`: `flex`
- `position`: `fixed`
- `zIndex`: `200`
- `width`: `1440px`
- `height`: `900px`
- `flexDirection`: `column`
- `justifyContent`: `center`
- `alignItems`: `center`
- `gap`: `24px`
- `rowGap`: `24px`
- `columnGap`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgba(10, 10, 10, 0.98)`
- `transition`: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1)`

### `mobileMenuClose`

**.mobile-menu__close** — 48×48px, 1 child element(s)

- `display`: `flex`
- `position`: `absolute`
- `top`: `16px`
- `right`: `16px`
- `bottom`: `836px`
- `left`: `1376px`
- `width`: `48px`
- `height`: `48px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `mobileMenuLink`

**.mobile-menu__link** — 94×58px, 0 child element(s)

> `Home`

- `display`: `block`
- `width`: `93.6094px`
- `height`: `57.5938px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `36px`
- `fontWeight`: `300`
- `lineHeight`: `57.6px`
- `letterSpacing`: `1.8px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

## States & Behaviors
### Open/close — CSS only, class-driven
The base `.mobile-menu` is `opacity: 0; visibility: hidden` with
`transition: opacity 400ms var(--ease-out), visibility 400ms var(--ease-out)`.
`.mobile-menu--open` sets `opacity: 1; visibility: visible`. **That class is the entire
open/close mechanism** — toggle it and the ported sheet animates. Do not add opacity state,
transitions or a motion library.

### Escape to close — JS
Listen for `keydown` on `document` **only while open** and call `onClose()` on `Escape`.
Add the listener in a `useEffect` gated on `open` and return the removal as cleanup.

### Link clicks close the menu
Every `.mobile-menu__link` and the "Book Now" button call `onClose()` on click, so following a
link dismisses the overlay.

### Accessibility
- Set `aria-hidden={!open}` on the overlay.
- The close button carries `aria-label="Close menu"`.
- The overlay carries `aria-label="Mobile navigation"`.
- Because the panel is `visibility: hidden` when closed it is already out of the a11y tree and
  the tab order; do not add `inert` or focus-trap code the target does not have.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `mobileMenu` | 17px · w 1440 · h 900 | 15.936px · w 768 · h 1024 | 15.18px · w 390 · h 844 |
| `mobileMenuClose` | 17px · w 48 · h 48 | 15.936px · w 48 · h 48 | 15.18px · w 48 · h 48 |
| `mobileMenuLink` | 36px · w 94 · h 58 | 28.416px · w 74 · h 45 | 24px · w 62 · h 38 |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Verified behaviour
`scripts/qa-behaviour-upkeepmedspa.mjs`: the menu is closed initially, the hamburger opens it, the
open state is fully opaque, it contains exactly **15** `.mobile-menu__link` elements, and the close
button shuts it — all passing.

## Note on `id="mobile-menu"`
The target's `.mobile-menu` carries no `id`. One was added here so the overlay is addressable;
it has no styling attached and does not affect rendering.