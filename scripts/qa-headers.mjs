// Verifies the HTTP security headers are actually sent by the running server.
// This exists because the header layer's behaviour under `output: "standalone"`
// was assumed, not measured. Run via: node scripts/with-server.mjs scripts/qa-headers.mjs
const BASE = process.env.BASE_URL || "http://127.0.0.1:3100";

const EXPECTED = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  "x-dns-prefetch-control": "on",
};

const paths = ["/", "/services", "/about", "/contact", "/blog/nefertiti-lift", "/og-image.png", "/nope-404"];
let failures = 0;

for (const p of paths) {
  const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
  const got = {};
  for (const [k, v] of Object.entries(EXPECTED)) {
    const actual = res.headers.get(k);
    got[k] = actual === v ? "ok" : `got ${JSON.stringify(actual)} want ${JSON.stringify(v)}`;
    if (got[k] !== "ok") failures++;
  }

  // poweredByHeader: false
  const powered = res.headers.get("x-powered-by");
  if (powered) { got["x-powered-by"] = `LEAKED: ${powered}`; failures++; }
  else got["x-powered-by"] = "ok";

  const bad = Object.entries(got).filter(([, v]) => v !== "ok");
  console.log(
    `${p.padEnd(24)} HTTP ${res.status}  ` +
    (bad.length ? `FAIL -> ${bad.map(([k, v]) => `${k}: ${v}`).join("; ")}` : "all headers ok")
  );
}

// SEO surface: sitemap, robots, OG image content-type
const sm = await fetch(`${BASE}/sitemap.xml`);
const smText = await sm.text();
const urlCount = (smText.match(/<url>/g) || []).length;
console.log(`\n/sitemap.xml  HTTP ${sm.status}  ${smContentType(sm)}  ${urlCount} <url> entries`);

const rb = await fetch(`${BASE}/robots.txt`);
const rbText = await rb.text();
console.log(`/robots.txt   HTTP ${rb.status}  ${rbText.trim().split("\n").map((l) => l.trim()).join(" | ")}`);

const og = await fetch(`${BASE}/og-image.png`);
console.log(`/og-image.png HTTP ${og.status}  ${smContentType(og)}  ${Math.round((await og.arrayBuffer()).byteLength / 1024)} KB`);

if (urlCount < 20) { console.error(`FAIL: sitemap has only ${urlCount} urls`); failures++; }
if (!/Sitemap:/i.test(rbText)) { console.error("FAIL: robots.txt has no Sitemap line"); failures++; }
if (og.status !== 200 || !/image\/png/.test(og.headers.get("content-type") || "")) { console.error("FAIL: og image"); failures++; }

console.log(failures === 0 ? "\nHEADERS + SEO SURFACE: PASS" : `\nHEADERS + SEO SURFACE: ${failures} FAILURES`);
process.exitCode = failures === 0 ? 0 : 1;

function smContentType(r) { return r.headers.get("content-type") || "(no content-type)"; }
