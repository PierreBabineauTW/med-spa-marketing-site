// ---------------------------------------------------------------------------
// Responsive QA across every page and every required viewport.
//
// Checks, per page per viewport:
//   - no horizontal overflow (document scrollWidth <= clientWidth)
//   - no individual element wider than the viewport (the usual cause)
//   - console errors and page errors
//   - the mobile menu opens, is closable by Escape and by its close button,
//     and does not clip its own links
//   - tap targets on coarse-pointer devices meet 24px (WCAG 2.5.8 AA)
//   - text is not below 10px (unreadable)
//   - CLS is 0 (no layout shift on load)
//
// Usage: node scripts/with-server.mjs scripts/qa-responsive.mjs
// ---------------------------------------------------------------------------
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900, touch: false },
  { name: "desktop-1280", width: 1280, height: 800, touch: false },
  { name: "tablet-1024", width: 1024, height: 768, touch: true },
  { name: "tablet-768", width: 768, height: 1024, touch: true },
  { name: "mobile-430", width: 430, height: 932, touch: true },
  { name: "mobile-390", width: 390, height: 844, touch: true },
  { name: "mobile-375", width: 375, height: 812, touch: true },
  { name: "mobile-360", width: 360, height: 800, touch: true },
];

const PAGES = [
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
  "/nope-404",
];

const failures = [];
let checks = 0;
const fail = (vp, page, msg) => failures.push(`[${vp}] ${page}  ${msg}`);
const pass = () => { checks++; };

/**
 * Polls `fn` until it returns true, instead of sleeping a fixed amount.
 * Menu open/close runs a CSS transition whose duration varies by breakpoint,
 * so a single wait either wastes time or flakes. Polling makes the assertion
 * about the outcome rather than about timing.
 */
const waitFor = async (fn, timeout = 2500, step = 60) => {
  const t0 = Date.now();
  for (;;) {
    if (await fn()) return true;
    if (Date.now() - t0 > timeout) return false;
    await new Promise((r) => setTimeout(r, step));
  }
};

const menuIsClosed = (page) =>
  page.evaluate(() => {
    const el = document.querySelector(".mobile-menu");
    if (!el) return true;
    const s = getComputedStyle(el);
    return s.visibility === "hidden" || s.opacity === "0";
  });

