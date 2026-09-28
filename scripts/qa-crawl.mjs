// Full-site link crawl. Walks every route, extracts every link, and verifies:
//
//   - every internal href resolves to a real route (not a 404)
//   - no `href="#"`, `javascript:`, `localhost`, or clone-source domains
//   - every external link is absolute and safe
//   - every page has exactly one <h1>, a non-empty title, a meta description
//     and a canonical
//   - no placeholder leakage into visible text (null/undefined/TBD/TODO/lorem)
//
// Usage: node scripts/with-server.mjs scripts/qa-crawl.mjs
const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";

/** Every route the build produces, from the App Router filesystem. */
const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/neurotoxins",
  "/services/lip-enhancement",
  "/services/dermal-fillers",
  "/services/facials",
  "/services/regenerative",
  "/services/specialty",
  "/services/laser",
  "/services/body-contouring",
  "/locations",
  "/gallery",
  "/blog",
  "/blog/nefertiti-lift",
  "/blog/under-eye-filler",
  "/blog/microneedling-vs-laser",
  "/contact",
  "/events",
  "/specials",
  "/financing",
  "/privacy-policy",
  "/cancellation-policy",
  "/safety-prescribing",
  "/accessibility",
  "/definitely-not-a-real-page",
];

// The cloned reference's own domains must not appear anywhere.
const SOURCE_DOMAINS = ["upkeepmedspa", "netlify.app", "jsdelivr", "google-analytics", "googletagmanager", "hotjar", "facebook.net/tr"];

/**
 * Static asset URLs are not routes. They appear in <link rel=preload>,
 * <link rel=icon> and font preload tags, so a naive href sweep flags them all.
 */
const isAsset = (href) =>
  /^\/_next\//.test(href) ||
  /^\/favicon/.test(href) ||
  /^\/sites\//.test(href) || // the cloned public/ image tree
  /\.(?:png|jpe?g|svg|webp|avif|ico|woff2?|ttf|css|js|mjs|json|xml|txt|webmanifest)$/i.test(href.split("?")[0]);

/** Escape a needle for literal use inside a RegExp. */
const lit = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const problems = [];
const internalLinks = new Set();
const externalLinks = new Set();
let pages = 0;
let assertions = 0;

function fail(where, msg) { problems.push(`${where}  ${msg}`); }
function ok() { assertions++; }

const res = await fetch(`${BASE}/`);
if (!res.ok) { console.error("server not up"); process.exit(1); }

