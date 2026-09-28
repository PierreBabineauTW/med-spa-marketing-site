// Phase-1 preservation check.
//
// The approved design must be byte-identical on desktop after Phase 2. This
// measures the computed style of every element the home page renders and
// compares it against a recorded baseline, so a Phase 2 change to the approved
// visual shows up as a diff instead of going unnoticed.
//
//   node scripts/qa-visual-baseline.mjs --record   # write docs/.../PHASE2_VISUAL_BASELINE.json
//   node scripts/qa-visual-baseline.mjs            # compare against it
//
// Run with: node scripts/with-server.mjs scripts/qa-visual-baseline.mjs [--record]
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";
const BASELINE_FILE = "docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/PHASE2_VISUAL_BASELINE.json";
const RECORD = process.argv.includes("--record");

/**
 * Only properties that define the approved look. Layout, colour and type are
 * the design; things like z-index of an overlay are behaviour.
 */
const PROPS = [
  "display", "position", "width", "height", "maxWidth", "minHeight",
  "padding", "margin", "borderRadius", "borderTopWidth", "borderBottomWidth",
  "backgroundColor", "backgroundImage", "color", "opacity",
  "fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight",
  "letterSpacing", "textTransform", "textAlign", "boxShadow", "gap",
  "gridTemplateColumns", "flexDirection", "alignItems", "justifyContent",
  "objectFit", "aspectRatio", "overflowY", "zIndex",
];

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1280", width: 1280, height: 800 },
];

/** Desktop only: touch-target rules are scoped to (pointer: coarse) by design. */
const PAGES = ["/", "/services", "/services/neurotoxins", "/locations", "/gallery", "/about", "/contact"];

const browser = await chromium.launch();
const snapshot = {};

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("upkeep-consent-v1", "accepted");
      localStorage.setItem("upkeep_signup_v1", "1"); // dismiss the newsletter popup
    } catch {}
  });

  for (const route of PAGES) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);

    // A route that did not exist when the baseline was recorded renders Next's
    // error page. There is nothing to preserve there — Phase 2 added it — so it
    // is recorded as absent instead of snapshotting a 404.
    const isErrorPage = await page.evaluate(() => !!document.querySelector(".next-error-h1"));
    if (isErrorPage) {
      snapshot[`${vp.name} ${route}`] = { __absentAtBaseline: true };
      await page.close();
      continue;
    }

    const styles = await page.evaluate((props) => {
      const out = {};
      // A stable path keeps the key independent of class-name churn elsewhere.
      const pathOf = (el) => {
        const parts = [];
        let cur = el;
        while (cur && cur.nodeType === 1 && cur !== document.body) {
          const parent = cur.parentElement;
          if (!parent) break;
          const idx = Array.prototype.indexOf.call(parent.children, cur);
          let key = cur.tagName.toLowerCase();
          if (cur.id) key += `#${cur.id}`;
          else {
            const cls = String(cur.className || "").trim().split(/\s+/).filter(Boolean)[0];
            if (cls) key += `.${cls}`;
          }
          parts.unshift(`${key}[${idx}]`);
          cur = parent;
        }
        return parts.join(">");
      };
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.bottom < 0) continue; // above-the-fold only: keeps it stable and fast
        const s = getComputedStyle(el);
        const o = {};
        for (const p of props) o[p] = s[p];
        // images: record intrinsic box so a different crop is caught
        if (el.tagName === "IMG") {
          o.src = (el.getAttribute("src") || "").split("/").pop();
          o.naturalW = el.naturalWidth;
          o.naturalH = el.naturalHeight;
        }
        out[pathOf(el)] = o;
      }
      return out;
    }, PROPS);

    snapshot[`${vp.name} ${route}`] = styles;
    await page.close();
  }
  await ctx.close();
}
await browser.close();

// ---------------------------------------------------------------------------

const totalElements = Object.values(snapshot).reduce((n, s) => n + Object.keys(s).length, 0);

