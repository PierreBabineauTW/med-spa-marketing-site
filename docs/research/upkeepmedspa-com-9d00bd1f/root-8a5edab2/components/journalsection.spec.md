# JournalSection Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/JournalSection.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-07-journal.png`
- **Interaction model:** static (`fade-in` on the header row and each card)
- **Export:** named `JournalSection`, **no props** — read content from `journal` in `@/lib/upkeepmedspa-data`.
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
hrefs and image paths all come from `journal`.

```text
<section .section aria-label="Latest from the blog">
  <div .container>
    <div .flex style="justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:var(--space-4);margin-bottom:v…">
      <div .fade-in>
        <p .eyebrow "Expert Insights">
        <h2 .heading-section "How to UPKEEP">
      <a .btn.btn--small.btn--arrow.fade-in "Read All Articles" href="/blog">
    <div .grid-3.fade-in>
      <a .blog-card href="/blog/nefertiti-lift">
        <div .overflow-hidden>
          <img .blog-card__image alt="The Nefertiti Lift" src="https://images.squarespace-cdn.com/content/v1/5dfbc92ebcc4646c5b1d7497/1773948201904-9HCFCD5K0Y454UX…">
        <div .blog-card__content>
          <p .blog-card__category "Neurotoxin">
          <h3 .blog-card__title "The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin">
          <p .blog-card__excerpt "How the Nefertiti Lift and DAO neurotoxin work together to subtly lift and define the lower face.">
      <a .blog-card href="/blog/under-eye-filler">
        <div .overflow-hidden>
          <img .blog-card__image alt="Under Eye Filler" src="https://images.squarespace-cdn.com/content/v1/5dfbc92ebcc4646c5b1d7497/1773777867446-EYVAK1IW8JGYVO4…">
        <div .blog-card__content>
          <p .blog-card__category "Filler">
          <h3 .blog-card__title "Under Eye Filler: The Secret to Looking Well-Rested">
          <p .blog-card__excerpt "Under eye filler with Restylane® L helps smooth hollow tear troughs and reduce shadowing for a refre…">
      <a .blog-card href="/blog/microneedling-vs-laser">
        <div .overflow-hidden>
          <img .blog-card__image alt="Microneedling vs Laser" src="https://images.squarespace-cdn.com/content/v1/5dfbc92ebcc4646c5b1d7497/1760466670913-0H38UCIW7S34ZZZ…">
        <div .blog-card__content>
          <p .blog-card__category "Skin Health">
          <h3 .blog-card__title "Microneedling vs. Laser: Which Treatment Is Right for You?">
          <p .blog-card__excerpt "Both are powerful options for boosting collagen and refining your skin — but they work in very diffe…">
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `journalSection`

**.section** — 1440×818px, 1 child element(s)

> `Expert Insights How to UPKEEP Read All Articles Neurotoxin The Subtle Lift You Didn't Know You Neede`

- `display`: `block`
- `position`: `relative`
- `width`: `1440px`
- `height`: `818.281px`
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

### `journalGrid`

**.grid-3.fade-in** — 1256×458px, 3 child element(s)

> `Neurotoxin The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin How the Nefertiti `

- `display`: `grid`
- `width`: `1256px`
- `height`: `458.391px`
- `gap`: `24px`
- `rowGap`: `24px`
- `columnGap`: `24px`
- `gridTemplateColumns`: `402.656px 402.672px 402.656px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- `animationName`: `revealFade`
- children: `a.blog-card`, `a.blog-card`, `a.blog-card`

### `blogCard`

**.blog-card** — 403×458px, 2 child element(s)

> `Neurotoxin The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin How the Nefertiti `

- `display`: `block`
- `width`: `402.656px`
- `height`: `458.391px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `hidden`
- `transition`: `border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1)`
- children: `div.overflow-hidden`, `div.blog-card__content`

### `blogCardImage`

**.blog-card__image** — 401×250px, 0 child element(s)

- `display`: `block`
- `width`: `400.656px`
- `height`: `250.406px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `overflow`: `clip`
- `filter`: `sepia(0.06) saturate(1.05) brightness(0.98) contrast(1.02)`
- `transition`: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`

### `blogCardContent`

**.blog-card__content** — 401×182px, 3 child element(s)

> `Neurotoxin The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin How the Nefertiti `

- `display`: `block`
- `width`: `400.656px`
- `height`: `181.984px`
- `padding`: `20px`
- `paddingTop`: `20px`
- `paddingRight`: `20px`
- `paddingBottom`: `20px`
- `paddingLeft`: `20px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`
- children: `p.blog-card__category`, `h3.blog-card__title`, `p.blog-card__excerpt`

