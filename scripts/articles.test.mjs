import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, cp, rm, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import Eleventy from '@11ty/eleventy';
import { articles, validateArticle, relatedArticles, articleSchema, jsonLd } from './articles.mjs';
import { socialImages } from './social-images.mjs';

const valid = { draft: false, title: 'A useful decision', description: 'A useful guide to making a specific business decision.', topic: 'Software decisions', date: '2026-01-10', socialTitle: 'Build, buy or wait?', socialDescription: 'Compare the options before committing time and money to new software.', socialLabel: 'SOFTWARE DECISIONS', socialAction: 'Read the guide' };

test('publishing rejects missing metadata, unknown topics and misleading dates', () => {
  const now = new Date('2026-09-17');
  validateArticle(valid, now);
  validateArticle({ draft: true }, now);
  for (const edit of [{ date: 'invalid' }, { date: '2099-01-01' }, { updated: '2025-01-01' }, { updated: '2099-01-01' }, { updated: 'invalid' }, { topic: 'Anything' }, { cta: 'checkout' }, { description: '' }, { socialTitle: '' }]) assert.throws(() => validateArticle({ ...valid, ...edit }, now));
});

test('related reading excludes current and archive, prioritises topic then recency', () => {
  const item = (url, topic, date, archive = false) => ({ url, date: new Date(date), data: { topic, archive } });
  const items = [item('/self/', 'AI', '2026-09-01'), item('/older/', 'AI', '2026-01-01'), item('/newer/', 'AI', '2026-08-01'), item('/other/', 'Software', '2026-09-02'), item('/archive/', 'AI', '2016-01-01', true)];
  assert.deepEqual(relatedArticles(items, '/self/', 'AI').map(i => i.url), ['/newer/', '/older/', '/other/']);
});

test('article structured data preserves original date and safely embeds authored text', () => {
  const schema = articleSchema({ ...valid, title: 'Text </script><script>alert(1)</script>', site: { url: 'https://adrianching.com' }, page: { url: '/blog/example/' } }, 'https://adrianching.com/social/example.jpg');
  assert.equal(schema.datePublished, '2026-01-10T00:00:00.000Z');
  assert.equal(schema.dateModified, undefined);
  assert.equal(schema.author.url, 'https://adrianching.com/about/');
  assert.ok(!jsonLd(schema).includes('</script>'));
  assert.deepEqual(JSON.parse(jsonLd(schema)), schema);
});

test('Eleventy publishes complete articles, hides drafts and produces discovery links', async () => {
  const root = await mkdtemp('.article-tests-');
  const input = join(root, 'src');
  const output = join(root, 'out');
  const put = async (path, text) => { await mkdir(join(input, path, '..'), { recursive: true }); await writeFile(join(input, path), text); };
  try {
    await put('articles/articles.11tydata.js', `export { default } from ${JSON.stringify(pathToFileURL(resolve('src/articles/articles.11tydata.js')).href)};`);
    await put('_data/site.json', JSON.stringify({ url: 'https://adrianching.com', name: 'Adrian Ching' }));
    await mkdir(join(input, '_includes/layouts'), { recursive: true });
    await cp('src/_includes/layouts/post.njk', join(input, '_includes/layouts/post.njk'));
    await put('_includes/layouts/base.njk', '<!doctype html><html><head>{% socialImageMeta page.url, title, socialImage, site.url, socialTitle, socialDescription, socialLabel, socialAction %}</head><body>{{ content | safe }}</body></html>');
    await cp('src/sitemap.xml.njk', join(input, 'sitemap.xml.njk'));
    await mkdir(join(input, 'blog'), { recursive: true });
    await cp('src/blog/index.njk', join(input, 'blog/index.njk'));
    await cp('src/_includes/icons.njk', join(input, '_includes/icons.njk'));
    await put('_data/media.json', JSON.stringify({ featuredVideos: [], youtube: { channelUrl: 'https://www.youtube.com/@adrianchinghc' } }));
    const article = (data, body = 'A clear opening answer.\n\n## The decision\n\nThe useful explanation.') => `---json\n${JSON.stringify(data)}\n---\n${body}`;
    await put('articles/earlier.md', article(valid));
    await put('articles/latest.md', article({ ...valid, title: 'A newer useful decision', date: '2026-02-01', updated: '2026-03-01', cta: 'audit', socialArtwork: 'scripts/assets/illustrations/build-buy-wait.webp', socialArtworkAlt: 'Blocks, arch and pause bars.' }));
    await put('articles/draft.md', article({ title: 'Unreviewed draft' }));
    await put('articles/explicit-draft.md', article({ ...valid, draft: true, title: 'Explicit draft' }));
    const configPath = join(root, 'eleventy.config.mjs');
    await writeFile(configPath, 'export default function () { return {}; }');
    const elev = new Eleventy(input, output, { configPath, quietMode: true, config: config => {
      config.setOutputDirectory(output); config.setInputDirectory(input);
      articles(config); socialImages(config); config.addFilter('year', date => new Date(date).getUTCFullYear());
      return { dir: { input, output, includes: '_includes', data: '_data' }, markdownTemplateEngine: 'njk', htmlTemplateEngine: 'njk' };
    } });
    await elev.write();
    const html = await readFile(join(output, 'blog/latest/index.html'), 'utf8');
    assert.match(html, /Published <time datetime="2026-02-01T00:00:00.000Z"/);
    assert.match(html, /Updated <time datetime="2026-03-01T00:00:00.000Z"/);
    assert.doesNotMatch(html, /original article from my/);
    assert.match(html, /href="\/ai-profit-opportunity-audit\/"/);
    assert.match(html, /href="\/blog\/earlier\/"/);
    assert.match(html, /class="article-featured"/);
    assert.match(html, /srcset="[^"]+400w, [^"]+800w, [^"]+1200w"/);
    assert.match(html, /Blocks, arch and pause bars/);
    assert.doesNotMatch(html, /photograph of Adrian/);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema['@type'], 'BlogPosting');
    assert.equal(schema.image[0], html.match(/property="og:image" content="([^"]+)"/)[1]);
    assert.equal(schema.dateModified, '2026-03-01T00:00:00.000Z');
    await access(join(output, new URL(schema.image[0]).pathname));
    const listing = await readFile(join(output, 'blog/index.html'), 'utf8');
    assert.ok(listing.indexOf('/blog/latest/') < listing.indexOf('/blog/earlier/'));
    assert.doesNotMatch(listing, /draft/);
    assert.match(listing, /href="#writing"/);
    assert.match(listing, /id="writing"/);
    assert.match(listing, /writing-entry-featured/);
    assert.match(listing, /alt="" width="1200" height="630" loading="lazy"/);
    const featured = html.match(/<picture class="article-cover">.*?<img src="([^"]+)"/s)[1];
    assert.equal(new URL(schema.image[0]).pathname, featured);
    await access(join(output, featured.replace('.jpg', '.400.webp')));
    assert.doesNotMatch(listing, /Inside an audit|From the writing archive|ai-profit-opportunity-audit\/example/);
    const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
    assert.match(sitemap, /<loc>https:\/\/adrianching.com\/blog\/latest\/<\/loc><lastmod>2026-03-01T00:00:00.000Z<\/lastmod>/);
    assert.doesNotMatch(sitemap, /draft/);
    await assert.rejects(access(join(output, 'blog/draft/index.html')));
    await assert.rejects(access(join(output, 'blog/explicit-draft/index.html')));
  } finally { await rm(root, { recursive: true, force: true }); }
});
