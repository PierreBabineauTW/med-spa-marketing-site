# SignupPopup Specification

## Overview
- **Target file:** `src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SignupPopup.tsx`
- **Screenshot:** `docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/overlay-signup-popup-open.png`
- **Interaction model:** **time-driven** (auto-opens 12s after load) **and click-driven** (close triggers, form submit); Escape-driven while open
- **Export:** named `SignupPopup`, no props — read content from `@/lib/upkeepmedspa-data`.
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
  <div class="signup-popup" id="signupPopup" role="dialog" aria-modal="true" aria-labelledby="signupHeading" aria-hidden="true">
  <div class="signup-popup__backdrop" data-signup-close="">
  </div>
  <div class="signup-popup__card" role="document">
  <button type="button" class="signup-popup__close" data-signup-close="" aria-label="Close">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
  <path d="M6 6l12 12M18 6L6 18">
  </path>
  </svg>
  </button>
  <div class="signup-popup__inner" data-signup-state="form">
  <p class="eyebrow signup-popup__eyebrow">Stay In Bloom</p>
  <h2 id="signupHeading" class="signup-popup__title">Keep Up<br>With Us</h2>
  <p class="signup-popup__lede">New services, seasonal offers, and a little editorial inspiration — straight to your inbox.</p>
  <form class="signup-popup__form" name="signup_form" novalidate="">
  <label class="signup-popup__label" for="signupEmail">
  <span>Email <span aria-hidden="true" class="signup-popup__req">*</span>
  </span>
  <input type="email" id="signupEmail" name="email" autocomplete="email" required="" placeholder="you@example.com">
  </label>
  <label class="signup-popup__label" for="signupPhone">
  <span>Phone <span class="signup-popup__optional">(optional)</span>
  </span>
  <input type="tel" id="signupPhone" name="phone" autocomplete="tel" placeholder="(555) 000-0000">
  </label>
  <button type="submit" class="btn btn--filled signup-popup__submit">Sign Me Up</button>
  <p class="signup-popup__fineprint">By signing up you agree to receive occasional marketing messages. Unsubscribe anytime.</p>
  </form>
  </div>
  <div class="signup-popup__inner signup-popup__inner--success" data-signup-state="success" hidden="">
  <p class="eyebrow signup-popup__eyebrow">You're In</p>
  <h2 class="signup-popup__title">See You<br>Soon</h2>
  <p class="signup-popup__lede">Thanks for joining the list. Keep an eye on your inbox.</p>
  <button type="button" class="btn" data-signup-close="">Close</button>
  </div>
  </div>
  </div>
```

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
### `signupPopup`

**.signup-popup.is-open** — 0×0px, 2 child element(s)

> `Stay In Bloom Keep UpWith Us New services, seasonal offers, and a little editorial inspiration — str`

- `position`: `fixed`
- `zIndex`: `2000`
- `padding`: `16px`
- `paddingTop`: `16px`
- `paddingBottom`: `16px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `transition`: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s`

### `signupCard`

**.signup-popup__card** — 0×0px, 3 child element(s)

> `Stay In Bloom Keep UpWith Us New services, seasonal offers, and a little editorial inspiration — str`

- `display`: `block`
- `position`: `relative`
- `width`: `100%`
- `padding`: `48px`
- `paddingTop`: `48px`
- `paddingBottom`: `48px`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `color`: `rgb(245, 240, 235)`
- `backgroundColor`: `rgb(20, 16, 14)`
- `boxShadow`: `rgba(0, 0, 0, 0.6) 0px 30px 80px 0px`
- `transition`: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`

### `signupClose`

**.signup-popup__close** — 0×0px, 1 child element(s)

- `display`: `flex`
- `position`: `absolute`
- `top`: `16px`
- `right`: `16px`
- `width`: `36px`
- `height`: `36px`
- `justifyContent`: `center`
- `alignItems`: `center`
- `fontFamily`: `Switzer, "Helvetica Neue", sans-serif`
- `fontSize`: `17px`
- `fontWeight`: `400`
- `lineHeight`: `27.2px`
- `textAlign`: `center`
- `color`: `rgb(245, 240, 235)`
- `transition`: `border-color 0.2s, color 0.2s`

