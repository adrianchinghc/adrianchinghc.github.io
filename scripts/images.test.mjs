import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { cropRectangle, imageUrl } from "./responsive-images.mjs";

test("mobile crops preserve the existing CSS focal position", () => {
  const rect = cropRectangle(1013, 1800, "16/11", 38);
  assert.equal(rect.width, 1013);
  assert.equal(rect.height, 696);
  assert.equal(rect.top, Math.round((1800 - 696) * .38));
  const landscape = cropRectangle(1600, 900, "4/3", 50);
  assert.deepEqual(landscape, { left: 200, top: 0, width: 1200, height: 900 });
  assert.throws(() => cropRectangle(100, 100, "0/3"), /Invalid/);
});

test("new encoded content always receives a different cache URL", () => {
  assert.notEqual(imageUrl(Buffer.from("before"), 400, "webp"), imageUrl(Buffer.from("after"), 400, "webp"));
});

test("every generated image candidate exists and matches its content hash and dimensions", async () => {
  function htmlFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? htmlFiles(join(dir, entry.name)) : entry.name.endsWith(".html") ? [join(dir, entry.name)] : []);
  }
  const candidates = new Set();
  for (const file of htmlFiles("_site")) {
    const html = readFileSync(file, "utf8");
    for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of srcset.split(", ")) candidates.add(candidate);
    }
  }
  assert.ok(candidates.size > 50);
  for (const candidate of candidates) {
    const [url, descriptor] = candidate.split(" ");
    const bytes = readFileSync(`_site${url}`);
    const width = Number(descriptor.slice(0, -1));
    const format = url.split(".").at(-1);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, width, url);
    assert.equal(url, imageUrl(bytes, width, format), url);
  }
});

test("hero pages retain a WebP fallback and mobile AVIF sources", () => {
  for (const file of ["index.html", "about/index.html", "newsletter/index.html"]) {
    const html = readFileSync(`_site/${file}`, "utf8");
    assert.match(html, /<source media="\(max-width: 760px\)" type="image\/avif"/);
    assert.match(html, /<source media="\(max-width: 760px\)" type="image\/webp"/);
    assert.match(html, /<img[^>]+fetchpriority="high"[^>]+srcset="[^"]+\.webp/);
  }
});
