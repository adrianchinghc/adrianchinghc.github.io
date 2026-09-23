// Rebuilds the AC-033 cover from the master values in ac-033-manrope-tokens.json.
//
// Corrected under ADR-461 after the ADR-459 audit: flat cobalt (the hand-rolled
// per-pixel grain PRNG is gone), headline tracking -3px, author tracking +0.5px,
// and a real ExtraBold 800 face pinned on the variable font's wght axis.
//
// The headline does not fit the locked box at those settings. The exports below
// are measurement evidence, not an approved cover: the shipped
// scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp is the
// read-only input here and is never overwritten.
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AUTHOR, HEADLINE, assertHeadlineIsExtraBold, measureInk, registerCoverFonts, useFace } from "./cover-fonts.mjs";

const project = resolve(import.meta.dirname, "../..");
const directory = import.meta.dirname;
const output = resolve(directory, "exports");
const original = resolve(project, "scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp");
const tokensPath = resolve(directory, "ac-033-manrope-tokens.json");
const masterPath = resolve(directory, "ac-033-manrope-master.svg");
const isolatedPath = resolve(directory, "ac-033-illustration-isolated.png");

const widths = [1200, 400, 320];
const backgroundColor = "#0557e1";
const textColor = "#fff7df";
const headlineTrackingPx = -3;
const authorTrackingPx = 0.5;
const headlineLines = ["Where should", "AI go first?"];
const headlineBaselines = [250, 366];
const headlineOriginX = 33;
const headlineSizePx = 112;
const authorText = "Adrian Ching";
const authorOriginX = 35;
const authorBaselineY = 582;
const authorSizePx = 27;
const headlineRightLimitX = 583;

const dimensions = png => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

