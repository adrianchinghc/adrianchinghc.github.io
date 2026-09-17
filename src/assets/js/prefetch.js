// Prefetch only a navigation destination the visitor shows interest in.
// No prerendering: scripts, analytics and Kit run only after real navigation.
(() => {
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;
  if (!HTMLScriptElement.supports?.("speculationrules")) return;
  const prefetched = new Set();

  function prepareNavigation(event) {
    if (document.readyState !== "complete" || document.visibilityState !== "visible") return;
    if (event.type === "pointerover" && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const link = event.target.closest?.('.site-nav a[href]');
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.search || url.hash ||
        url.pathname === location.pathname || !url.pathname.endsWith("/")) return;
    if (prefetched.has(url.href) || prefetched.size >= 6) return;
    prefetched.add(url.href);
    const rules = document.createElement("script");
    rules.type = "speculationrules";
    rules.textContent = JSON.stringify({ prefetch: [{ source: "list", urls: [url.href], eagerness: "immediate" }] });
    document.head.append(rules);
  }

  // Do no speculative work during initial rendering or on touch navigation.
  document.addEventListener("pointerover", prepareNavigation, { passive: true });
  document.addEventListener("focusin", prepareNavigation);
})();
