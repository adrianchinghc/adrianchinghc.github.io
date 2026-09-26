import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { isReviewPreview } from "../../scripts/publication.mjs";

if (existsSync(".env")) loadEnvFile(".env");

export default function () {
  const cleanId = (name, pattern) => {
    const value = (process.env[name] || "").trim();
    return pattern.test(value) ? value : "";
  };
  const analytics = {
    ga: cleanId("GA_MEASUREMENT_ID", /^G-[A-Z0-9]+$/i),
    metaPixel: cleanId("META_PIXEL_ID", /^\d+$/),
    hotjar: cleanId("HOTJAR_ID", /^\d+$/)
  };
  const isPreview = isReviewPreview();

  return {
    name: "Adrian Ching",
    url: "https://adrianching.com",
    description: "Adrian Ching is building Second Team, sharing what he learns and helping a small number of B2B founders decide where AI is worth using.",
    bookingUrl: "https://calendly.com/adrianchinghc/30-minute-call",
    newsletterUrl: "/newsletter/#join",
    contactUrl: process.env.CONTACT_URL || "/work-with-me/#fit-call",
    paymentUrl: process.env.PAYMENT_URL || "",
    analytics,
    analyticsEnabled: Object.values(analytics).some(Boolean),
    isPreview,
    robots: isPreview ? "noindex, nofollow" : "index, follow",
    googleSiteVerification: cleanId("GOOGLE_SITE_VERIFICATION", /^[A-Za-z0-9_-]+$/),
    social: {
      youtube: "https://www.youtube.com/@adrianchinghc",
      linkedin: "https://www.linkedin.com/in/adrianchinghc",
      instagram: "https://www.instagram.com/adrianchinghc",
      facebook: "https://www.facebook.com/adrianchinghc",
      x: "https://x.com/adrianchinghc"
    }
  };
}
