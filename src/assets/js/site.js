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
      link_text: link.querySelector("h3")?.textContent.trim() || link.getAttribute("aria-label") || link.textContent.trim(),
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
