# KNOWN GAPS AND DELIBERATE DEVIATIONS

Everything here is a conscious decision, with the reason. Nothing on this list
is an accident, and nothing here is a broken build.

## Not cloned (out of scope for the home page)

### 1. Flash-sale popup — `.upk-flash-overlay`

The target ships a third fixed overlay (`flash-sale-popup.js`, poster
`/assets/events/flash-sale-40-off-sept2026.png`, 900×1600, z-index 10001). It is
**date/event-gated** — a "40% off full syringe" promo for **Sept 24–25, 2026** —
and the stylesheet block is titled *"Flash Sale Popup — 40% off full syringe
(Sept 24-25)"*.

On a fresh load it sits in the DOM as
`.upk-pop-overlay.upk-flash-overlay.upk-pop-open` but computes to
`opacity: 0`, so it is invisible — while still hit-testing, which is why the
accessibility button is unreachable on the live site (see below).

Not cloned: it is an expired, event-specific promo, not part of the home page's
design. **The poster image is downloaded** and present in the asset root, so
wiring it up later is a small job. All of its CSS *is* ported, incidentally —
the filter is selector-driven and `upk-flash-*` rules were not needed by any
cloned markup, so they were dropped from `upkeep.css` along with the other
unused blocks.

### 2. Pink Party RSVP popup

Same reasoning: `rsvp-popup.js` + *"Pink Party RSVP Popup — UPKEEP Dallas
5 Year Anniversary"*. Event-specific, not in the DOM on a plain home-page load.

### 3. Newsletter submission backend

The target posts to Mailchimp's JSONP endpoint
(`upkeepmedspa.us15.list-manage.com/subscribe/post-json`) with a honeypot field.
A clone has no backend, so `SignupPopup` handles submit client-side: prevent
default, require a non-empty email, swap to the success state. **No network
request is made** — asserted by the QA suite.

### 4. Linked routes

Only `/` exists in this clone. Every internal `<a href>` points at a path that
would 404 here (`/services/…`, `/blog/…`, `/locations#ues`, …), exactly as
written in the target's markup. External links (`joinblvd.com` booking,
Instagram/TikTok/Facebook, Yelp) work and carry
`target="_blank" rel="noopener noreferrer"`.

### 5. `tracking.js` / Mailchimp Connected Sites

Analytics tags. Out of scope — nothing in the target's visible design depends on
them, and shipping third-party tracking in a clone would be wrong.

---

## Target bugs reproduced on purpose

These look like defects in the clone. They are defects in the target too, each
verified against the live site. **Do not "fix" them** — the brief is pixel- and
behavior-perfect emulation, and fixing them would be a divergence.

1. **The consent bar covers the accessibility button.** Bar: `fixed; bottom: 0;
   78px; z-index: 9999`. Button: `bottom: 20px; 52px; z-index: 9998`. They
   overlap by 50px, and `elementFromPoint` at the button's centre returns the
   bar. Verified: live `a11y reachable: false`, clone `a11y reachable: false`
   (`scripts/tmp-check-overlap.mjs`).
2. **The transparent flash overlay swallows pointer events** on the target
   (`opacity: 0` but still hit-testing), compounding the above. Not reproduced
   because the overlay itself is not cloned.
3. **The newsletter popup never resets.** Reopening after a successful submit
   still shows "See You Soon", because the source never resets the two
   `[data-signup-state]` blocks.
4. **`aria-labelledby="signupHeading"` points at a hidden heading** while the
   success block is shown — the id lives on the form block's `<h2>`.
5. **Dropdowns are keyboard-inaccessible** — hover-only, with no `aria-expanded`
   and no focus path.
6. **A `float` keyframe is shared globally.** `.hero__scroll-hint` declares
   `animation: float 3s ease-in-out infinite`; `@keyframes float` is global, so
   any future element that names `float` inherits that motion.

---

## Small, intentional deviations

1. **`id="mobile-menu"`** — the target's `.mobile-menu` has no `id`. Added so the
   overlay is addressable. No styling attaches to it; rendering is unaffected.
2. **`type="button"` on the testimonial dots** — the captured markup has no
   `type`. Harmless outside a form and safer against accidental submit.
3. **Accessibility preferences restore in an effect, not pre-paint.** The target
   applies `html.a11y-large-text` before first paint; in React this must happen
   after mount, so a returning visitor can see a one-frame flash of the base text
   size. Closing it needs a pre-hydration inline script, which was judged a worse
   trade than the one-frame flash.
4. **`localStorage` values for the consent bar** are `"accepted"` / `"declined"`.
   The target's exact stored value was not captured; only the *behaviour*
   (persist, don't re-show) matters and that is exact.
5. **Blog images downloaded at `format=1200w`** from Squarespace rather than the
   `format=500w` the browser picks at 1440, so the clone stays crisp on 2×
   displays. Aspect ratios are unchanged, so the 16:10 crop is identical.
6. **A scoped eslint override.** `@next/next/no-html-link-for-pages` is disabled
   for `src/components/sites/**` because the ported stylesheet targets bare `a`
   and most linked routes don't exist in this single-page clone. `next/link` would
   render an identical `<a>`, so this is a lint-cleanliness decision, not a
   behavioural one.

---

## Tooling notes

- **CSS coverage is asserted, not assumed.** `scripts/tmp-extract-css.mjs` ends
  with a check that every class/ID used by any captured page fragment resolves
  to a rule in `upkeep.css` if — and only if — the source has one. It currently
  reports **0 missing**. This caught a real gap: an earlier filter revision
  silently dropped every `#a11y-menu-button` / `#a11y-menu-heading` rule, which
  would have shipped an unstyled accessibility widget.
- **`tmp-*.mjs` scripts are scratch tooling** and are not part of the clone.
  The durable scripts are:
  | Script | Purpose |
  | --- | --- |
  | `inspect-upkeepmedspa-com-9d00bd1f-root-8a5edab2.mjs` | screenshots, per-section HTML, asset inventory |
  | `styles-upkeepmedspa-com-9d00bd1f-root-8a5edab2.mjs` | computed styles at 1440/768/390 |
  | `extract-upkeepmedspa-com-9d00bd1f-root-8a5edab2.mjs` | states, hover diffs, SVGs, text content |
  | `capture-overlays.mjs` | rendered markup of the three JS-injected overlays |
  | `gen-dom-outlines.mjs` | DOM outlines parsed with a real browser |
  | `gen-specs.mjs`, `gen-specs-overlays.mjs` | component spec files |
  | `download-assets-upkeepmedspa-com-9d00bd1f-root-8a5edab2.mjs` | images + fonts |
  | `qa-clone-upkeepmedspa.mjs` | clone screenshots + layout assertions |
  | `qa-behaviour-upkeepmedspa.mjs` | **54 behavioural assertions** |
- **Re-running the CSS extractor overwrites `upkeep.css`.** It is generated, not
  hand-edited; the generators are the source of truth.
- `scripts/tmp-extract-css.mjs` should be renamed to something durable
  (`build-upkeep-css.mjs`) if this clone is maintained further.