### `blogCardCategory`

**.blog-card__category** — 361×21px, 0 child element(s)

> `Neurotoxin`

- `display`: `block`
- `width`: `360.656px`
- `height`: `20.7969px`
- `margin`: `0px 0px 8px`
- `marginBottom`: `8px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `13px`
- `fontWeight`: `500`
- `lineHeight`: `20.8px`
- `letterSpacing`: `2.6px`
- `textTransform`: `uppercase`
- `color`: `rgb(212, 160, 144)`
- `transition`: `all`

### `blogCardTitle`

**.blog-card__title** — 361×57px, 0 child element(s)

> `The Subtle Lift You Didn't Know You Needed: Nefertiti + DAO Neurotoxin`

- `display`: `block`
- `width`: `360.656px`
- `height`: `57.1875px`
- `margin`: `0px 0px 8px`
- `marginBottom`: `8px`
- `fontFamily`: `"Cormorant Garamond", Georgia, serif`
- `fontSize`: `22px`
- `fontWeight`: `400`
- `lineHeight`: `28.6px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `blogCardExcerpt`

**.blog-card__excerpt** — 361×48px, 0 child element(s)

> `How the Nefertiti Lift and DAO neurotoxin work together to subtly lift and define the lower face.`

- `display`: `block`
- `width`: `360.656px`
- `height`: `48px`
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

### Header row
- The header is a flex row: eyebrow + `<h2 class="heading-section">` "How to UPKEEP" on the left,
  and `<a class="btn btn--small btn--arrow fade-in">` "Read All Articles" on the right.
  The `.flex` utility (with `justify-content`/`gap` from the sheet) handles the split — do not
  rebuild it with a grid.

### Blog card anatomy
```
<a class="blog-card overflow-hidden" href={card.href}>
  <img class="blog-card__image" />
  <div class="blog-card__content">
    <p class="blog-card__category">…
    <h3 class="blog-card__title">…
    <p class="blog-card__excerpt">…
```
- **`blog-card__image` is on the `<img>` itself, not a wrapper.** It carries
  `width: 100%; aspect-ratio: 16/10; object-fit: cover` — so it *is* the aspect box. Use explicit
  `width`/`height` props from `card.image` and let the sheet's `aspect-ratio` + `object-fit`
  do the work; a `fill` image would collapse here because there is no positioned parent.
- The three source photos are **portrait** (500×649, 500×745, 500×750) cropped into a 16:10
  landscape box — a heavy centre crop. Reproduce it; do not "fix" the orientation.
- `.grid-3` columns measured: **3** at 1440 (402.66px), **1** at 768, **1** at 390.

### Content
- `journal.cards` in order: Neurotoxin / "The Subtle Lift You Didn't Know You Needed: Nefertiti +
  DAO Neurotoxin"; Filler / "Under Eye Filler: The Secret to Looking Well-Rested";
  Skin Health / "Microneedling vs. Laser: Which Treatment Is Right for You?".
  Excerpts and hrefs (`/blog/nefertiti-lift`, `/blog/under-eye-filler`,
  `/blog/microneedling-vs-laser`) are in the data module — reproduce verbatim.

### Hover
- `.blog-card:hover .blog-card__image { transform: scale(1.03) }` with
  `transition: transform 600ms var(--ease-out)`. CSS-only — add no JS.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `grid3` | n/a | n/a | n/a |
| `blogCardCategory` | 13px · lh 20.8px · ls 2.6px · w 361 | 11.936px · lh 19.0976px · ls 2.3872px · w 299 | 11.18px · lh 17.888px · ls 2.236px · w 316 |
| `blogCardTitle` | 22px · lh 28.6px · w 361 | 20.608px · lh 26.7904px · w 299 | 18.34px · lh 23.842px · w 316 |
| `blogCardExcerpt` | 15px · lh 24px · w 361 | 14.304px · lh 22.8864px · w 299 | 13.17px · lh 21.072px · w 316 |
| `btnSmall` | 13px · lh 20.8px · ls 1.56px · w 219 | 11.936px · lh 19.0976px · ls 1.43232px · w 206 | 11.18px · lh 17.888px · ls 1.3416px · w 197 |
| `headingSection` | 55.2px · lh 60.72px · w 604 | 38.4px · lh 42.24px · w 707 | 32px · lh 35.2px · w 358 |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type
scale. Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`
(matches the source) and internal hrefs as plain `<a>`. Do **not** use `next/link` — the target
is a static site with plain anchors and the ported CSS styles bare `a`.