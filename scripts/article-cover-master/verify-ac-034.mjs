// Post-build check for the article covers. Run the renderers first.
//
// Extended under ADR-461: hash pinning alone passed while the headline was
// rendering SemiBold 600 from a shared font alias, so this now also proves the
// glyph weight, the tracking, the ink bounds and the file dependencies.
//
// Extended again under ADR-462: the headline sizes are now per-cover fitted
// values rather than a shared 112px. Every line must land inside the box, each
// cover must use the largest whole pixel size that does so, and the renderers,
// tokens and master SVG must all carry the same number.
import { createCanvas } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AUTHOR, HEADLINE, assertHeadlineIsExtraBold, measureInk, registerCoverFonts } from "./cover-fonts.mjs";

const project = resolve(import.meta.dirname, "../..");
const at = file => resolve(project, file);
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

// The locked headline box and each cover's ADR-462 fitted size. The sizes are
// not free parameters: section 6 re-derives them and fails if a larger whole
// pixel size would also have fitted, or if the recorded one does not.
const limitX = 583;
const maxSizePx = 112;
const COVERS = [
  { id: "AC-033", sizePx: 86, renderer: "scripts/article-cover-master/render-ac-033-manrope.mjs", lines: ["Where should", "AI go first?"] },
  { id: "AC-034", sizePx: 107, renderer: "scripts/article-cover-master/render-ac-034-manrope.mjs", lines: ["You're the", "bottleneck"] },
];

// 1. Every file the build reads or writes must exist. The audited head was
//    missing two of these, which made the AC-033 master unbuildable.
const required = [
  "scripts/article-cover-master/cover-fonts.mjs",
  "scripts/article-cover-master/ac-033-manrope-master.svg",
  "scripts/article-cover-master/ac-033-manrope-tokens.json",
  "scripts/article-cover-master/ac-033-illustration-isolated.png",
  "scripts/article-cover-master/render-ac-033-manrope.mjs",
  "scripts/article-cover-master/render-ac-034-manrope.mjs",
  "scripts/assets/manrope-extrabold.ttf",
  "scripts/assets/manrope-semibold.ttf",
  "scripts/assets/illustrations/ac-033-where-should-ai-go-first-cover.webp",
  "scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png",
  "scripts/article-cover-master/exports/ac-033-manrope-baseline.png",
  "scripts/article-cover-master/exports/ac-033-manrope-baseline.webp",
  "scripts/article-cover-master/exports/ac-034-manrope-baseline.png",
  "scripts/article-cover-master/exports/ac-034-manrope-baseline.webp",
];
for (const file of required) {
  await access(at(file)).catch(() => failures.push(`Missing required file: ${file}`));
}

// The master references the isolated illustration by relative href; that
// reference was dangling at the audited head.
const master = await readFile(at("scripts/article-cover-master/ac-033-manrope-master.svg"), "utf8");
for (const href of master.matchAll(/href="([^"]+)"/g)) {
  await access(resolve(import.meta.dirname, href[1])).catch(() =>
    failures.push(`Master SVG references a file that does not exist: ${href[1]}`),
  );
}

// 2. The approved AC-033 illustration must be untouched.
const approvedIllustrationSha = "5326acbbfe99559bad54affd25231c42f087b4631bc581c4bbfaa89630fcd9dd";
const isolated = await readFile(at("scripts/article-cover-master/ac-033-illustration-isolated.png"));
check(
  createHash("sha256").update(isolated).digest("hex") === approvedIllustrationSha,
  "ac-033-illustration-isolated.png no longer matches the approved bytes.",
);
const approvedAc034Illustration = "3ac633806278474c501694fa3890bb79da0343bd37a2fb62e11d33bce2bb2e93";
const ac034Illustration = await readFile(at("scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png"));
check(
  createHash("sha256").update(ac034Illustration).digest("hex") === approvedAc034Illustration,
  "ac-034-lead-follow-up-illustration-transparent.png no longer matches the ADR-447 approved bytes.",
);

