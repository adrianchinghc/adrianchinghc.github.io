import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

// Share previews are separate from visible site photography. Reuse originals,
// never generate faces. Coordinates place the person deliberately in each crop.
const cards = {
  "/": { title: "I build companies.\nI share what I learn.", label: "FOUNDER · BUILDER · WRITER", photo: "founder", y: 95 },
  "/about/": { title: "The story\nbehind the work.", label: "ABOUT ADRIAN", photo: "adrian-in-conversation", x: 100, y: 55 },
  "/blog/": { title: "Ideas worth\nputting to work.", label: "VIDEOS & WRITING", photo: "studio", y: 85, x: 70, zoom: 1.15 },
  "/newsletter/": { title: "Notes from\ninside the work.", label: "THE NEWSLETTER", photo: "reading", y: 100 },
  "/work-with-me/": { title: "A clearer view of\nwhat to do next.", label: "WORK WITH ME", photo: "speaking-at-laptop", y: 65 },
  "/ai-profit-opportunity-audit/": { title: "AI Profit\nOpportunity Audit", label: "DIAGNOSIS & PRIORITIES", photo: "working-at-laptop", y: 100, x: 85, zoom: 1.35 },
  "/ai-profit-opportunity-audit/example/": { title: "What an AI opportunity\naudit could look like.", label: "AN ILLUSTRATIVE EXAMPLE", photo: false },
  "/advisory/": { title: "Private AI\n& Growth Advisor", label: "INDEPENDENT GUIDANCE", photo: "recording-solo", y: 75 },
  "/client-stories/": { title: "In their\nown words.", label: "CLIENT STORIES · THE UPSTACK YEARS", photo: false },
  "/privacy/": { title: "Your privacy.\nYour choices.", label: "ADRIANCHING.COM", photo: false },
  "/newsletter/confirmed/": { title: "You're on the list.", label: "SUBSCRIPTION CONFIRMED", photo: false },
  "/404.html": { title: "This page\nhas moved on.", label: "ADRIANCHING.COM", photo: false },
};
const aliases = { "/work/": "/work-with-me/", "/ventures/": "/about/" };
const fontfile = resolve("scripts/assets/manrope-semibold.ttf");
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function textLayer(text, size, color, width) {
  return sharp({ text: {
    text: `<span foreground="${color}">${escape(text)}</span>`,
    font: `Manrope ${size}`, fontfile, rgba: true, width,
    wrap: "word-char", spacing: 8,
  } }).png().toBuffer({ resolveWithObject: true });
}

export function socialImages(config) {
  let output = "_site";
  const jobs = new Map();
  config.on("eleventy.before", ({ dir }) => { output = dir.output; jobs.clear(); });
  config.addWatchTarget("scripts/assets/");

  config.addAsyncShortcode("socialImageMeta", async (route, title, source, origin) => {
    const pageRoute = aliases[route] || route;
    const spec = cards[pageRoute] || { title: title || "Adrian Ching", label: "IDEAS & WRITING", photo: source || false };
    const key = JSON.stringify({ pageRoute, spec });
    if (!jobs.has(key)) jobs.set(key, (async () => {
      const hasPhoto = spec.photo !== false;
      const titleWidth = hasPhoto ? 596 : 1050;
      const ink = "#22231f", paper = "#fafaf7", muted = "#b6b7ad", rust = "#d49a82";
      const layers = [];
      const addText = async (text, size, color, width, left, top) => {
        const layer = await textLayer(text, size, color, width);
        layers.push({ input: layer.data, left, top });
        return layer.info.height;
      };
      await addText("Adrian Ching.", 32, paper, 500, 56, 48);
      await addText(spec.label, 17, rust, titleWidth, 56, 150);
      let headline;
      for (let size = hasPhoto ? 58 : 72; size >= 24; size -= 2) {
        headline = await textLayer(spec.title, size, paper, titleWidth);
        if (headline.info.height <= 260) break;
      }
      if (headline.info.height > 260) throw new Error(`Social title does not fit: ${pageRoute}`);
      layers.push({ input: headline.data, left: 52, top: 211 });
      await addText("adrianching.com", 22, muted, 500, 56, 545);
      if (hasPhoto) {
        const photoPath = spec.photo.startsWith("/assets/images/") ? `src${spec.photo}` : `src/assets/images/adrian/${spec.photo}.webp`;
        if (!resolve(photoPath).startsWith(resolve("src/assets/images") + "/")) throw new Error("Social photos must be local site images");
        const input = await readFile(photoPath);
        const meta = await sharp(input).metadata();
        const ratio = 440 / 534;
        const width = Math.round(Math.min(meta.width, meta.height * ratio) / (spec.zoom || 1));
        const height = Math.round(width / ratio);
        const crop = { width, height, left: Math.round((meta.width - width) * (spec.x ?? 50) / 100), top: Math.round((meta.height - height) * (spec.y ?? 50) / 100) };
        const photo = await sharp(input).extract(crop).resize(440, 534).toBuffer();
        layers.push({ input: photo, left: 712, top: 48 });
      }
      const bytes = await sharp({ create: { width: 1200, height: 630, channels: 3, background: ink } })
        .composite(layers).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
      const slug = pageRoute === "/" ? "home" : pageRoute.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9-]+/gi, "-");
      const url = `/social/${slug}.${hash}.jpg`;
      await mkdir(join(output, "social"), { recursive: true });
      await writeFile(join(output, url), bytes);
      return { url, alt: `${spec.title.replace(/\n/g, " ")} — Adrian Ching${hasPhoto ? ", with a photograph of Adrian" : ""}.` };
    })());
    const card = await jobs.get(key);
    const image = `${origin || "https://adrianching.com"}${card.url}`;
    return `<meta property="og:image" content="${escape(image)}">
  <meta property="og:image:secure_url" content="${escape(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escape(card.alt)}">
  <meta name="twitter:image" content="${escape(image)}">
  <meta name="twitter:image:alt" content="${escape(card.alt)}">`;
  });
}
