# AccessibilityMenu Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/AccessibilityMenu.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/sec-09-footer.png`
- **Interaction model:** **click-driven** (button toggles the panel; the two toggles persist) **and storage-driven** (preferences restore on load); Escape and outside-click also close
- **Export:** named `AccessibilityMenu`, no props — read content from `@/lib/upkeepmedspa-data`.
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
  <div id="a11y-menu-root">      <button id="a11y-menu-button" type="button" aria-label="Open accessibility menu" aria-expanded="false" aria-controls="a11y-menu-panel">        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.4">
  </circle>          <circle cx="12" cy="5.4" r="1.6" fill="currentColor">
  </circle>          <path d="M5.5 8.5 L18.5 8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none">
  </path>          <path d="M9.5 8.5 L8 18.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none">
  </path>          <path d="M14.5 8.5 L16 18.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none">
  </path>          <path d="M9.2 12 L14.8 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none">
  </path>        </svg>      </button>      <div id="a11y-menu-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-menu-heading" hidden="">        <h2 id="a11y-menu-heading">Accessibility</h2>        <p class="a11y-menu__intro">Quick controls for a more comfortable visit.</p>        <div class="a11y-menu__controls">          <label class="a11y-menu__toggle">            <input type="checkbox" id="a11y-toggle-text">            <span class="a11y-menu__toggle-label">Larger text</span>            <span class="a11y-menu__toggle-switch" aria-hidden="true">
  </span>          </label>          <label class="a11y-menu__toggle">            <input type="checkbox" id="a11y-toggle-motion">            <span class="a11y-menu__toggle-label">Reduce motion</span>            <span class="a11y-menu__toggle-switch" aria-hidden="true">
  </span>          </label>          <button type="button" class="a11y-menu__reset" id="a11y-reset">Reset preferences</button>        </div>        <div class="a11y-menu__divider" role="presentation">
  </div>        <a class="a11y-menu__link" href="./accessibility.html">Read full Accessibility Statement</a>        <div class="a11y-menu__contact">          <p class="a11y-menu__contact-label">Need help? Contact us:</p>          <a href="mailto:info@upkeepmedspa.com">info@upkeepmedspa.com</a>          <a href="tel:+18338753377">(833) 875-3377</a>        </div>      </div>
  </div>
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `a11yRoot`

**div** — 0×0px, 2 child element(s)

> `Accessibility Quick controls for a more comfortable visit. Larger text Reduce motion Reset preferenc`

- `position`: `fixed`
- `bottom`: `20px`
- `left`: `20px`
- `zIndex`: `9998`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `all`

### `a11yButton`

**button** — 0×0px, 1 child element(s)

- `display`: `flex`
- `width`: `52px`
- `height`: `52px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(26, 15, 10)`
- `backgroundColor`: `rgb(212, 160, 144)`
- `borderRadius`: `50%`
- `boxShadow`: `rgba(0, 0, 0, 0.45) 0px 6px 20px 0px, rgba(0, 0, 0, 0.35) 0px 2px 6px 0px`
- `transition`: `transform 0.2s ease-out, box-shadow 0.2s ease-out`

### `a11yPanel`

**div** — 0×0px, 6 child element(s)

> `Accessibility Quick controls for a more comfortable visit. Larger text Reduce motion Reset preferenc`

- `position`: `absolute`
- `bottom`: `64px`
- `width`: `296px`
- `padding`: `20px`
- `paddingTop`: `20px`
- `paddingBottom`: `20px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `14px`
- `fontWeight`: `400`
- `lineHeight`: `21px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgb(19, 16, 18)`
- `borderRadius`: `14px`
- `boxShadow`: `rgba(0, 0, 0, 0.6) 0px 18px 48px 0px, rgba(0, 0, 0, 0.4) 0px 4px 12px 0px`
- `transition`: `all`

## States & Behaviors
### The target's script
- Visible on load, pinned bottom-left, `z-index: 9998`, **52×52px**.
- `#a11y-menu-button` toggles the panel's `hidden` attribute and keeps `aria-expanded` in sync
  (`"false"`/`"true"`). Escape closes it and returns focus to the button; outside click closes too.
  Focus moves to the `<h2 id="a11y-menu-heading">` on open, which the target makes focusable
  (`tabIndex={-1}`) — the sheet styles `#a11y-menu-heading:focus-visible`.
- **"Larger text"** adds/removes `a11y-large-text` on **`<html>`** and persists to
  `localStorage["upkeep-a11y-large-text"] = "1"` (remove the key when off).
- **"Reduce motion"** adds/removes `a11y-reduce-motion` on `<html>`, persisted under
  `localStorage["upkeep-a11y-reduce-motion"] = "1"`.
  Both classes are already handled by the ported sheet — `html.a11y-reduce-motion` forces
  `.fade-in`/`.reveal-up` to `opacity: 1 !important` and neutralises transitions, which is the
  entire point. **Do not implement the visual effect yourself.**
- **"Reset preferences"** removes both classes from `<html>`, clears both keys, and unchecks both
  boxes.
- **Restore on load:** re-apply the persisted classes to `<html>`. The target does this pre-paint;
  in React it must happen in an effect, so a returning visitor may see a one-frame flash of the base
  text size. That trade-off is inherent to hydration — a pre-hydration inline script would close it
  at the cost of a `next/script` in the layout.
- Wrap every `localStorage` access in `try/catch`.

**Lint note:** `react-hooks/set-state-in-effect` is enabled in this repo, so the naive
`useState` + mount-effect-`setState` pattern fails `eslint`. Read the two preferences through
`useSyncExternalStore` with a `false` server snapshot (which also syncs across tabs via the
`storage` event), and apply the `<html>` classes from effects that only mutate the DOM.

### Toggle rows are labels, not checkboxes
Each row is a `<label class="a11y-menu__toggle">` wrapping a **visually hidden** checkbox, a label
span and a decorative switch span. Clicking anywhere on the row toggles it — that is native
`<label>` behaviour, so keep the input inside the label rather than faking it with a div. The
switch's "on" look comes from
`.a11y-menu__toggle input[type="checkbox"]:checked ~ .a11y-menu__toggle-switch`, so the DOM order
(input → switch span) matters.

### All of the widget's CSS is already ported
`#a11y-menu-root`, `#a11y-menu-button` (and its `:hover`, `:focus-visible`, `svg` rules),
`#a11y-menu-panel` (and `[hidden]`), `#a11y-menu-heading` (and `:focus`, `:focus-visible`) and
every `.a11y-menu__*` class are in `upkeep.css`. Verified by the coverage assertion in
`scripts/tmp-extract-css.mjs`: 0 selectors styled in the source are missing from the port.

### Contact details
Reuse `footer.contact` from `@/lib/upkeepmedspa-data` for the email/phone. The statement link points
at `./accessibility.html` in the source; this clone uses `/accessibility`, the same destination the
footer uses.
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `a11yRoot` | 17px | 15.936px | 15.18px |
| `a11yButton` | 17px | 15.936px | 15.18px |
| `a11yPanel` | 14px | 14px | 14px |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Verified behaviour
`scripts/qa-behaviour-upkeepmedspa.mjs`: button present on load and 52×52, panel hidden initially,
button opens it, `aria-expanded=true`, clicking each toggle row checks the box, both add their
`<html>` class and persist `"1"`, reset clears both classes and both keys, and
`html.a11y-reduce-motion` genuinely forces `.fade-in` to `opacity: 1` — all passing.

## Parity note (do not "fix")
The fixed consent bar overlaps this button (see `consentbanner.spec.md`). Verified identical on
the live target.