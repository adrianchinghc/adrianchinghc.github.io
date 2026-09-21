import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { purgeUrls, purge } from "./purge-cloudflare.mjs";

const code = readFileSync("src/assets/js/prefetch.js", "utf8");
function run({ supported = true, connection, visibility = "visible", readyState = "complete" } = {}) {
  const added = [];
  const events = {};
  runInNewContext(code, {
    URL, navigator: { connection }, HTMLScriptElement: { supports: () => supported },
    location: { href: "https://adrianching.com/", origin: "https://adrianching.com", pathname: "/" },
    document: {
      visibilityState: visibility, readyState, head: { append: (el) => added.push(el) },
      createElement: () => ({}), addEventListener: (event, callback) => { events[event] = callback; }
    }
  });
  assert.equal(added.length, 0, "page load must not start speculative requests");
  return {
    added,
    intent(href, { type = "pointerover", pointerType = "mouse", target = "", download = false, inNav = true } = {}) {
      events[type]?.({ type, pointerType, target: { closest: () => inNav ? { href, target, hasAttribute: () => download } : null } });
    }
  };
}
test("prefetch waits for intent and fetches only the intended navigation page once", () => {
  const page = run();
  page.intent("/newsletter/");
  page.intent("/newsletter/");
  page.intent("/about/", { type: "focusin" });
  assert.equal(page.added.length, 2);
  assert.equal(page.added[0].type, "speculationrules");
  assert.deepEqual(JSON.parse(page.added[0].textContent), { prefetch: [{ source: "list", urls: ["https://adrianching.com/newsletter/"], eagerness: "immediate" }] });
});
test("prefetch excludes other origins, special links and touch navigation and stays bounded", () => {
  const page = run();
  for (const href of ["/", "/about/#story", "/about/?x=1", "https://example.com/", "/file.pdf"]) page.intent(href);
  for (const options of [{ pointerType: "touch" }, { target: "_blank" }, { download: true }, { inNav: false }]) page.intent("/about/", options);
  assert.equal(page.added.length, 0);
  for (let i = 0; i < 10; i++) page.intent(`/page-${i}/`);
  assert.equal(page.added.length, 6);
});
test("unsupported, loading, hidden and data-saving browsers retain ordinary navigation", () => {
  for (const options of [{ supported: false }, { readyState: "loading" }, { visibility: "hidden" }, { connection: { saveData: true } }, { connection: { effectiveType: "slow-2g" } }]) {
    const page = run(options);
    page.intent("/newsletter/");
    page.intent("/about/", { type: "focusin" });
    assert.equal(page.added.length, 0);
  }
});
test("purge includes directory aliases and rejects other origins", () => {
  const urls = purgeUrls('<loc>https://adrianching.com/about/</loc><loc>https://example.com/</loc>');
  assert.ok(urls.includes("https://adrianching.com/about/index.html"));
  assert.ok(urls.includes("https://adrianching.com/about"));
  assert.ok(urls.includes("https://adrianching.com/sitemap.xml"));
  assert.equal(urls.length, 6);
});
test("purge uses bounded batches and fails on API errors", async () => {
  const calls = [];
  const config = { token: "test", zone: "a".repeat(32), urls: Array.from({ length: 61 }, (_, i) => `https://adrianching.com/${i}/`) };
  await purge({ ...config, request: async (url, options) => { calls.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ success: true }) }; } });
  assert.deepEqual(calls.map((call) => call.files.length), [30, 30, 1]);
  await assert.rejects(purge({ ...config, request: async () => ({ ok: false, status: 403, json: async () => ({ success: false }) }) }), /purge failed/);
  await assert.rejects(purge({ ...config, token: "" }), /credentials/);
});
