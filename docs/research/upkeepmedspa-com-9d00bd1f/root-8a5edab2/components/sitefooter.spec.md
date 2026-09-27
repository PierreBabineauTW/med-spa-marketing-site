# SiteFooter Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SiteFooter.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-09-footer.png`
- **Interaction model:** static — no JavaScript at all
- **Export:** named `SiteFooter`, no props — read content from `@/lib/upkeepmedspa-data`.
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
<footer .footer role="contentinfo">
  <div .container>
    <div .footer__grid>
      <div>
        <a .footer__brand-logo href="/">
          <img .footer__logo-img alt="UPKEEP" src="./assets/logo.png">
        <p .footer__tagline "Not your mother's med spa. Making aesthetics accessible since 2019.">
        <div .footer__socials>
          <a .footer__social-link aria-label="Instagram" href="https://www.instagram.com/upkeepmedspa">
            <svg .[object.SVGAnimatedString]>
              <rect .[object.SVGAnimatedString]>
              <circle .[object.SVGAnimatedString]>
              <circle .[object.SVGAnimatedString]>
          <a .footer__social-link aria-label="TikTok" href="https://www.tiktok.com/@upkeepmedspa">
            <svg .[object.SVGAnimatedString]>
              <path .[object.SVGAnimatedString]>
          <a .footer__social-link aria-label="Facebook" href="https://www.facebook.com/Upkeepmedspa/">
            <svg .[object.SVGAnimatedString]>
              <path .[object.SVGAnimatedString]>
      <div>
        <p .footer__heading "Navigate">
        <a .footer__link "Home" href="/">
        <a .footer__link "Services" href="/services/neurotoxins">
        <a .footer__link "Gallery" href="/gallery">
        <a .footer__link "Current Specials" href="/specials">
        <a .footer__link "Upcoming Events" href="/events">
        <a .footer__link "Financing" href="/financing">
        <a .footer__link "About Us" href="/about">
        <a .footer__link "Blog" href="/blog">
        <a .footer__link "Contact" href="/contact">
      <div>
        <p .footer__heading "Services">
        <a .footer__link "Neurotoxins" href="/services/neurotoxins">
        <a .footer__link "Lip Enhancement" href="/services/lip-enhancement">
        <a .footer__link "Dermal Fillers" href="/services/dermal-fillers">
        <a .footer__link "Facials & Skin" href="/services/facials">
        <a .footer__link "Regenerative" href="/services/regenerative">
        <a .footer__link "Specialty Injections" href="/services/specialty">
        <a .footer__link "Laser Treatments" href="/services/laser">
        <a .footer__link "Body Contouring" href="/services/body-contouring">
      <div>
        <p .footer__heading "Contact">
        <a .footer__link "(833) 875-3377" href="tel:+18338753377">
        <a .footer__link "info@upkeepmedspa.com" href="mailto:info@upkeepmedspa.com">
        <p .footer__link "7 locations across NYC & Dallas" style="margin-top:var(--space-3);color:var(--color-text-faint);">
        <a .btn.btn--small.btn--accent "Book Now" href="https://www.joinblvd.com/b/upkeep-medspa/widget#/locations" style="margin-top:var(--space-4);">
    <div .footer__bottom>
      <p "© 2026 Upkeep Med Spa. All rights reserved. Women-owned & operated.">
      <div .footer__legal-links>
        <a "Privacy Policy" href="/privacy-policy">
        <a "Cancellation Policy" href="/cancellation-policy">
        <a "Safety & Prescribing" href="/safety-prescribing">
        <a "Accessibility" href="/accessibility">
    <div .footer__a11y-notice>
      <p "If you are visually impaired or have any other impairment and you wish to discuss potential accommod…">
        <strong "Accessibility:">
        <a "(833) 875-3377" href="tel:+18338753377">
        <a "info@upkeepmedspa.com" href="mailto:info@upkeepmedspa.com">
        <a "Accessibility Statement" href="/accessibility">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `footer`

**.footer** — 1440×598px, 1 child element(s)

> `Not your mother's med spa. Making aesthetics accessible since 2019. Navigate Home Services Gallery C`

- `display`: `block`
- `width`: `1440px`
- `height`: `598.188px`
- `padding`: `64px 0px 32px`
- `paddingTop`: `64px`
- `paddingBottom`: `32px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgb(10, 10, 10)`
- `transition`: `all`

### `footerGrid`

**.footer__grid** — 1256×329px, 4 child element(s)

> `Not your mother's med spa. Making aesthetics accessible since 2019. Navigate Home Services Gallery C`

- `display`: `grid`
- `width`: `1256px`
- `height`: `328.797px`
- `margin`: `0px 0px 48px`
- `marginBottom`: `48px`
- `gap`: `40px`
- `rowGap`: `40px`
- `columnGap`: `40px`
- `gridTemplateColumns`: `454.391px 227.203px 227.203px 227.188px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `footerBrandLogo`

**.footer__brand-logo** — 155×28px, 1 child element(s)

- `display`: `inline-block`
- `width`: `154.906px`
- `height`: `28px`
- `margin`: `0px 0px 16px`
- `marginBottom`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `footerLogoImg`

**.footer__logo-img** — 155×28px, 0 child element(s)

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

### `footerTagline`

**.footer__tagline** — 223×54px, 0 child element(s)

> `Not your mother's med spa. Making aesthetics accessible since 2019.`

- `display`: `block`
- `width`: `223.375px`
- `height`: `54.375px`
- `margin`: `0px 0px 24px`
- `marginBottom`: `24px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `fontStyle`: `italic`
- `lineHeight`: `27.2px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `all`

### `footerSocials`

**.footer__socials** — 454×44px, 3 child element(s)

