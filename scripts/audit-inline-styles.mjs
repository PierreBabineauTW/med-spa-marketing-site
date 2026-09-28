// Counts inline `style` attributes in shipped source. A strict CSP needs
// style-src 'unsafe-inline' unless these are all removed, so the number is
// documented rather than guessed.
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter((f) => /^src\/.*\.(tsx|ts)$/.test(f))
  .filter((f) => { try { return statSync(f).isFile(); } catch { return false; } });

let total = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const lines = src.split(/\r?\n/);
  lines.forEach((l, i) => {
    if (/\bstyle=\{\{/.test(l)) {
      total++;
      console.log(`  ${f}:${i + 1}  ${l.trim().slice(0, 88)}`);
    }
  });
}
console.log(`\ninline style={...} attributes in shipped source: ${total}`);
console.log(
  total === 0
    ? "style-src can omit 'unsafe-inline'."
    : "A strict CSP needs style-src 'unsafe-inline' until these are moved into a class."
);
