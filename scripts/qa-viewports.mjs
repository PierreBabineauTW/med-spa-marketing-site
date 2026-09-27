// Multi-viewport audit for the polish pass. Looks for REAL defects only:
// horizontal overflow, undersized touch targets, text that overflows its box,
// clipped/absolutely-positioned content, and the fixed-overlay stack.
// Read-only: makes no changes.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const VIEWPORTS = [
  ["iphone-14-pro-max", 430, 932],
  ["iphone-14", 390, 844],
  ["iphone-se", 375, 812],
  ["android-small", 360, 800],
  ["ipad", 768, 1024],
  ["laptop", 1280, 800],
  ["desktop", 1440, 900],
];

const browser = await chromium.launch();
for (const [name, width, height] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = { overflowX: document.documentElement.scrollWidth - vw, wide: [], tiny: [], clipped: [], fonts: [] };

    // 1. elements wider than the viewport
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        out.wide.push({
          sel: el.tagName.toLowerCase() + "." + (el.className && el.className.toString ? el.className.toString().split(" ").filter(Boolean).slice(0, 2).join(".") : ""),
          left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        });
      }
    }

    // 2. interactive targets smaller than 44x44 (WCAG 2.5.5 / touch)
    for (const el of document.querySelectorAll('a[href], button, input, [role="button"], [role="menuitem"]')) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 44 || r.width < 44) {
        out.tiny.push({
          sel: el.tagName.toLowerCase() + "." + (el.className && el.className.toString ? el.className.toString().split(" ").filter(Boolean).slice(0, 2).join(".") : ""),
          text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24),
          w: Math.round(r.width), h: Math.round(r.height),
        });
      }
    }

    // 3. text overflowing its own box (clipped or spilling)
    for (const el of document.querySelectorAll("h1,h2,h3,p,a,span,blockquote,button,li,label")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (cs.overflow === "hidden" && cs.textOverflow !== "ellipsis" && cs.webkitLineClamp === "none") {
        // element deliberately clips — check if the content is taller than the box
        if (el.scrollHeight > el.clientHeight + 2) {
          out.clipped.push({ sel: el.tagName.toLowerCase() + "." + (el.className.toString || "").split(" ").slice(0, 2).join("."), text: (el.textContent||"").trim().slice(0, 30), scrollH: el.scrollHeight, clientH: el.clientHeight });
        }
      }
    }

    // 4. fixed overlay stack
    out.fixed = [...document.querySelectorAll("body *")]
      .filter((el) => getComputedStyle(el).position === "fixed")
      .map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return { sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + "." + (el.className && el.className.toString ? el.className.toString().split(" ").filter(Boolean).slice(0,2).join(".") : ""), z: cs.zIndex, y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width), opacity: cs.opacity };
      });

    // 5. key type sizes
    const g = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).fontSize : null; };
    out.fonts = { h1: g(".heading-hero"), h2: g(".heading-section"), body: g(".body-text"), btn: g(".btn"), eyebrow: g(".eyebrow"), quote: g(".testimonial__quote") };
    out.docH = document.documentElement.scrollHeight;
    return out;
  });

  console.log(`\n########## ${name}  ${width}x${height} ##########`);
  console.log(`  horizontal overflow : ${report.overflowX > 0 ? "*** " + report.overflowX + "px ***" : "none"}`);
  console.log(`  doc height          : ${report.docH}`);
  console.log(`  type                : h1=${report.fonts.h1} h2=${report.fonts.h2} body=${report.fonts.body} btn=${report.fonts.btn} eyebrow=${report.fonts.eyebrow} quote=${report.fonts.quote}`);
  if (report.wide.length) {
    console.log(`  WIDER THAN VIEWPORT (${report.wide.length}):`);
    for (const w of report.wide.slice(0, 8)) console.log(`     ${w.sel}  left=${w.left} right=${w.right} w=${w.w}`);
  }
  const uniqTiny = [...new Map(report.tiny.map((t) => [t.sel + t.w + "x" + t.h, t])).values()];
  if (uniqTiny.length) {
    console.log(`  SMALL TOUCH TARGETS (${uniqTiny.length}):`);
    for (const t of uniqTiny.slice(0, 12)) console.log(`     ${t.sel}  ${t.w}x${t.h}  "${t.text}"`);
  }
  if (report.clipped.length) {
    console.log(`  CLIPPED TEXT (${report.clipped.length}):`);
    for (const c of report.clipped.slice(0, 8)) console.log(`     ${c.sel} scrollH=${c.scrollH} clientH=${c.clientH} "${c.text}"`);
  }
  if (errors.length) console.log(`  CONSOLE ERRORS: ${errors.length} -> ${errors[0].slice(0, 120)}`);
  await ctx.close();
}
await browser.close();
console.log("\ndone");
