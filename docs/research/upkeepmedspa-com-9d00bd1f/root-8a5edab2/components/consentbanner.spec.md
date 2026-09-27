# ConsentBanner Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ConsentBanner.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-09-footer.png`
- **Interaction model:** **click-driven** dismissal, persisted to `localStorage`; visible immediately on load
- **Export:** named `ConsentBanner`, no props — read content from `@/lib/upkeepmedspa-data`.
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
  <div id="upkeep-consent-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
  <div class="upkeep-consent__inner">
  <p class="upkeep-consent__text">We use cookies to improve your experience and, with your permission, to show relevant ads and measure marketing performance. See our <a href="/privacy-policy.html">Privacy Policy</a>.</p>
  <div class="upkeep-consent__actions">
  <button type="button" class="upkeep-consent__btn upkeep-consent__btn--secondary" data-consent="decline">Decline</button>
  <button type="button" class="upkeep-consent__btn upkeep-consent__btn--primary" data-consent="accept">Allow marketing cookies</button>
  </div>
  </div>
  </div>
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `consentBanner`

**div** — 0×0px, 1 child element(s)

> `We use cookies to improve your experience and, with your permission, to show relevant ads and measur`

- `position`: `fixed`
- `zIndex`: `9999`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(244, 236, 228)`
- `backgroundColor`: `rgb(26, 26, 26)`
- `boxShadow`: `rgba(0, 0, 0, 0.3) 0px -8px 28px 0px`
- `transition`: `all`
- `animationName`: `upkeepConsentSlideUp`
- `animationDuration`: `0.32s`

### `consentInner`

**.upkeep-consent__inner** — 0×0px, 2 child element(s)

> `We use cookies to improve your experience and, with your permission, to show relevant ads and measur`

- `display`: `flex`
- `padding`: `16px 24px`
- `paddingTop`: `16px`
- `paddingBottom`: `16px`
- `margin`: `0px auto`
- `flexWrap`: `wrap`
- `justifyContent`: `space-between`
- `alignItems`: `center`
- `gap`: `24px`
- `rowGap`: `24px`
- `columnGap`: `24px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(244, 236, 228)`
- `transition`: `all`

### `consentText`

**.upkeep-consent__text** — 0×0px, 1 child element(s)

> `We use cookies to improve your experience and, with your permission, to show relevant ads and measur`

- `display`: `block`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `14px`
- `fontWeight`: `400`
- `lineHeight`: `21.7px`
- `color`: `rgb(244, 236, 228)`
- `transition`: `all`

### `consentActions`

**.upkeep-consent__actions** — 0×0px, 2 child element(s)

> `DeclineAllow marketing cookies`

- `display`: `flex`
- `gap`: `10px`
- `rowGap`: `10px`
- `columnGap`: `10px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(244, 236, 228)`
- `transition`: `all`

## States & Behaviors
### Visible on load
Not delayed, not scroll-triggered — the target shows it immediately.

### Dismissal is persistent
Clicking either button hides the bar and records the choice in `localStorage` under
`consentBanner.storageKey` (`"accepted"` / `"declined"`), so it stays gone on later visits. On
mount, read the key and skip rendering when a value is present.

### Hydration safety
The persisted check must not run during render, or SSR and the client will disagree. Read
`localStorage` inside an effect (or a `useSyncExternalStore` with a `false` server snapshot) so
the first paint matches on both sides. Wrap every access in `try/catch` — private-mode browsers
throw, and the target does the same.

**Note on this repo's lint config:** `react-hooks/set-state-in-effect` is enabled, so the naive
`useState` + mount-effect-`setState` pattern fails `eslint`. `useSyncExternalStore` with a
`false` server snapshot is the approach that satisfies both the rule and hydration.

### No focus trap, no Escape, no scroll lock
It is a passive bar. The privacy-policy link inside it navigates normally.

### Sentences
Assemble the paragraph as `{consentBanner.before}` + `<a href={consentBanner.link.href}>` +
`{consentBanner.link.label}` + `</a>` + `{consentBanner.after}` so the sentence matches the
source exactly, including the link mid-sentence.

### Hover
CSS-only in the sheet for both button variants. Add no transition utilities and no JS.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `consentInner` | 17px | 15.936px | 15.18px |
| `consentText` | 14px | 14px | 14px |
| `consentActions` | 17px | 15.936px | 15.18px |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Verified behaviour
`scripts/qa-behaviour-upkeepmedspa.mjs`: banner visible on a fresh visit, `[data-consent="accept"]`
hides it, and it stays dismissed after a reload — all passing.

## Parity note (do not "fix")
The banner is `position: fixed; bottom: 0; z-index: 9999` and 78px tall, which **overlaps** the
floating accessibility button (`bottom: 20px; z-index: 9998`). Verified identical on the live
target — both report the a11y button as unreachable while the banner is up. This is target
behaviour, so the clone reproduces it.