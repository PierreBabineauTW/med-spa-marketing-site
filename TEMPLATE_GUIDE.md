# Template guide

A production-ready marketing site for an aesthetics / med-spa business, built
with Next.js 16 (App Router), React 19, TypeScript strict and Tailwind v4.

The visual design — palette, the Cormorant Garamond + Switzer type pairing, the
editorial photography, the section rhythm, the card language — was ported from a
hand-written static site and is treated as **fixed**. Everything that identifies
a *business* lives in two config files.

---

## 1. Configure the business

Two files. Nothing else should need editing to rebrand.

### `src/config/site.ts` — identity

| Field | What it drives |
| --- | --- |
| `name` | Metadata, logo alt, copyright, JSON-LD |
| `logo` | Nav and footer wordmark. Set `src: ""` to fall back to the name in the display serif |
| `tagline` | Footer line |
| `contact.phone` / `phoneHref` / `email` / `emailHref` | Every `tel:`/`mailto:` link, the a11y statement, the contact page |
| `contact.locationsSummary` | Line above the booking CTA |
| `ownership` | Appended to the copyright. **`null` by default** — see §7 |
| `socials[]` | Footer social icons |
| `review` | Review-platform credit under the testimonial carousel |
| `bookingUrl` | Every "Book Now" button |
| `legal.*` | Copyright line, accessibility statement |
| `routes.*` | Internal paths used by the footer, nav and overlays |
| `seo.*` | Title, description, site URL, theme colour |
| `storageKeys` | `localStorage` names for the consent cookie and accessibility prefs |

The copyright year and the accessibility statement are **derived** from the
fields above, so changing the phone or email updates every place that shows it.

### `src/config/content.ts` — content

| Field | Notes |
| --- | --- |
| `services[]` | `slug`, `name`, `tagline`, `description`, `image`, `whatToExpect[]`, `faq[]`, `pricing[]`, `sample` |
| `studios[]` | `id` (used as the `/locations#id` anchor), name, address, phone, hours, `mapUrl`, image, region |
| `regions[]` | Region tabs on the locations page |
| `gallery[]` + `galleryCategories` | Gallery grid and its filters |
| `posts[]` | `body` blocks are `p` / `h3` / `ul`; `sample: true` shows a placeholder notice |
| `legal.*` | Privacy, cancellation, safety and accessibility copy |
| `foundedYear` | `null` by default |
| `hours` | `null` by default |

### Adding a service

Append to `services[]`. That single edit creates the page, adds it to the
services index, the nav dropdown, the footer, the sitemap, the `Service`
JSON-LD, the 404 page and every "related services" row. There is no second list
to keep in sync.

The `slug` must match the path you want (`/services/<slug>`).

### Adding a studio

Append to `studios[]` with a unique `id`. The locations page, its pills, the
sitemap and the footer deep-links all pick it up automatically. Set `region` to
one of the ids in `regions[]`.

---

## 2. SEO

`src/lib/seo.tsx` is the single source. Every indexable page calls:

```ts
export const metadata = pageMetadata({ title, description, path: "/about" });
```

It handles title templating, canonical URL, OpenGraph, Twitter cards and the
share image. The canonical is derived from `path`, so it cannot drift from the
route.

**Set the site URL in production.** `site.seo.url` drives `metadataBase`, every
canonical, the sitemap and `robots.txt`. Override it with an environment
variable so a deploy needs no code change:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Also generated:

- `src/app/sitemap.ts` — built from config; a new service or post appears
  automatically
- `src/app/robots.ts` — whole site indexable, `/api/` disallowed
- `public/og-image.png` — the share image. Regenerate after changing the brand
  name or description: `node scripts/gen-og-image.mjs`

### Structured data

`JsonLd` emits JSON-LD from the same objects that render the visible copy, so
the two cannot disagree. Available: `organizationSchema`, `serviceSchema`,
`breadcrumbSchema`, `faqSchema`, `articleSchema`, `localBusinessSchema`.

**Only configured values are emitted.** `localBusinessSchema()` returns `null`
unless the studio has a real address *and* phone — it is not forced to produce
output. `articleSchema` deliberately omits `datePublished` and `author`,
because this template does not know them. If you add a field you cannot
substantiate, you are making a claim about a real business; don't.

---

## 3. Forms

`POST /api/contact` is a dependency-free route handler. It is honest by
construction:

| Situation | Response | What the visitor sees |
| --- | --- | --- |
| Provider accepted it | `200 { ok: true }` | Confirmation |
| **No provider configured** | `503 { ok: false, code: "not_configured" }` | "This form is not connected to a mail provider yet." |
| Provider reachable but rejected / timed out | `502 { ok: false, code: "upstream_error" }` | "We could not send your message just now." |
| Invalid input | `400 { ok: false, error }` | The specific field problem, via `role="alert"` |
| Honeypot filled | `200 { ok: true }` | Nothing is forwarded |

