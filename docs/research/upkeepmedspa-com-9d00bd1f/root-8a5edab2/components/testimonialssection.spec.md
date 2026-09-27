# TestimonialsSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/TestimonialsSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-04-testimonials.png`
- **Interaction model:** **click-driven (dots) AND time-driven (6s auto-advance)** — explicitly *not* scroll-driven
- **Export:** named `TestimonialsSection`, no props — read content from `@/lib/upkeepmedspa-data`.
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
<section .section aria-label="Client testimonials">
  <div .container.text-center>
    <p .eyebrow.fade-in "Real Clients, Real Words">
    <h2 .heading-section.mb-4.fade-in "What Our Clients Say">
    <p .fade-in "5.0 average across verified reviews" style="font-size:var(--text-sm);letter-spacing:0.1em;text-transform:uppercase;color:var(--color-text-muted)…">
      <span "★★★★★" style="color:var(--color-accent);letter-spacing:0.15em;">
    <div .fade-in style="max-width:760px;margin:0 auto;">
      <div data-testimonial="0" style="display: none;">
        <div .testimonial__stars "★★★★★" aria-label="5 out of 5 stars" style="color:var(--color-accent);letter-spacing:0.15em;">
        <blockquote .testimonial__quote "I have come to see Naz for a few years now and adore her work so much I've sent quite a handful of f…">
        <p .testimonial__name "— Jessie K. · Greenwich Village">
      <div data-testimonial="1" style="display: none;">
        <div .testimonial__stars "★★★★★" aria-label="5 out of 5 stars" style="color:var(--color-accent);letter-spacing:0.15em;">
        <blockquote .testimonial__quote "I had a wonderful visit to Upkeep clinic in Brooklyn today. Injector Collin is incredibly knowledgea…">
        <p .testimonial__name "— Henga B. · Brooklyn">
      <div data-testimonial="2" style="display: none;">
        <div .testimonial__stars "★★★★★" aria-label="5 out of 5 stars" style="color:var(--color-accent);letter-spacing:0.15em;">
        <blockquote .testimonial__quote "Best quick lip and Botox I've ever received from Lana. I've moved around over the years to various m…">
        <p .testimonial__name "— Michele S. · Dallas · Knox Henderson">
      <div data-testimonial="3" style="display: none;">
        <div .testimonial__stars "★★★★★" aria-label="5 out of 5 stars" style="color:var(--color-accent);letter-spacing:0.15em;">
        <blockquote .testimonial__quote "Nazeli made my dreams come true. She was thorough, kind, and made me feel at ease with the entire pr…">
        <p .testimonial__name "— Chael M. · Greenwich Village">
      <div data-testimonial="4">
        <div .testimonial__stars "★★★★★" aria-label="5 out of 5 stars" style="color:var(--color-accent);letter-spacing:0.15em;">
        <blockquote .testimonial__quote "Izzy is my injector and she is perfect. She is so reassuring if I'm trying something new and she exp…">
        <p .testimonial__name "— Sarah R. · Addison">
      <div data-testimonial="5" style="display:none;">
        <div .testimonial__stars "★★★★★" aria-label="5 out of 5 stars" style="color:var(--color-accent);letter-spacing:0.15em;">
        <blockquote .testimonial__quote "I have done RF microneedling and Botox at Upkeep and highly recommend. RF microneedling was with Ale…">
        <p .testimonial__name "— Alison T. · Addison">
      <div .testimonial-dots style="margin-top:var(--space-8);display:flex;justify-content:center;gap:var(--space-2);flex-wrap:wrap;">
        <button .testimonial-dot aria-label="Show testimonial 1" data-dot="0" style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent); background: tr…">
        <button .testimonial-dot aria-label="Show testimonial 2" data-dot="1" style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent); background: tr…">
        <button .testimonial-dot aria-label="Show testimonial 3" data-dot="2" style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent); background: tr…">
        <button .testimonial-dot aria-label="Show testimonial 4" data-dot="3" style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent); background: tr…">
        <button .testimonial-dot aria-label="Show testimonial 5" data-dot="4" style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent); background: va…">
        <button .testimonial-dot aria-label="Show testimonial 6" data-dot="5" style="width:10px;height:10px;border-radius:50%;border:1px solid var(--color-accent);background:transparent…">
      <p "Verified reviews from · Reviewer names as publicly listed" style="margin-top:var(--space-6);font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;co…">
        <a "Yelp" href="https://www.yelp.com/biz/upkeep-new-york-2" style="color:var(--color-text-muted);text-decoration:underline;text-underline-offset:3px;">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `testiSection`

**.section** — 1440×859px, 1 child element(s)

> `Real Clients, Real Words What Our Clients Say ★★★★★ 5.0 average across verified reviews ★★★★★ I have`

- `display`: `block`
- `position`: `relative`
- `width`: `1440px`
- `height`: `859.062px`
- `padding`: `115.2px 0px`
- `paddingTop`: `115.2px`
- `paddingBottom`: `115.2px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `testiContainer`

**.container.text-center** — 1320×629px, 4 child element(s)

> `Real Clients, Real Words What Our Clients Say ★★★★★ 5.0 average across verified reviews ★★★★★ I have`

- `display`: `block`
- `width`: `1320px`
- `height`: `628.688px`
- `padding`: `0px 32px`
- `margin`: `0px 60px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `testiPanel`

**div** — 0×0px, 3 child element(s)

> `★★★★★ I have come to see Naz for a few years now and adore her work so much I've sent quite a handfu`

- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `testiStars`

