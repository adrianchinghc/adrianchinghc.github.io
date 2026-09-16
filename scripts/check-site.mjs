import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const output = "_site";
const errors = [];
const versionedAssets = [["site", "css"], ["site", "js"], ["prefetch", "js"]].map(([name, extension]) => {
  const bytes = readFileSync(`src/assets/${extension}/${name}.${extension}`);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const url = `/static/${name}.${hash}.${extension}`;
  const destination = join(output, url);
  if (!existsSync(destination) || !readFileSync(destination).equals(bytes)) {
    errors.push(`Missing or mismatched versioned asset: ${url}`);
  }
  return url;
});
const required = [
  "index.html", "work-with-me/index.html", "ai-profit-opportunity-audit/index.html",
  "advisory/index.html", "about/index.html", "client-stories/index.html", "blog/index.html", "newsletter/index.html", "newsletter/confirmed/index.html", "privacy/index.html",
  "404.html", "robots.txt", "sitemap.xml", "CNAME", "BingSiteAuth.xml"
];

for (const file of required) {
  if (!existsSync(join(output, file))) errors.push(`Missing required output: ${file}`);
}

function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

function internalTarget(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || !clean.startsWith("/")) return null;
  if (clean === "/") return join(output, "index.html");
  if (extname(clean)) return join(output, clean);
  return join(output, clean, "index.html");
}

