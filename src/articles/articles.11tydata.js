import { validateArticle } from '../../scripts/articles.mjs';

export default {
  layout: 'layouts/post.njk', article: true, draft: true, ogType: 'article', cta: 'newsletter',
  eleventyComputed: {
    permalink: data => {
      if (data.draft !== false) return false;
      validateArticle(data);
      return `/blog/${data.page.fileSlug}/`;
    },
    eleventyExcludeFromCollections: data => data.draft !== false
  }
};
