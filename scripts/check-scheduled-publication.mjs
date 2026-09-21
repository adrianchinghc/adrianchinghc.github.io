import { readdir, readFile, appendFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import { articleIsVisible } from './publication.mjs';
import { validateArticle } from './articles.mjs';

export async function dueArticlePaths(directory = 'src/articles', now = new Date()) {
  const paths = [];
  for (const name of await readdir(directory)) {
    if (!name.endsWith('.md')) continue;
    const { data } = matter(await readFile(join(directory, name), 'utf8'));
    if (data.draft !== false || data.archive) continue;
    validateArticle(data, now);
    if (articleIsVisible(data, { now, preview: false })) paths.push(`/blog/${basename(name, '.md')}/`);
  }
  return paths.sort();
}

export function missingArticlePaths(paths, sitemap) {
  if (!/<urlset\b/.test(sitemap) || !/<\/urlset>/.test(sitemap)) throw new Error('Production did not return a valid sitemap');
  const live = new Set([...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim()));
  return paths.filter(path => !live.has(`https://adrianching.com${path}`));
}

export async function checkScheduledPublication({ now = new Date(), request = fetch, directory } = {}) {
  const due = await dueArticlePaths(directory, now);
  if (!due.length) return [];
  // Cache-bust the read, and fail rather than deploy on an unreadable response.
  const response = await request(`https://adrianching.com/sitemap.xml?schedule=${now.getTime()}`, {
    headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Cannot read production sitemap (HTTP ${response.status})`);
  return missingArticlePaths(due, await response.text());
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const missing = await checkScheduledPublication();
  const publish = missing.length > 0;
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `publish=${publish}\n`);
  console.log(publish ? `Publication due: ${missing.join(', ')}` : 'No unpublished articles are due. Skipping build and deployment.');
}
