# Publishing articles

Search Console and Bing Webmaster Tools are configured (confirmed by Adrian).
Keep the existing search/training crawler policy. Search discovery is not a
promise of indexing, ranking or AI citation.

## New writing

Create `src/articles/a-descriptive-slug.md`. Its public URL will be
`/blog/a-descriptive-slug/`. The directory supplies the article layout,
BlogPosting metadata and newsletter next step. Do not override these defaults
with another permalink/layout or collection exclusion.

New files are drafts by default: no HTML output, article listing or sitemap
entry. Set `draft: false` only when the content has been reviewed for publishing.
A future publication date fails the build; there is no implicit scheduler.
Draft files are still in this public repository: do not store confidential
material in them. To review unpublished writing visually, set draft to false
on rebuild-2026, inspect the Vercel preview, and obtain approval before merging.

```yaml
---
title: "The specific question this article answers"
description: "A clear summary of who this is for and what decision it helps them make."
date: 2026-09-17
draft: true
topic: Software decisions
# updated: 2026-09-18 # Only after a substantive edit; never set on every build.
cta: newsletter
socialTitle: "Build, buy or wait?"
socialDescription: "A practical guide to comparing the options before committing time and money to software."
socialLabel: "SOFTWARE DECISIONS"
socialAction: "Read the guide →"
# socialPalette: ivory # Bright typography by default; optional artwork below.
---
```

Replace all example copy. Available topics: AI decisions, Software decisions,
Customer follow-up, Building businesses. Next steps: newsletter (default), audit,
advisory. Pick the one that fits the reader's question. No public checkout.

## Editorial and search standards

- One H1 (the template supplies it); start the body with a direct answer or a
  purposeful narrative. Use H2/H3 for sections and descriptive link text.
- Include original reasoning, useful tables/checklists and verified experience.
  Mark hypothetical examples clearly. Never invent client results, personal
  stories, quotations or metrics. Keep Second Team product details private.
- Cite primary sources for external facts. Check time-sensitive claims.
- Link to relevant articles and offers naturally. The template also recommends
  up to three published articles, prioritising the same topic and then recency.
- Follow SOCIAL-IMAGES.md. Every new page requires intentional share copy;
  the generated share image is reused in the article's structured data.
- Keep article dates accurate. The sitemap uses updated, or publication date. Do not manufacture freshness.
- Preserve published article URLs unless a removal is explicitly approved. New articles appear automatically
  on /blog/; the latest-writing section stays hidden until there are entries.
- Use Markdown tables for comparisons; the article table scrolls within its
  reading column on small screens. Include meaningful headings and image alt.
- Do not duplicate visible photography already used elsewhere on the site.

## Verification and release

Run a clean build, `npm run check`, `node --test scripts/*.test.mjs`, and
`git diff --check`. Tests exercise draft exclusion, chronological listings,
related links, metadata safety and article output using isolated fixtures.
Check desktop light/dark layouts, generated responsive rules, card legibility,
links, canonical, dates and BlogPosting JSON-LD on the exact Vercel commit.
Ask Adrian for real-device checks where needed. Keep the PR draft and do not
run Lighthouse on routine pushes. Only merge to source with explicit approval.

The obsolete 2016 Middleman tutorial was removed by Adrian’s request. Its old
URL should return 404; do not redirect it to unrelated content. Ideas shows no
empty writing section or Writing jump link. Both appear automatically on the
normal Eleventy build when the first reviewed article is published. This needs
no template redesign; static-site publication still requires a build/deploy.
The illustrative audit example remains on the Audit page, not Ideas.

## Illustrated featured images

Every published article automatically receives a bright cover below the byline,
an Ideas thumbnail, and a matching share image and BlogPosting image. Text is
rendered by the build, not baked into AI artwork. The page uses 400/800/1200px
WebP variants with dimensions reserved; social platforms receive a 1200×630 JPEG.

Optional front matter:

```yaml
socialPalette: ivory # ivory (default), cobalt, or yellow
socialArtwork: scripts/assets/illustrations/build-buy-wait.webp
socialArtworkAlt: An anonymous figure considers three colourful paths leading to building blocks, an arch and a pause gateway.
```

Use the example artwork only for that decision topic. For a new subject, generate
and review a distinct, object-based editorial illustration without text, save an
optimized WebP under scripts/assets/illustrations, and supply meaningful alt text.
Artwork is contained in the right panel without cropping. Without artwork, the
build uses a bright typography-only cover. It does not call an AI service or
invent illustrations during deployment. Avoid robots, brains, glow and generated
portraits. The site’s reading surfaces remain restrained in light and dark mode. White covers keep their colour in both themes and use a subtle theme-aware border so their edges remain visible.

Illustrations may intentionally repeat as that article's cover and thumbnail;
this does not relax the existing one-use rule for visible photographs. Articles
use socialArtwork rather than socialImage. Review headlines at feed size and keep
them short; extra-long explicit lines still fail the legibility gate.

The noindex /design-preview/article/ demonstration exists only when VERCEL_ENV is
preview. It is excluded from collections and never built for GitHub Pages.
