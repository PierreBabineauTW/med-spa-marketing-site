// Inventories every internal route referenced by the nav, footer, page content and
// overlays, so Phase 2 knows exactly which pages must exist.
import { readFileSync } from "node:fs";

const files = [
  "src/lib/upkeepmedspa-data.ts",
  "src/config/site.ts",
  "src/app/page.tsx",
  "src/app/layout.tsx",
];

const all = [];
for (const f of files) {
  const s = readFileSync(f, "utf8");
  for (const m of s.matchAll(/href:\s*"([^"]+)"/g)) all.push({ file: f, href: m[1] });
  for (const m of s.matchAll(/href="([^"]+)"/g)) all.push({ file: f, href: m[1] });
  for (const m of s.matchAll(/link:\s*\{[^}]*href:\s*"([^"]+)"/g)) all.push({ file: f, href: m[1] });
}

const internal = all.filter((a) => a.href.startsWith("/"));
const uniq = [...new Set(internal.map((a) => a.href))].sort();
const external = [...new Set(all.filter((a) => /^https?:/.test(a.href)).map((a) => a.href))].sort();

console.log(`href literals scanned: ${all.length}`);
console.log(`\nINTERNAL routes referenced (${uniq.length}):`);
for (const h of uniq) {
  const n = internal.filter((a) => a.href === h).length;
  const path = h.split("#")[0] || "/";
  console.log(`  ${String(n).padStart(2)}x  ${h}${h.includes("#") ? "   -> path " + path : ""}`);
}
console.log(`\nEXTERNAL (${external.length}):`);
for (const h of external) console.log(`  ${h}`);

// suspicious link patterns
const bad = all.filter((a) => a.href === "#" || a.href.startsWith("javascript:") || a.href.startsWith("localhost") || a.href.startsWith("http://"));
console.log(`\nSUSPICIOUS (${bad.length}):`);
for (const b of [...new Set(bad.map((b) => b.file + " -> " + b.href))]) console.log(`  ${b}`);
