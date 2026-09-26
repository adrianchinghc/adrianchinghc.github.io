// Chooses the pages Lighthouse audits for a pull request: the four core
// templates, the newest article (the article template), and every page the
// pull request adds or changes, including a scheduled article before it
// publishes. Usage: node scripts/lighthouse-urls.mjs <changed-files.txt>
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

export const corePages = ["/", "/client-stories/", "/work-with-me/", "/newsletter/"];
// Each page adds about a minute of audits on mobile and desktop.
const maxPages = 10;

export function pageForSource(file) {
  const article = file.match(/^src\/articles\/([\w-]+)\.md$/);
  if (article) return `/blog/${article[1]}/`;
  const page = file.match(/^src\/(?:(.+)\/)?index\.(?:njk|md|html)$/);
  return page ? `/${page[1] ? `${page[1]}/` : ""}` : null;
}

export function newestArticle(directory = "src/articles") {
  return readdirSync(directory).filter((name) => name.endsWith(".md")).map((name) => {
    const { data } = matter(readFileSync(join(directory, name), "utf8"));
    return { page: `/blog/${basename(name, ".md")}/`, date: new Date(data.date), draft: data.draft !== false || data.archive };
  }).filter(({ draft, date }) => !draft && Number.isFinite(+date)).sort((a, b) => b.date - a.date)[0]?.page ?? null;
}

export function lighthouseUrls(changedFiles, { output = "_site", newest = newestArticle() } = {}) {
  const built = (page) => existsSync(join(output, page, "index.html"));
  const pages = [...new Set([...corePages, ...changedFiles.map(pageForSource), newest].filter((page) => page && built(page)))];
  if (pages.length > maxPages) console.error(`Auditing ${maxPages} of ${pages.length} pages; skipped ${pages.slice(maxPages).join(", ")}`);
  return pages.slice(0, maxPages);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const list = process.argv[2] && existsSync(process.argv[2]) ? readFileSync(process.argv[2], "utf8") : "";
  console.log(lighthouseUrls(list.split("\n").map((line) => line.trim()).filter(Boolean)).join(" "));
}
