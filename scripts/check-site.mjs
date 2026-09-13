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
  for (const file of filesIn(output).filter((path) => path.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    if (!html.includes("<html lang=\"en\"")) errors.push(`${file}: missing lang attribute`);
    if (!html.includes("<meta name=\"viewport\"")) errors.push(`${file}: missing viewport metadata`);
    for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*(?:href|src)=\"([^\"]+)\"/g)) {
      const target = internalTarget(match[1]);
      if (target && !existsSync(target)) errors.push(`${file}: broken internal link ${match[1]}`);
    }
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt=\"[^\"]*\"/.test(match[0])) errors.push(`${file}: image missing alt text`);
    }
  }
}

if (existsSync(join(output, "CNAME")) && readFileSync(join(output, "CNAME"), "utf8").trim() !== "adrianching.com") {
  errors.push("CNAME does not preserve adrianching.com");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Site checks passed (${filesIn(output).length} generated files).`);
