import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const project = resolve(import.meta.dirname, "../..");
const directory = import.meta.dirname;
const output = resolve(directory, "exports");
const headlineFont = resolve(project, "scripts/assets/manrope-extrabold.ttf");
const authorFont = resolve(project, "scripts/assets/manrope-semibold.ttf");
const original = resolve(project, "scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp");
const widths = [1200, 400, 320];
const dimensions = png => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });
const grain = (ctx, width, height) => { const pixels = ctx.createImageData(width, height); let state = 33; for (let i = 0; i < pixels.data.length; i += 4) { state = (state * 1664525 + 1013904223) >>> 0; const value = state & 7; pixels.data[i] = 2 + value; pixels.data[i + 1] = 86 + value; pixels.data[i + 2] = 226 + value; pixels.data[i + 3] = 255; } ctx.putImageData(pixels, 0, 0); };
const isolateIllustration = sourceImage => {
  const canvas = createCanvas(1200, 630); const ctx = canvas.getContext("2d");
  ctx.drawImage(sourceImage, 0, 0, 1200, 630); const pixels = ctx.getImageData(0, 0, 1200, 630);
  for (let y = 0; y < 630; y++) for (let x = 0; x < 1200; x++) {
    const i = (y * 1200 + x) * 4; const r = pixels.data[i]; const g = pixels.data[i + 1]; const b = pixels.data[i + 2];
    if (x < 600 || (b > 100 && b > r * 1.5 && b > g * 1.4)) pixels.data[i + 3] = 0;
  }
  ctx.putImageData(pixels, 0, 0); return canvas;
};
const render = (illustration, width) => { const height = Math.round(width * 630 / 1200); const scale = width / 1200; const canvas = createCanvas(width, height); const ctx = canvas.getContext("2d"); ctx.fillStyle = "#0356e0"; ctx.fillRect(0, 0, width, height); grain(ctx, width, height); ctx.drawImage(illustration, 0, 0, 1200, 630, 0, 0, width, height); ctx.fillStyle = "#fff7df"; ctx.font = `800 ${112 * scale}px Manrope Cover`; ctx.letterSpacing = `${-6.5 * scale}px`; ctx.fillText("Where should", 33 * scale, 250 * scale); ctx.fillText("AI go first?", 33 * scale, 366 * scale); ctx.font = `600 ${27 * scale}px Manrope Cover`; ctx.letterSpacing = `${-1.2 * scale}px`; ctx.fillText("Adrian Ching", 35 * scale, 582 * scale); return canvas.toBuffer("image/png"); };
await mkdir(output, { recursive: true });
const [source, headlineBytes, authorBytes] = await Promise.all([readFile(original), readFile(headlineFont), readFile(authorFont)]);
GlobalFonts.registerFromPath(headlineFont, "Manrope Cover"); GlobalFonts.registerFromPath(authorFont, "Manrope Cover");
const sourceImage = await loadImage(source); const illustration = isolateIllustration(sourceImage); const files = {};
await writeFile(resolve(directory, "ac-033-illustration-isolated.png"), illustration.toBuffer("image/png"));
for (const width of widths) { const png = render(illustration, width); const filename = width === 1200 ? "ac-033-manrope-baseline.png" : "ac-033-manrope-" + width + ".png"; await writeFile(resolve(output, filename), png); files[filename] = { ...dimensions(png), sha256: createHash("sha256").update(png).digest("hex") }; }
const evidence = { method: "@napi-rs/canvas compositor; it decodes the canonical WebP, isolates the canonical right-side editorial artwork onto the master's continuous cobalt field, draws real Manrope font files, and encodes PNG. No Sharp import, invocation, crop, composite, resize, or encoder is used.", renderer: "@napi-rs/canvas", source: { file: "scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp", sha256: createHash("sha256").update(source).digest("hex") }, headline: { family: "Manrope", weight: 800, fontFile: "scripts/assets/manrope-extrabold.ttf", fontSha256: createHash("sha256").update(headlineBytes).digest("hex"), registeredFamily: "Manrope Cover", renderedWith: "CanvasRenderingContext2D font: 800 112px Manrope Cover" }, author: { family: "Manrope", weight: 600, fontFile: "scripts/assets/manrope-semibold.ttf", fontSha256: createHash("sha256").update(authorBytes).digest("hex"), renderedWith: "CanvasRenderingContext2D font: 600 27px Manrope Cover" }, files };
await writeFile(resolve(output, "ac-033-render-provenance.json"), JSON.stringify(evidence, null, 2) + "\n"); console.log(JSON.stringify(evidence));
