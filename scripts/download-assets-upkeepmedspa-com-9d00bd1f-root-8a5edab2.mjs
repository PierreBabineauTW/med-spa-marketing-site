// Asset downloader for https://upkeepmedspa.com/ (root page)
// site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
// Downloads every <img>, background image, and the self-hosted Switzer body font
// into the page asset root. Batched 4 at a time.

import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";

const SITE = "upkeepmedspa-com-9d00bd1f";
const PAGE = "root-8a5edab2";
const ROOT = `public/sites/${SITE}/${PAGE}`;
const IMAGES = `${ROOT}/images`;
const FONTS = `${ROOT}/fonts`;
for (const d of [IMAGES, FONTS]) mkdirSync(d, { recursive: true });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// ---- manifest: filenames chosen from the alt text / source path -------------
const IMAGES_MANIFEST = [
  // local site assets
  ["/assets/logo.png", "logo.png", "nav + footer wordmark (509x92)"],
  ["/assets/hero-home.jpg", "hero-home.jpg", "hero background (1193x1080), reused by booking CTA"],
  ["/assets/section-results.jpg", "section-results.jpg", "intro/split section image (2752x1536)"],
  ["/assets/svc-neurotoxins.jpg", "svc-neurotoxins.jpg", "service tile 1 (1080x1350)"],
  ["/assets/svc-lips.jpg", "svc-lips.jpg", "service tile 2 (2752x1536)"],
  ["/assets/svc-fillers.jpg", "svc-fillers.jpg", "service tile 3 (1080x1619)"],
  ["/assets/svc-facials.jpg", "svc-facials.jpg", "service tile 4 (1080x1610)"],
  ["/assets/svc-regenerative.jpg", "svc-regenerative.jpg", "service tile 5 (1080x1610)"],
  ["/assets/svc-specialty.jpg", "svc-specialty.jpg", "service tile 6 (1080x1610)"],
  ["/assets/svc-laser.jpg", "svc-laser.jpg", "service tile 7 (2752x1536)"],
  ["/assets/svc-body.jpg", "svc-body.jpg", "service tile 8 (1080x1610)"],
  ["/assets/locations/ues-wix.jpg", "loc-ues.jpg", "location: Upper East Side"],
  ["/assets/locations/gv-wix.jpg", "loc-gv.jpg", "location: Greenwich Village"],
  ["/assets/locations/brooklyn-wix.jpg", "loc-brooklyn.jpg", "location: Brooklyn"],
  ["/assets/locations/chelsea-wix.jpg", "loc-chelsea.jpg", "location: Chelsea"],
  ["/assets/loc-li.jpg", "loc-li.jpg", "location: Long Island"],
  ["/assets/locations/dallas-wix.jpg", "loc-dallas.jpg", "location: Dallas"],
  ["/assets/locations/north-dallas-wix.jpg", "loc-addison.jpg", "location: Addison"],
  ["/assets/events/flash-sale-40-off-sept2026.png", "flash-sale-poster.png", "flash-sale popup poster (900x1600)"],
  // blog card images live on Squarespace CDN; take a higher-res rendition than the
  // 500w the browser picked at 1440 so the clone stays crisp on 2x displays
  ["https://images.squarespace-cdn.com/content/v1/5dfbc92ebcc4646c5b1d7497/1773948201904-9HCFCD5K0Y454UXB2HKA/DSC_2463.jpg?format=1200w", "blog-nefertiti-lift.jpg", "blog card 1 (Nefertiti + DAO)"],
  ["https://images.squarespace-cdn.com/content/v1/5dfbc92ebcc4646c5b1d7497/1773777867446-EYVAK1IW8JGYVO49CQQI/The+Vault+Stock-10763.jpg?format=1200w", "blog-under-eye-filler.jpg", "blog card 2 (Under Eye Filler)"],
  ["https://images.squarespace-cdn.com/content/v1/5dfbc92ebcc4646c5b1d7497/1760466670913-0H38UCIW7S34ZZZC9ACH/e901665b-c1d2-493e-8b56-ef3f97702369.jpg?format=1200w", "blog-microneedling-vs-laser.jpg", "blog card 3 (Microneedling vs Laser)"],
];

