// Kit fills a subscriber's Referrer and UTM fields from the page the form is
// submitted on. Someone who arrives from Google on an article and subscribes on
// /newsletter/ would otherwise be credited to this site. Keep the first outside
// source of this browser tab and give it to Kit's own fields when a newsletter
// form is submitted. Nothing is sent anywhere else, and the value lives only in
// this tab's session storage.
//
// This relies on ck.5.js sending its FormData, including the referrer, host and
// search fields, through window.fetch. docs/MEASUREMENT-SEO.md says how to recheck.
(() => {
  const key = "adrian_first_touch";
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const kitSubscription = /^https:\/\/app\.(?:kit|convertkit)\.com\/forms\/\d+\/subscriptions\/?(?:\?|$)/;

  function read() {
    try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch (_) { return null; }
  }

  // Keeps only the referring site, which is all attribution needs. Paths and
  // query strings can carry search terms or IDs. App referrers such as
  // android-app://com.google.android.gm/ have no web origin, so keep the host.
  function outsideReferrer(value) {
    try {
      const url = new URL(value);
      return url.origin !== location.origin ? `${url.protocol}//${url.host}/` : "";
    } catch (_) { return ""; }
  }

  function campaign(search) {
    const found = new URLSearchParams(search);
    const kept = new URLSearchParams();
    campaignKeys.forEach((name) => {
      const value = found.get(name);
      if (value) kept.set(name, Array.from(value).slice(0, 200).join(""));
    });
    return kept.toString();
  }

  const arrival = { referrer: outsideReferrer(document.referrer), campaign: campaign(location.search) };
  if (!read() && (arrival.referrer || arrival.campaign)) {
    try { sessionStorage.setItem(key, JSON.stringify(arrival)); } catch (_) { /* Kit keeps the current page's values. */ }
  }

  function attribute(form) {
    const touch = read();
    if (!touch) return;
    // The signup page's own outside source is the more specific answer. Keep it
    // whole: mixing its referrer with first-touch tags would name two sources.
    if (outsideReferrer(form.get("referrer") || "") || campaign(form.get("search") || "")) return;
    if (touch.campaign) {
      const search = new URLSearchParams(form.get("search") || "");
      new URLSearchParams(touch.campaign).forEach((value, name) => search.set(name, value));
      const page = new URL(form.get("host") || location.href);
      page.search = search.toString();
      page.hash = "";
      form.set("search", page.search);
      form.set("host", page.href);
    }
    if (touch.referrer) form.set("referrer", touch.referrer);
  }

  const nativeFetch = window.fetch;
  if (typeof nativeFetch !== "function") return;
  window.fetch = function (resource, options) {
    try {
      if (kitSubscription.test(String(resource?.url ?? resource)) && options?.body instanceof FormData) attribute(options.body);
    } catch (_) { /* Kit keeps its own values. */ }
    return nativeFetch.apply(this, arguments);
  };
})();
