# Phase 2 build brief — UPKEEP production-ready pages

Read this before writing any page. It is the contract for the whole phase.

## The rule

The visual design is **APPROVED AND LOCKED** (Phase 1 `premium-polish` commit
`3ae2915`). You are adding pages, not styling.

**Never introduce a new design language.** Every class you use must already
exist in `src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css`, or be
supplied by a shared component below. Do not add Tailwind colour/spacing/text
utilities — the ported sheet is imported unlayered and wins the cascade anyway.
Do not write a new CSS file.

## Design vocabulary available (already in upkeep.css)

**Layout:** `.container` (max 1320px, gutter clamp) · `.section` (padding-block
clamp 4rem→8rem) · `.section--tight` · `.split` (2-col grid, 1-col ≤768px) ·
`.grid-3` · `.grid-4` · `.flex` · `.flex-col` · `.relative` · `.overflow-hidden`

**Type:** `.heading-hero` (page H1) · `.heading-section` (H2) · `.eyebrow` ·
`.body-text` · `.blog-post-content` (article body) · `.manifesto` +
`.manifesto__text` (large italic pull statement)

**Buttons:** `.btn` · `.btn--arrow` (adds a `→` on hover) · `.btn--accent`
(rose-gold outline) · `.btn--filled` (solid rose-gold) · `.btn--small`

**Modifiers:** `.text-center` · `.mx-auto` · `.mb-2` `.mb-4` `.mb-6` `.mb-8`
`.mb-12` · `.mt-4` `.mt-8` · `.gap-4` `.gap-8` · `.items-center` ·
`.justify-center` · `.text-left`

**Cards:** `.svc-tile` (+`__img`/`__title`/`__desc`) · `.location-card`
(+`__bg`/`__overlay`/`__content`/`__name`/`__address`) · `.blog-card`
(+`__image`/`__content`/`__category`/`__title`/`__excerpt`)

**Subpage pieces:** `.page-hero` (+`__bg`/`__content`/`__overlay`) ·
`.menu-nav` + `.menu-nav__pill` (+`--active`) · `.menu-category`
(+`__header`/`__title`/`__subtitle`) · `.menu-simple__row`/`__name`/`__dots`/
`__price`/`__unit` · `.menu-accordion` (+`__trigger`/`__brand`/`__icon`/`__body`)
· `.menu-group-label` · `.booking-cta` (+`__bg`/`__content`) ·
`.footer__legal-links` · `.footer__link` · `.press-bar` + `.press-bar__item`

**Motion:** add `fade-in` to section blocks — the ported sheet animates them
with native `animation-timeline: view()`. **No JS reveal, no IntersectionObserver,
no motion library.** The `prefers-reduced-motion` safety net is in `polish.css`.

## Shared components you should use instead of re-marking up

```tsx
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
// <PageHero eyebrow? title intro? image? />  → <h1 class="heading-hero text-center">

import { SectionHeading, CtaBand, FaqList, Breadcrumbs }
  from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
// <SectionHeading eyebrow title lede align="center" as="h2" />
// <CtaBand eyebrow title body cta={{label,href}} external />
// <FaqList items={[{q,a}]} />   → <details class="menu-accordion">
// <Breadcrumbs items={[{label, href?}]} />
```

Interactive components (already written, do not duplicate):
- `StudioSwitcher` — `/components/.../root-8a5edab2/StudioSwitcher`
- `GalleryGrid` — `/components/.../root-8a5edab2/GalleryGrid`

## Page shell

The root layout already renders skip-link, `SiteNav`, `{children}`, `SiteFooter`
and the three overlays. **Your page must render only `<main id="main-content">`
…</main>`.** Do not add nav, footer, overlays or the skip link.

## Config

`@/config/site` — brand name, logo, tagline, contact, socials, booking URL,
review link, legal copy, `routes`, `seo`, `storageKeys`.
`@/config/content` — `services[8]`, `studios[7]`, `regions`, `gallery`,
`galleryCategories`, `posts[3]`, `legal.{privacy,cancellation,safety,accessibility}`,
`foundedYear` (null), `hours` (null).

## SEO

```tsx
import { pageMetadata, JsonLd, breadcrumbSchema, faqSchema, serviceSchema,
         organizationSchema, articleSchema, localBusinessSchema }
  from "@/lib/seo";

export const metadata = pageMetadata({ title, description, path: "/about" });
```

Render schema **inside** the returned JSX with `<JsonLd id="…" data={…} />` as a
direct child of `<main>`. `localBusinessSchema()` returns `null` when the studio
has no configured phone/address — that is intentional, do not force it.

## Honesty rules (hard requirements)

- **Never invent** reviews, clients, awards, years in business, certifications,
  team members, phone numbers, addresses, statistics, opening hours, prices,
  performance claims or case studies.
- Anything unknown is `null` in config. The UI then **omits that row entirely** —
  it must never render `null`, `undefined`, `TBD`, `TODO`, `Coming soon` or a
  lorem string to a visitor.
- Service pricing only appears where `service.pricing` is non-empty. Two services
  carry the pricing the reference site publishes publicly; the rest render no
  pricing table.
- `post.sample === true` → the article page shows a short, tasteful notice that
  the copy is a placeholder. It is a template, and pretending otherwise would be
  dishonest.
- No `href="#"`, no `javascript:void(0)`, no `localhost`, no dead links.
  Every internal link must point at a page that exists in `src/app/`.
- Internal links use plain `<a>`; the sheet styles bare `a`.
  `next/link` is intentionally not used (see `eslint.config.mjs`).
- External links get `target="_blank" rel="noopener noreferrer"`.

## Page requirements

Every page needs:
- exactly one `<h1>` (PageHero renders it) and a sane `h2`/`h3` order
- a meta description that describes that page, not the whole site
- at least one internal link onward, and one link back (breadcrumb counts)
- an answer-first opening paragraph naming what the page is about (helps SEO and
  AI answers) — write it plainly, no SEO jargon in the copy

## Definition of done

1. `npx.cmd tsc --noEmit` passes. (PowerShell blocks `npx.ps1`; use `npx.cmd`.)
2. Only the files assigned to you are created or modified.
3. The page renders without console errors.
4. No new CSS file, no Tailwind colour/spacing/text utilities.

Report: files created, tsc result, and anything you could not honour.
