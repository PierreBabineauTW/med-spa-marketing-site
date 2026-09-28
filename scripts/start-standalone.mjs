// Production start script for `output: "standalone"`.
//
// `next start` is not the right runner when standalone output is enabled, and
// the standalone server needs `.next/static` and `public/` copied next to it
// (the build leaves them in their original locations). This does both, so
// `npm start` does what it says.
//
// Usage: node scripts/start-standalone.mjs   (or `npm start`)
// Honours PORT and HOSTNAME.
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";

const ROOT = ".next/standalone";
const SERVER = `${ROOT}/server.js`;

if (!existsSync(SERVER)) {
  console.error(
    `No standalone build at ${SERVER}.\n` +
      `Run \`npm run build\` first.`
  );
  process.exit(1);
}

if (!existsSync(`${ROOT}/.next/static`)) {
  mkdirSync(`${ROOT}/.next`, { recursive: true });
  cpSync(".next/static", `${ROOT}/.next/static`, { recursive: true });
  console.log("copied .next/static");
}
if (!existsSync(`${ROOT}/public`)) {
  cpSync("public", `${ROOT}/public`, { recursive: true });
  console.log("copied public");
}

const child = spawn(process.execPath, [SERVER], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: process.env.PORT || "3000",
    HOSTNAME: process.env.HOSTNAME || "0.0.0.0",
  },
});
child.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
