// Runs ESLint programmatically and prints each warning with its file, so the
// list can be acted on. (The default human formatter is interleaved with npm's
// own output, which hides the filenames.)
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// On Windows npx is a .cmd shim that cannot be spawned directly, so the ESLint
// binary is invoked through node. `fileURLToPath` yields a native path; the
// leading-slash-on-drive-letter form that `.pathname` produces must be stripped
// or node resolves it against the current drive and fails.
const eslintBin = fileURLToPath(new URL("../node_modules/eslint/bin/eslint.js", import.meta.url));

const out = execFileSync(
  process.execPath,
  [eslintBin, "--format", "json", "."],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
);

const results = JSON.parse(out);
let total = 0;

for (const f of results) {
  if (!f.messages.length) continue;
  const rel = f.filePath.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", "");
  console.log(`\n${rel}`);
  for (const m of f.messages) {
    total++;
    const where = m.line ? `L${m.line}:${m.column}` : "";
    console.log(`  ${where.padEnd(10)} ${m.severity === 2 ? "ERROR" : "warn "}  ${m.message}  [${m.ruleId}]`);
  }
}

const errors = results.reduce((n, f) => n + f.errorCount, 0);
console.log(`\n${total} problems, ${errors} errors`);
process.exitCode = errors === 0 ? 0 : 1;
