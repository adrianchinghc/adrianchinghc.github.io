const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  document.documentElement.classList.add("nav-ready");
  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
    nav.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.textContent = isOpen ? "Menu" : "Close menu";
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
}

document.querySelectorAll('a[href^="https://calendly.com/"]').forEach((link) => {
  link.addEventListener("click", () => {
    const eventData = {
      link_url: link.href,
      link_text: link.textContent.trim(),
      cta_location: link.dataset.cta || link.closest("section, header, footer")?.getAttribute("id") || link.closest("section, header, footer")?.className || "page",
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

// Track interest, not completed bookings or subscriptions. Existing events stay intact.
document.querySelectorAll('a[href="/work-with-me/"], a[href="/newsletter/"], [data-newsletter-link]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag !== "function") return;
    const eventName = link.getAttribute("href") === "/work-with-me/" ? "work_with_me_click" : "newsletter_click";
    window.gtag("event", eventName, {
      link_url: link.href,
      link_text: link.textContent.trim(),
      page_path: window.location.pathname,
      cta_location: link.dataset.cta || link.closest("header, footer, section")?.className || "page"
    });
  });
});

document.querySelectorAll("[data-media-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const eventData = {
      link_url: link.href,
      link_text: link.querySelector("h3")?.textContent.trim() || link.textContent.trim(),
      link_type: link.dataset.mediaLink,
      page_path: window.location.pathname
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", "youtube_click", eventData);
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "YouTubeClick", eventData);
    }
    if (typeof window.hj === "function") {
      window.hj("event", "youtube_click");
    }
  });
});