The client component (`ContactForm.tsx`) shows a success state only on
`200 { ok: true }`. **It never claims a message was sent when nothing was.**

### Connecting a provider

```
CONTACT_WEBHOOK_URL=https://your-form-backend.example/endpoint
```

Any HTTPS endpoint accepting a JSON POST works. The validated payload is
`{ name, email, phone?, message, submittedAt, source }`. Treat the value as a
secret — webhook URLs usually carry a token in the path — and never point it at
a placeholder, or the form will report a failure on every submission.

**Add rate limiting at the edge.** There is no in-process limiter, because an
in-memory one does not survive serverless scale-out or more than one instance.
Use the platform's WAF (Vercel WAF, Cloudflare) rather than trusting the app.

---

## 4. Design system

**`upkeep.css` is generated. Never hand-edit it.** Regenerate with:

```
node scripts/build-upkeep-css.mjs
```

It is produced from two files captured verbatim from the reference site and
kept in `docs/research/…/source/`. The script filters ~180KB of rules down to
the ~510 this site actually uses, and ends with a **coverage assertion** that
fails the build if a selector the markup uses has no rule. That assertion exists
because an earlier revision silently dropped every `#a11y-menu-*` rule and
shipped an unstyled accessibility widget.

`polish.css` is the hand-written correction layer — five targeted fixes, each
documented in place. Every rule exists to fix a specific measured defect; none
changes the design language, the palette or the type scale. Touch-target rules
are scoped to `@media (pointer: coarse)` so mouse rendering is unchanged.

Tokens that would change for a different brand: the `:root` block in
`src/app/globals.css` and in the generated `upkeep.css`.

### Adding a page

1. Create `src/app/<route>/page.tsx`.
2. Render **only** `<main id="main-content">…</main>`. The root layout already
   renders the skip link, nav, footer and the three overlays.
3. Use `PageHero` (renders the `h1`) and `SectionHeading` from
   `components/sites/…/shared/`.
4. Call `pageMetadata(...)` and add a breadcrumb plus an onward internal link.
5. Use only class names that already exist in `upkeep.css`. Do not add a CSS
   file, and do not reach for Tailwind colour/spacing/text utilities — the
   ported sheet is imported unlayered and wins the cascade anyway.
6. Add the route to `sitemap.ts` if it should be indexed.
7. Link to it from the nav, the footer or a relevant page so it is not an orphan.

`docs/research/…/PHASE2_BRIEF.md` is the full contract for writing pages in
this design system.

---

## 5. Commands

```bash
npm install
npm run dev          # dev server
npm run build        # production build (output: standalone)
npm start            # production server — copies static assets, then boots
npm run lint
npm run typecheck
npm run check        # lint + typecheck + build
```

`output: "standalone"` is set, so `next start` is **not** the right runner.
`npm start` calls `scripts/start-standalone.mjs`, which copies `.next/static`
and `public/` into `.next/standalone/` (the build leaves them in the original
places) and then runs `.next/standalone/server.js`. It honours `PORT` and
`HOSTNAME`.

`scripts/with-server.mjs` does the same copy step, which is why every QA script
is run through it.

### Maintenance scripts

```bash
npm run build:css             # regenerate the generated design system
npm run build:og              # regenerate the share image
npm run audit:security        # no server needed
npm run audit:links           # no server needed
npm run audit:descriptions    # no server needed
npm run audit:inline-styles   # no server needed
```

### Tests

There is no test runner. QA is a set of Playwright scripts run against the
real production build:

```bash
node scripts/with-server.mjs scripts/qa-crawl.mjs           # every route: links, metadata, schema, placeholders
node scripts/with-server.mjs scripts/qa-responsive.mjs      # 26 pages x 8 viewports
node scripts/with-server.mjs scripts/qa-headers.mjs         # security headers, sitemap, robots, OG image
node scripts/with-server.mjs scripts/qa-visual-baseline.mjs  # approved desktop look has not changed
node scripts/with-server.mjs scripts/qa-behaviour-upkeepmedspa.mjs
node scripts/with-server.mjs scripts/qa-mobile-menu.mjs
node scripts/with-server.mjs scripts/qa-touch-targets.mjs
node scripts/with-server.mjs scripts/qa-risks.mjs           # a11y modes, focus, perf

node scripts/audit-security.mjs                            # no server needed
node scripts/audit-links.mjs                               # no server needed
node scripts/audit-descriptions.mjs                        # no server needed
node scripts/audit-inline-styles.mjs                       # no server needed
node scripts/lint-report.mjs                               # lint, with filenames
node scripts/css-var.mjs --text-xs                         # look up a design token
```

Run a build first; the suites test the built output, not the dev server.

### `qa-visual-baseline.mjs` — the Phase-1 guard

