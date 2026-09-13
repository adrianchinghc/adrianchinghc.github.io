import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const output = "_site";
const errors = [];
const required = [
  "index.html", "work-with-me/index.html", "ai-profit-opportunity-audit/index.html",
  "advisory/index.html", "about/index.html", "blog/index.html", "newsletter/index.html",
  "404.html", "robots.txt", "sitemap.xml", "CNAME", "BingSiteAuth.xml"
];

for (const file of required) {
  if (!existsSync(join(output, file))) errors.push(`Missing required output: ${file}`);
}

function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

function internalTarget(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || !clean.startsWith("/")) return null;
  if (clean === "/") return join(output, "index.html");
  if (extname(clean)) return join(output, clean);
  return join(output, clean, "index.html");
}

if (existsSync(output)) {
  let calendlyLinks = 0;
  for (const file of filesIn(output).filter((path) => path.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    if (!html.includes("<html lang=\"en\"")) errors.push(`${file}: missing lang attribute`);
    if (!html.includes("<meta name=\"viewport\"")) errors.push(`${file}: missing viewport metadata`);
    if (/<a\b[^>]*href="(?:|#)"/.test(html)) errors.push(`${file}: empty or dead-end link`);
    if (/<img\b[^>]*src="https:\/\/(?:i\.ytimg\.com|img\.youtube\.com)/.test(html)) errors.push(`${file}: remote YouTube cover dependency`);
    if (!html.includes('http-equiv="refresh"')) {
      if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${file}: expected one main heading`);
      for (const marker of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:image"', 'name="twitter:image:alt"']) {
        if (!html.includes(marker)) errors.push(`${file}: missing ${marker}`);
      }
    }
    if (/cal\.com|CALCOM_URL/i.test(html)) errors.push(`${file}: legacy Cal.com reference found`);
    calendlyLinks += (html.match(/https:\/\/calendly\.com\/adrianchinghc\/30-minute-call/g) || []).length;
    for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*(?:href|src)=\"([^\"]+)\"/g)) {
      const target = internalTarget(match[1]);
      if (target && !existsSync(target)) errors.push(`${file}: broken internal link ${match[1]}`);
      const hash = match[1].split("#")[1];
      if (hash && (target || match[1].startsWith("#"))) {
        const fragmentFile = target || file;
        if (existsSync(fragmentFile) && fragmentFile.endsWith(".html")) {
          const fragment = decodeURIComponent(hash);
          if (!readFileSync(fragmentFile, "utf8").includes(`id="${fragment}"`)) errors.push(`${file}: missing anchor ${match[1]}`);
        }
      }
    }
    for (const match of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="https:\/\/adrianching\.com([^\"]+)"/g)) {
      const target = internalTarget(match[1]);
      if (!target || !existsSync(target)) errors.push(`${file}: missing social image ${match[1]}`);
    }
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt=\"[^\"]*\"/.test(match[0])) errors.push(`${file}: image missing alt text`);
    }
  }
  if (calendlyLinks < 8) errors.push(`Expected Calendly CTAs across commercial pages; found ${calendlyLinks}`);
  if (existsSync(join(output, ".agents"))) errors.push("Development skills must not be published in the site output");
}

if (existsSync(join(output, "CNAME")) && readFileSync(join(output, "CNAME"), "utf8").trim() !== "adrianching.com") {
  errors.push("CNAME does not preserve adrianching.com");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Site checks passed (${filesIn(output).length} generated files).`);
