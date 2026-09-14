import { responsiveImages } from "./scripts/responsive-images.mjs";

export default function (eleventyConfig) {
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
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
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
