const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });
}

document.querySelectorAll('a[href^="https://calendly.com/"]').forEach((link) => {
  link.addEventListener("click", () => {
    const eventData = {
      link_url: link.href,
      link_text: link.textContent.trim(),
      page_path: window.location.pathname
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", "founder_fit_call_click", eventData);
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "FounderFitCallClick", eventData);
    }
    if (typeof window.hj === "function") {
      window.hj("event", "founder_fit_call_click");
    }
  });
});
