import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

if (existsSync(".env")) loadEnvFile(".env");

export default function () {
  return {
    name: "Adrian Ching",
    url: "https://adrianching.com",
    description: "Adrian Ching is building Second Team, sharing what he learns and helping a small number of B2B founders decide where AI is worth using.",
    bookingUrl: "https://calendly.com/adrianchinghc/30-minute-call",
    newsletterUrl: (process.env.KIT_URL || "").trim(),
    contactUrl: process.env.CONTACT_URL || "/work-with-me/#fit-call",
    paymentUrl: process.env.PAYMENT_URL || "",
    analytics: {
      ga: process.env.GA_MEASUREMENT_ID || "",
      metaPixel: process.env.META_PIXEL_ID || "",
      hotjar: process.env.HOTJAR_ID || ""
    },
    social: {
      youtube: "https://www.youtube.com/@adrianchinghc",
      linkedin: "https://www.linkedin.com/in/adrianchinghc",
      instagram: "https://www.instagram.com/adrianchinghc",
      facebook: "https://www.facebook.com/adrianchinghc",
      x: "https://x.com/adrianchinghc"
    }
  };
}
