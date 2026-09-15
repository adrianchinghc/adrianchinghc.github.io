import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

export function purgeUrls(sitemap) {
  const urls = new Set(["https://adrianching.com/", "https://adrianching.com/index.html"]);
  for (const match of sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
    const url = new URL(match[1].trim());
    if (url.origin !== "https://adrianching.com" || url.search || url.hash) continue;
    urls.add(url.href);
    if (url.pathname.endsWith("/")) {
      urls.add(new URL("index.html", url).href);
      if (url.pathname !== "/") urls.add(url.href.slice(0, -1));
    }
  }
  return [...urls];
}

export async function purge({ token, zone, urls, request = fetch }) {
  if (!token || !/^[a-f0-9]{32}$/.test(zone || "")) throw new Error("Cloudflare purge credentials are missing.");
  for (let start = 0; start < urls.length; start += 30) {
    const response = await request(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ files: urls.slice(start, start + 30) }),
      signal: AbortSignal.timeout(30000)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(`Cloudflare HTML purge failed (HTTP ${response.status}).`);
  }
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href) {
  const urls = new Set(purgeUrls(readFileSync("_site/sitemap.xml", "utf8")));
  function includeHtml(directory) {
    for (const file of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, file.name);
      if (file.isDirectory()) includeHtml(path);
      else if (file.name.endsWith(".html")) {
        const pathname = relative("_site", path).split("\\").join("/");
        urls.add(`https://adrianching.com/${pathname}`);
        if (pathname.endsWith("index.html")) {
          const directoryUrl = `https://adrianching.com/${pathname.slice(0, -10)}`;
          urls.add(directoryUrl);
          if (directoryUrl !== "https://adrianching.com/") urls.add(directoryUrl.slice(0, -1));
        }
      }
    }
  }
  includeHtml("_site");
  // Retired pages from the previous release must not remain cached either.
  try {
    for (const url of purgeUrls(readFileSync("previous-sitemap.xml", "utf8"))) urls.add(url);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await purge({ token: process.env.CLOUDFLARE_CACHE_PURGE_TOKEN, zone: process.env.CLOUDFLARE_ZONE_ID, urls: [...urls] });
  console.log(`Cleared ${urls.size} HTML URLs from Cloudflare.`);
}
