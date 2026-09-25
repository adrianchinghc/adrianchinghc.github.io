// Kit fills a subscriber's Referrer and UTM fields from the page the form is
// submitted on. Someone who arrives from Google on an article and subscribes on
// /newsletter/ would otherwise be credited to this site. Keep the first outside
// source of this browser tab and give it to Kit's own fields when a newsletter
// form is submitted. Nothing is sent anywhere else, and the value is forgotten
// when the tab closes.
(() => {
  const key = "adrian_first_touch";
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const kitSubscription = /^https:\/\/app\.(kit|convertkit)\.com\/forms\/\d+\/subscriptions$/;

  function read() {
    try { return JSON.parse(sessionStorage.getItem(key) || "null"); } catch (_) { return null; }
  }

  function outsideReferrer(value) {
    try { return value && new URL(value).origin !== location.origin ? value : ""; } catch (_) { return ""; }
  }

  function campaign(search) {
    const found = new URLSearchParams(search);
    const kept = new URLSearchParams();
    campaignKeys.forEach((name) => {
      const value = found.get(name);
      if (value) kept.set(name, value.slice(0, 200));
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
    // Campaign tags on the signup page itself are the more specific answer.
    if (touch.campaign && !campaign(form.get("search") || "")) {
      const search = new URLSearchParams(form.get("search") || "");
      new URLSearchParams(touch.campaign).forEach((value, name) => search.set(name, value));
      const page = new URL(form.get("host") || location.href);
      page.search = search.toString();
      page.hash = "";
      form.set("search", page.search);
      form.set("host", page.href);
    }
    if (touch.referrer && !outsideReferrer(form.get("referrer") || "")) form.set("referrer", touch.referrer);
  }

  const nativeFetch = window.fetch;
  if (typeof nativeFetch !== "function") return;
  window.fetch = function (resource, options) {
    try {
      const url = typeof resource === "string" ? resource : resource?.url;
      if (kitSubscription.test(url || "") && options?.body instanceof FormData) attribute(options.body);
    } catch (_) { /* Kit keeps its own values. */ }
    return nativeFetch.apply(this, arguments);
  };
})();
