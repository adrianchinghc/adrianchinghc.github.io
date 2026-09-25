// Rebuilds the AC-035 commissioned article cover from the locked article-cover standard.
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AUTHOR, HEADLINE, assertHeadlineIsExtraBold, measureInk, registerCoverFonts, useFace } from "./cover-fonts.mjs";

const project = resolve(import.meta.dirname, "../..");
const output = resolve(import.meta.dirname, "exports");
const illustrationSource = resolve(project, "scripts/assets/illustrations/ac-035-build-vs-buy-illustration-transparent.png");
const coverOutput = resolve(project, "scripts/assets/illustrations/ac-035-build-vs-buy-cover.webp");
const tokenSource = resolve(import.meta.dirname, "ac-033-manrope-tokens.json");

const backgroundColor = "#0557e1";
const textColor = "#fff7df";
const headlineTrackingPx = -3;
const authorTrackingPx = 0.5;
const headlineLines = ["Build it or", "buy it?"];
const headlineBaselines = [250, 366];
const headlineOriginX = 33;
const headlineMaxSizePx = 112;
const headlineSizePx = 112;
const headlineRightLimitX = 583;
const authorText = "Adrian Ching";
const authorOriginX = 35;
const authorBaselineY = 582;
const authorSizePx = 27;
const illustrationBox = { x: 604, y: 69, width: 596, height: 454 };
const widths = [1200, 400, 320];

const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const pngDimensions = bytes => ({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) });

const render = (illustration, width, format) => {
  const scale = width / 1200;
  const height = Math.round(width * 630 / 1200);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const imageScale = Math.min(illustrationBox.width / illustration.width, illustrationBox.height / illustration.height);
  const imageWidth = illustration.width * imageScale;
  const imageHeight = illustration.height * imageScale;
  const imageX = illustrationBox.x + (illustrationBox.width - imageWidth) / 2;
  const imageY = illustrationBox.y + (illustrationBox.height - imageHeight) / 2;
  ctx.drawImage(illustration, imageX * scale, imageY * scale, imageWidth * scale, imageHeight * scale);

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
const weightProof = assertHeadlineIsExtraBold(probeCtx, "Build it or", headlineSizePx);
const [illustrationBytes, tokenBytes] = await Promise.all([readFile(illustrationSource), readFile(tokenSource)]);
const illustration = await loadImage(illustrationBytes);

const headlineBounds = headlineLines.map(line => measureInk(createCanvas, line, HEADLINE, headlineSizePx, headlineTrackingPx, headlineOriginX));
if (!headlineBounds.every(line => line.inkRightX <= headlineRightLimitX)) {
  throw new Error(`AC-035 headline overruns x=${headlineRightLimitX}: ${JSON.stringify(headlineBounds)}`);
}

const files = {};
for (const width of widths) {
  const png = render(illustration, width, "image/png");
  const filename = width === 1200 ? "ac-035-manrope-baseline.png" : `ac-035-manrope-${width}.png`;
  await writeFile(resolve(output, filename), png);
  files[filename] = { ...pngDimensions(png), sha256: sha256(png) };
}
const webp = render(illustration, 1200, "image/webp");
await Promise.all([
  writeFile(resolve(output, "ac-035-manrope-baseline.webp"), webp),
  writeFile(coverOutput, webp),
]);
files["ac-035-manrope-baseline.webp"] = { width: 1200, height: 630, sha256: sha256(webp) };

const evidence = {
  method: "@napi-rs/canvas compositor. It places a commissioned transparent raster illustration on the locked flat cobalt field, then draws the pinned Manrope faces. No Sharp, Resvg, SVG illustration, crop, fabricated UI or generated text is used.",
  renderer: "@napi-rs/canvas",
  background: { color: backgroundColor, texture: "none" },
  typography: { headlineSizePx, headlineMaxSizePx, headlineTrackingPx, authorTrackingPx },
  fonts: faces,
  weightProof,
  tokens: { file: "scripts/article-cover-master/ac-033-manrope-tokens.json", sha256: sha256(tokenBytes) },
  illustration: {
    file: "scripts/assets/illustrations/ac-035-build-vs-buy-illustration-transparent.png",
    sha256: sha256(illustrationBytes),
    sourceDimensions: { width: illustration.width, height: illustration.height },
    box: illustrationBox,
    source: "Chroma commissioned raster illustration for ADR-498",
    promptSummary: "A modular machine assembled on a workbench versus a complete machine taken from a shelf, joined by a forked decision arrow.",
  },
  headline: { text: "Build it or buy it?", lines: headlineLines, bounds: headlineBounds, limitX: headlineRightLimitX },
  author: { text: authorText, originX: authorOriginX, baselineY: authorBaselineY },
  socialCoverAlt: "Screen-printed illustration on cobalt of machine parts on a workbench beside a complete machine on a shelf, split by a forked arrow.",
  files,
};
await writeFile(resolve(output, "ac-035-render-provenance.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence, null, 2));
