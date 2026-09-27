# SiteNav Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SiteNav.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/state-nav-scrolled-1440.png`
- **Interaction model:** **scroll-driven** (a `nav--scrolled` class past a 60px threshold) for the bar itself; the two dropdowns are **hover-driven in pure CSS**; the hamburger is **click-driven**
- **Export:** named `SiteNav`, no props — read content from `@/lib/upkeepmedspa-data`.
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
<nav .nav aria-label="Main navigation" role="navigation">
  <div .nav__inner>
    <a .nav__logo aria-label="UPKEEP Med Spa home" href="/">
      <img .nav__logo-img alt="UPKEEP" src="./assets/logo.png">
    <ul .nav__links role="list">
      <li>
        <a .nav__link.nav__link--active "Home" href="/">
      <li .nav__dropdown>
        <a .nav__link.nav__dropdown-trigger "Services" href="/services/neurotoxins">
          <svg .[object.SVGAnimatedString]>
            <path .[object.SVGAnimatedString]>
        <div .nav__dropdown-menu role="menu">
          <a .nav__dropdown-item "Neurotoxins" href="/services/neurotoxins" role="menuitem">
          <a .nav__dropdown-item "Lip Enhancement" href="/services/lip-enhancement" role="menuitem">
          <a .nav__dropdown-item "Dermal Fillers" href="/services/dermal-fillers" role="menuitem">
          <a .nav__dropdown-item "Regenerative" href="/services/regenerative" role="menuitem">
          <a .nav__dropdown-item "Specialty" href="/services/specialty" role="menuitem">
          <a .nav__dropdown-item "Facials & Skin" href="/services/facials" role="menuitem">
          <a .nav__dropdown-item "Laser" href="/services/laser" role="menuitem">
          <a .nav__dropdown-item "Body Contouring" href="/services/body-contouring" role="menuitem">
      <li>
        <a .nav__link "Gallery" href="/gallery">
      <li>
        <a .nav__link "About" href="/about">
      <li>
        <a .nav__link "Blog" href="/blog">
      <li .nav__dropdown>
        <a .nav__link.nav__dropdown-trigger "Locations" href="/locations">
          <svg .[object.SVGAnimatedString]>
            <path .[object.SVGAnimatedString]>
        <div .nav__dropdown-menu role="menu">
          <a .nav__dropdown-item "Upper East Side" href="/locations#ues" role="menuitem">
          <a .nav__dropdown-item "Greenwich Village" href="/locations#gv" role="menuitem">
          <a .nav__dropdown-item "Brooklyn" href="/locations#bk" role="menuitem">
          <a .nav__dropdown-item "Chelsea" href="/locations#ch" role="menuitem">
          <a .nav__dropdown-item "Long Island" href="/locations#li" role="menuitem">
          <a .nav__dropdown-item "Dallas" href="/locations#dal" role="menuitem">
          <a .nav__dropdown-item "Addison" href="/locations#add" role="menuitem">
      <li>
        <a .nav__link "Contact" href="/contact">
    <div .nav__cta-group>
      <a .nav__events "Upcoming Events" aria-label="Upcoming Events" href="/events">
      <a .nav__book.nav__book--desktop "Book Now" href="https://www.joinblvd.com/b/upkeep-medspa/widget#/locations">
    <button .nav__hamburger aria-label="Open menu">
      <svg .[object.SVGAnimatedString]>
        <path .[object.SVGAnimatedString]>
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `nav`

**.nav** — 1440×77px, 1 child element(s)

> `Home Services Neurotoxins Lip Enhancement Dermal Fillers Regenerative Specialty Facials & Skin Laser`

