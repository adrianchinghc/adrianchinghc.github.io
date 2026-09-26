import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

// Cloudflare's _redirects limits: 2,000 static rules, 1,000 characters each.
const maxRedirects = 2000;
const maxRuleLength = 1000;
// GitHub Pages needs CNAME; Cloudflare must not publish it.
const ignoredAssets = ["CNAME"];

function pagesIn(directory, output = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return pagesIn(path, output);
    return name === "index.html" ? [`/${relative(output, directory).split(sep).join("/")}`] : [];
  });
}

export function parseRedirects(text) {
  return text.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const [source, destination, status, ...extra] = line.split(/\s+/);
    if (!source?.startsWith("/") || !destination || extra.length || !["301", "302", "303", "307", "308"].includes(status)) {
      throw new Error(`Invalid redirect rule: ${line}`);
    }
    return { source, destination, status: Number(status) };
  });
}

// Cloudflare answers /about and /about/index.html with a temporary 307 to
// /about/. GitHub Pages used a permanent 301, which keeps link credit on the
// canonical address, so every page gets explicit 301s.
export function pageRedirects(pages, rules = []) {
  const taken = new Set(rules.map(({ source }) => source));
  return pages.sort().flatMap((page) => {
    const canonical = page === "/" ? "/" : `${page}/`;
    const aliases = page === "/" ? ["/index.html"] : [page, `${page}/index.html`];
    return aliases.filter((source) => !taken.has(source)).map((source) => ({ source, destination: canonical, status: 301 }));
  });
}

export function redirectsFile(rules) {
  if (rules.length > maxRedirects) throw new Error(`Cloudflare allows ${maxRedirects} redirects; the site has ${rules.length}`);
  const sources = new Set();
  const lines = rules.map(({ source, destination, status }) => {
    if (sources.has(source)) throw new Error(`Duplicate redirect source: ${source}`);
    sources.add(source);
    const line = `${source} ${destination} ${status}`;
    if (line.length > maxRuleLength) throw new Error(`Redirect rule is too long: ${source}`);
    return line;
  });
  return `${lines.join("\n")}\n`;
}

export function writeCloudflareFiles(output, source = "src/_redirects") {
  const rules = parseRedirects(readFileSync(source, "utf8"));
  writeFileSync(join(output, "_redirects"), redirectsFile([...rules, ...pageRedirects(pagesIn(output), rules)]));
  writeFileSync(join(output, ".assetsignore"), `${ignoredAssets.join("\n")}\n`);
}
