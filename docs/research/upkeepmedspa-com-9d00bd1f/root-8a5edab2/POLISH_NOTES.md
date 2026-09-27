# PREMIUM POLISH PASS — upkeepmedspa-clone

Branch `premium-polish/upkeepmedspa`. Goal: refine, not redesign. Roughly 90% of
the visual direction is deliberately untouched.

**Result: 5 files modified, 3 added, 0 components rewritten, 0 sections rebuilt.**
The page structure (`src/app/page.tsx`) is byte-identical to before the pass.

---

## 1. The one real bug found: unreachable mobile-menu links

`scripts/qa-risks.mjs` measured the mobile menu (a centred flex column of 15
links + a button) against real phone viewports:

| viewport | menu content | panel height | last link bottom | reachable? |
| --- | --- | --- | --- | --- |
| 360 × 800 | 892px | 800px | 820px | **no** |
| 375 × 812 | 898px | 812px | 826px | **no** |
| 390 × 844 | 914px | 844px | 842px | yes (2px to spare) |
| 430 × 932 | 962px | 932px | — | yes |

`.mobile-menu` had `overflow-y: visible`, so on the two common small phones
"Upcoming Events", "Contact" and the **"Book Now" button rendered past the bottom
edge with no way to scroll to them.** `elementFromPoint` could not reach them at
any scroll offset. This is a functional defect, not a taste question.

**Fix** (`polish.css`): `overflow-y: auto` + `overscroll-behavior-y: contain`,
`justify-content: safe center` (centres when the content fits, falls back to
start-aligned when it overflows, instead of clipping the top), `flex-shrink: 0`
on the children, and 64px/32px block padding so the first link clears the 48px
close button when scrolled to the very top.

On viewports under 960px tall the link gap also tightens from 24px to 16px. A
15-item menu at a 24px gap needs ~962px and simply does not fit a 932px phone;
the tighter rhythm lets the list sit on taller phones while the overflow rule
keeps every link reachable on short ones.

Verified after: **all 15 links + the Book Now button reachable at 360×640, 360×800,
375×812, 390×844, 430×932 and 768×1024**; no overlap with the close button; close
button still works at every size (`scripts/qa-mobile-menu.mjs`).

The live target has the same defect. This is the one place the clone deliberately
diverges, because unreachable content is a broken function rather than a design
decision.

## 2. Touch targets — coarse pointers only

Measured undersized targets at 360/375/390/430. All fixes are scoped to
`@media (pointer: coarse)`, so **a mouse user sees the design byte-for-byte
identical to the reference.** Verified that a 768px context reports
`pointer: coarse = false` and keeps the original 10px dots and 40px buttons.

| target | before | after | how |
| --- | --- | --- | --- |
| testimonial dot | 10 × 10 | **24 × 24** box, 10px visual | visible circle redrawn as `::before`; `aria-current="true"` marks the active one |
| footer legal links | 36 tall | **44** | `min-height` on coarse pointers |
| compact CTA (`.btn--small`) | 40 tall | **44** | `min-height` on coarse pointers |
| nav wordmark | 111 × 20 | **44 tall** hit area | `::after` expander; rendered logo size and row height unchanged |

The dot gap widens 8px → 14px on coarse pointers so the 24px target circles around
adjacent dots do not intersect. Hit-testing confirms a 38px pitch with a 14px dead
zone between targets — **no overlap**, so no dot steals its neighbour's taps.

Inline links inside sentences (phone, email, "Privacy Policy", the review credit)
are 14–18px tall and were **left alone**: WCAG 2.5.8 explicitly exempts targets
whose size is constrained by the line-height of surrounding text.

## 3. Reduced motion

Verified under `reducedMotion: "reduce"`: all 16 below-fold `.fade-in` elements
compute to `opacity: 1`. The ported `prefers-reduced-motion` block sets
`animation-duration: 0.01ms !important`, but that does not reliably neutralise a
**progress-based** scroll timeline across engines, so a safety net was added that
forces reveals visible and disables the hero float/parallax. Belt-and-braces
rather than a fix — no visual change.

## 4. Templatization

`src/config/site.ts` is now the single place for business identity, consumed by
the data module, the layout metadata and the accessibility widget.

Replaced with neutral placeholders: brand name, phone, email, street addresses,
social profile URLs, booking URL, review-platform link, legal entity and
copyright, SEO title/description/URL, and the four `localStorage` keys.

Replaced the six real client testimonials with six placeholders of near-identical
length, so the carousel panel and dot pitch keep their measured proportions.

Kept, because it *is* the design: all photography, the palette, the
Cormorant Garamond + Switzer pairing, section copy, service names, the editorial
layout, and the logo asset (its path and dimensions are in the config, documented
as the one file to swap).

No JSON-LD or structured data was ever present, so there was none to strip.

## 5. Explicitly NOT changed

- **The hero.** No layout, type, image-crop or CTA change. Verified 20px inset /
  320px wide on all three CTAs at 360px — consistent, not the misalignment the
  first screenshot pass suggested.
- **The type system.** Every size is the ported fluid `clamp()`; the measured
  scale across 430/390/375/360 is coherent (h1 48, h2 32, body 15.2, quote 24).
- **Images.** Untouched — same files, same `object-fit`, same crops.
- **Motion.** The arrow nudge (`translateX(4px)`), the hero float, the 600/800ms
  card image scales and the scroll-driven reveals were all already correct and
  restrained. The only motion added is a 180ms colour transition on the dots.
- **Performance.** CLS 0, LCP 272ms, one 79.5KB stylesheet (≈12KB brotli on a
  CDN). The 374KB "transfer" measured locally is uncompressed `next start`
  output, not a real-world problem — not chased.
- **The known target bugs** (consent bar covering the a11y button, the popup not
  resetting, hover-only dropdowns) are still reproduced; see `KNOWN_GAPS.md`.

---

## Regression suite added

| script | what it asserts |
| --- | --- |
| `qa-mobile-menu.mjs` | every link + Book Now reachable at 6 viewports, no close-button overlap |
| `qa-touch-targets.mjs` | coarse-pointer hit areas via `elementFromPoint` (catches pseudo-element expanders a bounding-box check would miss) |
| `qa-viewports.mjs` | overflow, clipped text, undersized targets, console errors at 7 viewports |
| `qa-risks.mjs` | mobile-menu reachability, reduced-motion reveals, larger-text mode, focus rings, LCP/CLS |
| `with-server.mjs` | boots the standalone build, runs a script against it, tears it down |
| `shoot.mjs` | before/after screenshots at any viewport |

## Final state

- `npm run lint` → 0 errors (16 warnings, all in QA scripts)
- `npm run typecheck` → clean
- `npm run build` → clean
- `qa-behaviour-upkeepmedspa.mjs` → **54/54 pass**, 0 console errors
- No horizontal overflow at 430/390/375/360/768/1280/1440
- 0 missing images, CLS 0
