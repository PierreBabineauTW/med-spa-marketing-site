// Functional risk probe: mobile-menu overflow, reduced-motion reveals, the
// accessibility "larger text" mode, focus visibility, skip link, and CLS/LCP.
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3100";

const browser = await chromium.launch();

// ---- 1. mobile menu reachability on short screens -------------------------
console.log("########## mobile menu reachability ##########");
for (const [w, h] of [[360, 800], [375, 812], [390, 844], [430, 932]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.click(".nav__hamburger");
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const el = document.querySelector(".mobile-menu");
    const cs = getComputedStyle(el);
    const links = [...el.querySelectorAll(".mobile-menu__link")];
    const last = links[links.length - 1];
    const lb = last.getBoundingClientRect();
    return {
      scrollH: el.scrollHeight, clientH: el.clientHeight,
      overflowY: cs.overflowY, canScroll: el.scrollHeight > el.clientHeight,
      lastLinkBottom: Math.round(lb.bottom), vh: window.innerHeight,
      lastLinkVisible: lb.bottom <= window.innerHeight,
      lastLinkTop: Math.round(lb.top),
    };
  });
  // can we actually reach the last link by scrolling?
  let reachable = null;
  if (m.canScroll) {
    await page.evaluate(() => { document.querySelector(".mobile-menu").scrollTop = 9999; });
    await page.waitForTimeout(300);
    reachable = await page.evaluate(() => {
      const links = [...document.querySelectorAll(".mobile-menu__link")];
      const b = links[links.length - 1].getBoundingClientRect();
      return b.top >= 0 && b.bottom <= window.innerHeight;
    });
  } else {
    reachable = m.lastLinkVisible;
  }
  console.log(`  ${w}x${h}: scrollH=${m.scrollH} clientH=${m.clientH} overflowY=${m.overflowY} lastLinkBottom=${m.lastLinkBottom} vh=${m.vh} lastLinkVisible=${m.lastLinkVisible} reachableByScroll=${reachable}`);
  await ctx.close();
}

// ---- 2. prefers-reduced-motion vs scroll-driven reveals --------------------
console.log("\n########## prefers-reduced-motion + scroll reveals ##########");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  // do below-the-fold fade-in elements stay invisible? (the classic bug)
  const res = await page.evaluate(async () => {
    const els = [...document.querySelectorAll("main .fade-in")];
    const out = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) continue; // skip in-view
      out.push({ cls: el.className.toString().slice(0, 40), opacity: getComputedStyle(el).opacity, top: Math.round(r.top + window.scrollY) });
    }
    return { count: out.length, invisible: out.filter((o) => Number(o.opacity) < 0.9).length, sample: out.slice(0, 6) };
  });
  console.log(`  reduced-motion: ${res.count} below-fold reveals, ${res.invisible} with opacity < 0.9`);
  for (const s of res.sample) console.log(`     ${s.cls} opacity=${s.opacity} y=${s.top}`);
  await ctx.close();
}

// ---- 3. accessibility "larger text" mode ----------------------------------
console.log("\n########## a11y larger-text mode ##########");
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById("upkeep-consent-banner")?.remove());
  await page.click("#a11y-menu-button");
  await page.waitForTimeout(300);
  await page.locator(".a11y-menu__toggle").first().click();
  await page.waitForTimeout(400);
  const l = await page.evaluate(() => ({
    htmlClass: document.documentElement.className,
    body: getComputedStyle(document.body).fontSize,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: getComputedStyle(document.querySelector(".heading-hero")).fontSize,
  }));
  console.log(`  html class: "${l.htmlClass}"  body=${l.body} h1=${l.h1}  overflowX=${l.overflowX}`);
  // do the nav links / mobile menu still fit?
  const navFits = await page.evaluate(() => {
    const links = [...document.querySelectorAll(".nav__links .nav__link")];
    const inner = document.querySelector(".nav__inner");
    return { linkCount: links.length, innerW: Math.round(inner.getBoundingClientRect().width), sumW: Math.round(links.reduce((a, l) => a + l.getBoundingClientRect().width, 0)) };
  });
  console.log(`  nav: ${JSON.stringify(navFits)}`);
  await ctx.close();
}

// ---- 4. focus visibility + skip link ---------------------------------------
console.log("\n########## focus + skip link ##########");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  // skip link on first Tab
  await page.keyboard.press("Tab");
  const skip = await page.evaluate(() => {
    const a = document.querySelector(".skip-link");
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return { text: a.textContent.trim(), y: Math.round(r.y), visible: cs.visibility !== "hidden" && r.height > 0, href: a.getAttribute("href") };
  });
  console.log(`  first Tab -> skip link "${skip.text}" href=${skip.href} y=${skip.y} visible=${skip.visible}`);
  // tab through the first 14 focusables, report any with no visible focus ring
  const rings = await page.evaluate(() => {
    const out = [];
    const sel = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
    const els = [...document.querySelectorAll(sel)].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.display !== "none" && cs.visibility !== "hidden" && e.getBoundingClientRect().height > 0;
    });
    for (const e of els.slice(0, 20)) {
      e.focus();
      const cs = getComputedStyle(e);
      const hasOutline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const hasShadow = cs.boxShadow && cs.boxShadow !== "none";
      if (!hasOutline && !hasShadow) out.push(e.tagName.toLowerCase() + "." + (e.className.toString().split(" ")[0] || "") + ' "' + (e.textContent || "").trim().slice(0, 20) + '"');
    }
    return { checked: Math.min(20, els.length), noRing: out };
  });
  console.log(`  focusable checked: ${rings.checked}, without a visible focus ring: ${rings.noRing.length}`);
  for (const n of rings.noRing.slice(0, 10)) console.log(`     ${n}`);
  await ctx.close();
}

// ---- 5. LCP + layout shift ------------------------------------------------
console.log("\n########## perf: LCP + CLS ##########");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const perf = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Number(window.__cls.toFixed(4)) }));
  const weight = await page.evaluate(() => {
    const res = performance.getEntriesByType("resource");
    const by = {};
    for (const r of res) { const k = r.initiatorType; by[k] = (by[k] || 0) + (r.transferSize || 0); }
    const total = Object.values(by).reduce((a, b) => a + b, 0);
    return { totalKB: Math.round(total / 1024), byType: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, Math.round(v / 1024) + "KB"])) };
  });
  console.log(`  LCP=${perf.lcp}ms  CLS=${perf.cls}`);
  console.log(`  transferred: ${weight.totalKB}KB  ${JSON.stringify(weight.byType)}`);
  await ctx.close();
}

await browser.close();
console.log("\ndone");
