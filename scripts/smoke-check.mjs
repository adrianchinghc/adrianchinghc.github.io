import { readFileSync } from "node:fs";
import { join } from "node:path";

// Checks a just-deployed site against the build that was deployed: the new
// release is live, the essentials answer, and redirects and caching hold.
export async function smokeCheck({ origin, output = "_site", request = fetch, now = Date.now() }) {
  const errors = [];
  const get = (path) => request(new URL(path, origin), { redirect: "manual", headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(20000) });
  const local = (file) => readFileSync(join(output, file), "utf8");
  const assets = [...new Set(local("index.html").match(/\/static\/[\w.-]+\.(?:css|js)/g) || [])];

  const home = await get(`/?smoke=${now}`);
  const homeHtml = await home.text();
  if (home.status !== 200) errors.push(`/ answered ${home.status}`);
  if (!homeHtml.includes(`<link rel="canonical" href="https://adrianching.com/">`)) errors.push("/ is missing its canonical link");
  // Versioned file names change with their content, so a stale release fails here.
  for (const asset of assets) if (!homeHtml.includes(`"${asset}"`)) errors.push(`/ does not reference this release's ${asset}`);

  for (const file of ["sitemap.xml", "robots.txt"]) {
    const response = await get(`/${file}?smoke=${now}`);
    if (response.status !== 200 || (await response.text()) !== local(file)) errors.push(`/${file} does not match this release`);
  }
  if (assets[0]) {
    const response = await get(assets[0]);
    if (response.status !== 200) errors.push(`${assets[0]} answered ${response.status}`);
    if (!/immutable/.test(response.headers.get("cache-control") || "")) errors.push(`${assets[0]} is not cached as immutable`);
  }
  for (const [path, destination] of [["/about", "/about/"], ["/work/", "/work-with-me/"]]) {
    const response = await get(path);
    const location = response.headers.get("location") || "";
    if (response.status !== 301 || new URL(location, origin).pathname !== destination) errors.push(`${path} should 301 to ${destination}, got ${response.status} ${location}`);
  }
  const missing = await get(`/smoke-check-missing-${now}/`);
  if (missing.status !== 404) errors.push(`A missing page answered ${missing.status}, not 404`);
  return errors;
}

// A fresh deployment can take a few seconds to reach every location.
export async function smokeCheckWithRetries(options, { attempts = 5, delay = 10000, wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
  let errors = [];
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      errors = await smokeCheck(options);
    } catch (error) {
      errors = [`Request failed: ${error.message}`];
    }
    if (!errors.length) return [];
    if (attempt < attempts) await wait(delay);
  }
  return errors;
}
