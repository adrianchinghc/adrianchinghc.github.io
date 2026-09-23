// Rebuilds the AC-034 cover from the AC-033 master values.
//
// Corrected under ADR-461 after the ADR-459 audit. The previous build registered
// the headline file and the author file under one shared alias ("Manrope Cover"),
// so a request for weight 800 resolved to the registered 600 face and the headline
// shipped as SemiBold. Face selection now lives in cover-fonts.mjs, one alias per
// face, with the variable font's wght axis pinned explicitly.
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AUTHOR, HEADLINE, assertHeadlineIsExtraBold, measureInk, registerCoverFonts, useFace } from "./cover-fonts.mjs";

const project = resolve(import.meta.dirname, "../..");
const directory = import.meta.dirname;
const output = resolve(directory, "exports");
const illustrationSource = resolve(project, "scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png");
const masterSource = resolve(directory, "ac-033-manrope-master.svg");
const tokensSource = resolve(directory, "ac-033-manrope-tokens.json");

const widths = [1200, 400, 320];
const backgroundColor = "#0557e1";
const textColor = "#fff7df";
const headlineTrackingPx = -3;
const authorTrackingPx = 0.5;
const headlineLines = ["You're the", "bottleneck"];
const headlineBaselines = [250, 366];
const headlineOriginX = 33;
const headlineSizePx = 112;
const authorText = "Adrian Ching";
const authorOriginX = 35;
const authorBaselineY = 582;
const authorSizePx = 27;
const headlineRightLimitX = 583;
const illustrationBox = { x: 604, y: 69, width: 596, height: 454 };

const dimensions = png => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

const render = (illustration, width, format) => {
  const height = Math.round((width * 630) / 1200);
  const scale = width / 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(
    illustration,
    0, 0, illustrationBox.width, illustrationBox.height,
    illustrationBox.x * scale, illustrationBox.y * scale, illustrationBox.width * scale, illustrationBox.height * scale,
  );
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
const weightProof = assertHeadlineIsExtraBold(probeCtx, "bottleneck", headlineSizePx);

const [illustrationPng, masterBytes, tokenBytes] = await Promise.all([readFile(illustrationSource), readFile(masterSource), readFile(tokensSource)]);
await writeFile(resolve(output, "ac-034-illustration-transparent.png"), illustrationPng);
const illustration = await loadImage(illustrationPng);

const files = {};
for (const width of widths) {
  const png = render(illustration, width, "image/png");
  const filename = width === 1200 ? "ac-034-manrope-baseline.png" : `ac-034-manrope-${width}.png`;
  if (width !== 1200) await writeFile(resolve(output, `ac-034-illustration-fit-${width}.png`), png);
  await writeFile(resolve(output, filename), png);
  files[filename] = { ...dimensions(png), sha256: sha256(png) };
}
const webp = render(illustration, 1200, "image/webp");
await writeFile(resolve(output, "ac-034-manrope-baseline.webp"), webp);
files["ac-034-manrope-baseline.webp"] = { width: 1200, height: 630, sha256: sha256(webp) };

const headlineBounds = headlineLines.map(line =>
  measureInk(createCanvas, line, HEADLINE, headlineSizePx, headlineTrackingPx, headlineOriginX),
);
const authorBounds = measureInk(createCanvas, authorText, AUTHOR, authorSizePx, authorTrackingPx, authorOriginX);

const evidence = {
  method:
    "@napi-rs/canvas compositor. It fills a flat #0557e1 field with no grain, noise, filter or gradient, loads the ADR-447 owner-approved transparent raster illustration directly onto the illustration box via loadImage (no SVG rasterization, no hand-coded vector step), draws the Manrope variable font pinned to wght 800 for the headline and the static wght 600 face for the attribution under separate registration aliases, and encodes PNG and WebP. No Sharp import, invocation, crop, composite, resize or encoder is used. No Resvg import, invocation or SVG illustration source is used.",
  renderer: "@napi-rs/canvas",
  correctedUnder: "ADR-461, applying the ADR-459 audit findings",
  background: { color: backgroundColor, texture: "none", note: "Flat fill only. The earlier hand-rolled per-pixel grain PRNG produced visible banding and is removed." },
  typography: { headlineTrackingPx, authorTrackingPx, note: "The ADR-446 mandated values. See headlineFit for what they measure at the corrected weight 800." },
  fonts: faces,
  weightProof: {
    ...weightProof,
    note: "Advances of the same string from the same file at three axis positions. Ascending advances prove the headline face resolves to a real ExtraBold 800 and not to the 200 default or the 600 instance. The build throws if this ordering fails.",
  },
  master: { file: "scripts/article-cover-master/ac-033-manrope-master.svg", sha256: sha256(masterBytes), acceptedInteraction: "0b27f1dc-8a54-40f1-adf0-54c7ad474804", acceptedAt: "2026-09-22T09:24:03.678Z", acceptedMasterSha256: "185212c092d3757536260aed4ce4de1cea57f58584fa4f63209504b61f2248a0", note: "The accepted sha256 is the version Adrian approved on 2026-09-22. The current sha256 differs because ADR-446 then ordered the grain and tracking corrections and ADR-461 applied them; the composition, palette and layer structure are unchanged." },
  tokens: { file: "scripts/article-cover-master/ac-033-manrope-tokens.json", sha256: sha256(tokenBytes) },
  illustration: {
    file: "scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png",
    sha256: sha256(illustrationPng),
    box: illustrationBox,
    source: "Chroma (ADR-447), owner-approved via Paperclip attachment 14e1e53c-73a3-4e8a-9e74-a826854b29cb",
    note: "Transparent 596x454 RGBA raster illustration, independently passed by Oracle and approved by Adrian on ADR-447 (2026-09-23). Bytes unchanged by ADR-461.",
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
    illustrationBoxStartsX: illustrationBox.x,
    method: "Pixel ink extent of each line rendered at the locked settings, origin x=33.",
    lines: headlineBounds,
    fits: headlineBounds.every(line => line.inkRightX <= headlineRightLimitX),
  },
  authorFit: authorBounds,
  files,
};
await writeFile(resolve(output, "ac-034-render-provenance.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence, null, 2));
