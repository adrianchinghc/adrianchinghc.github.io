import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

if (existsSync(".env")) loadEnvFile(".env");

export default function () {
  return {
    name: "Adrian Ching",
    url: "https://adrianching.com",
    description: "Adrian Ching builds businesses, shares useful lessons and helps B2B founders find where AI can grow profit.",
    bookingUrl: "https://calendly.com/adrianchinghc/30-minute-call",
    newsletterUrl: process.env.KIT_URL || "/newsletter/#join",
    contactUrl: process.env.CONTACT_URL || "/work-with-me/#fit-call",
    paymentUrl: process.env.PAYMENT_URL || "",
    analytics: {
      ga: process.env.GA_MEASUREMENT_ID || "",
      metaPixel: process.env.META_PIXEL_ID || "",
      hotjar: process.env.HOTJAR_ID || ""
    },
    social: {
      youtube: "https://www.youtube.com/@adrianching",
      x: "https://x.com/adrianchinghc",
      github: "https://github.com/adrianchinghc"
    }
  };
}