## States & Behaviors
### Open/close — the `is-open` class is the whole mechanism
Closed: `position: fixed; inset: 0; z-index: 2000; display: flex; opacity: 0; visibility: hidden`.
`#signupPopup.is-open` sets `opacity: 1; visibility: visible`, and the sheet owns the transition.
Your state should only toggle that class (plus `aria-hidden`).

### The target's script, reproduced
```js
function openPopup() {
  lastFocus = document.activeElement;
  popup.classList.add('is-open');
  popup.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const f = popup.querySelector('input[type="email"]'); if (f) f.focus(); }, 250);
}
function closePopup() {
  popup.classList.remove('is-open');
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  try { localStorage.setItem(STORAGE_KEY, 'dismissed:' + Date.now()); } catch(e) {}
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
popup.querySelectorAll('[data-signup-close]').forEach(el => el.addEventListener('click', closePopup));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup(); });
if (!stored) { setTimeout(openPopup, 12000); }
document.querySelectorAll('[data-open-signup]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); openPopup(); });
});
```
Required:
- **Hidden on load**; auto-opens after `signupPopup.autoOpenDelayMs` (**12000 ms**) only when
  `localStorage[signupPopup.storageKey]` is unset. All storage access in `try/catch`.
- Opening adds `is-open`, sets `aria-hidden="false"`, **locks body scroll**, and focuses the email
  input after **250 ms**.
- Closing removes `is-open`, sets `aria-hidden="true"`, **restores body scroll**, writes
  `"dismissed:" + Date.now()`, and **restores focus** to the previously focused element.
- Close triggers: the backdrop, the close button, and the success state's Close button — all carry
  `data-signup-close` — plus **Escape**, bound only while open. A single mount-time
  `querySelectorAll('[data-signup-close]')` pass attaching native listeners reproduces the source
  exactly and sidesteps `jsx-a11y` complaints about a click handler on the non-interactive
  backdrop `<div>`.
- **Manual trigger:** wire a delegated `document` click listener for `[data-open-signup]` calling
  `preventDefault()` then open. Nothing on the home page uses the attribute (same as the source),
  but the behaviour must exist.
- **Submit makes no network request.** The target posts to Mailchimp's JSONP endpoint; that backend
  is explicitly out of scope. `preventDefault()`, require a non-empty email, then swap the two
  `[data-signup-state]` blocks — hide `form`, show `success`. The captured markup keeps
  `novalidate` on the form; keep it and check the field yourself (calling the input's native
  `reportValidity()` for the empty case gives the required-field feedback with no new CSS).
- Keep an effect cleanup that releases the scroll lock and cancels the pending focus timer, so
  unmounting while open cannot strand the page.
- The source never resets the form/success view on reopen, so a reopen after a successful submit
  still shows "See You Soon". Preserve that.

### Accessibility notes preserved
`role="dialog"`, `aria-modal="true"`, `aria-labelledby="signupHeading"`, `aria-label="Close"`
on the close button. The source's own quirk — `aria-labelledby` pointing at the form block's `h2`,
which is hidden while the success block shows — is reproduced verbatim rather than "fixed".
## Responsive — measured at all three widths (not estimated)

| element | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `signupCard` | 17px | 15.936px | 15.18px |
| `signupClose` | 17px | 15.936px | 15.18px |

All of the above is driven by the ported sheet's own media queries and fluid `clamp()` type scale.
Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
Render `https://…` links with `target="_blank" rel="noopener noreferrer"`;
internal hrefs as plain `<a>`. Do **not** use `next/link` — the target is a static site with plain
anchors and the ported CSS styles bare `a`. (`@next/next/no-html-link-for-pages` is disabled for
`src/components/sites/**` in `eslint.config.mjs` for exactly this reason.)
## Measured
Card is **460×639px** when open; backdrop is `rgba(10,10,10,0.78)`; the submit button is a
`.btn--filled` (`#d4a090` on `#0a0a0a`, `min-height: 48px`, `width: 100%`).

## Verified behaviour
`scripts/qa-behaviour-upkeepmedspa.mjs`: auto-opens on the timer, `aria-hidden=false`, body scroll
locked, email focused after 250 ms, Escape closes, `aria-hidden=true`, scroll restored,
`upkeep_signup_v1` written as `dismissed:<ts>`, `[data-open-signup]` reopens it, submit swaps to
the success state, and **no Mailchimp request is made** — all passing.