// Switzer (Indian Type Foundry, free license) served from Fontshare.
const FONTS_MANIFEST = [
  ["//cdn.fontshare.com/wf/EW5HJEX6O4L64XUWQA2XU7Q6BZ3B4JA4/ZWUP4SQYHHMMSS5LFHFFBX6DXL7C3DTU/H5EOHLIZH5K7IZK6SGYJI75L4KV6FUO7.woff2", "Switzer-Light.woff2", 300],
  ["//cdn.fontshare.com/wf/BLNB4FAQFNK56DWWNF7PMGTCOTZHOEII/ST3WKSSDMBK2MIQQO3MAVYWLF4FTOLFV/6IN5WOLRCYP4G4MOCOHOMXNON6Q7MDAR.woff2", "Switzer-Regular.woff2", 400],
  ["//cdn.fontshare.com/wf/OYB4CXKJQXKTNSLJMTDQOIVUL2V5EL7S/WYO2P7DQVV5RNXGMCUO2HL4RJP4VFUAS/6XPIMU23OJVRY676OG5YVJMWEHWICATX.woff2", "Switzer-Medium.woff2", 500],
];

async function download(url, dest, note) {
  const full = url.startsWith("//") ? "https:" + url : new URL(url, "https://upkeepmedspa.com").href;
  if (existsSync(dest) && statSync(dest).size > 0) {
    return { url, file: dest.split(/[\\/]/).pop(), bytes: statSync(dest).size, status: "cached", note };
  }
  try {
    const res = await fetch(full, { headers: { "User-Agent": UA, Referer: "https://upkeepmedspa.com/" } });
    if (!res.ok) return { url, status: `HTTP ${res.status}`, note, error: true };
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    return { url: full, file: dest.split(/[\\/]/).pop(), bytes: buf.length, status: "ok", note };
  } catch (e) {
    return { url: full, status: "ERROR", detail: e.message, note, error: true };
  }
}

// batched: 4 at a time
async function runAll(jobs, label) {
  const results = [];
  const size = 4;
  for (let i = 0; i < jobs.length; i += size) {
    const batch = jobs.slice(i, i + size);
    const got = await Promise.all(batch.map(([url, name]) => download(url, name, "")));
    results.push(...got);
    process.stdout.write(`  ${label}: ${Math.min(i + size, jobs.length)}/${jobs.length}\n`);
  }
  return results;
}

console.log("== images ==");
const imgJobs = IMAGES_MANIFEST.map(([src, file]) => [src, join(IMAGES, file)]);
const imgResults = await runAll(imgJobs, "images");

console.log("== fonts ==");
const fontJobs = FONTS_MANIFEST.map(([src, file]) => [src, join(FONTS, file)]);
const fontResults = await runAll(fontJobs, "fonts");

const manifest = {
  site: "https://upkeepmedspa.com/",
  siteKey: SITE,
  pageKey: PAGE,
  generatedFor: ROOT,
  images: IMAGES_MANIFEST.map(([src, file, note], i) => ({
    localPath: `/sites/${SITE}/${PAGE}/images/${file}`,
    source: src.startsWith("http") ? src : `https://upkeepmedspa.com${src}`,
    alt: note,
    result: imgResults[i],
  })),
  fonts: FONTS_MANIFEST.map(([src, file, weight], i) => ({
    localPath: `/sites/${SITE}/${PAGE}/fonts/${file}`,
    source: "https:" + src,
    family: "Switzer",
    weight,
    style: "normal",
    license: "Indian Type Foundry — free for commercial use",
    result: fontResults[i],
  })),
};
writeFileSync(`${ROOT}/asset-manifest.json`, JSON.stringify(manifest, null, 2));

const failed = [...imgResults, ...fontResults].filter((r) => r.error);
console.log(`\nimages: ${imgResults.filter((r) => !r.error).length}/${imgResults.length} ok, ${(imgResults.reduce((s, r) => s + (r.bytes || 0), 0) / 1024 / 1024).toFixed(2)} MB`);
console.log(`fonts:  ${fontResults.filter((r) => !r.error).length}/${fontResults.length} ok`);
for (const r of [...imgResults, ...fontResults]) {
  console.log(`  ${r.error ? "FAIL" : "OK  "} ${String(r.file || "?").padEnd(30)} ${String(r.bytes || 0).padStart(9)} B  ${r.status}  ${r.note || ""}`);
}
if (failed.length) { console.log(`\n${failed.length} FAILED`); process.exitCode = 1; }
else console.log("\nall assets downloaded");
