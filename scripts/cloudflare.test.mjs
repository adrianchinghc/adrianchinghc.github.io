import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pageRedirects, parseRedirects, redirectsFile } from "./cloudflare.mjs";
import { buildSteps, productionMeasurementId } from "./cloudflare-build.mjs";
import { liveOrigin, readWranglerConfig } from "./cloudflare-deploy.mjs";
import { smokeCheck, smokeCheckWithRetries } from "./smoke-check.mjs";
import { isReviewPreview, showsScheduledArticles } from "./publication.mjs";
import { corePages, lighthouseUrls, newestArticle, pageForSource } from "./lighthouse-urls.mjs";

test("every page gets a permanent redirect from its other addresses", () => {
  const rules = parseRedirects("# comment\n/work/ /work-with-me/ 301\n");
  assert.deepEqual(pageRedirects(["/about", "/", "/work"], rules), [
    { source: "/index.html", destination: "/", status: 301 },
    { source: "/about", destination: "/about/", status: 301 },
    { source: "/about/index.html", destination: "/about/", status: 301 },
    { source: "/work", destination: "/work/", status: 301 },
    { source: "/work/index.html", destination: "/work/", status: 301 }
  ]);
  // A hand-written rule for an address wins over the generated one.
  const withAlias = parseRedirects("/work /work-with-me/ 301\n/work/index.html /work-with-me/ 301");
  assert.deepEqual(pageRedirects(["/work"], withAlias), []);
});

test("redirect rules are validated before Cloudflare sees them", () => {
  assert.throws(() => parseRedirects("/old /new"), /Invalid redirect rule/);
  assert.throws(() => parseRedirects("old /new 301"), /Invalid redirect rule/);
  assert.throws(() => parseRedirects("/old /new 200"), /Invalid redirect rule/);
  assert.throws(() => redirectsFile(parseRedirects("/a /b 301\n/a /c 301")), /Duplicate redirect source/);
  const tooMany = Array.from({ length: 2001 }, (_, index) => ({ source: `/${index}`, destination: "/", status: 301 }));
  assert.throws(() => redirectsFile(tooMany), /allows 2000 redirects/);
  assert.equal(redirectsFile(parseRedirects("/a /b 301")), "/a /b 301\n");
});

test("production builds check, test and send analytics to the production property", () => {
  for (const env of [{ WORKERS_CI_BRANCH: "source" }, {}]) {
    const steps = buildSteps(env);
    assert.deepEqual(steps.map(({ command }) => command.join(" ")), ["npm run build", "npm run check", "node --test scripts/*.test.mjs"]);
    for (const step of steps) {
      assert.equal(step.env.SITE_ENV, "production");
      assert.equal(step.env.GA_MEASUREMENT_ID, productionMeasurementId);
    }
  }
});

test("branch previews build, check and test a preview without any tracking", () => {
  const steps = buildSteps({ WORKERS_CI_BRANCH: "new-article", GA_MEASUREMENT_ID: "G-TEST", META_PIXEL_ID: "1", HOTJAR_ID: "2", PATH: "/bin" });
  assert.deepEqual(steps.map(({ command, env }) => `${command.join(" ")} ${env.SITE_ENV}`), [
    "npm run build preview",
    "npm run check preview",
    "node --test scripts/*.test.mjs preview"
  ]);
  for (const { env } of steps) {
    for (const name of ["GA_MEASUREMENT_ID", "META_PIXEL_ID", "HOTJAR_ID", "GOOGLE_SITE_VERIFICATION"]) assert.equal(env[name], undefined, name);
    assert.equal(env.PATH, "/bin");
  }
});

test("the Worker configuration serves the built site with real 404s", () => {
  const config = readWranglerConfig();
  assert.equal(config.name, "adrianching");
  assert.deepEqual(config.assets, { directory: "./_site", not_found_handling: "404-page", html_handling: "auto-trailing-slash" });
  assert.equal(config.main, undefined, "the site needs no Worker script");
  // The live check starts only once the Worker serves the domain.
  assert.equal(liveOrigin({}), "");
  assert.equal(liveOrigin({ routes: [{ pattern: "adrianching.com/*", zone_name: "adrianching.com" }] }), "https://adrianching.com");
  assert.equal(liveOrigin({ routes: [{ pattern: "www.adrianching.com/*" }] }), "");
});

function fakeSite(overrides = {}) {
  const output = mkdtempSync(join(tmpdir(), "smoke-"));
  writeFileSync(join(output, "index.html"), '<link rel="canonical" href="https://adrianching.com/"><link href="/static/site.abc123.css"><script src="/static/site.def456.js"></script>');
  writeFileSync(join(output, "sitemap.xml"), "<urlset></urlset>");
  writeFileSync(join(output, "robots.txt"), "User-agent: *");
  const pages = {
    "/": { status: 200, body: () => readFileSync(join(output, "index.html"), "utf8") },
    "/sitemap.xml": { status: 200, body: () => readFileSync(join(output, "sitemap.xml"), "utf8") },
    "/robots.txt": { status: 200, body: () => readFileSync(join(output, "robots.txt"), "utf8") },
    "/static/site.abc123.css": { status: 200, headers: { "cache-control": "public, max-age=31536000, immutable" } },
    "/about": { status: 301, headers: { location: "/about/" } },
    "/work/": { status: 301, headers: { location: "https://adrianching.com/work-with-me/" } },
    ...overrides
  };
  const requested = [];
  const request = async (url) => {
    requested.push(url.pathname);
    const page = pages[url.pathname] ?? { status: 404 };
    return { status: page.status, headers: new Headers(page.headers || {}), text: async () => page.body?.() ?? "" };
  };
  return { output, request, requested, cleanup: () => rmSync(output, { recursive: true, force: true }) };
}

