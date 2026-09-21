import { articleIsVisible, publicationDate, buildTime } from './publication.mjs';

export const articleTopics = ['AI decisions', 'Software decisions', 'Customer follow-up', 'Building businesses'];
export const isoDate = value => new Date(value).toISOString();
export const readableDate = value => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' }).format(new Date(value));
export const jsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');

export function validateArticle(data, now = buildTime) {
  if (data.draft !== false || data.archive) return;
  for (const field of ['title', 'description', 'topic', 'date', 'socialTitle', 'socialDescription', 'socialLabel', 'socialAction']) {
    if (!data[field]) throw new Error(`Article requires ${field}: ${data.page?.inputPath}`);
  }
  if (!articleTopics.includes(data.topic)) throw new Error(`Unknown article topic: ${data.topic}`);
  const published = publicationDate(data.date);
  const updated = data.updated && new Date(data.updated);
  if (updated && (!Number.isFinite(+updated) || updated < published || updated > now)) throw new Error('Article updated date must be between publication and today');
  if (data.cta && !['newsletter', 'audit', 'advisory'].includes(data.cta)) throw new Error(`Unknown article CTA: ${data.cta}`);
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
