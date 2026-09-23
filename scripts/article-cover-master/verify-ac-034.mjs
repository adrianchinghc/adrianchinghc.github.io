import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const expected = new Map([
  ["scripts/article-cover-master/exports/ac-034-manrope-baseline.webp", "121a224f96c961c5baa284d0c8c72f6a85fad447130fd43c44e10472f068203e"],
  ["scripts/article-cover-master/exports/ac-034-manrope-baseline.png", "83ccb4e923f95f7be2c727fd6bfcacc3dc1dbf4b20221dd424ad81b32452ce8f"],
  ["scripts/assets/illustrations/ac-034-lead-follow-up-illustration-transparent.png", "3ac633806278474c501694fa3890bb79da0343bd37a2fb62e11d33bce2bb2e93"],
]);

for (const [file, wanted] of expected) {
  const bytes = await readFile(file);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== wanted) throw new Error(`${file}: expected ${wanted}, received ${actual}`);
}

const png = await readFile("scripts/article-cover-master/exports/ac-034-manrope-baseline.png");
if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
  throw new Error("Final PNG is not 1200x630.");
}

for (const file of [
  "scripts/article-cover-master/render-ac-034-manrope.mjs",
  "scripts/article-cover-master/render-ac-034-review-evidence.mjs",
]) {
  const source = await readFile(file, "utf8");
  if (/from\s+["']sharp["']|require\s*\(\s*["']sharp["']\s*\)|sharp\s*\(/i.test(source)) {
    throw new Error(`${file} imports or calls Sharp.`);
  }
  if (/from\s+["']@resvg\/resvg-js["']|new\s+Resvg\s*\(/i.test(source)) {
    throw new Error(`${file} imports or calls Resvg (hand-coded vector illustration rasterization is banned by ADR-446).`);
  }
}

console.log("AC-034 final hashes, PNG dimensions, and no-Sharp/no-Resvg script checks passed.");