// 3. Both covers must be exactly 1200x630 in PNG and WebP.
for (const name of ["ac-033", "ac-034"]) {
  const png = await readFile(at(`scripts/article-cover-master/exports/${name}-manrope-baseline.png`));
  check(png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, `${name} baseline PNG is not 1200x630.`);
  const webp = await readFile(at(`scripts/article-cover-master/exports/${name}-manrope-baseline.webp`));
  check(webp.toString("ascii", 0, 4) === "RIFF" && webp.toString("ascii", 8, 12) === "WEBP", `${name} baseline WebP is not a WebP file.`);
  // VP8L/VP8X/VP8 all carry the canvas size in the chunk that follows the header.
  const vp8 = webp.toString("ascii", 12, 16);
  let width = null;
  let height = null;
  if (vp8 === "VP8 ") {
    width = webp.readUInt16LE(26) & 0x3fff;
    height = webp.readUInt16LE(28) & 0x3fff;
  } else if (vp8 === "VP8L") {
    const bits = webp.readUInt32LE(21);
    width = (bits & 0x3fff) + 1;
    height = ((bits >> 14) & 0x3fff) + 1;
  } else if (vp8 === "VP8X") {
    width = (webp.readUIntLE(24, 3) & 0xffffff) + 1;
    height = (webp.readUIntLE(27, 3) & 0xffffff) + 1;
  }
  check(width === 1200 && height === 630, `${name} baseline WebP is ${width}x${height}, not 1200x630.`);

  for (const variant of [400, 320]) {
    const scaled = await readFile(at(`scripts/article-cover-master/exports/${name}-manrope-${variant}.png`));
    const expectedHeight = Math.round((variant * 630) / 1200);
    check(
      scaled.readUInt32BE(16) === variant && scaled.readUInt32BE(20) === expectedHeight,
      `${name} ${variant}px variant is ${scaled.readUInt32BE(16)}x${scaled.readUInt32BE(20)}, expected ${variant}x${expectedHeight}.`,
    );
  }
}

// 4. The headline must render a real ExtraBold 800, not the 200 default and not
//    the 600 face. This is the ADR-459 regression.
registerCoverFonts();
const ctx = createCanvas(8, 8).getContext("2d");
let weightProof = null;
try {
  weightProof = assertHeadlineIsExtraBold(ctx, "bottleneck", 112);
} catch (error) {
  failures.push(error.message);
}
check(HEADLINE.alias !== AUTHOR.alias, "The headline and author faces share one family alias; weight 800 will resolve to the 600 face.");

// 5. The master, the tokens and the renderers must agree on the same numbers.
const tokens = JSON.parse(await readFile(at("scripts/article-cover-master/ac-033-manrope-tokens.json"), "utf8"));
check(tokens.headline.trackingPx === -3, `Token headline tracking is ${tokens.headline.trackingPx}, expected -3.`);
check(tokens.headline.sizePx === 112, `Token headline sizePx is ${tokens.headline.sizePx}; 112 is the standard's maximum and must not move.`);
check(
  tokens.headline.fittedSizePx === COVERS[0].sizePx,
  `Token headline fittedSizePx is ${tokens.headline.fittedSizePx}, expected the AC-033 fitted ${COVERS[0].sizePx}.`,
);
check(
  new RegExp(`font-size="${COVERS[0].sizePx}"[^>]*font-weight="800"`).test(master),
  `Master SVG headline font-size is not the AC-033 fitted ${COVERS[0].sizePx}px.`,
);
check(tokens.authorName.trackingPx === 0.5, `Token author tracking is ${tokens.authorName.trackingPx}, expected 0.5.`);
check(tokens.background.color === "#0557e1", `Token background is ${tokens.background.color}, expected #0557e1.`);
check(/letter-spacing="-3"/.test(master), "Master SVG headline tracking is not -3.");
check(/letter-spacing="0.5"/.test(master), "Master SVG author tracking is not 0.5.");
check(!/filter=|feTurbulence/.test(master), "Master SVG still carries a background filter; the field must be flat.");
check(/fill="#0557e1"/.test(master), "Master SVG background is not a flat #0557e1 fill.");

