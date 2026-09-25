import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Pages load these from a content-hashed URL, so changed bytes always get a new URL.
// A function, not a constant: the dev server reloads config and must re-hash edits.
export function versionedAssets() {
  return ["/assets/css/site.css", "/assets/js/site.js", "/assets/js/prefetch.js", "/assets/js/attribution.js"].map((source) => {
    const bytes = readFileSync(`src${source}`);
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    const [name, extension] = source.split("/").pop().split(".");
    return { source, bytes, url: `/static/${name}.${hash}.${extension}` };
  });
}
