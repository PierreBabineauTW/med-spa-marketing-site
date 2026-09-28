// Reports the character length of every config-driven meta description, so
// nothing silently exceeds the ~160 chars a search result can show.
import { readFileSync } from "node:fs";

const src = readFileSync("src/config/content.ts", "utf8");

// service descriptions
const svcBlock = src.slice(src.indexOf("services: ["), src.indexOf("studios: ["));
const svcs = [...svcBlock.matchAll(/slug: "([a-z-]+)"[\s\S]*?description:\s*\n?\s*"([^"]*)"/g)];
console.log("SERVICE descriptions (limit 160):");
for (const [, slug, d] of svcs) {
  const flag = d.length > 160 ? "TOO LONG" : "ok";
  console.log(`  ${String(d.length).padStart(4)}  ${flag.padEnd(9)} /services/${slug}`);
}

// post excerpts are used as descriptions too
const postBlock = src.slice(src.indexOf("posts: ["));
const posts = [...postBlock.matchAll(/slug: "([a-z-]+)"[\s\S]*?excerpt:\s*\n?\s*"([^"]*)"/g)];
console.log("\nPOST excerpts (limit 160):");
for (const [, slug, d] of posts) {
  const flag = d.length > 160 ? "TOO LONG" : "ok";
  console.log(`  ${String(d.length).padStart(4)}  ${flag.padEnd(9)} /blog/${slug}`);
}

// legal intros -- these are page copy, not descriptions, but flag the long ones
const legalBlock = src.slice(src.indexOf("legal: {"));
for (const m of legalBlock.matchAll(/(privacy|cancellation|safety|accessibility):\s*\{\s*title:[^,]*,\s*intro:\s*\n?\s*"([^"]*)"/g)) {
  console.log(`\nLEGAL intro ${m[1]}: ${m[2].length} chars (page copy, not metadata)`);
}
