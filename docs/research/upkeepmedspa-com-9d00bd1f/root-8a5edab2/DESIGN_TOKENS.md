# DESIGN_TOKENS — upkeepmedspa.com (home)

Verbatim from the target's own `style.css` `:root` block plus `base.css`.
Ported into `src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css` and
mirrored into `src/app/globals.css` (shadcn token names + Tailwind v4 `@theme`).

Aesthetic: **ultra-romantic editorial luxury, floral-drenched, dark mode.**

## Typography

| Token | Value |
| --- | --- |
| `--font-display` | `'Cormorant Garamond', 'Georgia', serif` |
| `--font-body` | `'Switzer', 'Helvetica Neue', sans-serif` |

- **Cormorant Garamond** — Google Fonts, non-variable: weights 300/400/500, plus
  italics 300/400. Used for every heading and the testimonial quotes.
- **Switzer** — Fontshare (Indian Type Foundry, free for commercial use), weights
  300/400/500. Not on Google Fonts, so it is **self-hosted**:
  `next/font/local` over `src/lib/fonts/Switzer-{Light,Regular,Medium}.woff2`.
- Both are wired through CSS variables in the layout (`--font-cormorant`,
  `--font-switzer`) and re-aliased onto `--font-display` / `--font-body`.

### Fluid type scale

| Token | `clamp()` | 1440 | 768 | 390 |
| --- | --- | --- | --- | --- |
| `--text-xs` | `clamp(0.6875rem, 0.65rem + 0.2vw, 0.8125rem)` | 13px | 11.94px | 11.18px |
| `--text-sm` | `clamp(0.8125rem, 0.75rem + 0.3vw, 0.9375rem)` | 15px | 13.17px | 11.18px |
| `--text-base` | `clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem)` | 17px | 15.94px | 15.18px |
| `--text-lg` | `clamp(1.125rem, 1rem + 0.6vw, 1.375rem)` | 22px | 20.6px | 18.34px |
| `--text-xl` | `clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)` | 36px | 28.4px | 24px |
| `--text-2xl` | `clamp(2rem, 1.2rem + 2.5vw, 3.5rem)` | 55.2px | 38.4px | 32px |
| `--text-3xl` | `clamp(2.5rem, 1rem + 4vw, 5rem)` | — | — | — |
| `--text-hero` | `clamp(3rem, 0.5rem + 7vw, 7rem)` | 108.8px | 61.76px | 48px |

### Named type roles (measured at 1440)

| Class | Family | Size / line-height | Weight | Letter-spacing | Colour |
| --- | --- | --- | --- | --- | --- |
| `.heading-hero` (`h1`) | display | 108.8 / 108.8 | 300 | -0.01em | `#f5f0eb` |
| `.heading-section` (`h2`) | display | 55.2 / 60.72 | 300 | — | `#f5f0eb` |
| `.eyebrow` (`p`) | body | 13 / 20.8 | 500 | 0.25em | `#d4a090` |
| `.eyebrow` (hero variant) | body | 13 / 20.8 | 500 | 0.25em | `#fff` + `text-shadow: rgba(0,0,0,.6) 0 1px 8px` |
| `.body-text` | body | 17 / 28.9 | 300 | — | `rgba(245,240,235,.78)` |
| `.btn` | body | 15 / 24 | 400 | 0.12em, uppercase | `#f5f0eb` |
| `.btn--pink` | body | 15 / 24 | 500 | 0.18em, uppercase | `#1a1410` on `#d4a090` |
| `.btn--small` | body | 13 / 20.8 | 400 | 0.12em, uppercase | `#f5f0eb` |
| `.testimonial__quote` | display | 36 / 54 | 300 italic | — | `#f5f0eb` |
| `.testimonial__stars` | body | 22 / 35.2 | 400 | 0.15em | `#d4a090` |
| `.location-card__name` | display | 36 / 39.6 | 300 | — | `#f5f0eb` |
| `.nav__link` | body | 13 / 20.8 | 400 | 0.15em, uppercase | — |
| `.press-bar__item` | display | 22 / 35.2 | 400 | 0.05em | `rgba(245,240,235,.65)` |
| `.footer__heading` | body | 13 / 20.8 | 500 | 0.2em, uppercase | — |
| `.footer__link` | body | 15 / 24 | 300 | — | — |
| `.footer__tagline` | display italic | 17 / 27.2 | 300 | — | — |

## Colour palette

