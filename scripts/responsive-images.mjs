import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export function cropRectangle(width, height, ratio, position = 50) {
  const [x, y] = ratio.split("/").map(Number);
  if (!(x > 0 && y > 0 && position >= 0 && position <= 100)) throw new Error("Invalid image crop");
  const cropWidth = Math.min(width, Math.round(height * x / y));
  const cropHeight = Math.min(height, Math.round(width * y / x));
  return { left: Math.round((width - cropWidth) / 2), top: Math.round((height - cropHeight) * position / 100), width: cropWidth, height: cropHeight };
}

export function imageUrl(bytes, width, format) {
  // Hash encoded bytes so crop, quality and encoder changes always get new URLs.
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  return `/responsive/${hash}-${width}.${format}`;
}

export function responsiveImages(config) {
  const jobs = new Map();
  config.on("eleventy.before", () => jobs.clear());
  config.addTransform("responsive-images", async function (html) {
    if ((typeof this.page.outputPath !== "string" || !this.page.outputPath.endsWith(".html"))) return html;
    for (const [tag] of [...html.matchAll(/<img\b[^>]*>/g)]) {
      const src = tag.match(/\bsrc="(\/assets\/images\/[^"?]+\.(?:webp|jpg|jpeg|png))"/)?.[1];
      if (!src || tag.includes("srcset=")) continue;
      const mobileCrop = tag.match(/data-mobile-crop="([^"]+)"/)?.[1];
      const mobilePosition = Number(tag.match(/data-mobile-position="([^"]+)"/)?.[1] ?? 50);
      const key = JSON.stringify({ src, mobileCrop, mobilePosition });
      if (!jobs.has(key)) jobs.set(key, (async () => {
        const input = await readFile(`src${src}`);
        const meta = await sharp(input).metadata();
        if (meta.width < 300 || meta.pages > 1) return null;
        await mkdir("_site/responsive", { recursive: true });
        async function variants(format, crop) {
          const widthLimit = crop?.width ?? meta.width;
          const widths = [...new Set([400, 640, 800, 960, 1280, widthLimit].filter(w => w <= widthLimit))].sort((a, b) => a - b);
          const images = [];
          // Bound encoder concurrency to avoid exhausting CI memory.
          for (const width of widths) {
            let image = sharp(input);
            if (crop) image = image.extract(crop);
            image = image.resize({ width, withoutEnlargement: true });
            const bytes = await (format === "avif" ? image.avif({ quality: 50, effort: 4 }) : image.webp({ quality: 76 })).toBuffer();
            const url = imageUrl(bytes, width, format);
            await writeFile(`_site${url}`, bytes);
            images.push({ url, width });
          }
          return { srcset: images.map(i => `${i.url} ${i.width}w`).join(", "), fallback: images.at(-1).url };
        }
        const webp = await variants("webp");
        if (!mobileCrop) return { meta, webp };
        const crop = cropRectangle(meta.width, meta.height, mobileCrop, mobilePosition);
        return { meta, webp, avif: await variants("avif"), mobileWebp: await variants("webp", crop), mobileAvif: await variants("avif", crop), crop };
      })());
      const result = await jobs.get(key);
      if (!result) continue;
      const mobileSizes = tag.match(/data-mobile-sizes="([^"]+)"/)?.[1] ?? "(max-width: 420px) calc(100vw - 32px), calc(100vw - 40px)";
      const sizes = tag.includes('loading="lazy"') ? 'auto, (max-width: 420px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), 600px' : '(max-width: 420px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), (max-width: 1000px) 45vw, 520px';
      let replacement = tag.replace(/\s(?:width|height|data-mobile-crop|data-mobile-position|data-mobile-sizes)="[^"]*"/g, "").replace(`src="${src}"`, `src="${result.webp.fallback}"`);
      replacement = replacement.replace(/>$/, ` data-image-source="${src}" width="${result.meta.width}" height="${result.meta.height}" srcset="${result.webp.srcset}" sizes="${sizes}">`);
      if (result.mobileAvif) {
        const dimensions = `width="${result.crop.width}" height="${result.crop.height}"`;
        replacement = `<picture class="responsive-picture"><source media="(max-width: 760px)" type="image/avif" srcset="${result.mobileAvif.srcset}" sizes="${mobileSizes}" ${dimensions}><source media="(max-width: 760px)" type="image/webp" srcset="${result.mobileWebp.srcset}" sizes="${mobileSizes}" ${dimensions}><source type="image/avif" srcset="${result.avif.srcset}" sizes="${sizes}">${replacement}</picture>`;
      }
      html = html.replace(tag, replacement);
    }
    return html;
  });
}
