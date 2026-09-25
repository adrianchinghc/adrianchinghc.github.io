import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const code = readFileSync("src/assets/js/attribution.js", "utf8");
const kit = "https://app.kit.com/forms/9916003/subscriptions";

// Loads the script as one page view in a browser tab that shares `tab` storage.
function visit(href, referrer, tab) {
  const sent = [];
  const window = { fetch: (resource, options) => { sent.push({ resource, options }); return Promise.resolve(); } };
  const location = new URL(href);
  runInNewContext(code, {
    window, location, document: { referrer }, URL, URLSearchParams, FormData, JSON,
    sessionStorage: {
      getItem: (name) => tab.get(name) ?? null,
      setItem: (name, value) => tab.set(name, value)
    }
  });
  // Mirrors ck.5.js's submit: FormData with the page's own referrer, address and
  // query, sent through window.fetch. Update this if Kit changes its request.
  function subscribe(action = kit) {
    const form = new FormData();
    form.append("email_address", "reader@example.com");
    form.append("referrer", referrer);
    form.append("host", location.href);
    form.append("search", location.search);
    window.fetch(action, { method: "POST", body: form });
    return Object.fromEntries(sent.at(-1).options.body);
  }
  return { window, sent, subscribe };
}

test("a Google visitor who subscribes on a later page is credited to Google", () => {
  const tab = new Map();
  visit("https://adrianching.com/blog/where-should-a-b2b-company-use-ai-first/", "https://www.google.com/", tab);
  const fields = visit("https://adrianching.com/newsletter/", "https://adrianching.com/blog/where-should-a-b2b-company-use-ai-first/", tab).subscribe();
  assert.equal(fields.referrer, "https://www.google.com/");
  assert.equal(fields.search, "");
  assert.equal(fields.host, "https://adrianching.com/newsletter/");
  assert.equal(fields.email_address, "reader@example.com");
});

test("campaign tags from the landing page reach Kit's UTM fields on a later page", () => {
  const tab = new Map();
  visit("https://adrianching.com/blog/?utm_source=chatgpt.com&utm_medium=ai&ref=x", "", tab);
  const fields = visit("https://adrianching.com/newsletter/", "https://adrianching.com/blog/", tab).subscribe();
  assert.equal(fields.search, "?utm_source=chatgpt.com&utm_medium=ai");
  assert.equal(fields.host, "https://adrianching.com/newsletter/?utm_source=chatgpt.com&utm_medium=ai");
  assert.equal(fields.referrer, "https://adrianching.com/blog/", "no outside referrer was known, so Kit keeps its own");
});

test("the first outside source in a tab wins over later ones", () => {
  const tab = new Map();
  visit("https://adrianching.com/?utm_source=linkedin&utm_medium=social", "https://www.linkedin.com/", tab);
  visit("https://adrianching.com/about/", "https://www.google.com/", tab);
  const fields = visit("https://adrianching.com/newsletter/", "https://adrianching.com/about/", tab).subscribe();
  assert.equal(fields.referrer, "https://www.linkedin.com/");
  assert.equal(fields.search, "?utm_source=linkedin&utm_medium=social");
});

test("the signup page's own referrer and campaign tags are left alone", () => {
  const tab = new Map();
  visit("https://adrianching.com/?utm_source=youtube", "https://www.youtube.com/", tab);
  const fields = visit("https://adrianching.com/newsletter/?utm_source=kit&utm_campaign=welcome", "https://mail.google.com/", tab).subscribe();
  assert.equal(fields.referrer, "https://mail.google.com/");
  assert.equal(fields.search, "?utm_source=kit&utm_campaign=welcome");
});

test("a direct visit leaves Kit's values unchanged, and other requests are untouched", () => {
  const tab = new Map();
  const page = visit("https://adrianching.com/newsletter/", "", tab);
  assert.equal(tab.size, 0);
  assert.deepEqual(page.subscribe(), { email_address: "reader@example.com", referrer: "", host: "https://adrianching.com/newsletter/", search: "" });

  const other = visit("https://adrianching.com/blog/", "https://www.google.com/", tab);
  const body = new FormData();
  body.append("referrer", "https://adrianching.com/");
  other.window.fetch("https://example.com/forms/1/subscriptions", { method: "POST", body });
  other.window.fetch(kit.replace("subscriptions", "visit"), { method: "POST", body: "{}" });
  assert.equal(other.sent[0].options.body.get("referrer"), "https://adrianching.com/");
  assert.equal(other.sent[1].options.body, "{}");
});

