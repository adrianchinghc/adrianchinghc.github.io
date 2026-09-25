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
  const consentKey = "adrian_analytics_consent_v1";
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const kitSubscription = /^https:\/\/app\.(?:kit|convertkit)\.com\/forms\/\d+\/subscriptions\/?(?:\?|$)/;

  function read() {
    try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch (_) { return null; }
  }

  // A visitor who declined analytics gets no first-touch attribution either.
  function declined() {
    try { return localStorage.getItem(consentKey) === "declined"; } catch (_) { return false; }
  }

  function forget() {
    try { sessionStorage.removeItem(key); } catch (_) { /* Nothing was stored. */ }
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
  if (declined()) forget();
  else if (!read() && (arrival.referrer || arrival.campaign)) {
    try { sessionStorage.setItem(key, JSON.stringify(arrival)); } catch (_) { /* Kit keeps the current page's values. */ }
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest?.('[data-consent="decline"]')) forget();
  });

  function attribute(form) {
    if (declined()) return forget();
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
    // Blank when the first touch had tags but no outside referrer, as a signup
    // on that landing page would have sent; an internal page is not a source.
    form.set("referrer", touch.referrer || "");
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