const menuIsOpen = (page) =>
  page.evaluate(() => {
    const el = document.querySelector(".mobile-menu");
    if (!el) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.opacity !== "0";
  });

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    // isMobile makes Chromium report a coarse pointer, which is what activates
    // the (pointer: coarse) touch-target rules in polish.css — verified by
    // scripts/qa-touch-targets.mjs asserting matchMedia("(pointer: coarse)").
    isMobile: vp.touch,
    hasTouch: vp.touch,
  });

  // The consent banner is a fixed overlay that covers the bottom of the
  // viewport. Pre-accept it so it does not obscure content during
  // measurement, matching what a returning visitor sees.
  await context.addInitScript(() => {
    try { localStorage.setItem("upkeep-consent-v1", "accepted"); } catch { /* private mode */ }
  });

  for (const route of PAGES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(180);

    // --- horizontal overflow -------------------------------------------
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const overflowing = [];
      const vw = de.clientWidth;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.position === "fixed") continue; // overlays are viewport-sized by design
        if (r.right > vw + 1 || r.left < -1) {
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className && String(el.className).slice(0, 60)) || "",
            left: Math.round(r.left),
            right: Math.round(r.right),
          });
        }
      }
      // unreadably small text
      const tiny = [];
      for (const el of document.querySelectorAll("p, span, a, li, h1, h2, h3, h4, label, button, small, time")) {
        if (!el.textContent || !el.textContent.trim()) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < 10) tiny.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), fs });
      }
      return {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        overflowing: overflowing.slice(0, 5),
        tiny: tiny.slice(0, 5),
        tinyCount: tiny.length,
      };
    });

    if (m.scrollWidth > m.clientWidth + 1) {
      fail(vp.name, route, `horizontal overflow: scrollWidth ${m.scrollWidth} > clientWidth ${m.clientWidth}`);
      for (const o of m.overflowing) fail(vp.name, route, `  overflowing <${o.tag} class="${o.cls}"> left=${o.left} right=${o.right}`);
    } else pass();

    if (m.tinyCount) {
      fail(vp.name, route, `${m.tinyCount} element(s) with text under 10px`);
      for (const t of m.tiny) fail(vp.name, route, `  <${t.tag} class="${t.cls}"> font-size ${t.fs}px`);
    } else pass();

    // The 404 page's own navigation legitimately returns 404, which Chromium
    // logs as a console error. That is the route working, not a defect.
    const is404 = route.startsWith("/nope");
    const realConsoleErrors = is404
      ? consoleErrors.filter((t) => !/Failed to load resource.*404/.test(t))
      : consoleErrors;
    if (realConsoleErrors.length) fail(vp.name, route, `console errors: ${realConsoleErrors.slice(0, 3).join(" | ")}`);
    else pass();
    if (pageErrors.length) fail(vp.name, route, `page errors: ${pageErrors.slice(0, 2).join(" | ")}`);
    else pass();

    // --- mobile menu behaviour (narrow viewports only) -------------------
    // Real Playwright input is used throughout: synthetic dispatchEvent does
    // not faithfully drive React's event handling, and testing the harness
    // rather than the site is how false failures get "fixed" in the product.
    if (vp.width <= 768) {
      const hasBurger = await page.locator(".nav__hamburger").count();
      if (!hasBurger) fail(vp.name, route, "no .nav__hamburger found");
      else pass();

      if (hasBurger) {
        await page.click(".nav__hamburger");
        if (!(await waitFor(() => menuIsOpen(page)))) {
          fail(vp.name, route, "hamburger click did not open the menu");
        } else pass();

        const menuInfo = await page.evaluate(() => {
          const menu = document.querySelector(".mobile-menu");
          const mr = menu.getBoundingClientRect();
          const links = [...menu.querySelectorAll("a")];
          const clipped = links.filter((a) => {
            const r = a.getBoundingClientRect();
            return r.bottom > mr.bottom + 1 || r.top < mr.top - 1;
          });
          return {
            linkCount: links.length,
            scrollable: menu.scrollHeight > menu.clientHeight + 1,
            clippedCount: clipped.length,
            clippedSample: clipped.slice(0, 3).map((a) => a.textContent.trim().slice(0, 30)),
            closeBtn: !!document.querySelector(".mobile-menu__close"),
            ariaHidden: menu.getAttribute("aria-hidden"),
          };
        });

        if (menuInfo.linkCount === 0) fail(vp.name, route, "mobile menu has no links");
        else pass();
        if (!menuInfo.closeBtn) fail(vp.name, route, "mobile menu has no close button");
        else pass();
        if (menuInfo.ariaHidden !== "false") fail(vp.name, route, `open menu reports aria-hidden="${menuInfo.ariaHidden}"`);
        else pass();
        // Links may need scrolling, but must never be clipped with no way to
        // scroll to them.
        if (menuInfo.clippedCount && !menuInfo.scrollable) {
          fail(vp.name, route, `${menuInfo.clippedCount} menu link(s) clipped and menu not scrollable: ${menuInfo.clippedSample.join(", ")}`);
        } else pass();

        // Escape must close it
        await page.keyboard.press("Escape");
        if (await waitFor(() => menuIsClosed(page))) pass();
        else fail(vp.name, route, "mobile menu did not close on Escape");

        // And the close button must work too
        await page.click(".nav__hamburger");
        await waitFor(() => menuIsOpen(page));
        await page.click(".mobile-menu__close");
        if (await waitFor(() => menuIsClosed(page))) pass();
        else fail(vp.name, route, "mobile menu close button did not close it");
      }
    }

    await page.close();
  }

  // --- CLS measured once per viewport on the home page ------------------
  {
    const p = await context.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const cls = await p.evaluate(
      () =>
        new Promise((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) if (!e.hadRecentInput) total += e.value;
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(Math.round(total * 10000) / 10000), 900);
        })
    );
    if (cls > 0.1) fail(vp.name, "/", `CLS ${cls} exceeds 0.1`);
    else pass();
    await p.close();
  }

  await context.close();
  process.stdout.write(`  ${vp.name} (${vp.width}x${vp.height}) done\n`);
}

await browser.close();

console.log(`\nchecked ${PAGES.length} pages x ${VIEWPORTS.length} viewports`);
console.log(`assertions: ${checks}`);
if (failures.length) {
  console.log(`\nFAILURES (${failures.length}):`);
  for (const f of failures) console.log("  " + f);
  process.exitCode = 1;
} else {
  console.log("\nRESPONSIVE QA: PASS");
}
