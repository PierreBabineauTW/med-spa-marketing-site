// Prints a line range of upkeep.css (1-indexed, inclusive) with line numbers.
// Usage: node scripts/css-range.mjs <start> <end> [searchFor]
import { readFileSync } from "node:fs";
const f = "src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css";
const lines = readFileSync(f, "utf8").split(/\r?\n/);

if (process.argv[4]) {
  const needle = process.argv[4];
  lines.forEach((l, i) => { if (l.includes(needle)) console.log(`${i + 1}: ${l}`); });
} else {
  const a = Number(process.argv[2]), b = Number(process.argv[3]);
  for (let i = a; i <= b && i <= lines.length; i++) console.log(`${i}: ${lines[i - 1]}`);
}