test("the live check passes a healthy release", async () => {
  const site = fakeSite();
  try {
    assert.deepEqual(await smokeCheck({ origin: "https://adrianching.com", output: site.output, request: site.request, now: 1 }), []);
    assert.ok(site.requested.includes("/smoke-check-missing-1/"));
  } finally { site.cleanup(); }
});

test("the live check fails a stale, broken or misrouted release", async () => {
  const site = fakeSite({
    "/": { status: 200, body: () => '<link rel="canonical" href="https://adrianching.com/"><link href="/static/site.old.css">' },
    "/sitemap.xml": { status: 200, body: () => "<urlset>old</urlset>" },
    "/static/site.abc123.css": { status: 200, headers: { "cache-control": "public, max-age=0" } },
    "/about": { status: 307, headers: { location: "/about/" } },
    "/smoke-check-missing-1/": { status: 200 }
  });
  try {
    const errors = await smokeCheck({ origin: "https://adrianching.com", output: site.output, request: site.request, now: 1 });
    for (const expected of [/site\.abc123\.css/, /site\.def456\.js/, /sitemap\.xml does not match/, /not cached as immutable/, /\/about should 301/, /missing page answered 200/]) {
      assert.ok(errors.some((error) => expected.test(error)), `${expected} in ${errors.join("; ")}`);
    }
  } finally { site.cleanup(); }
});

test("the live check waits out a deployment that is still spreading", async () => {
  let calls = 0;
  const waits = [];
  const site = fakeSite();
  const request = async (url) => {
    if (url.pathname === "/") calls += 1;
    if (calls < 3) throw new Error("not yet");
    return site.request(url);
  };
  try {
    const options = { origin: "https://adrianching.com", output: site.output, request, now: 1 };
    assert.deepEqual(await smokeCheckWithRetries(options, { wait: async (ms) => waits.push(ms) }), []);
    assert.deepEqual(waits, [10000, 10000]);
    const failing = await smokeCheckWithRetries({ ...options, request: async () => { throw new Error("down"); } }, { attempts: 2, wait: async () => {} });
    assert.deepEqual(failing, ["Request failed: down"]);
  } finally { site.cleanup(); }
});

test("audit builds show scheduled articles but stay indexable; Vercel's variable still counts", () => {
  const previous = { SITE_ENV: process.env.SITE_ENV, VERCEL_ENV: process.env.VERCEL_ENV };
  const cases = [
    [{}, false, false],
    [{ SITE_ENV: "production" }, false, false],
    [{ SITE_ENV: "preview" }, true, true],
    [{ SITE_ENV: "audit" }, false, true],
    [{ VERCEL_ENV: "preview" }, true, true],
    [{ VERCEL_ENV: "production" }, false, false]
  ];
  try {
    for (const [env, preview, scheduled] of cases) {
      delete process.env.SITE_ENV;
      delete process.env.VERCEL_ENV;
      Object.assign(process.env, env);
      assert.equal(isReviewPreview(), preview, JSON.stringify(env));
      assert.equal(showsScheduledArticles(), scheduled, JSON.stringify(env));
    }
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("Lighthouse audits the core pages, the newest article and every changed page", () => {
  const output = mkdtempSync(join(tmpdir(), "lighthouse-"));
  try {
    for (const page of ["", "client-stories", "work-with-me", "newsletter", "about", "blog/new-post", "blog/older-post", "ai-profit-opportunity-audit/example"]) {
      mkdirSync(join(output, page), { recursive: true });
      writeFileSync(join(output, page, "index.html"), "");
    }
    const changed = ["src/about/index.njk", "src/articles/new-post.md", "src/ai-profit-opportunity-audit/example/index.njk", "src/assets/css/site.css", "src/articles/deleted-post.md", "README.md"];
    assert.deepEqual(lighthouseUrls(changed, { output, newest: "/blog/older-post/" }), [
      "/", "/client-stories/", "/work-with-me/", "/newsletter/", "/about/", "/blog/new-post/", "/ai-profit-opportunity-audit/example/", "/blog/older-post/"
    ]);
    // A site-wide change still audits the article template through the newest article.
    assert.deepEqual(lighthouseUrls(["src/assets/css/site.css"], { output, newest: "/blog/new-post/" }), [...corePages, "/blog/new-post/"]);
    assert.equal(pageForSource("src/index.njk"), "/");
    assert.equal(pageForSource("src/_includes/layouts/base.njk"), null);
    // The newest published or scheduled article in the repository exists.
    assert.match(newestArticle(), /^\/blog\/[\w-]+\/$/);
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});
