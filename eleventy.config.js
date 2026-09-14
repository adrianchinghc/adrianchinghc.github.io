import { responsiveImages } from "./scripts/responsive-images.mjs";

export default function (eleventyConfig) {
  responsiveImages(eleventyConfig);
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
