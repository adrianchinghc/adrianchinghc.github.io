import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { cropRectangle, imageUrl, responsiveImages } from "./responsive-images.mjs";

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
    assert.ok(bytes.length > 0, `${url}: generated image must not be empty`);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, width, url);
    if (url.startsWith("/social/")) {
      // Cover variants are named after their shared master JPEG content hash.
      const match = url.match(/\.([a-f0-9]{12})\.(\d+)\.webp$/);
      assert.ok(match, url);
      assert.equal(Number(match[2]), width, url);
      assert.equal(meta.height, Math.round(width * 630 / 1200), url);
      const master = readFileSync(`_site${url.replace(/\.\d+\.webp$/, ".jpg")}`);
      assert.equal(match[1], createHash("sha256").update(master).digest("hex").slice(0, 12), url);
    } else {
      assert.equal(url, imageUrl(bytes, width, format), url);
    }
  }
});

test("a figure that states its own width keeps that width and gets only one sizes attribute", async () => {
  let transform;
  responsiveImages({ on() {}, addTransform(name, fn) { transform = fn; } });
  const sizes = "(max-width: 420px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), 720px";
  // The transform writes its variants into _site. Remove the ones this test
  // adds, so a build that is tested and then deployed publishes no stray files.
  const existing = new Set(existsSync("_site/responsive") ? readdirSync("_site/responsive") : []);
  let html;
  try {
    html = await transform.call({ page: { outputPath: "_site/figure-sizes.html" } }, `<img src="/assets/images/adrianching.jpg" alt="A test figure" sizes="${sizes}">`);
  } finally {
    for (const name of existsSync("_site/responsive") ? readdirSync("_site/responsive") : []) {
      if (!existing.has(name)) rmSync(join("_site/responsive", name));
    }
  }
  assert.ok(html.includes(`sizes="${sizes}"`), html);
  assert.equal(html.match(/sizes="/g).length, 1, html);
  assert.match(html, /srcset="[^"]+\.webp 400w/);
});

test("hero pages retain a WebP fallback and mobile AVIF sources", () => {
  for (const file of ["index.html", "about/index.html", "newsletter/index.html"]) {
    const html = readFileSync(`_site/${file}`, "utf8");
    assert.match(html, /<source media="\(max-width: 760px\)" type="image\/avif"/);
    assert.match(html, /<source media="\(max-width: 760px\)" type="image\/webp"/);
    assert.match(html, /<img[^>]+fetchpriority="high"[^>]+srcset="[^"]+\.webp/);
  }
});