for (const file of [
  "scripts/article-cover-master/render-ac-033-manrope.mjs",
  "scripts/article-cover-master/render-ac-034-manrope.mjs",
  "scripts/article-cover-master/render-ac-034-review-evidence.mjs",
]) {
  const source = await readFile(at(file), "utf8");
  check(!/from\s+["']sharp["']|require\s*\(\s*["']sharp["']\s*\)|sharp\s*\(/i.test(source), `${file} imports or calls Sharp.`);
  check(
    !/from\s+["']@resvg\/resvg-js["']|new\s+Resvg\s*\(/i.test(source),
    `${file} imports or calls Resvg (hand-coded vector illustration rasterization is banned by ADR-446).`,
  );
}

// Each renderer must declare the fitted size this file re-derives in section 6,
// and must still declare -3px tracking. A silent edit to either fails here.
for (const cover of COVERS) {
  const source = await readFile(at(cover.renderer), "utf8");
  check(
    new RegExp(`^const headlineSizePx = ${cover.sizePx};$`, "m").test(source),
    `${cover.renderer} does not declare headlineSizePx = ${cover.sizePx}.`,
  );
  check(
    new RegExp(`^const headlineMaxSizePx = ${maxSizePx};$`, "m").test(source),
    `${cover.renderer} does not declare headlineMaxSizePx = ${maxSizePx}.`,
  );
  check(/^const headlineTrackingPx = -3;$/m.test(source), `${cover.renderer} does not declare headlineTrackingPx = -3.`);
}

// The shipped AC-034 cover must be the exported baseline WebP byte for byte.
// Without this the article can keep serving a stale render of an older build.
const shippedCover = await readFile(at("scripts/assets/illustrations/ac-034-lead-follow-up-cover.webp"));
const exportedCover = await readFile(at("scripts/article-cover-master/exports/ac-034-manrope-baseline.webp"));
check(
  shippedCover.equals(exportedCover),
  "scripts/assets/illustrations/ac-034-lead-follow-up-cover.webp does not match exports/ac-034-manrope-baseline.webp; the shipped cover is stale.",
);

// 6. Re-derive each cover's headline size from pixels and hold it to the box.
//    Every line has to fit, and the recorded size has to be the largest whole
//    pixel value at or below 112 that fits, so a needlessly small headline fails
//    the build just as an overrunning one does.
const fitsAt = (lines, sizePx) => lines.every(line => measureInk(createCanvas, line, HEADLINE, sizePx, -3, 33).inkRightX <= limitX);
const bounds = [];
for (const cover of COVERS) {
  for (const line of cover.lines) {
    const measured = measureInk(createCanvas, line, HEADLINE, cover.sizePx, -3, 33);
    bounds.push({ cover: cover.id, sizePx: cover.sizePx, ...measured, limitX, overrunPx: Math.max(0, measured.inkRightX - limitX) });
  }
  check(
    fitsAt(cover.lines, cover.sizePx),
    `${cover.id} headline overruns the box at its recorded ${cover.sizePx}px: every line must end at or before x=${limitX}.`,
  );
  check(
    cover.sizePx >= maxSizePx || !fitsAt(cover.lines, cover.sizePx + 1),
    `${cover.id} is set to ${cover.sizePx}px but also fits at ${cover.sizePx + 1}px. Use the largest whole pixel size that fits.`,
  );
  check(cover.sizePx <= maxSizePx, `${cover.id} headline size ${cover.sizePx}px exceeds the ${maxSizePx}px standard maximum.`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL  ${failure}`);
  throw new Error(`${failures.length} cover build check(s) failed.`);
}

console.log(
  "Cover build checks passed: file dependencies, approved illustration bytes, shipped cover freshness, 1200x630 PNG + WebP, " +
    "400/320 variants, ExtraBold 800 glyph weight, tracking, fitted headline sizes, headline box fit, flat background, no Sharp, no Resvg.",
);
console.log(`Headline weight proof (advance of "bottleneck" at 112px): wght 800 = ${weightProof.advanceAt800}, wght 600 = ${weightProof.advanceAt600}, wght 200 = ${weightProof.advanceAt200}.`);
console.log(`\nHeadline ink bounds at -3px tracking, origin x=33, box limit x=${limitX} (maximum size ${maxSizePx}px):`);
for (const row of bounds) {
  console.log(
    `  ${row.cover}  ${String(row.sizePx).padStart(3)}px  ${JSON.stringify(row.text).padEnd(16)} advance right x=${String(row.advanceRightEdgeX).padStart(7)}  ink right x=${String(row.inkRightX).padStart(4)}  ${row.overrunPx ? `OVERRUNS the box by ${row.overrunPx}px` : `within the box, ${limitX - row.inkRightX}px clear`}`,
  );
}
