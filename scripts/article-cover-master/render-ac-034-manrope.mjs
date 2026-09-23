import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const project = resolve(import.meta.dirname, "../..");
const directory = import.meta.dirname;
const output = resolve(directory, "exports");
const headlineFont = resolve(project, "scripts/assets/manrope-extrabold.ttf");
const authorFont = resolve(project, "scripts/assets/manrope-semibold.ttf");
const illustrationSource = resolve(project, "scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png");
const masterSource = resolve(project, "scripts/article-cover-master/ac-033-manrope-master.svg");
const widths = [1200, 400, 320];
const dimensions = png => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });
const backgroundColor = "#0557e1";
const headlineTrackingPx = -3;
const authorTrackingPx = 0.5;
const render = (illustration, width, format) => {
  const height = Math.round(width * 630 / 1200); const scale = width / 1200;
  const canvas = createCanvas(width, height); const ctx = canvas.getContext("2d");
  ctx.fillStyle = backgroundColor; ctx.fillRect(0, 0, width, height);
  ctx.drawImage(illustration, 0, 0, 596, 454, 604 * scale, 69 * scale, 596 * scale, 454 * scale);
  ctx.fillStyle = "#fff7df";
  ctx.font = `800 ${112 * scale}px Manrope Cover`; ctx.letterSpacing = `${headlineTrackingPx * scale}px`;
  ctx.fillText("You're the", 33 * scale, 250 * scale);
  ctx.fillText("bottleneck", 33 * scale, 366 * scale);
  ctx.font = `600 ${27 * scale}px Manrope Cover`; ctx.letterSpacing = `${authorTrackingPx * scale}px`;
  ctx.fillText("Adrian Ching", 35 * scale, 582 * scale);
  return canvas.toBuffer(format);
};
await mkdir(output, { recursive: true });
const [illustrationPng, headlineBytes, authorBytes, masterBytes] = await Promise.all([readFile(illustrationSource), readFile(headlineFont), readFile(authorFont), readFile(masterSource)]);
GlobalFonts.registerFromPath(headlineFont, "Manrope Cover"); GlobalFonts.registerFromPath(authorFont, "Manrope Cover");
await writeFile(resolve(output, "ac-034-illustration-transparent.png"), illustrationPng);
const illustration = await loadImage(illustrationPng);
const files = {};
for (const width of widths) {
  const png = render(illustration, width, "image/png");
  const filename = width === 1200 ? "ac-034-manrope-baseline.png" : "ac-034-manrope-" + width + ".png";
  if (width !== 1200) await writeFile(resolve(output, `ac-034-illustration-fit-${width}.png`), png);
  await writeFile(resolve(output, filename), png);
  files[filename] = { ...dimensions(png), sha256: createHash("sha256").update(png).digest("hex") };
}
const webp = render(illustration, 1200, "image/webp");
await writeFile(resolve(output, "ac-034-manrope-baseline.webp"), webp);
files["ac-034-manrope-baseline.webp"] = { sha256: createHash("sha256").update(webp).digest("hex") };
const evidence = {
  method: "@napi-rs/canvas compositor; it fills a plain, uninterrupted cobalt field (no procedural grain, no gradient), loads the ADR-447 owner-approved transparent raster illustration directly onto the illustration box via loadImage (no SVG rasterization, no hand-coded vector step), draws real Manrope font files for headline and author, and encodes PNG/WebP. No Sharp import, invocation, crop, composite, resize, or encoder is used. No Resvg import, invocation, or SVG illustration source is used.",
  renderer: "@napi-rs/canvas",
  background: {
    color: backgroundColor,
    note: "Flat fill only, verified by sampling ac-033-where-should-ai-go-first-cover.webp background pixels (bottom band avg #0254e1, top band avg #0356e1; both cluster on the master SVG's own base fill #0557e1). This supersedes the #0858d8 value cited in ADR-408, which does not match the source bytes. The prior render's hand-rolled per-pixel grain() PRNG produced visible banding; it has been removed in favor of a plain field per the owner correction.",
  },
  typography: {
    note: "Tracking opened from the rejected -6.5px/-1.2px candidate. Headline tracking is bounded by the locked 550px headline box (bottleneck at 0px tracking measures ~576px, wider than the box), so -3px is the most open value that still clears the box before the illustration; author tracking moved to a slightly open +0.5px.",
    headlineTrackingPx,
    authorTrackingPx,
  },
  master: { file: "scripts/article-cover-master/ac-033-manrope-master.svg", sha256: createHash("sha256").update(masterBytes).digest("hex"), acceptedInteraction: "0b27f1dc-8a54-40f1-adf0-54c7ad474804", acceptedAt: "2026-09-22T09:24:03.678Z", acceptedMasterSha256: "185212c092d3757536260aed4ce4de1cea57f58584fa4f63209504b61f2248a0" },
  illustration: { file: "scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png", sha256: createHash("sha256").update(illustrationPng).digest("hex"), box: { x: 604, y: 69, width: 596, height: 454 }, source: "Chroma (ADR-447), owner-approved via Paperclip attachment 14e1e53c-73a3-4e8a-9e74-a826854b29cb", note: "Transparent 596x454 RGBA raster illustration, independently passed by Oracle and approved by Adrian on ADR-447 (2026-09-23). Supersedes the hand-coded ac-034-lead-follow-up-illustration.svg + Resvg rasterization path banned by ADR-446's illustration standard." },
  headline: { family: "Manrope", weight: 800, fontFile: "scripts/assets/manrope-extrabold.ttf", fontSha256: createHash("sha256").update(headlineBytes).digest("hex"), registeredFamily: "Manrope Cover", lines: ["You're the", "bottleneck"], renderedWith: `CanvasRenderingContext2D font: 800 112px Manrope Cover, letterSpacing ${headlineTrackingPx}px` },
  author: { family: "Manrope", weight: 600, fontFile: "scripts/assets/manrope-semibold.ttf", fontSha256: createHash("sha256").update(authorBytes).digest("hex"), renderedWith: `CanvasRenderingContext2D font: 600 27px Manrope Cover, letterSpacing ${authorTrackingPx}px` },
  files,
};
await writeFile(resolve(output, "ac-034-render-provenance.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence));