- `display`: `block`
- `position`: `fixed`
- `bottom`: `823px`
- `zIndex`: `100`
- `width`: `1440px`
- `height`: `77px`
- `padding`: `16px 0px`
- `paddingTop`: `16px`
- `paddingBottom`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgba(10, 10, 10, 0.85)`
- `transition`: `background 0.35s cubic-bezier(0.16, 1, 0.3, 1), padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)`

### `navInner`

**.nav__inner** — 1320×44px, 4 child element(s)

> `Home Services Neurotoxins Lip Enhancement Dermal Fillers Regenerative Specialty Facials & Skin Laser`

- `display`: `flex`
- `width`: `1320px`
- `height`: `44px`
- `padding`: `0px 32px`
- `margin`: `0px 60px`
- `justifyContent`: `space-between`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `navLogo`

**.nav__logo** — 155×28px, 1 child element(s)

- `display`: `flex`
- `width`: `154.906px`
- `height`: `28px`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navLogoImg`

**.nav__logo-img** — 155×28px, 0 child element(s)

- `display`: `block`
- `width`: `154.906px`
- `height`: `28px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `clip`
- `transition`: `all`

### `navLinks`

**.nav__links** — 665×29px, 7 child element(s)

> `Home Services Neurotoxins Lip Enhancement Dermal Fillers Regenerative Specialty Facials & Skin Laser`

- `display`: `flex`
- `width`: `665.359px`
- `height`: `28.7969px`
- `alignItems`: `center`
- `gap`: `32px`
- `rowGap`: `32px`
- `columnGap`: `32px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `navLinkA`

**.nav__link.nav__link--active** — 45×24px, 0 child element(s)

> `Home`

- `display`: `inline`
- `position`: `relative`
- `padding`: `4px 0px`
- `paddingTop`: `4px`
- `paddingBottom`: `4px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `letterSpacing`: `1.95px`
- `textTransform`: `uppercase`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navLinkActive`

**.nav__link.nav__link--active** — 45×24px, 0 child element(s)

> `Home`

- `display`: `inline`
- `position`: `relative`
- `padding`: `4px 0px`
- `paddingTop`: `4px`
- `paddingBottom`: `4px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `letterSpacing`: `1.95px`
- `textTransform`: `uppercase`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navDropdownTrigger`

**.nav__link.nav__dropdown-trigger** — 89×29px, 1 child element(s)

> `Services`

- `display`: `flex`
- `position`: `relative`
- `width`: `89.1406px`
- `height`: `28.7969px`
- `padding`: `4px 0px`
- `paddingTop`: `4px`
- `paddingBottom`: `4px`
- `alignItems`: `center`
- `gap`: `4px`
- `rowGap`: `4px`
- `columnGap`: `4px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `letterSpacing`: `1.95px`
- `textTransform`: `uppercase`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navDropdownMenu`

**.nav__dropdown-menu** — 220×346px, 8 child element(s)

> `Neurotoxins Lip Enhancement Dermal Fillers Regenerative Specialty Facials & Skin Laser Body Contouri`

- `display`: `block`
- `position`: `absolute`
- `top`: `28.7969px`
- `right`: `-175.422px`
- `bottom`: `-354px`
- `left`: `44.5625px`
- `width`: `220px`
- `height`: `346px`
- `padding`: `12px 0px`
- `paddingTop`: `12px`
- `paddingBottom`: `12px`
- `margin`: `8px 0px 0px`
- `marginTop`: `8px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgba(17, 17, 17, 0.97)`
- `transition`: `opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navDropdownItem`

**.nav__dropdown-item** — 218×40px, 0 child element(s)

> `Neurotoxins`

- `display`: `block`
- `width`: `218px`
- `height`: `40px`
- `padding`: `8px 20px`
- `paddingTop`: `8px`
- `paddingBottom`: `8px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `15px`
- `fontWeight`: `300`
- `lineHeight`: `24px`
- `letterSpacing`: `0.75px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navCtaGroup`

**.nav__cta-group** — 329×44px, 2 child element(s)

> `Upcoming EventsBook Now`

- `display`: `flex`
- `width`: `329.406px`
- `height`: `44px`
- `alignItems`: `center`
- `gap`: `12px`
- `rowGap`: `12px`
- `columnGap`: `12px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `navEvents`

**.nav__events** — 185×44px, 0 child element(s)

> `Upcoming Events`