if (existsSync(output)) {
  const titles = new Map();
  const descriptions = new Map();
  const visibleImages = new Map();
  const socialImages = new Map();
  const duplicatePhotoGroups = new Map([
    ["/assets/images/adrian/founder.webp", "adrian-seated-outside"],
    ["/assets/images/adrian/seated-portrait.webp", "adrian-seated-outside"],
    ["/assets/images/adrian/upstack-team.webp", "upstack-team-group"],
    ["/assets/images/adrian/team-gathering.webp", "upstack-team-group"],
    ["/assets/images/adrian/at-work.webp", "adrian-cafe-window"],
    ["/assets/images/adrian/working-side.webp", "adrian-cafe-window"],
    ["/assets/images/adrian/studio.webp", "adrian-recording-camera"],
    ["/assets/images/adrian/recording-camera.webp", "adrian-recording-camera"],
    ["/assets/images/adrian/building.webp", "adrian-working-front"],
    ["/assets/images/adrian/working-front.webp", "adrian-working-front"],
    ["/assets/images/adrian/conversation.webp", "adrian-recording-conversation"],
    ["/assets/images/adrian/recording-conversation.webp", "adrian-recording-conversation"],
    ["/assets/images/adrian/behind-the-scenes.webp", "recording-production"],
    ["/assets/images/adrian/recording-session.webp", "recording-production"]
  ]);
  const intentionalImageRepeats = new Map([
    ["/assets/images/work/dinie-johari.jpg", new Set([join(output, "index.html"), join(output, "client-stories/index.html")])]
  ]);
  for (const file of filesIn(output).filter((path) => path.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    const ogImages = [...html.matchAll(/<meta property="og:image" content="([^"]+)">/g)];
    const twitterImages = [...html.matchAll(/<meta name="twitter:image" content="([^"]+)">/g)];
    if (ogImages.length !== 1 || twitterImages.length !== 1 || ogImages[0]?.[1] !== twitterImages[0]?.[1]) {
      errors.push(`${file}: expected one matching Open Graph and Twitter image`);
    } else {
      const imageUrl = ogImages[0][1];
      if (!/^https:\/\/adrianching\.com\/social\/[a-z0-9.-]+\.jpg$/.test(imageUrl)) errors.push(`${file}: invalid social image URL`);
      const imageFile = join(output, new URL(imageUrl).pathname);
      if (!socialImages.has(imageFile)) {
        if (!existsSync(imageFile)) errors.push(`${file}: social card not generated`);
        else {
          const meta = await sharp(imageFile).metadata();
          if (meta.format !== "jpeg" || meta.width !== 1200 || meta.height !== 630) errors.push(`${file}: social card must be a 1200×630 JPEG`);
          if (statSync(imageFile).size > 1000000) errors.push(`${file}: social card exceeds 1 MB`);
        }
        socialImages.set(imageFile, file);
      } else if (!html.includes('http-equiv="refresh"') && !readFileSync(socialImages.get(imageFile), "utf8").includes('http-equiv="refresh"')) {
        errors.push(`${file}: full pages should have distinct share cards`);
      }
      for (const marker of ['property="og:image:width" content="1200"', 'property="og:image:height" content="630"', 'property="og:image:type" content="image/jpeg"', 'name="twitter:card" content="summary_large_image"']) {
        if (!html.includes(marker)) errors.push(`${file}: missing ${marker}`);
      }
    }
    if (!html.includes("<html lang=\"en\"")) errors.push(`${file}: missing lang attribute`);
    if (!html.includes("<meta name=\"viewport\"")) errors.push(`${file}: missing viewport metadata`);
    if (/<a\b[^>]*href="(?:|#)"/.test(html)) errors.push(`${file}: empty or dead-end link`);
    if (/<img\b[^>]*src="https:\/\/(?:i\.ytimg\.com|img\.youtube\.com)/.test(html)) errors.push(`${file}: remote YouTube cover dependency`);
    if (!html.includes('http-equiv="refresh"')) {
      for (const url of versionedAssets) {
        if (!html.includes(`"${url}"`)) errors.push(`${file}: missing current asset ${url}`);
      }
      if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${file}: expected one main heading`);
      for (const marker of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:image"', 'name="twitter:image:alt"']) {
        if (!html.includes(marker)) errors.push(`${file}: missing ${marker}`);
      }
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
      const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
      if (title) {
        if (titles.has(title)) errors.push(`${file}: duplicate title also used by ${titles.get(title)}`);
        titles.set(title, file);
      }
      if (description) {
        if (descriptions.has(description)) errors.push(`${file}: duplicate description also used by ${descriptions.get(description)}`);
        descriptions.set(description, file);
      }
      for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try { JSON.parse(match[1]); } catch { errors.push(`${file}: invalid JSON-LD`); }
      }
    }
    if (/cal\.com|CALCOM_URL/i.test(html)) errors.push(`${file}: legacy Cal.com reference found`);
    for (const match of html.matchAll(/<a\b[^>]*>/g)) {
      const tag = match[0];
      const locationCount = (tag.match(/\bdata-cta=/g) || []).length;
      if (locationCount > 1) errors.push(`${file}: link has duplicate data-cta attributes`);
      if (/\bdata-analytics-event=/.test(tag) && locationCount !== 1) {
        errors.push(`${file}: explicit analytics event requires one data-cta location`);
      }
    }
    for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*(?:href|src)=\"([^\"]+)\"/g)) {
      const target = internalTarget(match[1]);
      if (target && !existsSync(target)) errors.push(`${file}: broken internal link ${match[1]}`);
      const hash = match[1].split("#")[1];
      if (hash && (target || match[1].startsWith("#"))) {
        const fragmentFile = target || file;
        if (existsSync(fragmentFile) && fragmentFile.endsWith(".html")) {
          const fragment = decodeURIComponent(hash);
          if (!readFileSync(fragmentFile, "utf8").includes(`id="${fragment}"`)) errors.push(`${file}: missing anchor ${match[1]}`);
        }
      }
    }
    for (const match of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="https:\/\/adrianching\.com([^\"]+)"/g)) {
      const target = internalTarget(match[1]);
      if (!target || !existsSync(target)) errors.push(`${file}: missing social image ${match[1]}`);
    }
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt=\"[^\"]*\"/.test(match[0])) errors.push(`${file}: image missing alt text`);
      const src = match[0].match(/\bdata-image-source=\"([^\"]+)\"/)?.[1] ?? match[0].match(/\bsrc=\"([^\"]+)\"/)?.[1];
      if (src?.startsWith("/assets/images/")) {
        const imageKey = duplicatePhotoGroups.get(src) ?? src;
        if (visibleImages.has(imageKey)) {
          const allowedFiles = intentionalImageRepeats.get(src);
          const firstImage = visibleImages.get(imageKey);
          if (!allowedFiles?.has(firstImage.file) || !allowedFiles.has(file)) errors.push(`${file}: visible image ${src} repeats ${firstImage.src} from ${firstImage.file}`);
        } else visibleImages.set(imageKey, { file, src });
      }
    }
    for (const match of html.matchAll(/<a\b[^>]*\bhref="https?:\/\/[^\"]+"[^>]*>/g)) {
      if (!/\btarget="_blank"/.test(match[0])) errors.push(`${file}: external link must open in a new tab`);
      if (!/\brel="[^"]*\bnoopener\b[^"]*"/.test(match[0])) errors.push(`${file}: external link missing noopener`);
    }
  }
  const sitemap = readFileSync(join(output, "sitemap.xml"), "utf8");
  for (const route of ["/", "/work-with-me/", "/ai-profit-opportunity-audit/", "/advisory/", "/privacy/"]) {
    if (!sitemap.includes(`<loc>https://adrianching.com${route}</loc>`)) errors.push(`sitemap.xml: missing ${route}`);
  }
  const siteCss = readFileSync(join(output, versionedAssets[0]), "utf8");
  for (const selector of [".newsletter-fields{display:grid", ".newsletter-email input{display:block", ".theme-toggle .theme-icon-sun{display:none}"]) {
    if (!siteCss.includes(selector)) errors.push(`site.css: missing critical component rule ${selector}`);
  }
  if (!siteCss.includes("prefers-color-scheme:dark")) errors.push("site.css: missing system dark mode");
  if (!siteCss.includes(':root[data-theme="dark"]')) errors.push("site.css: missing manual dark mode");
  if (!readFileSync(join(output, "index.html"), "utf8").includes("data-theme-toggle")) errors.push("index.html: missing theme toggle");
  for (const route of ["index.html", "work-with-me/index.html", "ai-profit-opportunity-audit/index.html", "advisory/index.html"]) {
    const html = readFileSync(join(output, route), "utf8");
    if (!html.includes('href="https://calendly.com/adrianchinghc/30-minute-call"')) errors.push(`${route}: missing Founder Fit Call destination`);
  }
  if (!readFileSync(join(output, "client-stories/index.html"), "utf8").includes("https://youtu.be/38lsk8YyA3c")) errors.push("client-stories/index.html: missing Mario Vela video");
  if (!readFileSync(join(output, "client-stories/index.html"), "utf8").includes('alt="Mario Vela speaking in his client video"')) errors.push("client-stories/index.html: missing Mario Vela portrait");
  const homepageHtml = readFileSync(join(output, "index.html"), "utf8");
  for (const project of ["Black Tulip", "Whisker Tracker", "Dinie Johari"]) {
    if (!homepageHtml.includes(project)) errors.push(`index.html: missing featured ${project} client story`);
  }
  if (homepageHtml.includes("The work behind my perspective")) errors.push("index.html: removed project-proof section was restored");
  const confirmationHtml = readFileSync(join(output, "newsletter/confirmed/index.html"), "utf8");
  if (!confirmationHtml.includes('<meta name="robots" content="noindex, nofollow">')) errors.push("newsletter/confirmed/index.html: confirmation page must remain noindex");
  if (sitemap.includes("/newsletter/confirmed/")) errors.push("sitemap.xml: confirmation page must not be indexed");
  if (existsSync(join(output, ".agents"))) errors.push("Development skills must not be published in the site output");
}

if (existsSync(join(output, "CNAME")) && readFileSync(join(output, "CNAME"), "utf8").trim() !== "adrianching.com") {
  errors.push("CNAME does not preserve adrianching.com");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Site checks passed (${filesIn(output).length} generated files).`);
