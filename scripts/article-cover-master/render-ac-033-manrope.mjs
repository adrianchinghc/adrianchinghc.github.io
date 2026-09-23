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
const backgroundColor = "#0557e1";
const headlineTrackingPx = -3;
const authorTrackingPx = 0.5;
// Owner-approved exception (interaction 64b999b6-6426-4578-a003-c944130d6023,
// resolved 2026-09-23T05:51:43Z): keep the original headline wording and
// shrink the type to fit, overriding the standard's no-shrink rule for this
// article only. 94px is the largest size where both lines stay inside the
// 550px box (x=33..583) at -3px tracking (measured via pixel bounding box:
// "Where should" = 541px, "AI go first?" = 402px).
const headlineSizePx = 94;
const dimensions = png => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });
const isolateIllustration = sourceImage => {
  const canvas = createCanvas(1200, 630); const ctx = canvas.getContext("2d");
  ctx.drawImage(sourceImage, 0, 0, 1200, 630); const pixels = ctx.getImageData(0, 0, 1200, 630);
  for (let y = 0; y < 630; y++) for (let x = 0; x < 1200; x++) {
    const i = (y * 1200 + x) * 4; const r = pixels.data[i]; const g = pixels.data[i + 1]; const b = pixels.data[i + 2];
    if (x < 600 || (b > 100 && b > r * 1.5 && b > g * 1.4)) pixels.data[i + 3] = 0;
  }
  ctx.putImageData(pixels, 0, 0); return canvas;
};
const render = (illustration, width, format) => { const height = Math.round(width * 630 / 1200); const scale = width / 1200; const canvas = createCanvas(width, height); const ctx = canvas.getContext("2d"); ctx.fillStyle = backgroundColor; ctx.fillRect(0, 0, width, height); ctx.drawImage(illustration, 0, 0, 1200, 630, 0, 0, width, height); ctx.fillStyle = "#fff7df"; ctx.font = `800 ${headlineSizePx * scale}px Manrope Cover`; ctx.letterSpacing = `${headlineTrackingPx * scale}px`; ctx.fillText("Where should", 33 * scale, 250 * scale); ctx.fillText("AI go first?", 33 * scale, 366 * scale); ctx.font = `600 ${27 * scale}px Manrope Cover`; ctx.letterSpacing = `${authorTrackingPx * scale}px`; ctx.fillText("Adrian Ching", 35 * scale, 582 * scale); return canvas.toBuffer(format); };
await mkdir(output, { recursive: true });
const [source, headlineBytes, authorBytes] = await Promise.all([readFile(original), readFile(headlineFont), readFile(authorFont)]);
GlobalFonts.registerFromPath(headlineFont, "Manrope Cover"); GlobalFonts.registerFromPath(authorFont, "Manrope Cover");
const sourceImage = await loadImage(source); const illustration = isolateIllustration(sourceImage); const files = {};
await writeFile(resolve(directory, "ac-033-illustration-isolated.png"), illustration.toBuffer("image/png"));
for (const width of widths) { const png = render(illustration, width, "image/png"); const filename = width === 1200 ? "ac-033-manrope-baseline.png" : "ac-033-manrope-" + width + ".png"; await writeFile(resolve(output, filename), png); files[filename] = { ...dimensions(png), sha256: createHash("sha256").update(png).digest("hex") }; }
const webp = render(illustration, 1200, "image/webp");
await writeFile(resolve(output, "ac-033-manrope-baseline.webp"), webp);
files["ac-033-manrope-baseline.webp"] = { sha256: createHash("sha256").update(webp).digest("hex") };
const evidence = {
  method: "@napi-rs/canvas compositor; it decodes the canonical WebP, isolates the canonical right-side editorial artwork with the existing cutout method onto a flat cobalt field (no procedural grain, no gradient), draws real Manrope font files, and encodes PNG/WebP. No Sharp import, invocation, crop, composite, resize, or encoder is used.",
  renderer: "@napi-rs/canvas",
  background: { color: backgroundColor, note: "Flat fill only, matching the render-ac-034-manrope.mjs type/background/name reference. The prior hand-rolled per-pixel grain() PRNG has been removed per the ADR-446 owner correction." },
  typography: {
    note: "At the standard 112px, 'Where should' measures 651px at -3px tracking against the 550px locked box (x=33 to x=583) and does not fit at any tracking value without shrinking. Escalated via interaction 64b999b6-6426-4578-a003-c944130d6023; owner resolved 2026-09-23T05:51:43Z selecting 'keep original wording, shrink the letters to fit', overriding the standard's no-shrink rule for this article only. Headline rendered at " + headlineSizePx + "px (pixel-measured: 'Where should' = 541px, 'AI go first?' = 402px, both under the 550px box) with tracking and baselines otherwise unchanged.",
    headlineSizePx,
    headlineTrackingPx,
    authorTrackingPx,
  },
  source: { file: "scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp", sha256: createHash("sha256").update(source).digest("hex") },
  headline: { family: "Manrope", weight: 800, fontFile: "scripts/assets/manrope-extrabold.ttf", fontSha256: createHash("sha256").update(headlineBytes).digest("hex"), registeredFamily: "Manrope Cover", lines: ["Where should", "AI go first?"], renderedWith: `CanvasRenderingContext2D font: 800 ${headlineSizePx}px Manrope Cover, letterSpacing ${headlineTrackingPx}px` },
  author: { family: "Manrope", weight: 600, fontFile: "scripts/assets/manrope-semibold.ttf", fontSha256: createHash("sha256").update(authorBytes).digest("hex"), renderedWith: `CanvasRenderingContext2D font: 600 27px Manrope Cover, letterSpacing ${authorTrackingPx}px` },
  files,
};
await writeFile(resolve(output, "ac-033-render-provenance.json"), JSON.stringify(evidence, null, 2) + "\n"); console.log(JSON.stringify(evidence));
