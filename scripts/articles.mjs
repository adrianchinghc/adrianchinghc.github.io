import { articleIsVisible, publicationDate, buildTime, isReviewPreview } from './publication.mjs';

export const articleTopics = ['AI decisions', 'Software decisions', 'Customer follow-up', 'Building businesses'];
export const articleCtas = ['newsletter', 'audit', 'advisory', 'leadmagnet'];
export const isoDate = value => new Date(value).toISOString();
export const readableDate = value => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' }).format(new Date(value));
export const jsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');

export function validateArticle(data, now = buildTime, { preview = isReviewPreview() } = {}) {
  if (data.draft !== false || data.archive) return;
  for (const field of ['title', 'description', 'topic', 'date', 'socialTitle', 'socialDescription', 'socialLabel', 'socialAction']) {
    if (!data[field]) throw new Error(`Article requires ${field}: ${data.page?.inputPath}`);
  }
  // The typeset card is a development stand-in. Every article that reaches a
  // reader or a review preview ships the commissioned cover in all three
  // placements. See the creative standard in scripts/ARTICLES.md.
  for (const field of ['socialCover', 'socialCoverAlt']) {
    if (!data[field]) throw new Error(`Article requires ${field}; the typeset fallback cannot publish. See scripts/ARTICLES.md: ${data.page?.inputPath}`);
  }
  if (!articleTopics.includes(data.topic)) throw new Error(`Unknown article topic: ${data.topic}`);
  const published = publicationDate(data.date);
  const updated = data.updated && new Date(data.updated);
  if (updated && (!Number.isFinite(+updated) || updated < published || updated > now)) throw new Error('Article updated date must be between publication and today');
  if (data.cta && !articleCtas.includes(data.cta)) throw new Error(`Unknown article CTA: ${data.cta}`);
  // A lead magnet promises a specific file by email, so the article has to name a
  // configured Kit form. A review preview may render before that form exists;
  // publishing in that state would show readers a next step that goes nowhere.
  if (data.cta === 'leadmagnet') {
    const magnet = data.leadmagnets?.[data.leadMagnet];
    if (!magnet) throw new Error(`Article cta: leadmagnet requires leadMagnet naming an entry in src/_data/leadmagnets.json: ${data.page?.inputPath}`);
    if (!preview && !magnet.formId) throw new Error(`Lead magnet ${data.leadMagnet} has no Kit formId, so it cannot publish. See scripts/ARTICLES.md: ${data.page?.inputPath}`);
  }
}

export function relatedArticles(items, route, topic) {
  return items.filter(item => item.url !== route && !item.data.archive)
    .sort((a, b) => Number(b.data.topic === topic) - Number(a.data.topic === topic) || b.date - a.date)
    .slice(0, 3);
}

export function articleSchema(data, image) {
  const url = `${data.site.url}${data.page.url}`;
  return {
    '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`,
    headline: data.title, description: data.description, url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', '@id': `${data.site.url}/#adrian-ching`, name: 'Adrian Ching', url: `${data.site.url}/about/` },
    datePublished: isoDate(data.date), ...(data.updated ? { dateModified: isoDate(data.updated) } : {}),
    image: [image], inLanguage: 'en', articleSection: data.archive ? 'Archive' : data.topic,
    isAccessibleForFree: true
  };
}

export function articles(config) {
  config.addFilter('isoDate', isoDate);
  config.addFilter('readableDate', readableDate);
  config.addFilter('relatedArticles', relatedArticles);
  config.addCollection('articles', api => api.getAll().filter(item => item.data.article && articleIsVisible(item.data) && !item.data.archive).sort((a, b) => b.date - a.date));
  config.addCollection('archiveArticles', api => api.getAll().filter(item => item.data.article && item.data.archive).sort((a, b) => b.date - a.date));
}
