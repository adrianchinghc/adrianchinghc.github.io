# Link preview images

`social-images.mjs` renders 1200 × 630 JPEG cards during Eleventy builds,
using Sharp (already installed), the site's licensed Manrope font and existing
photographs. No browser or external image service is needed in CI.

Every page using the base layout receives matching Open Graph and Twitter/X
image metadata, including dimensions, MIME type and alt text. The `/work/`
and `/ventures/` redirects use the cards of their destination pages.

For a new page, its title becomes the card headline automatically. An optional
`socialImage` front-matter path selects an existing local photograph. Without
one, it gets a typography-only card. Curated overrides and crop coordinates
for the main pages live in the `cards` map. Keep headlines short and factual.

Cards are share/featured-image assets, separate from in-page photographs.
They do not create visible image duplication. Article-list designs can use
the generated card if a visible featured image is later requested.

Output is `_site/social/<page>.<content-hash>.jpg`. The hash changes when the
rendered image changes, so updated metadata points to a new asset URL.
The base layout uses production's absolute origin, just like its canonical
URL. Before merging, inspect the same `/social/...` path on the Vercel preview.
Production crawlers cannot fetch new cards until production is deployed.

Run `npm run build` and `npm run check`. The checker verifies image existence,
actual JPEG dimensions, a 1 MB size ceiling, matching OG/Twitter URLs and
distinct cards for full pages. After a design change, inspect the generated
JPEGs visually for title wrapping and face placement. Social platforms may
retain their own cached preview until they scrape the page again.
