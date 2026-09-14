import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export function responsiveImages(config) {
  const jobs = new Map();
  config.on("eleventy.before", () => jobs.clear());
  config.addTransform("responsive-images", async function (html) {
    if (!this.page.outputPath?.endsWith(".html")) return html;
    const tags = [...html.matchAll(/<img\b[^>]*>/g)];
    for (const [tag] of tags) {
      const src = tag.match(/\bsrc="(\/assets\/images\/[^"?]+\.(?:webp|jpg|jpeg|png))"/)?.[1];
      if (!src || tag.includes("srcset=")) continue;
      if (!jobs.has(src)) jobs.set(src, (async () => {
        const input = await readFile(`src${src}`);
        const meta = await sharp(input).metadata();
        if (meta.width < 300 || meta.pages > 1) return null;
        const hash = createHash("sha256").update(input).digest("hex").slice(0,12);
        // Keep generated derivatives outside the passthrough-copy destination.
        // Writing into _site/assets while Eleventy copies src/assets can race and
        // leave passthrough files empty on a clean build.
        await mkdir("_site/responsive", { recursive: true });
        const widths = [...new Set([400, 640, 960, 1280, meta.width].filter(w => w <= meta.width))].sort((a,b) => a-b);
        const images = await Promise.all(widths.map(async width => {
          const url = `/responsive/${hash}-${width}.webp`;
          await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`_site${url}`);
          return `${url} ${width}w`;
        }));
        return { meta, srcset: images.join(", "), fallback: `/responsive/${hash}-${widths.at(-1)}.webp` };
      })());
      const result = await jobs.get(src);
      if (!result) continue;
      // Lazy images use their actual layout width in supporting browsers.
      const sizes = tag.includes('loading="lazy"') ? 'auto, (max-width: 760px) calc(100vw - 40px), 600px' : '(max-width: 760px) calc(100vw - 40px), (max-width: 1000px) 45vw, 520px';
      let replacement = tag.replace(/\s(?:width|height)="[^"]*"/g, "").replace(`src="${src}"`, `src="${result.fallback}"`);
      replacement = replacement.replace(/>$/, ` data-image-source="${src}" width="${result.meta.width}" height="${result.meta.height}" srcset="${result.srcset}" sizes="${sizes}">`);
      html = html.replace(tag, replacement);
    }
    return html;
  });
}