test("blocked storage never stops the signup request", () => {
  const sent = [];
  const window = { fetch: (resource, options) => { sent.push(options); return Promise.resolve(); } };
  runInNewContext(code, {
    window, location: new URL("https://adrianching.com/newsletter/"), document: { referrer: "https://www.google.com/" },
    URL, URLSearchParams, FormData, JSON,
    sessionStorage: { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } }
  });
  const body = new FormData();
  body.append("referrer", "https://www.google.com/");
  window.fetch(kit, { method: "POST", body });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].body.get("referrer"), "https://www.google.com/");
});

test("a signup page's own outside referrer keeps first-touch tags out", () => {
  const tab = new Map();
  visit("https://adrianching.com/?utm_source=youtube&utm_medium=video", "https://www.youtube.com/", tab);
  const fields = visit("https://adrianching.com/newsletter/", "https://mail.google.com/", tab).subscribe();
  assert.equal(fields.referrer, "https://mail.google.com/");
  assert.equal(fields.search, "", "YouTube tags must not be paired with a Gmail referrer");
  assert.equal(fields.host, "https://adrianching.com/newsletter/");
});

test("a signup page's own campaign tags keep the first-touch referrer out", () => {
  const tab = new Map();
  visit("https://adrianching.com/blog/", "https://www.google.com/", tab);
  const fields = visit("https://adrianching.com/newsletter/?utm_source=kit", "https://adrianching.com/blog/", tab).subscribe();
  assert.equal(fields.search, "?utm_source=kit");
  assert.equal(fields.referrer, "https://adrianching.com/blog/", "a Google referrer must not be paired with Kit's campaign");
});

test("first-touch tags merge into a signup address with its own parameters and drop its fragment", () => {
  const tab = new Map();
  visit("https://adrianching.com/?utm_source=linkedin", "https://www.google.com/", tab);
  const fields = visit("https://adrianching.com/newsletter/?ref=x#join", "", tab).subscribe();
  assert.equal(fields.search, "?ref=x&utm_source=linkedin");
  assert.equal(fields.host, "https://adrianching.com/newsletter/?ref=x&utm_source=linkedin");
  assert.equal(fields.referrer, "https://www.google.com/");
});

test("only the referring site is kept, including app referrers", () => {
  const tab = new Map();
  visit("https://adrianching.com/blog/", "https://forum.example.com/thread/42?session=abc&email=a%40b.com", tab);
  const fields = visit("https://adrianching.com/newsletter/", "https://adrianching.com/blog/", tab).subscribe();
  assert.equal(fields.referrer, "https://forum.example.com/");

  const appTab = new Map();
  visit("https://adrianching.com/blog/", "android-app://com.google.android.gm/", appTab);
  const app = visit("https://adrianching.com/newsletter/", "https://adrianching.com/blog/", appTab).subscribe();
  assert.equal(app.referrer, "android-app://com.google.android.gm/");
});

test("Kit's older host, a trailing slash and URL objects are all recognised", () => {
  const tab = new Map();
  visit("https://adrianching.com/blog/", "https://www.google.com/", tab);
  for (const action of ["https://app.convertkit.com/forms/9916003/subscriptions", `${kit}/`, new URL(kit)]) {
    const fields = visit("https://adrianching.com/newsletter/", "https://adrianching.com/blog/", tab).subscribe(action);
    assert.equal(fields.referrer, "https://www.google.com/", String(action));
  }
});

test("long campaign values are cut without splitting a character", () => {
  const tab = new Map();
  const value = `${"a".repeat(199)}😀😀`;
  visit(`https://adrianching.com/?utm_campaign=${encodeURIComponent(value)}`, "", tab);
  const fields = visit("https://adrianching.com/newsletter/", "", tab).subscribe();
  const kept = new URLSearchParams(fields.search).get("utm_campaign");
  assert.equal(kept, `${"a".repeat(199)}😀`);
  assert.ok(!kept.includes("�"));
});
