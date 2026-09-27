// Inspection pass for https://upkeepmedspa.com/ (root page)
// site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
// Captures master screenshots at 1440/768/390, per-section screenshots,
// per-section outerHTML, and the full asset inventory.

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "upkeepmedspa-com-9d00bd1f";
const PAGE = "root-8a5edab2";
const URL = "https://upkeepmedspa.com/";
const SHOTS = `docs/design-references/${SITE}/${PAGE}`;
const ART = `docs/research/${SITE}/${PAGE}`;

for (const d of [SHOTS, `${ART}/sections`, `${ART}/raw`]) mkdirSync(d, { recursive: true });

// Force scroll-driven reveals + .parallax-bg to their settled state, and hide
// JS-injected chrome, so reference shots show the designed end state.
const NEUTRALIZE = `
  .fade-in, .reveal-up { opacity: 1 !important; clip-path: none !important; transform: none !important; animation: none !important; }
  .parallax-bg { transform: none !important; animation: none !important; }
  #upkeep-consent-banner, #a11y-menu-root, #upkeep-pink-banner { display: none !important; }
  .signup-popup, .upk-flash-overlay, .upk-rsvp-overlay { display: none !important; }
`;

const log = [];
function say(m) {
  console.log(m);
  log.push(m);
}

// Scroll the whole page in steps so every loading="lazy" image actually fetches,
// then return to the top. Without this, location/blog images stay 0x0 and the
// reference screenshots show empty cards.
async function warmLazy() {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  // wait for every <img> to finish decoding
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll("img")];
    await Promise.all(
      imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))
    );
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const unloaded = await page.evaluate(
    () => [...document.querySelectorAll("img")].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src"))
  );
  return unloaded;
}

// main > section order (nth-of-type is reliable: all siblings are <section>):
// 1 hero, 2 intro, 3 #services, 4 testimonials, 5 locations, 6 press, 7 journal, 8 booking-cta
// NOTE: #services also carries .section--tight, so class selectors are ambiguous — use nth-of-type.
const SECTIONS = [
  { key: "00-nav", label: "Navigation (fixed)", sel: "nav.nav" },
  { key: "01-hero", label: "Hero", sel: "main > section:nth-of-type(1)" },
  { key: "02-intro", label: "Refined Results / Treatments That Speak for Themselves", sel: "main > section:nth-of-type(2)" },
  { key: "03-services", label: "Our Services", sel: "main > section:nth-of-type(3)" },
  { key: "04-testimonials", label: "What Our Clients Say", sel: "main > section:nth-of-type(4)" },
  { key: "05-locations", label: "7 Locations Across NYC & Dallas", sel: "main > section:nth-of-type(5)" },
  { key: "06-press", label: "As Seen In", sel: "main > section:nth-of-type(6)" },
  { key: "07-journal", label: "How to UPKEEP", sel: "main > section:nth-of-type(7)" },
  { key: "08-booking-cta", label: "Ready to Glow?", sel: "main > section:nth-of-type(8)" },
  { key: "09-footer", label: "Footer", sel: "footer.footer" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});
const page = await ctx.newPage();

// ---- asset inventory (collect across the whole page) -------------------------
const assets = { images: [], videos: [], backgrounds: [], svgs: [], fonts: [], favicons: [], cssBgNonUrl: [] };
page.on("response", async (res) => {
  const url = res.url();
  const ct = (res.headers()["content-type"] || "").toLowerCase();
  if (ct.startsWith("image/") || ct.startsWith("video/") || ct.startsWith("font/")) {
    (ct.startsWith("video/") ? assets.videos : ct.startsWith("font/") ? assets.fonts : assets.images).push({
      url,
      type: ct,
      status: res.status(),
    });
  }
});

say("== goto ==");
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2500);
const unloaded = await warmLazy();
say(unloaded.length ? `!! still unloaded: ${JSON.stringify(unloaded)}` : "all images loaded");

const rawPage = await page.evaluate(() => ({
  title: document.title,
  meta: [...document.querySelectorAll("meta")].map((m) => ({
    name: m.getAttribute("name"),
    property: m.getAttribute("property"),
    content: m.getAttribute("content"),
  })),
  favicons: [...document.querySelectorAll('link[rel*="icon"], link[rel="manifest"]')].map((l) => ({
    rel: l.rel,
    href: l.href,
    type: l.getAttribute("type"),
    sizes: l.getAttribute("sizes"),
  })),
  links: [...document.querySelectorAll("link")].map((l) => ({ rel: l.rel, href: l.href })),
  scripts: [...document.querySelectorAll("script")].map((s) => ({
    src: s.src || null,
    inline: s.src ? null : (s.textContent || "").slice(0, 4000),
  })),
  scrollHeight: document.documentElement.scrollHeight,
}));
writeFileSync(`${ART}/raw/page-meta.json`, JSON.stringify(rawPage, null, 2));
say(`title: ${rawPage.title}  scrollHeight: ${rawPage.scrollHeight}`);