- `display`: `flex`
- `width`: `184.734px`
- `height`: `44px`
- `minHeight`: `44px`
- `padding`: `8px 20px`
- `paddingTop`: `8px`
- `paddingBottom`: `8px`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `letterSpacing`: `1.56px`
- `textTransform`: `uppercase`
- `color`: `rgb(245, 240, 235)`
- `transition`: `border-color 0.2s, color 0.2s, background 0.2s`

### `navBookDesktop`

**.nav__book.nav__book--desktop** — 133×44px, 0 child element(s)

> `Book Now`

- `display`: `flex`
- `width`: `132.672px`
- `height`: `44px`
- `minHeight`: `44px`
- `padding`: `8px 24px`
- `paddingTop`: `8px`
- `paddingBottom`: `8px`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `letterSpacing`: `1.56px`
- `textTransform`: `uppercase`
- `color`: `rgb(212, 160, 144)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `navHamburger`

**.nav__hamburger** — 0×0px, 1 child element(s)

- `width`: `44px`
- `height`: `44px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

## States & Behaviors
### Scroll state — JS REQUIRED (the only scroll behaviour)
The target's inline script:
```js
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { nav.classList.add('nav--scrolled'); }
  else { nav.classList.remove('nav--scrolled'); }
}, { passive: true });
```
Reproduce exactly: threshold is **strictly greater than 60**, and the class is **removed** on the
way back up. Register with `{ passive: true }`. Apply via `cn("nav", scrolled && "nav--scrolled")`.

### Dropdowns — CSS ONLY, zero JavaScript
The sheet does it with `:hover`:
- `.nav__dropdown:hover .nav__dropdown-menu { opacity: 1; visibility: visible }` (closed state is
  `opacity: 0; visibility: hidden` plus a transition)
- `.nav__dropdown:hover .nav__dropdown-trigger svg { transform: rotate(180deg) }`
**Do not add click handlers, state, `onMouseEnter`/`onMouseLeave` or `aria-expanded` to the
dropdowns** — the target has none, and adding JS would break parity.

### Mobile menu — JS REQUIRED
The hamburger (`aria-label="Open menu"`, shown only at the sheet's small-screen breakpoint)
toggles `MobileMenu`'s `open` prop. `MobileMenu` owns its own Escape handling and link-click
closing; you just pass `open` and `onClose`. Render `<MobileMenu>` as a sibling **after**
`</nav>` (inside a fragment) so `.nav__inner`'s children still match the captured DOM.

### Hover — CSS only
Nav links, dropdown items and CTA buttons have hover states in the sheet (180ms brand curve). Add
no JS and no transition utilities.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `navLinks` | 17px · w 665 · h 29 | 15.936px | 15.18px |
| `navCtaGroup` | 17px · w 329 · h 44 | 15.936px | 15.18px |
| `navBookDesktop` | 13px · w 133 · h 44 | 11.936px | 11.18px |
| `navEvents` | 13px · w 185 · h 44 | 11.936px | 11.18px |
| `hamburger` | n/a | n/a | n/a |
| `navLinkA` | 13px · w 45 · h 24 | 11.936px | 11.18px |
| `navEvents` | 13px · w 185 · h 44 | 11.936px | 11.18px |
| `navBookDesktop` | 13px · w 133 · h 44 | 11.936px | 11.18px |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Accessibility notes (preserve them)
- `role="navigation"` + `aria-label="Main navigation"` on `<nav>`; `role="list"` on the `<ul>`.
- `role="menu"` on each `.nav__dropdown-menu`; `role="menuitem"` on each `.nav__dropdown-item`.
- `aria-label="UPKEEP Med Spa home"` on the logo link, `aria-label="Upcoming Events"` on the
  events link, `aria-label="Open menu"` on the hamburger.
- The source's SVGs carry no `aria-hidden`; render them as-is.

## Verified behaviour
`scripts/qa-behaviour-upkeepmedspa.mjs` asserts all of the above against the running clone:
6/6 nav-scroll assertions, 4/4 dropdown assertions, and 0 console errors.