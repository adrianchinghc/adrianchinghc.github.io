import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { purgeUrls, purge } from "./purge-cloudflare.mjs";

const code = readFileSync("src/assets/js/prefetch.js", "utf8");
function run({ supported = true, connection, visibility = "visible" } = {}) {
  const added = [];
  let load;
  const links = ["/about/", "/newsletter/", "/newsletter/", "/", "/about/#story", "/about/?x=1", "https://example.com/"];
  runInNewContext(code, {
    URL, navigator: { connection }, HTMLScriptElement: { supports: () => supported },
    location: { href: "https://adrianching.com/", origin: "https://adrianching.com", pathname: "/" },
    window: { addEventListener: (event, callback) => { assert.equal(event, "load"); load = callback; } },
    document: {
      visibilityState: visibility, readyState: "loading", head: { append: (el) => added.push(el) },
      createElement: () => ({}),
      querySelectorAll: () => links.map((href) => ({ href, target: "", hasAttribute: () => false }))
    }
  });
  assert.equal(added.length, 0, "must wait for the current page to load");
  load?.();
  return added;
}
test("prefetch is bounded to unique same-origin navigation pages", () => {
  const rules = run();
  assert.equal(rules.length, 1);
  assert.equal(rules[0].type, "speculationrules");
  assert.deepEqual(JSON.parse(rules[0].textContent), { prefetch: [{ source: "list", urls: ["https://adrianching.com/about/", "https://adrianching.com/newsletter/"], eagerness: "immediate" }] });
});
test("unsupported, hidden and data-saving browsers retain ordinary navigation", () => {
  for (const options of [{ supported: false }, { visibility: "hidden" }, { connection: { saveData: true } }, { connection: { effectiveType: "slow-2g" } }]) assert.equal(run(options).length, 0);
});
test("purge includes directory aliases and rejects other origins", () => {
  const urls = purgeUrls('<loc>https://adrianching.com/about/</loc><loc>https://example.com/</loc>');
  assert.ok(urls.includes("https://adrianching.com/about/index.html"));
  assert.ok(urls.includes("https://adrianching.com/about"));
  assert.equal(urls.length, 5);
});
test("purge uses bounded batches and fails on API errors", async () => {
  const calls = [];
  const config = { token: "test", zone: "a".repeat(32), urls: Array.from({ length: 61 }, (_, i) => `https://adrianching.com/${i}/`) };
  await purge({ ...config, request: async (url, options) => { calls.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ success: true }) }; } });
  assert.deepEqual(calls.map((call) => call.files.length), [30, 30, 1]);
  await assert.rejects(purge({ ...config, request: async () => ({ ok: false, status: 403, json: async () => ({ success: false }) }) }), /purge failed/);
  await assert.rejects(purge({ ...config, token: "" }), /credentials/);
});