Compares 33 computed style properties of every above-the-fold element on the
home page at 1440×900 and 1280×800 against
`docs/research/…/PHASE2_VISUAL_BASELINE.json`, which was recorded from the
approved pre-Phase-2 commit. Any unlisted change fails.

It currently reports **one intended difference**, allowlisted with its reason:
the footer copyright box is narrower because the ownership claim was removed.

**Compare like with like.** The baseline was recorded from a `--webpack` build
(needed because a worktree's `node_modules` junction is outside Turbopack's
project root). A Turbopack build serialises the same fonts differently — the
`"Cormorant Garamond Fallback"` metric-override face appears in one and not the
other — which produces ~3000 phantom diffs. Build both sides the same way, or
re-record the baseline with `--record` on the current toolchain.

To extend the check to more pages, add them to `PAGES` in that script and
re-record. Keep the `EXPECTED` allowlist short: a growing list means the
approved design is quietly moving.

---

## 6. Optional integrations

None are configured. Each is a deliberate, documented gap rather than a
half-wired one.

- **Analytics** — no analytics, tracking pixel or marketing tag ships, and no
  identifier from the site this was cloned from was carried over. If you add
  one, configure it for your own business and update the cookie consent notice
  (`ConsentBanner.tsx`) to match what you actually set.
- **Maps** — `studios[].mapUrl` is `null`; the "Directions" button is omitted
  rather than pointing somewhere false. Set it to a real listing URL.
- **Booking** — `site.bookingUrl` currently points at a placeholder. Replace it.
- **Financing** — `/financing` explains the process generically and names no
  lender, rate or term. Add the real partner before launch.
- **Events and specials** — both render honest empty states. Add `events` /
  `offers` arrays to `content.ts` and map them in the page.

---

## 7. Things not to invent

The template ships placeholders, never invented facts. Anything unknown is
`null` in config and the UI **omits that row** — it never renders `TBD`,
`Coming soon` or a fabricated value.

Specifically, these are `null` on purpose:

- `ownership` — the footer claims nothing about who owns the business
- `foundedYear` — the tagline makes no "since YEAR" claim
- `hours`, `studios[].phone`, `studios[].mapUrl` — omitted until you know them
- `posts[].sample: true` — sample articles say so, on the page
- legal copy — generic, naming no entity, regulator or jurisdiction, with a
  visible "replace before launch" line

Preserve that discipline when you customise. A fabricated opening hour or
ownership claim on a real business site is a liability.

---

## 8. Security

Set in `next.config.ts` and verified by `scripts/qa-headers.mjs`:

`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` ·
`Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()` ·
`X-DNS-Prefetch-Control: on` · `X-Powered-By` omitted

### Content-Security-Policy — recommended, deliberately not set

A correct strict CSP needs deployment knowledge this repository does not have:

- the App Router emits inline bootstrap scripts, so `script-src` needs either
  `'unsafe-inline'` (defeats the purpose) or a per-request nonce, which requires
  `middleware.ts` and forces dynamic rendering;
- 20 inline `style` attributes remain in 8 component files (mostly the ported
  testimonial carousel, which sets colour and visibility imperatively), so
  `style-src` needs `'unsafe-inline'. Count them with
  `node scripts/audit-inline-styles.mjs` — the number moves as the code does;
- the contact form's destination is operator-supplied, so `connect-src` cannot
  be known at build time.

Guessing would either break the site or ship a policy with no teeth. Once your
real integrations are known, a reasonable starting point is:

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'none';
  form-action 'self';
  img-src 'self' data: blob:;
  font-src 'self';
  style-src 'self' 'unsafe-inline';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  connect-src 'self' <your-form-endpoint>;
  upgrade-insecure-requests
```

Start in **report-only**, read the violations, then drop the directives you did
not need and switch to enforcing mode. If you remove the inline styles, drop
`'unsafe-inline'` from `style-src` too.

### Other things worth doing at launch

- Rate-limit `POST /api/contact` at the edge (see §3).
- Keep `.env.local` out of git — it already is; commit only `.env.example`.
- Set `NEXT_PUBLIC_SITE_URL` to the real origin.

---

## 9. Accessibility

Shipped and verified: skip link, one `h1` per page, real headings and labels,
visible focus rings on every focusable element, `prefers-reduced-motion`
honoured plus a user-controlled motion toggle, an in-page large-text toggle, a
keyboard-operable lightbox and FAQ disclosures, 24–44px touch targets on coarse
pointers, no text under 10px at any tested viewport, and a mobile menu that
opens, scrolls, and closes on both Escape and its close button.

`/accessibility` states all of this to visitors. Update it if you change the
implementation — a statement that is no longer true is worse than none.

---

## 10. Provenance

The design was reverse-engineered from a public site; the captures, extracted
DOM, design tokens and behavioural notes are kept in
`docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/` as the record of how
each decision was made. That directory is excluded from ESLint and from
shipped code. `KNOWN_GAPS.md` lists what was deliberately not cloned.