if (RECORD) {
  writeFileSync(
    BASELINE_FILE,
    JSON.stringify(
      {
        props: PROPS,
        recordedFrom: process.env.BASELINE_REF || "(unspecified git ref)",
        note: "Desktop only: the coarse-pointer touch-target rules are intentionally mobile-only, so they cannot appear here. Routes that 404'd when this was recorded are marked __absentAtBaseline and are skipped when comparing.",
        snapshot,
      },
      null,
      1
    )
  );
  const present = Object.entries(snapshot).filter(([, v]) => !v.__absentAtBaseline).length;
  const absent = Object.keys(snapshot).length - present;
  console.log(
    `recorded baseline from ${process.env.BASELINE_REF || "(unspecified ref)"}: ` +
      `${present} page/viewport combinations, ${totalElements} elements -> ${BASELINE_FILE}` +
      (absent ? `\n  ${absent} route(s) did not exist at that ref and are marked absent` : "")
  );
  process.exit(0);
}

if (!existsSync(BASELINE_FILE)) {
  console.error(`No baseline at ${BASELINE_FILE}. Record one with --record.`);
  process.exit(1);
}

/**
 * Intended differences from the approved baseline, each with its reason.
 * Anything not listed here is a regression and fails the check.
 *
 * Keep this list short. Every entry is a decision that was made deliberately;
 * a growing list means the "approved" design is quietly moving.
 */
const EXPECTED = [
  {
    match: /footer\.footer\[\d+\]>div\.container\[0\]>div\.footer__bottom\[1\]>p\[0\]\s+width:/,
    why:
      "The footer copyright no longer appends the ownership claim. `site.ownership` " +
      "is null because a template must not assert who owns a business it knows nothing " +
      "about; the text is shorter, so the paragraph box is narrower. No design property " +
      "changes — only the length of one string.",
  },
];

const isExpected = (line) => EXPECTED.find((e) => e.match.test(line));

const baseline = JSON.parse(readFileSync(BASELINE_FILE, "utf8"));
const diffs = [];
const skipped = [];
const explained = [];
const unexplained = [];

for (const [key, current] of Object.entries(snapshot)) {
  const base = baseline.snapshot[key];
  if (!base) { diffs.push(`${key}: not in the baseline`); continue; }
  if (base.__absentAtBaseline) { skipped.push(key.replace(/^desktop-\d+ /, "")); continue; }

  // removed elements
  for (const sel of Object.keys(base)) {
    if (!(sel in current)) diffs.push(`${key}  removed element ${sel}`);
  }
  // added elements
  for (const sel of Object.keys(current)) {
    if (!(sel in base)) { diffs.push(`${key}  ADDED element ${sel}`); continue; }
    for (const p of PROPS) {
      const b = String(base[sel][p]);
      const c = String(current[sel][p]);
      // sub-pixel noise is not a design change
      if (b === c) continue;
      const nb = parseFloat(b), nc = parseFloat(c);
      if (!Number.isNaN(nb) && !Number.isNaN(nc) && Math.abs(nb - nc) < 0.6) continue;
      diffs.push(`${key}  ${sel}  ${p}: ${b} -> ${c}`);
    }
    if (base[sel].src && base[sel].src !== current[sel].src) {
      diffs.push(`${key}  ${sel}  img src: ${base[sel].src} -> ${current[sel].src}`);
    }
  }
}

const comparedKeys = Object.keys(snapshot).length - skipped.length;
for (const d of diffs) {
  const e = isExpected(d);
  if (e) explained.push({ diff: d, why: e.why });
  else unexplained.push(d);
}

console.log(`baseline ref: ${baseline.recordedFrom || "(unspecified)"}`);
console.log(`compared ${comparedKeys} page/viewport combination(s), ${totalElements} elements, ${PROPS.length} properties each`);
if (skipped.length) {
  console.log(`skipped ${skipped.length} (did not exist in the baseline, so added by this pass): ${[...new Set(skipped)].join(", ")}`);
}
if (explained.length) {
  console.log(`\nINTENDED DIFFERENCES (${explained.length}), each with a recorded reason:`);
  for (const e of explained) {
    console.log(`  ${e.diff}`);
    console.log(`      reason: ${e.why}`);
  }
}
if (unexplained.length) {
  console.log(`\nUNEXPLAINED DIFFS (${unexplained.length}) — the approved desktop look changed:`);
  for (const d of unexplained.slice(0, 60)) console.log("  " + d);
  if (unexplained.length > 60) console.log(`  ... and ${unexplained.length - 60} more`);
  process.exitCode = 1;
} else {
  console.log(
    `\nVISUAL BASELINE: PASS — the approved desktop rendering is unchanged` +
      (explained.length ? ` (${explained.length} intended difference(s), all explained above)` : "")
  );
}
