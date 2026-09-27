// Boots the built app and screenshots the clone at 1440 / 768 / 390 so it can be
// diffed against docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/.
// Usage: node scripts/qa-clone-upkeepmedspa.mjs [--sections]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/clone";
mkdirSync(OUT, { recursive: true });

// Settle the scroll-driven reveals and hide JS chrome, mirroring how the master
// reference shots were taken.
const NEUTRALIZE = `
  .fade-in, .reveal-up { opacity: 1 !important; clip-path: none !important; transform: none !important; animation: none !important; }
  .parallax-bg { transform: none !important; animation: none !important; }
`;

const SECTIONS = [
  ["01-hero", "section.hero"],
  ["02-intro", "main > section:nth-of-type(2)"],
  ["03-services", "main > section:nth-of-type(3)"],
  ["04-testimonials", "main > section:nth-of-type(4)"],
  ["05-locations", "main > section:nth-of-type(5)"],
  ["06-press", "main > section:nth-of-type(6)"],
  ["07-journal", "main > section:nth-of-type(7)"],
  ["08-booking-cta", "main > section:nth-of-type(8)"],
  ["09-footer", "footer.footer"],
];

const browser = await chromium.launch();
for (const [label, width, height] of [["desktop", 1440, 900], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);
  // warm lazy images
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(70); }
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    await Promise.all([...document.querySelectorAll("img")].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    if (document.fonts) await document.fonts.ready;
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.addStyleTag({ content: NEUTRALIZE });
  await page.waitForTimeout(500);

  const unloaded = await page.evaluate(() => [...document.querySelectorAll("img")].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")));
  const scrollH = await page.evaluate(() => document.documentElement.scrollHeight);
  const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  await page.screenshot({ path: join(OUT, `master-${label}-${width}.png`), fullPage: true });

  if (label === "desktop") {
    for (const [key, sel] of SECTIONS) {
      const loc = await page.evaluate((q) => {
        const el = document.querySelector(q);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { y: r.top + window.scrollY, h: r.height };
      }, sel);
      if (!loc) { console.log(`  sec-${key}: NOT FOUND (${sel})`); continue; }
      const top = Math.max(0, Math.floor(loc.y - 24));
      const height = Math.min(Math.ceil(loc.h) + 48, 16000);
      await page.screenshot({ path: join(OUT, `sec-${key}.png`), fullPage: true, clip: { x: 0, y: top, width, height } });
      console.log(`  sec-${key}: y=${Math.round(loc.y)} h=${Math.round(loc.h)}`);
    }
  }
  console.log(`${label} ${width}: scrollHeight=${Math.round(scrollH)} horizontalOverflow=${hScroll} unloadedImgs=${unloaded.length} consoleErrors=${errors.length}`);
  if (unloaded.length) console.log("   unloaded:", unloaded.slice(0, 6));
  for (const e of errors.slice(0, 6)) console.log("   ERR:", e.slice(0, 200));
  await ctx.close();
}
await browser.close();
console.log("done");
