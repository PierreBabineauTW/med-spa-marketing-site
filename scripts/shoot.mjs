// Captures full-page screenshots at a given viewport for visual review.
// Usage: node scripts/shoot.mjs <name> <width> <height>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [, , name, wArg, hArg] = process.argv;
const width = Number(wArg), height = Number(hArg);
const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/polish";
mkdirSync(OUT, { recursive: true });

// settle scroll-driven reveals; keep the real fixed chrome visible
const NEUTRALIZE = `.fade-in, .reveal-up { opacity: 1 !important; clip-path: none !important; transform: none !important; animation: none !important; }`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  isMobile: width < 700,
  hasTouch: width < 700,
});
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
await page.waitForTimeout(500);
await page.evaluate(async () => {
  await Promise.all([...document.querySelectorAll("img")].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  if (document.fonts) await document.fonts.ready;
});
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.addStyleTag({ content: NEUTRALIZE });
await page.waitForTimeout(400);

// dismiss the cookie bar so it doesn't sit over the footer in the capture
await page.evaluate(() => {
  localStorage.setItem("upkeep-consent-v1", "accepted");
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
const h2 = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h2; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.addStyleTag({ content: NEUTRALIZE });
await page.waitForTimeout(400);

await page.screenshot({ path: join(OUT, `full-${name}-${width}.png`), fullPage: true });

// a few section crops at the top of the page for detail review
const crops = [
  ["top", 0, Math.min(height * 2, 1800)],
  ["services", null, null],
  ["footer", null, null],
];
const svcY = await page.evaluate(() => { const e = document.querySelector("section#services"); const r = e.getBoundingClientRect(); return Math.round(r.top + window.scrollY); });
const fY = await page.evaluate(() => { const e = document.querySelector("footer.footer"); const r = e.getBoundingClientRect(); return Math.round(r.top + window.scrollY); });
const fH = await page.evaluate(() => Math.round(document.querySelector("footer.footer").getBoundingClientRect().height));
const svcH = await page.evaluate(() => Math.round(document.querySelector("section#services").getBoundingClientRect().height));
crops[1][1] = svcY; crops[1][2] = Math.min(svcH, 3000);
crops[2][1] = fY; crops[2][2] = Math.min(fH, 3000);
for (const [key, y, hh] of crops) {
  if (y === null) continue;
  await page.screenshot({ path: join(OUT, `${key}-${name}-${width}.png`), fullPage: true, clip: { x: 0, y: Math.max(0, y), width, height: hh } });
}
console.log(`${name} ${width}x${height} -> ${OUT} (docH=${h2})`);
await browser.close();
