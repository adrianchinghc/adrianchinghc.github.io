// Let the browser reuse a prefetched document while keeping a real navigation.
// No prerendering: scripts, analytics and Kit only run after the page is opened.
(() => {
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;
  if (!HTMLScriptElement.supports?.("speculationrules")) return;

  function prepareNavigation() {
    if (document.visibilityState !== "visible") return;
    const urls = [...new Set([...document.querySelectorAll('.site-nav a[href]')]
      .filter((link) => !link.hasAttribute("download") && (!link.target || link.target === "_self"))
      .map((link) => new URL(link.href, location.href))
      .filter((url) => url.origin === location.origin && !url.search && !url.hash &&
        url.pathname !== location.pathname && url.pathname.endsWith("/"))
      .map((url) => url.href))].slice(0, 6);
    if (!urls.length) return;
    const rules = document.createElement("script");
    rules.type = "speculationrules";
    rules.textContent = JSON.stringify({ prefetch: [{ source: "list", urls, eagerness: "immediate" }] });
    document.head.append(rules);
  }

  // The current page's images and styles get the connection first.
  if (document.readyState === "complete") prepareNavigation();
  else window.addEventListener("load", prepareNavigation, { once: true });
})();
