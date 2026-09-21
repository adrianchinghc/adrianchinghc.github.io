import { articleSchema, jsonLd } from "./articles.mjs";
import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

// Share previews are separate from visible site photography. Reuse originals,
// never generate faces. Coordinates place the person deliberately in each crop.
const cards = {
  "/": { title: "Building companies.\nLessons you can use.", label: "ADRIAN CHING · FOUNDER & BUILDER", action: "Explore the work →", description: "Explore the companies, decisions and lessons behind Adrian Ching's work as he builds Second Team and a portfolio of businesses.", photo: "founder", y: 95 },
  "/about/": { title: "Why I closed\nmy software agency.", label: "THE FOUNDER STORY", action: "Read the story →", description: "I founded Upstack Studio in 2017, then chose to close it. Here's why, what I learned and what I'm building now.", photo: "adrian-in-conversation", x: 100, y: 55 },
  "/blog/": { title: "Build, buy or skip?\nAsk better questions.", label: "AI · SOFTWARE · BUSINESS", action: "Explore the videos & writing →", description: "Choosing AI tools, hiring developers or planning software? Explore videos and writing around the decision you're making.", photo: "studio", y: 85, x: 70, zoom: 1.15 },
  "/newsletter/": { title: "Fewer missed sales.\nLess repeat work.", label: "ADRIAN CHING'S NEWSLETTER", action: "Get the free emails →", description: "Emails for founders and owners on better follow-up, less repeat work and choosing AI and software worth paying for. Lessons from Adrian Ching’s own businesses.", photo: "reading", y: 100 },
  "/work-with-me/": { title: "AI, software, growth.\nWhat to fix first?", label: "FOR ESTABLISHED B2B FOUNDERS", action: "Compare audit & advisory →", description: "Missed follow-ups, repeat work or another software proposal? Compare a focused AI opportunity audit with ongoing advice for important decisions.", photo: "speaking-at-laptop", y: 65 },
  "/ai-profit-opportunity-audit/": { title: "Where could AI\nhelp your business?", label: "AI PROFIT OPPORTUNITY AUDIT", action: "See what the audit covers →", description: "Identify and rank opportunities in your business. Get the top three recommendations and a concise 90-day roadmap. Diagnosis only; no implementation.", photo: "working-at-laptop", y: 100, x: 85, zoom: 1.35 },
  "/ai-profit-opportunity-audit/example/": { title: "What would an AI audit\nactually give you?", label: "ILLUSTRATIVE EXAMPLE · NOT A CLIENT RESULT", action: "Explore the example →", description: "See an illustrative AI opportunity audit: how opportunities can be ranked and turned into priorities. An example, not a documented client result.", photo: false },
  "/advisory/": { title: "An AI proposal?\nGet a second opinion.", label: "PRIVATE AI & GROWTH ADVISOR", action: "See how advisory works →", description: "Independent monthly guidance for B2B founders weighing AI, software and vendor decisions. Question proposals and trade-offs before committing your budget.", photo: "recording-solo", y: 75 },
  "/client-stories/": { title: "Before you work with me,\nhear from past clients.", label: "CLIENT FEEDBACK · THE UPSTACK YEARS", action: "Read the client stories →", description: "Read what clients said about building software with Upstack Studio. Historical feedback from my agency years, before the work I'm doing today.", photo: false },
  "/privacy/": { title: "What this site collects.\nWhat you control.", label: "PRIVACY & ANALYTICS", action: "Review your choices →", description: "Understand this site's analytics, newsletter data and third-party services, and how to change your analytics choice on this device.", photo: false },
  "/newsletter/confirmed/": { title: "Your next read\nstarts here.", label: "NEWSLETTER CONFIRMATION", action: "Explore the ideas →", description: "The newsletter confirmation page includes a path to Adrian's videos and writing on AI, software and building a business.", photo: false },
  "/404.html": { title: "Looking for\na missing page?", label: "ADRIANCHING.COM · PAGE NOT FOUND", action: "Find your way back →", description: "This link doesn't lead to a page. Find your way back to Adrian Ching's website and explore his work and ideas.", photo: false },
};

