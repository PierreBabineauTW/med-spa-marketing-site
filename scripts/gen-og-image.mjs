// Generates the OpenGraph / Twitter card image at public/og-image.png (1200x630).
//
// Rendered in a real browser with the site's actual CSS and self-hosted fonts, so
// the card uses the same typography as the site. (next/og's Satori renderer
// rejects the wOF2 signature that Switzer ships with, and pulling a font from a
// CDN at build time would make the build non-hermetic.)
//
// Regenerate with: node scripts/gen-og-image.mjs
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const OUT_DIR = "public";
const OUT = `${OUT_DIR}/og-image.png`;
mkdirSync(OUT_DIR, { recursive: true });

// Pull the strings straight from config so the card can never drift from the
// site. `site.ts` is TypeScript, so it cannot be imported here; the values are
// read textually. Both the inline form (`name: "X"`) and the hoisted-alias form
// (`const siteName = "X"`) are accepted, and a value that cannot be found or
// comes back empty is a hard error rather than a silently blank card.
const siteSrc = readFileSync("src/config/site.ts", "utf8");
const pick = (key) => {
  const patterns = [
    new RegExp(`^\\s*const\\s+${key}\\s*=\\s*"([^"]*)"`, "m"),
    new RegExp(`^\\s*${key}:\\s*"([^"]*)"`, "m"),
  ];
  for (const re of patterns) {
    const m = re.exec(siteSrc);
    if (m && m[1].trim()) return m[1];
  }
  throw new Error(`gen-og-image: could not read a non-empty "${key}" from src/config/site.ts`);
};
const cfg = {
  name: pick("siteName"),
  description: pick("description"),
  email: pick("siteEmail"),
  phone: pick("sitePhone"),
};
console.log(`card copy: name="${cfg.name}" email="${cfg.email}" phone="${cfg.phone}"`);

const fontB64 = (f) => readFileSync(`src/lib/fonts/${f}`).toString("base64");
const switzer = `url(data:font/woff2;base64,${fontB64("Switzer-Regular.woff2")}) format("woff2")`;
const switzerMed = `url(data:font/woff2;base64,${fontB64("Switzer-Medium.woff2")}) format("woff2")`;
const switzerLight = `url(data:font/woff2;base64,${fontB64("Switzer-Light.woff2")}) format("woff2")`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face{font-family:Switzer;src:${switzer};font-weight:400}
  @font-face{font-family:Switzer;src:${switzerMed};font-weight:500}
  @font-face{font-family:Switzer;src:${switzerLight};font-weight:300}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1200px;height:630px;background:#0a0a0a;font-family:Switzer,sans-serif;color:#f5f0eb;overflow:hidden}
  .wrap{width:1200px;height:630px;display:flex;flex-direction:column;justify-content:space-between;
    padding:72px;background-image:radial-gradient(circle at 78% 18%, rgba(212,160,144,.22) 0%, rgba(10,10,10,0) 58%)}
  .brand{display:flex;align-items:center;gap:16px}
  .dot{width:10px;height:10px;border-radius:9999px;background:#d4a090}
  .name{font-size:26px;letter-spacing:.34em;text-transform:uppercase;color:#d4a090;font-weight:500}
  h1{font-size:86px;line-height:1.06;font-weight:300;max-width:900px;letter-spacing:-.5px}
  p.lede{margin-top:28px;font-size:30px;line-height:1.4;color:rgba(245,240,235,.72);max-width:840px;font-weight:300}
  .foot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(212,176,168,.2);
    padding-top:28px;font-size:24px;color:rgba(245,240,235,.6)}
  .foot b{color:#d4a090;font-weight:500}
</style></head>
<body><div class="wrap">
  <div class="brand"><span class="dot"></span><span class="name">${cfg.name}</span></div>
  <div>
    <h1>Making aesthetics accessible.</h1>
    <p class="lede">${cfg.description}</p>
  </div>
  <div class="foot"><span>${cfg.email}</span><b>${cfg.phone}</b></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
const buf = await page.screenshot({ type: "png" });
writeFileSync(OUT, buf);
await browser.close();
console.log(`wrote ${OUT} (${Math.round(buf.length / 1024)} KB, 1200x630)`);