- `display`: `flex`
- `width`: `454.391px`
- `height`: `44px`
- `gap`: `16px`
- `rowGap`: `16px`
- `columnGap`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `footerSocialLink`

**.footer__social-link** — 44×44px, 1 child element(s)

- `display`: `flex`
- `width`: `44px`
- `height`: `44px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `footerHeading`

**.footer__heading** — 227×21px, 0 child element(s)

> `Navigate`

- `display`: `block`
- `width`: `227.203px`
- `height`: `20.7969px`
- `margin`: `0px 0px 20px`
- `marginBottom`: `20px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `500`
- `lineHeight`: `20.8px`
- `letterSpacing`: `2.6px`
- `textTransform`: `uppercase`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `footerLink`

**.footer__link** — 227×32px, 0 child element(s)

> `Home`

- `display`: `block`
- `width`: `227.203px`
- `height`: `32px`
- `padding`: `4px 0px`
- `paddingTop`: `4px`
- `paddingBottom`: `4px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `15px`
- `fontWeight`: `300`
- `lineHeight`: `24px`
- `color`: `rgba(245, 240, 235, 0.78)`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

### `footerBottom`

**.footer__bottom** — 1256×46px, 2 child element(s)

> `© 2026 Upkeep Med Spa. All rights reserved. Women-owned & operated. Privacy Policy Cancellation Poli`

- `display`: `flex`
- `width`: `1256px`
- `height`: `45.7969px`
- `padding`: `24px 0px 0px`
- `paddingTop`: `24px`
- `flexWrap`: `wrap`
- `justifyContent`: `space-between`
- `alignItems`: `center`
- `gap`: `16px`
- `rowGap`: `16px`
- `columnGap`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `color`: `rgba(245, 240, 235, 0.6)`
- `transition`: `all`

### `footerLegalLinks`

**.footer__legal-links** — 457×21px, 4 child element(s)

> `Privacy Policy Cancellation Policy Safety & Prescribing Accessibility`

- `display`: `flex`
- `width`: `457.188px`
- `height`: `20.7969px`
- `gap`: `24px`
- `rowGap`: `24px`
- `columnGap`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `color`: `rgba(245, 240, 235, 0.6)`
- `transition`: `all`

### `a11yNotice`

**.footer__a11y-notice** — 1256×79px, 1 child element(s)

> `Accessibility: If you are visually impaired or have any other impairment and you wish to discuss pot`

- `display`: `block`
- `width`: `1256px`
- `height`: `78.5938px`
- `padding`: `18px 0px`
- `paddingTop`: `18px`
- `paddingBottom`: `18px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `400`
- `lineHeight`: `20.8px`
- `color`: `rgba(245, 240, 235, 0.72)`
- `transition`: `all`

## States & Behaviors
### Transcribe the captured markup, not a plausible reconstruction
`docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sections/09-footer.html` is the source of
truth. Four details that a "sensible" rewrite gets wrong:
1. The four `.footer__grid` cells are **unclassed `<div>`s** — there is no `.footer__brand` or
   `.footer__col` class in the sheet, so adding one would be dead weight.
2. The column headings are **`<p class="footer__heading">`**, not `<h3>`. The sheet styles the
   class, not the tag. The third column's heading literal is **`Contact`**.
3. The logo is wrapped in **`<a class="footer__brand-logo" href="/">`** — that class carries
   `display: inline-block; margin-bottom: var(--space-4)` and is load-bearing for the 598px
   footer height.
4. The phone and email are **bare `<a class="footer__link">` siblings**, not `<p>` wrappers
   containing anchors. The phone text keeps its non-breaking space so the number cannot wrap
   mid-number.

### Icons
Pick from `footer.socials[i].icon` (`"instagram" | "tiktok" | "facebook"`) and render at
**18×18**. All three source SVGs use `fill="none" stroke="currentColor"` or `fill="currentColor"`,
so colour comes from CSS. Do not substitute a generic icon for any of the three.

### The accessibility notice
`footer.accessibilityNotice` is stored as one flat string, but the source links the phone, the
email and "Accessibility Statement" **inside** it. Split the string on those three fragments and
re-attach the anchors from `footer.contact.phoneHref` / `emailHref` (the statement link is
`/accessibility`), so the rendered paragraph is byte-identical to the source. Reproduce the
source's inline styles on the notice and its link.

### Preserved inline styles
- `margin-top: var(--space-3)` + `color: var(--color-text-faint)` on the "7 locations across NYC &
  Dallas" line.
- `margin-top: var(--space-4)` on the Book Now button.

### No JavaScript
Server component. No `"use client"`, no state, no handlers. Hover on `.footer__link`,
`.footer__social-link` and `.btn--accent` is CSS-only in the sheet.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `footerGrid` | 17px · cols 454.391px 227.203px 227.203px 227.188px · w 1256 · h 329 | 15.936px · cols 337.281px 337.281px · w 707 · h 635 | 15.18px · cols 358px · w 358 · h 1027 |
| `footerTagline` | 17px · w 223 · h 54 | 15.936px · w 209 · h 51 | 15.18px · w 199 · h 49 |
| `footerHeading` | 13px · w 227 · h 21 | 11.936px · w 337 · h 19 | 11.18px · w 358 · h 18 |
| `footerLink` | 15px · w 227 · h 32 | 14.304px · w 337 · h 31 | 13.17px · w 358 · h 29 |
| `btnSmall` | 13px · w 219 · h 40 | 11.936px · w 206 · h 40 | 11.18px · w 197 · h 40 |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Measured height
The footer is **598px** tall at 1440 and the `.footer__grid` is 328px — both matched exactly by the
clone. Reproducing `.footer__brand-logo` is what keeps it at 598 rather than growing.