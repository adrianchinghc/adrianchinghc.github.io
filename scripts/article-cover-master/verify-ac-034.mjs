// Post-build check for the article covers. Run the renderers first.
//
// Extended under ADR-461: hash pinning alone passed while the headline was
// rendering SemiBold 600 from a shared font alias, so this now also proves the
// glyph weight, the tracking, the ink bounds and the file dependencies.
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

// 6. Report the measured ink bounds for both headlines against the locked box.
const limitX = 583;
const bounds = [];
for (const [id, lines] of [
  ["AC-033", ["Where should", "AI go first?"]],
  ["AC-034", ["You're the", "bottleneck"]],
]) {
  for (const line of lines) {
    const measured = measureInk(createCanvas, line, HEADLINE, 112, -3, 33);
    bounds.push({ cover: id, ...measured, limitX, overrunPx: Math.max(0, measured.inkRightX - limitX) });
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL  ${failure}`);
  throw new Error(`${failures.length} cover build check(s) failed.`);
}

console.log("Cover build checks passed: file dependencies, approved illustration bytes, 1200x630 PNG + WebP, 400/320 variants, ExtraBold 800 glyph weight, tracking, flat background, no Sharp, no Resvg.");
console.log(`Headline weight proof (advance of "bottleneck" at 112px): wght 800 = ${weightProof.advanceAt800}, wght 600 = ${weightProof.advanceAt600}, wght 200 = ${weightProof.advanceAt200}.`);
console.log(`\nHeadline ink bounds at the locked 112px / -3px settings, origin x=33, box limit x=${limitX}:`);
for (const row of bounds) {
  console.log(
    `  ${row.cover}  ${JSON.stringify(row.text).padEnd(16)} advance right x=${String(row.advanceRightEdgeX).padStart(7)}  ink right x=${String(row.inkRightX).padStart(4)}  ${row.overrunPx ? `OVERRUNS the box by ${row.overrunPx}px` : "within the box"}`,
  );
}
const overruns = bounds.filter(row => row.overrunPx > 0);
if (overruns.length) {
  console.log(
    `\nHELD: ${overruns.length} headline line(s) overrun the locked box at the mandated settings. ` +
      "ADR-446 forbids tightening, shrinking and substitute wording, so no cover is finalized until Adrian approves wording that fits.",
  );
}