// DOM-declared assets
const domAssets = await page.evaluate(() => {
  const abs = (u) => {
    try { return new URL(u, location.href).href; } catch { return u; }
  };
  return {
    images: [...document.querySelectorAll("img")].map((i) => ({
      src: i.currentSrc || abs(i.getAttribute("src") || ""),
      dataSrc: i.getAttribute("data-src") || null,
      srcset: i.getAttribute("srcset"),
      alt: i.alt,
      w: i.naturalWidth,
      h: i.naturalHeight,
      loading: i.getAttribute("loading"),
      parentClass: i.parentElement ? i.parentElement.className.toString().slice(0, 90) : null,
      siblingImgs: i.parentElement ? i.parentElement.querySelectorAll("img").length : 0,
      pos: getComputedStyle(i).position,
      objectFit: getComputedStyle(i).objectFit,
    })),
    videos: [...document.querySelectorAll("video")].map((v) => ({
      src: v.currentSrc || v.src || (v.querySelector("source") ? v.querySelector("source").src : null),
      poster: v.poster || null,
      autoplay: v.autoplay, loop: v.loop, muted: v.muted,
      className: v.className.toString().slice(0, 90),
    })),
    backgrounds: [...document.querySelectorAll("*")]
      .map((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        if (!bg || bg === "none") return null;
        const urls = [...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => abs(m[1]));
        const hasImg = urls.length > 0;
        return {
          urls: hasImg ? urls : undefined,
          raw: bg.slice(0, 200),
          el: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + "." + el.className.toString().split(" ").filter(Boolean).slice(0, 3).join("."),
        };
      })
      .filter(Boolean),
    svgs: [...document.querySelectorAll("svg")].map((s) => ({
      outer: s.outerHTML.slice(0, 3000),
      cls: (s.getAttribute("class") || "").slice(0, 90),
      parentCls: s.parentElement ? s.parentElement.className.toString().slice(0, 90) : null,
      w: Math.round(s.getBoundingClientRect().width),
      h: Math.round(s.getBoundingClientRect().height),
      viewBox: s.getAttribute("viewBox"),
      fill: s.getAttribute("fill"),
    })),
    fontFamilies: [...new Set([...document.querySelectorAll("body *")].map((el) => getComputedStyle(el).fontFamily))],
    usedFontFaces: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style} ${f.status}`),
  };
});
writeFileSync(`${ART}/raw/assets-dom.json`, JSON.stringify(domAssets, null, 2));
say(`images: ${domAssets.images.length}  videos: ${domAssets.videos.length}  bgLayers: ${domAssets.backgrounds.length}  svgs: ${domAssets.svgs.length}`);
say(`fontFamilies: ${JSON.stringify(domAssets.fontFamilies)}`);
say(`loaded faces: ${JSON.stringify(domAssets.usedFontFaces)}`);

// ---- per-section HTML + geometry -------------------------------------------
for (const s of SECTIONS) {
  const data = await page.evaluate((sel) => {
    const el = sel ? document.querySelector(sel) : document.querySelector("nav.nav");
    if (!el) return { error: "not found" };
    const r = el.getBoundingClientRect();
    return {
      outerHTML: el.outerHTML,
      rect: { y: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width) },
    };
  }, s.sel);
  if (data.error) { say(`section ${s.key}: ${data.error}`); continue; }
  writeFileSync(`${ART}/sections/${s.key}.html`, data.outerHTML);
  say(`section ${s.key}: y=${data.rect.y} h=${data.rect.h}  html=${(data.outerHTML.length / 1024).toFixed(1)}kb`);
}

// ---- full page body HTML (the whole reference markup) -----------------------
const bodyHtml = await page.evaluate(() => document.body.outerHTML);
writeFileSync(`${ART}/raw/body.html`, bodyHtml);
say(`body.html: ${(bodyHtml.length / 1024).toFixed(1)}kb`);

// ---- master screenshots ------------------------------------------------------
for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await warmLazy();
  await page.addStyleTag({ content: NEUTRALIZE });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(SHOTS, `master-${vp.name}-${vp.width}.png`), fullPage: true });
  say(`master-${vp.name}-${vp.width}.png full-page captured`);
}

// ---- per-section screenshots at 1440 ---------------------------------------
await page.setViewportSize({ width: 1440, height: 900 });
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await warmLazy();
await page.addStyleTag({ content: NEUTRALIZE });
await page.waitForTimeout(600);

for (const s of SECTIONS) {
  const sel = s.sel || "nav.nav";
  const loc = await page.evaluate((q) => {
    const el = document.querySelector(q);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { y: r.top + window.scrollY, h: r.height };
  }, sel);
  if (!loc) { say(`shot ${s.key}: not found`); continue; }
  const pad = 24;
  const height = Math.min(Math.ceil(loc.h) + pad * 2, 16000);
  const top = Math.max(0, Math.floor(loc.y - pad));
  try {
    await page.screenshot({
      path: join(SHOTS, `sec-${s.key}.png`),
      fullPage: true,
      clip: { x: 0, y: top, width: 1440, height },
    });
    say(`sec-${s.key}.png  (y=${top} h=${height})`);
  } catch (e) {
    say(`shot ${s.key} failed: ${e.message}`);
  }
}

writeFileSync(`${ART}/raw/inspect-log.txt`, log.join("\n"));
await browser.close();
say("done");