// New pages must receive deliberately written share copy, not a generic fallback.
// These checks enforce legibility and completeness; editorial review checks truth.
export function validateSocialCard(spec, route) {
  for (const [field, min, max] of [["title", 10, 72], ["description", 40, 200], ["label", 3, 46], ["action", 5, 34]]) {
    if (typeof spec[field] !== "string" || spec[field].trim().length < min || spec[field].trim().length > max) {
      throw new Error(`${route}: provide social ${field} (${min}–${max} characters). See scripts/SOCIAL-IMAGES.md`);
    }
  }
}
const aliases = { "/work/": "/work-with-me/", "/ventures/": "/about/" };
const fontfile = resolve("scripts/assets/manrope-semibold.ttf");
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function textLayer(text, size, color, width, cover = false) {
  return sharp({ text: {
    text: `<span foreground="${color}">${escape(text)}</span>`,
    font: `${cover ? "Manrope Cover SemiBold" : "Manrope"} ${size}`, fontfile: cover ? resolve("scripts/assets/manrope-cover.ttf") : fontfile, rgba: true, width,
    wrap: "word-char", spacing: 8,
  } }).png().toBuffer({ resolveWithObject: true });
}

export function socialImages(config) {
  let output = "_site";
  const jobs = new Map();
  config.on("eleventy.before", ({ dir, directories }) => { output = directories?.output || dir.output; jobs.clear(); });
  config.addWatchTarget("scripts/assets/");

  const articleSpec = data => ({ title: data.socialTitle, description: data.socialDescription,
    label: data.socialLabel, action: data.socialAction, photo: false, article: true,
    artwork: data.socialArtwork, artworkAlt: data.socialArtworkAlt,
    cover: data.socialCover, coverAlt: data.socialCoverAlt,
    palette: data.socialPalette || "cobalt" });

  async function renderCard(pageRoute, spec) {
    validateSocialCard(spec, pageRoute);
    const key = JSON.stringify({ pageRoute, spec });
    if (!jobs.has(key)) jobs.set(key, (async () => {
      let bytes;
      if (spec.cover) {
        if (!spec.coverAlt?.trim()) throw new Error("Reviewed article covers require socialCoverAlt");
        const coverPath = resolve(spec.cover);
        if (!coverPath.startsWith(resolve("scripts/assets/illustrations") + "/")) throw new Error("Article covers must be local illustration assets");
        const input = await readFile(coverPath);
        const meta = await sharp(input).metadata();
        if (meta.width !== 1200 || meta.height !== 630) throw new Error("Reviewed covers must be 1200×630; preserve the approved composition");
        bytes = await sharp(input).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      } else {
        const hasPhoto = spec.photo !== false;
        const hasArtwork = Boolean(spec.artwork);
        const titleWidth = hasPhoto || hasArtwork ? 596 : 1050;
        const palettes = {
          cobalt: ["#1646ed", "#fff9e6", "#fff9e6", "#ffe16b"],
          yellow: ["#ffda35", "#22231f", "#22231f", "#22231f"],
          ivory: ["#fff9e6", "#22231f", "#22231f", "#1646ed"]
        };
        if (spec.article && !palettes[spec.palette]) throw new Error(`Unknown article palette: ${spec.palette}`);
        const [ink, paper, muted, rust] = spec.article ? palettes[spec.palette] : ["#22231f", "#fafaf7", "#b6b7ad", "#d49a82"];
        const layers = [];
        const addText = async (text, size, color, width, left, top) => {
          const layer = await textLayer(text, size, color, width);
          layers.push({ input: layer.data, left, top });
          return layer.info.height;
        };
        await addText("Adrian Ching.", spec.article ? 24 : 32, paper, 500, 56, spec.article ? 551 : 48);
        if (!spec.article) await addText(spec.label, 22, rust, titleWidth, 56, 142);
        let headline, fits = false;
        for (let size = spec.article ? 100 : hasPhoto || hasArtwork ? 64 : 76; size >= 48; size -= 2) {
          const lines = spec.title.split("\n");
          if (lines.length > 1) {
            const rendered = await Promise.all(lines.map(line => textLayer(line, size, paper, 3000, spec.article)));
            const height = rendered.reduce((sum, line) => sum + line.info.height, 0) + (lines.length - 1) * 18;
            fits = height <= 260 && rendered.every(line => line.info.width <= titleWidth);
            if (fits) {
              let top = 0;
              const inputs = rendered.map(line => {
                const layer = { input: line.data, left: 0, top };
                top += line.info.height + 18;
                return layer;
              });
              const data = await sharp({ create: { width: titleWidth, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(inputs).png().toBuffer();
              headline = { data, info: { height } };
            }
          } else {
            headline = await textLayer(spec.title, size, paper, titleWidth, spec.article);
            fits = headline.info.height <= 260;
          }
          if (fits) break;
        }
        if (!fits) throw new Error(`Social title does not fit: ${pageRoute}`);
        layers.push({ input: headline.data, left: 52, top: spec.article ? 155 : 211 });
        if (!spec.article) {
          await addText(spec.action, 24, rust, titleWidth, 56, 495);
          await addText("adrianching.com", 22, muted, 500, 56, 551);
        }
        if (hasArtwork) {
          if (!spec.artworkAlt?.trim()) throw new Error("Article artwork requires socialArtworkAlt");
          const artworkPath = resolve(spec.artwork);
          if (!artworkPath.startsWith(resolve("scripts/assets/illustrations") + "/")) throw new Error("Article artwork must be in scripts/assets/illustrations");
          const artwork = await sharp(await readFile(artworkPath)).resize(440, 534, { fit: "contain", background: ink }).toBuffer();
          layers.push({ input: artwork, left: 712, top: 48 });
        }
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
        bytes = await sharp({ create: { width: 1200, height: 630, channels: 3, background: ink } })
          .composite(layers).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      }
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
      const slug = pageRoute === "/" ? "home" : pageRoute.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9-]+/gi, "-");
      const url = `/social/${slug}.${hash}.jpg`;
      await mkdir(join(output, "social"), { recursive: true });
      await writeFile(join(output, url), bytes);
      const variants = [];
      if (spec.article) {
        for (const width of [400, 800, 1200]) {
          const path = url.replace(/\.jpg$/, `.${width}.webp`);
          await writeFile(join(output, path), await sharp(bytes).resize(width).webp({ quality: 85 }).toBuffer());
          variants.push(`${path} ${width}w`);
        }
      }
      return { url, variants, alt: `${spec.title.replace(/\n/g, " ")} — Adrian Ching${spec.cover ? `. ${spec.coverAlt}` : spec.artwork ? `. ${spec.artworkAlt}` : spec.photo !== false ? ", with a photograph of Adrian." : "."}` };
    })());
    return jobs.get(key);
  }

  config.addAsyncShortcode("articleCover", async function (route, data, thumbnail = false) {
    if (!route) return "";
    const card = await renderCard(route, articleSpec(data || this.ctx));
    const sizes = thumbnail ? "(max-width: 760px) calc(100vw - 40px), 400px" : "(max-width: 1000px) calc(100vw - 40px), 960px";
    return `<picture class="article-cover"><source type="image/webp" srcset="${escape(card.variants.join(', '))}" sizes="${sizes}"><img src="${escape(card.url)}" alt="${thumbnail ? '' : escape(card.alt)}" width="1200" height="630" loading="${thumbnail ? 'lazy' : 'eager'}" decoding="async"></picture>`;
  });

  config.addAsyncShortcode("socialImageMeta", async function (route, title, source, origin, socialTitle, socialDescription, socialLabel, socialAction) {
    if (!route) return "";
    const pageRoute = aliases[route] || route;
    const spec = this.ctx.article ? articleSpec(this.ctx) : cards[pageRoute] || { title: socialTitle, description: socialDescription, label: socialLabel, action: socialAction, photo: source || false };
    const card = await renderCard(pageRoute, spec);
    const image = `${origin || "https://adrianching.com"}${card.url}`;
    const shareTitle = `${spec.title.replace(/\n/g, " ")} · Adrian Ching`;
    return `<meta property="og:title" content="${escape(shareTitle)}">
  <meta property="og:description" content="${escape(spec.description)}">
  <meta name="twitter:title" content="${escape(shareTitle)}">
  <meta name="twitter:description" content="${escape(spec.description)}">
  <meta property="og:image" content="${escape(image)}">
  <meta property="og:image:secure_url" content="${escape(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escape(card.alt)}">
  <meta name="twitter:image" content="${escape(image)}">
  <meta name="twitter:image:alt" content="${escape(card.alt)}">${this.ctx.article ? `
  <meta property="article:published_time" content="${escape(new Date(this.ctx.date).toISOString())}">
  ${this.ctx.updated ? `<meta property="article:modified_time" content="${escape(new Date(this.ctx.updated).toISOString())}">` : ""}
  <script type="application/ld+json">${jsonLd(articleSchema(this.ctx, image))}</script>` : ""}`;
  });
}
