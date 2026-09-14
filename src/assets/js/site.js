const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  const wideScreen = window.matchMedia("(min-width: 761px)");
  const label = toggle.querySelector(".nav-label");
  const setMenu = (open, instant = true) => {
    nav.dataset.motion = instant ? "instant" : "pointer";
    toggle.dataset.motion = nav.dataset.motion;
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close menu" : "Menu";
    nav.classList.toggle("is-open", open);
    // Closed mobile links leave the tab order immediately, including during exit.
    nav.inert = !wideScreen.matches && !open;
  };
  setMenu(false);
  document.documentElement.classList.add("nav-ready");
  toggle.addEventListener("click", (event) => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setMenu(open, event.detail === 0);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false, event.detail === 0);
  });
  document.addEventListener("focusin", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
  });
  wideScreen.addEventListener("change", () => setMenu(false));
}

// Keyboard section jumps are immediate; pointer-initiated jumps retain native smooth scrolling.
document.addEventListener("keydown", () => { document.documentElement.dataset.input = "keyboard"; });
document.addEventListener("pointerdown", () => { document.documentElement.dataset.input = "pointer"; });

const analyticsConfig = window.acAnalytics || {};
const consentBanner = document.querySelector("[data-consent-banner]");
const consentKey = "adrian_analytics_consent_v1";
let analyticsReady = false;

function safeStorage(action, value) {
  try {
    if (action === "get") return localStorage.getItem(consentKey);
    if (action === "set") localStorage.setItem(consentKey, value);
    if (action === "remove") localStorage.removeItem(consentKey);
  } catch (_) {
    return null;
  }
  return value;
}

function addScript(src) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadAnalytics() {
  if (analyticsReady) return;
  analyticsReady = true;

  if (analyticsConfig.ga) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsConfig.ga, { send_page_view: true, transport_type: "beacon" });
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.ga)}`);
  }

  if (analyticsConfig.metaPixel) {
    window.fbq = window.fbq || function () { (window.fbq.q = window.fbq.q || []).push(arguments); };
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq("init", analyticsConfig.metaPixel);
    window.fbq("track", "PageView");
    addScript("https://connect.facebook.net/en_US/fbevents.js");
  }

  if (analyticsConfig.hotjar) {
    window.hj = window.hj || function () { (window.hj.q = window.hj.q || []).push(arguments); };
    window._hjSettings = { hjid: Number(analyticsConfig.hotjar), hjsv: 6 };
    addScript(`https://static.hotjar.com/c/hotjar-${window._hjSettings.hjid}.js?sv=${window._hjSettings.hjsv}`);
  }

  track("system_theme", { theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" });
}

function track(eventName, eventData = {}) {
  if (!analyticsReady) return;
  const data = { page_path: window.location.pathname, ...eventData };
  if (typeof window.gtag === "function") window.gtag("event", eventName, data);
  if (typeof window.fbq === "function") window.fbq("trackCustom", eventName, data);
  if (typeof window.hj === "function") window.hj("event", eventName);
}

const existingConsent = safeStorage("get");
if (existingConsent === "accepted") loadAnalytics();
else if (consentBanner && existingConsent !== "declined") consentBanner.hidden = false;

document.querySelectorAll("[data-consent]").forEach((button) => {
  button.addEventListener("click", () => {
    const accepted = button.dataset.consent === "accept";
    safeStorage("set", accepted ? "accepted" : "declined");
    consentBanner.hidden = true;
    if (accepted) {
      loadAnalytics();
      track("analytics_consent_accepted");
    }
  });
});

document.querySelectorAll("[data-consent-reset]").forEach((button) => {
  button.addEventListener("click", () => {
    safeStorage("remove");
    window.location.reload();
  });
});

function linkData(link) {
  const url = new URL(link.href, window.location.href);
  return {
    link_text: (link.getAttribute("aria-label") || link.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
    link_domain: url.hostname,
    link_path: url.pathname,
    cta_location: link.dataset.cta || link.closest("section, header, footer")?.id || link.closest("section, header, footer")?.className || "page"
  };
}

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", () => {
    const url = new URL(link.href, window.location.href);
    const data = linkData(link);
    let eventName = url.origin === "https://calendly.com" ? "founder_fit_call_click" : "link_click";
    if (link.matches("[data-media-link]")) eventName = "youtube_click";
    else if (url.pathname === "/work-with-me/") eventName = "work_with_me_click";
    else if (url.pathname === "/newsletter/") eventName = "newsletter_click";
    else if (url.origin !== window.location.origin) eventName = "outbound_click";
    track(eventName, data);
  });
});

const scrollMarks = new Set();
function trackScrollDepth() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  if (available <= 0) return;
  const depth = Math.round((window.scrollY / available) * 100);
  [25, 50, 75, 90].forEach((mark) => {
    if (depth >= mark && !scrollMarks.has(mark)) {
      scrollMarks.add(mark);
      track("scroll_depth", { percent_scrolled: mark });
    }
  });
}
window.addEventListener("scroll", trackScrollDepth, { passive: true });

[30, 60, 120].forEach((seconds) => {
  window.setTimeout(() => {
    if (document.visibilityState === "visible") track("engaged_time", { seconds });
  }, seconds * 1000);
});

function observeMetric(type, callback) {
  try { new PerformanceObserver(callback).observe({ type, buffered: true }); } catch (_) { /* Unsupported metric. */ }
}

let cumulativeLayoutShift = 0;
let largestContentfulPaint = 0;
let interactionToNextPaint = 0;
observeMetric("layout-shift", (list) => {
  list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) cumulativeLayoutShift += entry.value; });
});
observeMetric("largest-contentful-paint", (list) => {
  const entry = list.getEntries().at(-1);
  if (entry) largestContentfulPaint = entry.startTime;
});
observeMetric("event", (list) => {
  interactionToNextPaint = Math.max(interactionToNextPaint, ...list.getEntries().map((entry) => entry.duration || 0));
});
window.addEventListener("pagehide", () => {
  track("web_vital", { metric_name: "CLS", metric_value: Math.round(cumulativeLayoutShift * 1000) });
  if (largestContentfulPaint) track("web_vital", { metric_name: "LCP", metric_value: Math.round(largestContentfulPaint) });
  if (interactionToNextPaint) track("web_vital", { metric_name: "INP", metric_value: Math.round(interactionToNextPaint) });
});

window.addEventListener("error", (event) => {
  track("javascript_error", { error_type: "runtime", source_file: (event.filename || "unknown").split("/").pop(), line_number: event.lineno || 0 });
});
window.addEventListener("unhandledrejection", () => track("javascript_error", { error_type: "unhandled_promise" }));