// Lifts the canonical right-side artwork off its printed cobalt field so the
// master can lay it over one continuous flat fill. Unchanged from the approved
// build: it must keep reproducing the committed ac-033-illustration-isolated.png.
const isolateIllustration = sourceImage => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(sourceImage, 0, 0, 1200, 630);
  const pixels = ctx.getImageData(0, 0, 1200, 630);
  for (let y = 0; y < 630; y++) {
    for (let x = 0; x < 1200; x++) {
      const i = (y * 1200 + x) * 4;
      const r = pixels.data[i];
      const g = pixels.data[i + 1];
      const b = pixels.data[i + 2];
      if (x < 600 || (b > 100 && b > r * 1.5 && b > g * 1.4)) pixels.data[i + 3] = 0;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas;
};

const render = (illustration, width, format) => {
  const height = Math.round((width * 630) / 1200);
  const scale = width / 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(illustration, 0, 0, 1200, 630, 0, 0, width, height);
  ctx.fillStyle = textColor;
  useFace(ctx, HEADLINE, headlineSizePx * scale, headlineTrackingPx * scale);
  headlineLines.forEach((line, index) => ctx.fillText(line, headlineOriginX * scale, headlineBaselines[index] * scale));
  useFace(ctx, AUTHOR, authorSizePx * scale, authorTrackingPx * scale);
  ctx.fillText(authorText, authorOriginX * scale, authorBaselineY * scale);
  return canvas.toBuffer(format);
};

await mkdir(output, { recursive: true });
const faces = registerCoverFonts();
const probeCtx = createCanvas(8, 8).getContext("2d");
const weightProof = assertHeadlineIsExtraBold(probeCtx, "Where should", headlineSizePx);

const [source, tokenBytes, masterBytes] = await Promise.all([readFile(original), readFile(tokensPath), readFile(masterPath)]);
const sourceImage = await loadImage(source);
const illustration = isolateIllustration(sourceImage);
const isolatedBytes = illustration.toBuffer("image/png");
await writeFile(isolatedPath, isolatedBytes);

const files = {};
for (const width of widths) {
  const png = render(illustration, width, "image/png");
  const filename = width === 1200 ? "ac-033-manrope-baseline.png" : `ac-033-manrope-${width}.png`;
  await writeFile(resolve(output, filename), png);
  files[filename] = { ...dimensions(png), sha256: sha256(png) };
}
const webp = render(illustration, 1200, "image/webp");
await writeFile(resolve(output, "ac-033-manrope-baseline.webp"), webp);
files["ac-033-manrope-baseline.webp"] = { width: 1200, height: 630, sha256: sha256(webp) };

const headlineBounds = headlineLines.map(line =>
  measureInk(createCanvas, line, HEADLINE, headlineSizePx, headlineTrackingPx, headlineOriginX),
);
const authorBounds = measureInk(createCanvas, authorText, AUTHOR, authorSizePx, authorTrackingPx, authorOriginX);

const evidence = {
  method:
    "@napi-rs/canvas compositor. It fills a flat #0557e1 field with no grain, noise, filter or gradient; decodes the canonical AC-033 WebP and isolates its right-side artwork onto that field; draws the Manrope variable font pinned to wght 800 for the headline and the static wght 600 face for the attribution, each under its own registration alias; and encodes PNG and WebP. No Sharp import, invocation, crop, composite, resize or encoder is used. No Resvg import or invocation is used.",
  renderer: "@napi-rs/canvas",
  correctedUnder: "ADR-461, applying the ADR-459 audit findings",
  background: { color: backgroundColor, texture: "none", note: "The earlier build layered a per-pixel PRNG grain over the fill and the master SVG carried a paper-grain feTurbulence filter. Both are removed." },
  typography: {
    headlineTrackingPx,
    authorTrackingPx,
    note: "Tracking values are the ADR-446 mandated ones. They are not re-derived from measured fit; see headlineFit below for what they actually measure at weight 800.",
  },
  fonts: faces,
  weightProof: {
    ...weightProof,
    note: "Advances of the same string from the same file at three axis positions. Ascending advances prove the headline face resolves to a real ExtraBold 800 and not to the 200 default or the 600 instance. The build throws if this ordering fails.",
  },
  headline: {
    family: "Manrope",
    weight: 800,
    fontFile: HEADLINE.file,
    registeredFamily: HEADLINE.alias,
    variationSettings: HEADLINE.variationSettings,
    lines: headlineLines,
    renderedWith: `CanvasRenderingContext2D font: 800 ${headlineSizePx}px "${HEADLINE.alias}", fontVariationSettings ${HEADLINE.variationSettings}, letterSpacing ${headlineTrackingPx}px`,
  },
  author: {
    family: "Manrope",
    weight: 600,
    fontFile: AUTHOR.file,
    registeredFamily: AUTHOR.alias,
    renderedWith: `CanvasRenderingContext2D font: 600 ${authorSizePx}px "${AUTHOR.alias}", letterSpacing ${authorTrackingPx}px`,
  },
  headlineFit: {
    limitX: headlineRightLimitX,
    illustrationBoxStartsX: 604,
    method: "Pixel ink extent of each line rendered at the locked settings, origin x=33.",
    lines: headlineBounds,
    fits: headlineBounds.every(line => line.inkRightX <= headlineRightLimitX),
    status:
      "HELD. The approved wording overruns the locked headline box at the mandated 800/-3px settings. Tightening, shrinking and substitute wording are all forbidden, so these exports are measurement evidence only and no AC-033 cover is finalized here.",
  },
  authorFit: authorBounds,
  source: { file: "scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp", sha256: sha256(source), note: "Read-only input. This shipped cover is the ADR-446 illustration-style reference and is never rewritten by this script." },
  isolatedIllustration: { file: "scripts/article-cover-master/ac-033-illustration-isolated.png", sha256: sha256(isolatedBytes), note: "Regenerated deterministically from the source above; byte-identical to the approved committed file." },
  master: { file: "scripts/article-cover-master/ac-033-manrope-master.svg", sha256: sha256(masterBytes) },
  tokens: { file: "scripts/article-cover-master/ac-033-manrope-tokens.json", sha256: sha256(tokenBytes) },
  files,
};
await writeFile(resolve(output, "ac-033-render-provenance.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence, null, 2));
