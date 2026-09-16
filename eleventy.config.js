import { socialImages } from "./scripts/social-images.mjs";
import { responsiveImages } from "./scripts/responsive-images.mjs";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export default function (eleventyConfig) {
  // New content gets a new URL, including in browsers with a cached old stylesheet.
  const assetUrls = new Map();
  const assetBytes = new Map();
  for (const [source, extension] of [["/assets/css/site.css", "css"], ["/assets/js/site.js", "js"], ["/assets/js/prefetch.js", "js"]]) {
    const bytes = readFileSync(`src${source}`);
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    const name = source.split("/").pop().split(".")[0];
    const destination = `static/${name}.${hash}.${extension}`;
    assetBytes.set(destination, bytes);
    assetUrls.set(source, `/${destination}`);
  }
  // Write after passthrough completes; clean-build checks catch any truncated assets.
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    mkdirSync(join(dir.output, "static"), { recursive: true });
    for (const [destination, bytes] of assetBytes) writeFileSync(join(dir.output, destination), bytes);
  });
  eleventyConfig.addFilter("assetUrl", (source) => {
    if (!assetUrls.has(source)) throw new Error(`Unknown versioned asset: ${source}`);
    return assetUrls.get(source);
  });
  socialImages(eleventyConfig);
  responsiveImages(eleventyConfig);
  eleventyConfig.addTransform("external-links-new-tab", function (content) {
    if (!this.page.outputPath?.endsWith(".html")) return content;

    return content.replace(/<a\b([^>]*\bhref="https?:\/\/[^\"]+"[^>]*)>/g, (tag, attributes) => {
      let updated = attributes;
      if (!/\btarget="[^"]*"/.test(updated)) updated += ' target="_blank"';
      if (/\brel="([^"]*)"/.test(updated)) {
        updated = updated.replace(/\brel="([^"]*)"/, (match, rel) => (
          rel.split(/\s+/).includes("noopener") ? match : `rel="${rel} noopener"`
        ));
      } else {
        updated += ' rel="noopener"';
      }
      return `<a${updated}>`;
    });
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/fonts": "assets/fonts",
    "src/assets/favicon.svg": "assets/favicon.svg"
  });
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/BingSiteAuth.xml");
  eleventyConfig.addFilter("year", (date) => {
    const value = date === "now" ? new Date() : new Date(date);
    return value.getUTCFullYear();
  });
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
