export default {
  eleventyExcludeFromCollections: true,
  robots: 'noindex, nofollow',
  permalink: () => process.env.VERCEL_ENV === 'preview' ? '/design-preview/article/' : false
};
