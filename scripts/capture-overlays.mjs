// Captures the rendered markup of the three JS-injected overlays on the live site:
// the consent banner, the newsletter popup, and the accessibility widget. They
// are built by JS at runtime, so they only exist in the DOM after scripts run.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const ART = "docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
mkdirSync(`${ART}/overlays`, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("https://upkeepmedspa.com/", { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(3000);

const targets = [
  ["consent-banner", "#upkeep-consent-banner"],
  ["signup-popup", "#signupPopup"],
  ["a11y-menu", "#a11y-menu-root"],
];

for (const [key, sel] of targets) {
  const data = await page.evaluate((q) => {
    const el = document.querySelector(q);
    if (!el) return { error: "not found" };
    // pretty-print for readability
    const pretty = el.outerHTML
      .replace(/></g, ">\n<")
      .split("\n")
      .map((l) => "  " + l.trim())
      .join("\n");
    const cs = getComputedStyle(el);
    return {
      outerHTML: el.outerHTML,
      pretty,
      computed: {
        position: cs.position, inset: `${cs.top} ${cs.right} ${cs.bottom} ${cs.left}`,
        zIndex: cs.zIndex, display: cs.display, opacity: cs.opacity, visibility: cs.visibility,
        background: cs.backgroundColor, color: cs.color, backdropFilter: cs.backdropFilter,
      },
      rect: (() => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) }; })(),
      text: (el.textContent || "").replace(/\s+/g, " ").trim(),
    };
  }, sel);
  writeFileSync(`${ART}/overlays/${key}.html`, data.pretty || data.error);
  writeFileSync(`${ART}/overlays/${key}.json`, JSON.stringify(data, null, 2));
  console.log(`\n===== ${key} (${sel}) =====`);
  if (data.error) { console.log("  ", data.error); continue; }
  console.log("computed:", JSON.stringify(data.computed));
  console.log("rect:", JSON.stringify(data.rect));
  console.log("text:", data.text.slice(0, 200));
  console.log(data.pretty.slice(0, 2600));
}

// Also capture the popup in its OPEN state (it auto-opens after 12s)
console.log("\n\n===== signup popup forced open =====");
await page.evaluate(() => {
  document.getElementById("signupPopup")?.classList.add("is-open");
});
await page.waitForTimeout(700);
const open = await page.evaluate(() => {
  const el = document.getElementById("signupPopup");
  const cs = getComputedStyle(el);
  const card = el.querySelector(".signup-popup__card");
  return {
    overlayComputed: { opacity: cs.opacity, visibility: cs.visibility, display: cs.display },
    cardRect: card ? (() => { const r = card.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })() : null,
    classes: el.className,
  };
});
console.log(JSON.stringify(open, null, 2));
await page.screenshot({ path: `${ART}/../../design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/overlay-signup-popup-open.png` });

// localStorage keys used by the popup + consent scripts
const keys = await page.evaluate(() => {
  const out = {};
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out[k] = localStorage.getItem(k); } } catch (e) { out.__error = e.message; }
  return out;
});
console.log("\nlocalStorage:", JSON.stringify(keys, null, 2));

await browser.close();
console.log("\ndone");
