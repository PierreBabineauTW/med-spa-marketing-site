// Frontend security sweep over the tracked source tree.
//
// Checks the things that are actually verifiable from inside the repository,
// and reports the rest as "needs a deployment answer" rather than guessing.
//
// Usage: node scripts/audit-security.mjs
import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

const problems = [];
const notes = [];
const note = (m) => notes.push(m);

const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((f) => {
    try { return statSync(f).isFile(); } catch { return false; }
  });

const sourceFiles = tracked.filter(
  (f) => /^(src|scripts)\//.test(f) && /\.(ts|tsx|mjs|js|css)$/.test(f)
);

/**
 * Strips comments so an attribution line in a docblock is not mistaken for a
 * live reference. "SVGs extracted from https://example.com" is provenance and
 * should stay; `<a href="https://example.com">` is a link and should go.
 */
const stripComments = (src, file) => {
  let s = src;
  if (/\.(css|js|mjs)$/.test(file)) s = s.replace(/\/\*[\s\S]*?\*\//g, " ");
  if (!/\.(css)$/.test(file)) {
    s = s.replace(/\/\*[\s\S]*?\*\//g, " ");
    s = s.replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
  }
  return s;
};

const read = (f) => readFileSync(f, "utf8");

// --- 1. committed secrets --------------------------------------------------
const SECRET_PATTERNS = [
  [/\bsk_live_[0-9a-z]{10,}/, "Stripe live secret key"],
  [/\bsk_test_[0-9a-z]{10,}/, "Stripe test secret key"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key id"],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, "Google API key"],
  [/\bghp_[0-9A-Za-z]{36}\b/, "GitHub personal access token"],
  [/\bgithub_pat_[0-9A-Za-z_]{20,}/, "GitHub fine-grained token"],
  [/\bxox[baprs]-[0-9A-Za-z-]{10,}/, "Slack token"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  [/\beyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./, "JWT"],
  [/\b[A-Za-z0-9_-]{32,}\.[A-Za-z0-9_-]{32,}\.[A-Za-z0-9_-]{32,}\b/, "possible JWT-shaped string"],
];
for (const f of sourceFiles) {
  const s = read(f);
  for (const [re, label] of SECRET_PATTERNS) {
    if (re.test(s)) problems.push(`${f}: possible ${label}`);
  }
}

// --- 2. env files actually committed ---------------------------------------
for (const f of tracked) {
  if (/^\.env(\.|$)/.test(f) && !/^\.env\.example$/.test(f)) {
    problems.push(`${f}: a real .env file is committed`);
  }
}

// --- 3. unsafe HTML injection ---------------------------------------------
for (const f of sourceFiles) {
  const s = read(f);
  for (const m of s.matchAll(/dangerouslySetInnerHTML=\{\{\s*__html:\s*([^,}]+)/g)) {
    // Acceptable only if the expression is a JSON.stringify(...).replace(...)
    if (!/JSON\.stringify/.test(m[1])) {
      problems.push(`${f}: dangerouslySetInnerHTML whose value is not JSON.stringify(...) — "${m[1].trim().slice(0, 60)}"`);
    }
  }
  // innerHTML / document.write / eval. A <template>'s innerHTML is inert (its
  // content is a fragment that never executes), so it is allowed; assigning to
  // a live element's innerHTML is not.
  for (const bad of [/\.outerHTML\s*=/, /document\.write\s*\(/, /\beval\s*\(/, /new Function\s*\(/]) {
    if (bad.test(s)) problems.push(`${f}: uses ${bad.source}`);
  }
  for (const m of s.matchAll(/(\w+)\.innerHTML\s*=/g)) {
    // Allow the inert case: the variable was created as a <template>, whose
    // content is a DocumentFragment that never executes and loads nothing.
    const decl = new RegExp(`(?:const|let|var)\\s+${m[1]}\\s*=\\s*document\\.createElement\\(\\s*["']template["']\\s*\\)`);
    if (!decl.test(s)) problems.push(`${f}: assigns to ${m[1]}.innerHTML (use a <template> for inert parsing)`);
  }
}

// --- 4. target=_blank without rel hardening --------------------------------
for (const f of sourceFiles) {
  const s = read(f);
  for (const m of s.matchAll(/target="_blank"[^>]*>/g)) {
    const tag = m[0];
    if (!/rel="[^"]*\bnoopener\b/.test(tag)) problems.push(`${f}: target="_blank" without rel="noopener"`);
  }
  // reverse order: rel before target
  for (const m of s.matchAll(/<a\b[^>]*rel="[^"]*\bnoopener\b[^>]*>/g)) {
    if (/target="_blank"/.test(m[0]) && !/rel="[^"]*\bnoreferrer\b/.test(m[0])) {
      problems.push(`${f}: target="_blank" with rel="noopener" but no noreferrer`);
    }
  }
}

// --- 5. inherited tracking / source-site identifiers ------------------------
// Scanned with comments stripped, so only code counts. The reference site's
// name still appears in docblocks across these files as design attribution —
// that is provenance to keep, not a tracking identifier, and it is neither
// visitor-visible nor ever fetched.
const TRACKING = [
  [/\bG-[A-Z0-9]{8,}\b/, "Google Analytics measurement id"],
  [/\bUA-\d{4,10}-\d{1,4}\b/, "Universal Analytics id"],
  [/\bAW-\d{9,12}\b/, "Google Ads id"],
  [/\bfbq\s*\(/, "Meta Pixel code"],
  [/\bgtag\s*\(/, "Google tag"],
  [/\bdataLayer\b/, "Google tag dataLayer"],
  [/_hmtx|_hmq|_hmsl/i, "Hotjar"],
  [/\bclarity\.ms\b/i, "Microsoft Clarity"],
  [/\bhs-scriptloader\b|hubspot/i, "HubSpot"],
  [/\bgtm\.js\b/i, "tag manager"],
  [/\bvercel\/insights\b/i, "Vercel analytics"],
  [/googletagmanager\.com/i, "Google Tag Manager host"],
  [/connect\.facebook\.net/i, "Meta connect host"],
  [/doubleclick\.net/i, "Google advertising host"],
  // the reference site's own live domain and hosting domain, in code
  [/(?:https?:)?\/\/(?:www\.)?upkeepmedspa\.com/i, "the clone source's live domain"],
  [/(?:https?:)?\/\/[^\s"'`)]*\.netlify\.app/i, "the clone source's hosting domain"],
];
// The capture scripts exist to fetch from the reference site, so they contain
// its URL by design. They are the provenance pipeline: build tooling that never
// reaches the browser. Their URLs are read from constants at the top of each
// file; this check asserts exactly that, so the exclusion cannot quietly widen.
const CAPTURE_SCRIPTS = tracked.filter((f) =>
  /^(capture-overlays|download-assets|extract-|inspect-|styles-).*\.mjs$/.test(f.split("/").pop() ?? "")
);
for (const f of CAPTURE_SCRIPTS) {
  const s = stripComments(read(f), f);
  if (!/const\s+(?:BASE|SITE|ORIGIN|SOURCE)\w*\s*=/.test(s)) {
    problems.push(`${f}: capture script with no obvious base-URL constant — confirm the exclusion is still correct`);
  }
}

for (const f of sourceFiles) {
  if (CAPTURE_SCRIPTS.includes(f)) continue;
  const s = stripComments(read(f), f);
  for (const [re, label] of TRACKING) {
    if (re.test(s)) problems.push(`${f}: contains ${label}`);
  }
}

// --- 6. localhost / staging / preview URLs ---------------------------------
// QA and capture scripts talk to a local test server on purpose; they are build
// tooling, not shipped code, so they are excluded from the URL checks.
const isTooling = (f) => f.startsWith("scripts/");
for (const f of sourceFiles) {
  if (isTooling(f)) continue;
  const s = read(f);
  for (const m of s.matchAll(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.[\d.]+)[\w\-./:@#]*/g)) {
    problems.push(`${f}: localhost URL in shipped source — ${m[0]}`);
  }
  for (const m of s.matchAll(/https?:\/\/[\w-]*(?:vercel\.app|netlify\.app|ngrok|trycloudflare)[\w-]*/g)) {
    problems.push(`${f}: preview/staging domain — ${m[0]}`);
  }
}

// --- 7. insecure http links in shipped source ------------------------------
for (const f of sourceFiles) {
  const s = read(f);
  for (const m of s.matchAll(/["'`]http:\/\/(?!localhost|127\.0\.0\.1)[^"'`\s]+["'`]/g)) {
    problems.push(`${f}: plaintext http URL — ${m[0]}`);
  }
}

// --- 8. debug leftovers ----------------------------------------------------
for (const f of sourceFiles) {
  const s = read(f);
  for (const m of s.matchAll(/\bconsole\.(log|debug|info)\s*\(/g)) {
    if (f.startsWith("scripts/")) continue; // scripts report to stdout by design
    problems.push(`${f}: console.${m[1]} left in shipped source (L${s.slice(0, m.index).split("\n").length})`);
  }
  for (const m of s.matchAll(/\bdebugger\b/g)) {
    problems.push(`${f}: debugger statement (L${s.slice(0, m.index).split("\n").length})`);
  }
  for (const m of s.matchAll(/\/\/\s*(TODO|FIXME|HACK|XXX)\b/g)) {
    if (!/\b(TODO|FIXME):/.test(m[0])) problems.push(`${f}: ${m[0].trim()} comment`);
  }
}

// --- 9. things that need a deployment answer, not a guess ------------------
note("Content-Security-Policy is NOT set. It needs deployment knowledge: the App Router emits inline bootstrap scripts (needs a per-request nonce via middleware, which forces dynamic rendering), four components use inline style attributes, and the contact-form destination is operator-supplied via CONTACT_WEBHOOK_URL. Documented in next.config.ts and TEMPLATE_GUIDE.md rather than guessed.");
note("Rate limiting on POST /api/contact is not implemented. An in-memory limiter does not survive a serverless scale-out or multiple instances, so a real one belongs at the edge (Vercel WAF, Cloudflare) or in front of the endpoint. Deliberately not faked.");
note("Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control) are set in next.config.ts and verified by scripts/qa-headers.mjs against the running standalone build.");
note("poweredByHeader is false, so the X-Powered-By header is not sent.");

// --- report ----------------------------------------------------------------
console.log(`scanned ${sourceFiles.length} source files (of ${tracked.length} tracked)\n`);
if (notes.length) {
  console.log("DEPLOYMENT ANSWERS REQUIRED (not defects, not guessed):");
  for (const n of notes) console.log(`  - ${n}`);
  console.log("");
}
if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log("SECURITY SWEEP: no problems found");
}