| Token | Value | Role |
| --- | --- | --- |
| `--color-bg` | `#0a0a0a` | page background |
| `--color-surface` | `#111111` | the locations band, dropdown background |
| `--color-surface-2` | `#1a1a1a` | consent bar |
| `--color-surface-3` | `#222222` | raised surfaces |
| `--color-border` | `rgba(212,176,168,0.15)` | hairlines |
| `--color-border-hover` | `rgba(212,176,168,0.3)` | — |
| `--color-text` | `#f5f0eb` | cream, primary text |
| `--color-text-muted` | `rgba(245,240,235,0.78)` | body copy |
| `--color-text-faint` | `rgba(245,240,235,0.6)` | press eyebrow, footer note |
| `--color-accent` | `#d4a090` | **rose-gold**, "matched to logo" |
| `--color-accent-hover` | `#e0b5a5` | — |
| `--color-accent-soft` | `rgba(212,160,144,0.12)` | — |
| `--color-gold` | `#c9a96e` | brass |
| `--color-sage` | `#8a9a7b` | — |
| `--color-lavender` | `#b8a9c9` | — |
| `--color-cream` | `#f5f0eb` | — |
| shimmer gradient | `#d4a090` → `#b87a6a` → `#e8c0b0` | — |

**`--color-accent` is rose-gold, not the shadcn `accent` token.** In
`globals.css` the shadcn `--accent` is remapped to a surface colour so
`bg-accent` keeps its usual meaning; the brand rose-gold is exposed to Tailwind
as `--color-rose-gold` and to the ported CSS as `--color-accent`.

### Buttons

| Variant | Background | Text | Border |
| --- | --- | --- | --- |
| `.btn` (outline) | transparent | `#f5f0eb` | `1px solid #f5f0eb` |
| `.btn--arrow` | transparent, `::after` arrow | `#f5f0eb` | `1px solid #f5f0eb` |
| `.btn--accent` | transparent | `#d4a090` | `1px solid #d4a090` |
| `.btn--filled` | `#d4a090` | `#0a0a0a` | `1px solid #d4a090` |
| `.btn--pink` | `#d4a090` | `#1a1410` | `1px solid #d4a090` |

Padding `12px 32px` (min-height 48px); `--small` is `8px 20px` (min-height 40px);
`--pink` is `12px 40px` (min-height 52px).

## Spacing — 4px base

`--space-1` 0.25rem · `-2` 0.5rem · `-3` 0.75rem · `-4` 1rem · `-5` 1.25rem ·
`-6` 1.5rem · `-8` 2rem · `-10` 2.5rem · `-12` 3rem · `-16` 4rem · `-20` 5rem ·
`-24` 6rem · `-32` 8rem

Utilities: `.mb-4` `--space-4` · `.mb-6` `--space-6` · `.mb-8` `--space-8` ·
`.mx-auto` · `.text-center` · `.flex` · `.overflow-hidden` · `.grid-3` ·
`.grid-4` · `.container`

## Layout

| Token | Value |
| --- | --- |
| `--content-narrow` | 680px |
| `--content-default` | 1080px |
| `--content-wide` | 1320px (the `.container` max-width) |
| `--gutter` | `clamp(var(--space-4), 4vw, var(--space-8))` → 32px at 1440 |
| `.section` | `padding-block: clamp(var(--space-16), 8vw, var(--space-32))` → 115.2px at 1440 |
| `.section--tight` | `padding-block: clamp(var(--space-8), 4vw, var(--space-16))` |

## Radii, shadows, elevation

- `.svc-tile__img` → `border-radius: 8px`
- `.btn` → square (no radius); `.btn--pink` explicitly "sleek, square, no animation"
- `#a11y-menu-button` → `border-radius: 50%`; `#a11y-menu-panel` → 14px
- Shadows are reserved for overlays: nav dropdown / consent / a11y panel only.
  Page sections and cards have **no** box-shadow.

## Motion

| Token | Value |
| --- | --- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` — used almost everywhere |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-fast` | 180ms `--ease-out` |
| `--transition-med` | 350ms `--ease-out` |
| `--transition-slow` | 600ms `--ease-out` |
| `.hero__scroll-hint` | `animation: float 3s ease-in-out infinite` |

## Global editorial image treatment

```css
img:not(.nav__logo-img):not(.footer__logo-img):not(.gallery-grid__img)
  { filter: sepia(0.06) saturate(1.05) brightness(0.98) contrast(1.02); }
.hero__bg img { filter: sepia(0.08) saturate(1.08) brightness(0.96) contrast(1.03); }
```

"Warm rose tone unification — applied globally to all images for a cohesive
photoshoot feel." The logo is the only exclusion. This is why the clone's
photography reads as one shoot without any per-image work.

## Selection & focus

```css
::selection    { background: rgba(212,159,172,0.35); color: var(--color-text); }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; border-radius: 2px; }
```
