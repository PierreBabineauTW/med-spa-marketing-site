// Boots the standalone build, runs the given script against it, then shuts down.
// The sandbox reaps background processes between shell invocations, so the server
// and the test have to share one process tree.
//
// Usage: node scripts/with-server.mjs <script.mjs> [args...]
import { spawn } from "node:child_process";
import { existsSync, cpSync, mkdirSync } from "node:fs";

const [, , target, ...args] = process.argv;
if (!target) { console.error("usage: node scripts/with-server.mjs <script.mjs>"); process.exit(1); }

// `output: standalone` does not copy these into .next/standalone
if (!existsSync(".next/standalone/.next/static")) {
  mkdirSync(".next/standalone/.next", { recursive: true });
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
}
if (!existsSync(".next/standalone/public")) cpSync("public", ".next/standalone/public", { recursive: true });

const PORT = process.env.PORT || "3100";
const server = spawn(process.execPath, [".next/standalone/server.js"], {
  env: { ...process.env, PORT, HOSTNAME: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

const probe = async () => {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/`);
    return r.ok ? "ok" : "HTTP " + r.status;
  } catch (e) {
    return e.cause?.code || e.message;
  }
};

const waitForServer = async (ms = 20000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if ((await probe()) === "ok") return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
};

const up = await waitForServer();
if (!up) {
  console.error("server did not start:\n" + serverLog);
  server.kill();
  process.exit(1);
}
console.log(`[with-server] up on :${PORT} -> running ${target}\n`);

const child = spawn(process.execPath, [target, ...args], {
  env: { ...process.env, BASE_URL: `http://127.0.0.1:${PORT}` },
  stdio: "inherit",
});
const code = await new Promise((r) => child.on("exit", r));
if (code !== 0) {
  const alive = await probe().catch(() => "unreachable");
  console.error(`\n[with-server] child exited ${code}. server ${alive === "ok" ? "still up" : "NOT responding: " + alive}`);
  if (serverLog.trim()) console.error("[with-server] server log:\n" + serverLog.slice(0, 1500));
}
server.kill("SIGTERM");
await new Promise((r) => setTimeout(r, 300));
if (!server.killed) server.kill("SIGKILL");
process.exit(code ?? 0);
