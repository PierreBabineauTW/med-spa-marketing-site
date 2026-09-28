// Prints the value of a CSS custom property, searching upkeep.css then
// globals.css. Used to reason about computed sizes without guessing.
import { readFileSync } from "node:fs";

const files = [
  "src/app/globals.css",
  "src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css",
];
for (const name of process.argv.slice(2)) {
  let found = false;
  for (const f of files) {
    let src;
    try { src = readFileSync(f, "utf8"); } catch { continue; }
    const lines = src.split(/\r?\n/);
    lines.forEach((l, i) => {
      if (l.includes(`${name}:`) && !found) {
        console.log(`${f}:${i + 1}  ${l.trim()}`);
        found = true;
      }
    });
  }
  if (!found) console.log(`${name}: NOT FOUND`);
}
