// Workers Builds runs `npm run build:cloudflare` for every branch it builds.
// A failing step fails the build, so nothing is deployed.
//
// The production branch builds, checks and tests the site it deploys. Other
// branches do the same for the review preview they deploy. A change that
// breaks production still fails the production build, before it deploys.
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const productionBranch = "source";
// Adrian's public GA4 ID. Only production sends to it.
export const productionMeasurementId = "G-Z7QMLP7BSE";
const trackingVariables = ["GA_MEASUREMENT_ID", "META_PIXEL_ID", "HOTJAR_ID", "GOOGLE_SITE_VERIFICATION"];

function withoutTracking(env) {
  const clean = { ...env };
  for (const name of trackingVariables) delete clean[name];
  return clean;
}

export function buildSteps(env) {
  const build = ["npm", "run", "build"];
  const check = ["npm", "run", "check"];
  const test = ["node", "--test", "scripts/*.test.mjs"];
  // Without Workers Builds' branch variable, as on a local run, build production.
  if (!env.WORKERS_CI_BRANCH || env.WORKERS_CI_BRANCH === productionBranch) {
    const production = { ...env, SITE_ENV: "production", GA_MEASUREMENT_ID: env.GA_MEASUREMENT_ID || productionMeasurementId };
    return [build, check, test].map((command) => ({ command, env: production }));
  }
  // Preview traffic must never reach the production analytics property.
  const preview = { ...withoutTracking(env), SITE_ENV: "preview" };
  return [build, check, test].map((command) => ({ command, env: preview }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const { command, env } of buildSteps(process.env)) {
    console.log(`\n> ${command.join(" ")} (SITE_ENV=${env.SITE_ENV})`);
    // The shell expands scripts/*.test.mjs, as it does in the workflows.
    const result = spawnSync(command.join(" "), { env, shell: true, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