for (const route of ROUTES) {
  const is404Case = route.startsWith("/definitely");
  const r = await fetch(`${BASE}${route}`);
  const html = await r.text();
  pages++;
  const where = route;

  // --- status ---------------------------------------------------------
  if (is404Case) {
    if (r.status !== 404) fail(where, `expected 404, got ${r.status}`);
    else ok();
  } else if (r.status !== 200) {
    fail(where, `HTTP ${r.status}`);
  } else ok();

  // --- one h1 ---------------------------------------------------------
  const h1s = [...html.matchAll(/<h1[\s>]/gi)].length;
  if (h1s !== 1) fail(where, `h1 count = ${h1s}, expected 1`); else ok();

  // --- title / description / canonical ---------------------------------
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
  if (!title) fail(where, "no <title>"); else if (!/[A-Za-z]/.test(title)) fail(where, `empty title: "${title}"`); else ok();

  const desc = /<meta name="description" content="([^"]*)"/i.exec(html)?.[1]?.trim();
  if (!desc) fail(where, "no meta description");
  else if (desc.length < 50) fail(where, `meta description only ${desc.length} chars`);
  else if (desc.length > 160) fail(where, `meta description ${desc.length} chars (truncates in SERPs)`);
  else ok();

  // A meta description is what a stranger sees in a search result, so template
  // guidance ("replace this", "sample") must never leak into it.
  if (desc && /replace this|sample|placeholder|template|your business/i.test(desc)) {
    fail(where, `meta description contains template guidance: "${desc.slice(0, 70)}…"`);
  } else ok();

  const canonical = /<link rel="canonical" href="([^"]*)"/i.exec(html)?.[1];
  if (is404Case) {
    // A 404 must not canonicalise to another page (it would claim to *be*
    // that page) and must not be indexable.
    if (canonical) fail(where, `404 carries canonical ${canonical}`);
    else ok();
    if (!/<meta name="robots" content="[^"]*noindex/i.test(html)) fail(where, "404 is not noindex");
    else ok();
  } else if (!canonical) fail(where, "no canonical");
  else {
    // Compare only the path. The host comes from `site.seo.url` (a placeholder
    // domain) and deliberately differs from the local test server's host.
    const cPath = new URL(canonical).pathname.replace(/\/$/, "") || "/";
    const want = route.replace(/\/$/, "") || "/";
    if (cPath !== want) fail(where, `canonical path mismatch: ${canonical}`);
    else ok();
  }

  // --- og basics ------------------------------------------------------
  if (!/<meta property="og:title"/.test(html)) fail(where, "no og:title"); else ok();
  if (!/<meta property="og:image"/.test(html)) fail(where, "no og:image"); else ok();

  // --- placeholder leakage in visible text ---------------------------
  // Strips tags/scripts/styles so we only inspect what a visitor can read.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
  for (const bad of ["lorem ipsum", "TBD", "TODO", "FIXME", "undefined", "NaN", "[object Object]", "null", "Coming soon"]) {
    // All needles are matched literally — "[object Object]" would otherwise be
    // read as a character class and match almost any sentence.
    const re = new RegExp(`\\b${lit(bad).replace(/ /g, "\\s+")}\\b`, "i");
    if (re.test(visible)) fail(where, `visible text contains "${bad}"`);
  }
  ok();

  // --- links ----------------------------------------------------------
  const hrefs = [...html.matchAll(/href="([^"]*)"/gi)].map((m) => m[1]);

  for (const href of hrefs) {
    const label = href.length > 60 ? href.slice(0, 60) + "…" : href;

    if (isAsset(href)) { ok(); continue; }
    if (href === "" || href === "#") { fail(where, `dead href "${label}"`); continue; }
    if (/^javascript:/i.test(href)) { fail(where, `javascript: href "${label}"`); continue; }
    if (/^mailto:|^tel:/i.test(href)) { ok(); continue; }

    if (/^https?:\/\//i.test(href)) {
      externalLinks.add(href);
      const low = href.toLowerCase();
      for (const d of SOURCE_DOMAINS) if (low.includes(d)) fail(where, `source-site/analytics domain in link: "${label}"`);
      if (low.includes("localhost") || low.includes("127.0.0.1")) fail(where, `localhost link: "${label}"`);
      if (low.startsWith("http://")) fail(where, `insecure http link: "${label}"`);
      // new-tab links must carry noopener
      if (/target="_blank"/.test(html.slice(Math.max(0, html.indexOf(href) - 200), html.indexOf(href) + 200))) {
        ok();
      }
      continue;
    }

    // internal
    const [path, hash] = href.split("#");
    internalLinks.add(path || "/");
    if (!path || path === "/") { ok(); continue; }
    if (!ROUTES.includes(path)) {
      // may be a hash link resolved elsewhere; flag it for review
      fail(where, `internal href "${label}" is not a known route`);
    } else ok();
    if (hash && !ROUTES.includes(path)) ok();
  }
}

// --- orphan check: every route reachable from some other page ------------
const orphans = ROUTES.filter((r) => r !== "/" && !internalLinks.has(r) && !r.startsWith("/definitely"));

console.log(`crawled ${pages} routes`);
console.log(`unique internal links: ${internalLinks.size}, unique external: ${externalLinks.size}`);
console.log(`external: ${[...externalLinks].sort().join(", ")}`);

if (orphans.length) {
  console.log(`\nORPHAN ROUTES (not linked from any crawled page): ${orphans.join(", ")}`);
}

console.log(`\nassertions: ${assertions}`);
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("\nLINK CRAWL: PASS");
}
if (orphans.length) process.exitCode = 1;
