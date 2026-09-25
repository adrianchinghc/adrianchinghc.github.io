import { articles } from "./scripts/articles.mjs";
import { socialImages } from "./scripts/social-images.mjs";
import { responsiveImages } from "./scripts/responsive-images.mjs";
import { versionedAssets } from "./scripts/versioned-assets.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export default function (eleventyConfig) {
  // New content gets a new URL, including in browsers with a cached old stylesheet.
  const assetUrls = new Map();
  const assetBytes = new Map();
  for (const { source, bytes, url } of versionedAssets()) {
    assetBytes.set(url.slice(1), bytes);
    assetUrls.set(source, url);
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
  articles(eleventyConfig);
  socialImages(eleventyConfig);
  responsiveImages(eleventyConfig);
  eleventyConfig.addTransform("external-links-new-tab", function (content) {
    if ((typeof this.page.outputPath !== "string" || !this.page.outputPath.endsWith(".html"))) return content;

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
