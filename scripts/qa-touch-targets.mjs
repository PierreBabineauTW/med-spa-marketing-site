// Confirms the coarse-pointer hit-area fixes actually work by hit-testing with
// elementFromPoint at the extremes of each enlarged target — a bounding-box check
// alone would not see a pseudo-element expander.
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3100";

const browser = await chromium.launch();
for (const [name, w, h] of [["android", 360, 800], ["iphone", 390, 844], ["tablet", 768, 1024]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.evaluate(() => localStorage.setItem("upkeep-consent-v1", "accepted"));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const r = await page.evaluate(() => {
    const hit = (sel, dx, dy) => {
      const el = document.querySelector(sel);
      if (!el) return "missing";
      const b = el.getBoundingClientRect();
      if (b.width === 0) return "hidden";
      const x = b.left + b.width / 2 + dx;
      const y = b.top + b.height / 2 + dy;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return "offscreen";
      const top = document.elementFromPoint(x, y);
      return top && (el.contains(top) || el === top) ? "HIT" : "miss";
    };
    // nav logo: probe 12px above the 20px-tall box (inside the 44px expander)
    const logo = document.querySelector(".nav__logo").getBoundingClientRect();
    return {
      coarse: matchMedia("(pointer: coarse)").matches,
      logoAbove: hit(".nav__logo", 0, -9),
      logoBelow: hit(".nav__logo", 0, 9),
      logoBox: `${Math.round(logo.width)}x${Math.round(logo.height)}`,
      smallBtn: (() => { const e = document.querySelector(".footer__btn, .btn--small"); const b = e.getBoundingClientRect(); return `${Math.round(b.width)}x${Math.round(b.height)}`; })(),
      legalLink: (() => { const e = document.querySelector(".footer__legal-links a"); const b = e.getBoundingClientRect(); return `${Math.round(b.width)}x${Math.round(b.height)}`; })(),
      dotBox: (() => { const e = document.querySelector(".testimonial-dot"); const b = e.getBoundingClientRect(); return `${Math.round(b.width)}x${Math.round(b.height)}`; })(),
    };
  });

  // the dots sit far below the fold; the site sets `scroll-behavior: smooth`, so
  // the scroll must be forced instant or the probe runs mid-animation
  await page.evaluate(() => {
    document.querySelector(".testimonial-dots").scrollIntoView({ block: "center", behavior: "instant" });
  });
  await page.waitForTimeout(700);

  // dot: tap the top edge of the 24px box; the visible 10px circle is centred so
  // the top 7px should still register the button
  const dotEdge = await page.evaluate(() => {
    const e = document.querySelector(".testimonial-dot");
    const b = e.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + 4;
    const top = document.elementFromPoint(x, y);
    return { res: top && (e.contains(top) || e === top) ? "HIT" : "miss", y: Math.round(y), vh: innerHeight };
  });
  // adjacent dots must not steal each other's taps
  const dotSpacing = await page.evaluate(() => {
    const dots = [...document.querySelectorAll(".testimonial-dot")];
    const a = dots[0].getBoundingClientRect(), b = dots[1].getBoundingClientRect();
    const mid = (a.right + b.left) / 2;
    const top = document.elementFromPoint(mid, a.top + a.height / 2);
    return { pitch: Math.round(b.left - a.left), midpointHits: top && (dots[0].contains(top) || dots[0] === top) ? "dot0" : top && (dots[1].contains(top) || dots[1] === top) ? "dot1" : "neither" };
  });

  console.log(`  ${name} ${w}x${h}  pointer:coarse=${r.coarse}`);
  console.log(`     nav logo box ${r.logoBox}: tap 9px above=${r.logoAbove}  9px below=${r.logoBelow}`);
  console.log(`     small button ${r.smallBtn}   legal link ${r.legalLink}   dot ${r.dotBox} (top-edge tap=${dotEdge.res} at y=${dotEdge.y}/${dotEdge.vh})`);
  console.log(`     dot pitch ${dotSpacing.pitch}px  midpoint between dot0/dot1 -> ${dotSpacing.midpointHits}`);
  await ctx.close();
}
await browser.close();
console.log("done");
