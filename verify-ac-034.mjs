import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const expected = new Map([
  ["scripts/article-cover-master/exports/ac-034-manrope-baseline.webp", "0e4a1a90d004dd5e47648bc0c9fc6cfb995b1721961843c4d5bfaf6ef501a6c3"],
  ["scripts/article-cover-master/exports/ac-034-manrope-baseline.png", "ef9c4e9995cbd039b61dab8c18c03487aba086b50a0d00e30007fc157b5f8f0f"],
  ["scripts/assets/illustrations/ac-034-lead-follow-up-illustration.svg", "94ea7a01863447cc440dd31ccce8dd594b76babd05ead24dfb351e32e45937e6"],
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
}

console.log("AC-034 final hashes, PNG dimensions, and no-Sharp script checks passed.");
