// Workers Builds runs `npm run deploy:cloudflare` after a successful production
// build. It deploys, checks the live site against the build, and rolls back to
// the previous release if the check fails, so a broken release is replaced
// within about a minute and the build is marked failed.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { smokeCheckWithRetries } from "./smoke-check.mjs";

// wrangler.jsonc uses whole-line comments only, so JSON.parse can read the rest.
export function readWranglerConfig(text = readFileSync("wrangler.jsonc", "utf8")) {
  return JSON.parse(text.split("\n").filter((line) => !/^\s*\/\//.test(line)).join("\n"));
}

// The site's own domain once the Worker serves it; before the cutover the
// Worker has no route and production is still GitHub Pages.
export function liveOrigin(config) {
  const route = (config.routes || []).find(({ pattern }) => /^adrianching\.com\/\*$/.test(pattern));
  return route ? "https://adrianching.com" : "";
}

function wrangler(...args) {
  return spawnSync("npx", ["wrangler", ...args], { stdio: "inherit" }).status === 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!wrangler("deploy")) process.exit(1);
  const origin = process.env.SMOKE_ORIGIN || liveOrigin(readWranglerConfig());
  if (!origin) {
    console.log("The Worker does not serve adrianching.com yet, so there is no live check.");
    process.exit(0);
  }
  const errors = await smokeCheckWithRetries({ origin });
  if (!errors.length) {
    console.log(`Live check passed on ${origin}.`);
    process.exit(0);
  }
  console.error(`Live check failed on ${origin}:\n${errors.join("\n")}\nRolling back to the previous release.`);
  wrangler("rollback", "--yes", "--message", "Live check failed after deploy");
  process.exit(1);
}