**.testimonial__stars** — 0×0px, 0 child element(s)

> `★★★★★`

- `display`: `block`
- `margin`: `0px 0px 16px`
- `marginBottom`: `16px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `22px`
- `fontWeight`: `400`
- `lineHeight`: `35.2px`
- `letterSpacing`: `3.3px`
- `textAlign`: `center`
- `color`: `rgb(212, 160, 144)`
- `transition`: `all`

### `testiQuote`

**.testimonial__quote** — 0×0px, 0 child element(s)

> `I have come to see Naz for a few years now and adore her work so much I've sent quite a handful of f`

- `display`: `block`
- `margin`: `0px 0px 24px`
- `marginBottom`: `24px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `36px`
- `fontWeight`: `300`
- `fontStyle`: `italic`
- `lineHeight`: `54px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `testiName`

**.testimonial__name** — 0×0px, 0 child element(s)

> `— Jessie K. · Greenwich Village`

- `display`: `block`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `testiDots`

**.testimonial-dots** — 760×10px, 6 child element(s)

- `display`: `flex`
- `width`: `760px`
- `height`: `10px`
- `margin`: `32px 0px 0px`
- `marginTop`: `32px`
- `flexWrap`: `wrap`
- `justifyContent`: `center`
- `gap`: `8px`
- `rowGap`: `8px`
- `columnGap`: `8px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `testiDot`

**.testimonial-dot** — 10×10px, 0 child element(s)

- `display`: `block`
- `width`: `10px`
- `height`: `10px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `borderRadius`: `50%`
- `transition`: `color 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)`

## States & Behaviors
### The target's carousel script
```js
const dots = document.querySelectorAll('.testimonial-dot');
const testimonials = document.querySelectorAll('[data-testimonial]');
let currentTestimonial = 0;
function showTestimonial(i) {
  testimonials.forEach(t => t.style.display = 'none');
  dots.forEach(d => { d.style.background = 'transparent'; });
  if (testimonials[i]) { testimonials[i].style.display = ''; }
  if (dots[i]) { dots[i].style.background = 'var(--color-accent)'; }
  currentTestimonial = i;
}
dots.forEach(dot => dot.addEventListener('click', () => showTestimonial(parseInt(dot.dataset.dot))));
if (testimonials.length) { setInterval(() => { showTestimonial((currentTestimonial + 1) % testimonials.length); }, 6000); }
```
Required behaviour:
- **6 panels** matching `testimonials.items` in order, each carrying `data-testimonial={index}`.
- **6 dots** as `<button>`s with `data-dot={index}` and `aria-label={`Show testimonial ${index + 1}`}`.
- All six panels stay **in the DOM**; only the active one is visible (the source toggles `display`
  rather than unmounting, and the `data-testimonial` attribute is part of the captured markup).
- Clicking a dot shows that panel and makes that dot active.
- A `setInterval` at **6000 ms** advances `(current + 1) % 6`, wrapping. A dot click sets the index
  directly and does **not** restart the timer — same as the source.
- **No transition on the swap.** It is an instant `display` toggle. Do not add framer-motion, CSS
  transitions or fades.
- Needs `"use client"`.

### The dots are NOT styled by the ported sheet
`.testimonial-dot`, `.testimonial-dots` and `.testimonial__name` have **no rules at all** in
`upkeep.css` — they are styled purely by inline `style` attributes, and the active dot's
background is set imperatively. Reproduce that: each dot carries
`width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--color-accent);
background: transparent; cursor: pointer; padding: 0`, and the **active** dot's `background` is set
to `var(--color-accent)`.

### Non-breaking spaces in the names
Each `testimonials.items[i].name` uses the entity form `— Name &nbsp;·&nbsp; Location`. Render the
real U+00A0 characters, not the literal `&nbsp;` text (e.g. replace `"&nbsp;"` with `"\u00a0"`
once per name). `Michele S. · Dallas · Knox Henderson` has a **second, plain-space** middot — only the
first is non-breaking. `testimonial__name` has no sheet rule, so nothing styles it beyond the class.

### The review note
Rendered after the dots, inside the same container, as an unclassed `<p>` with
`style={{ marginTop: "var(--space-6)", fontSize: "var(--text-xs)", letterSpacing: "0.08em",
textTransform: "uppercase", color: "var(--color-text-muted)" }}` containing
`{testimonials.note.before}`, a link to `testimonials.note.link.href` with the label
`testimonials.note.link.label`, then `{testimonials.note.after}`. The link's own inline style is
`color: var(--color-text-muted); text-decoration: underline; text-underline-offset: 3px`.

### Height varies with the visible quote
The section is 859–913px tall depending on which quote is showing — that is expected, not a bug.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `testiQuote` | 36px | 28.416px | 24px |
| `testiStars` | 22px | 20.608px | 18.34px |
| `testiName` | 17px | 15.936px | 15.18px |
| `headingSection` | 55.2px · w 604 · h 121 | 38.4px · w 707 · h 42 | 32px · w 358 · h 70 |
| `btnArrow` | 15px · w 265 · h 50 | 14.304px · w 256 · h 49 | 13.17px · w 242 · h 48 |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Verified behaviour
`scripts/qa-behaviour-upkeepmedspa.mjs`: 6 panels, 6 dots, exactly one panel visible, the active
dot always matches the visible panel, and clicking dot 5 shows panel 4 — all passing.

## Height variance (measured)
- live site showing panel 2: section 859px, visible panel 372px
- clone showing panel 1: section 913px, visible panel 426px
Both are legitimate renderings of the same section; the difference is the quote length.