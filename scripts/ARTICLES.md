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
Future-dated posts are scheduled: production omits their HTML, Ideas entries,
sitemap entries and related links until the publication timestamp. Vercel
preview/development builds render scheduled posts for review with noindex.
Drafts remain hidden in both modes. Do not manually link a published page to a
scheduled article: the production link checker will reject that missing route.
Draft files are still in this public repository: do not store confidential
material in them. To review unpublished writing visually, commit `draft: false`
on the article's own branch and read the page in that branch's Vercel preview.
A `draft: true` file builds no page, so its preview shows the site without the
article. Rendering a preview is not approval. Approval to merge a scheduled
post must explicitly cover the exact final version AND its publication timestamp.
Merging a due/past-dated post publishes it immediately; merging a future-dated
post authorizes its later automatic publication.

```yaml
---
title: "The specific question this article answers"
description: "A clear summary of who this is for and what decision it helps them make."
date: "2026-09-23T11:30:00+08:00" # Wednesday 11:30am Malaysia time
draft: true
topic: Software decisions
# updated: 2026-09-18 # Only after a substantive edit; never set on every build.
cta: newsletter
socialTitle: "Build, buy or wait?"
socialDescription: "A practical guide to comparing the options before committing time and money to software."
socialLabel: "SOFTWARE DECISIONS"
socialAction: "Read the guide →"
socialCover: scripts/assets/illustrations/your-article-cover.webp # See Article covers
socialCoverAlt: "Describe the actual illustration, not the article."
---
```

Replace all example copy. Available topics: AI decisions, Software decisions,
Customer follow-up, Building businesses. Next steps: newsletter (default), audit,
advisory. Pick the one that fits the reader's question. No public checkout.
The newsletter next step renders the Kit signup form at the end of the article,
so a reader subscribes without leaving the page. Its invitation matches the article's
topic using `src/_data/newsletter.json`, with a general fallback. Keep the promise
specific and supported by the newsletter; do not invent results or an email cadence.
Audit and advisory keep a link.

## Scheduled publication

Use a quoted ISO timestamp with an explicit timezone for new posts, for example
`date: "2026-09-23T11:30:00+08:00"`. This is the existing `date` field, not a second
scheduling field. Legacy date-only values keep their midnight-UTC meaning.
Visible bylines use Malaysia time; machine-readable metadata preserves the instant.

The existing Pages workflow checks every Wednesday at 12:00 Malaysia time
(`0 4 * * 3` in UTC). Set each weekly post's publication timestamp and its
Production Pipeline Publish Date to Wednesday at `11:30:00+08:00`, using
Asia/Kuala_Lumpur time. Use separate Wednesdays for the default one-post-per-week
cadence. This makes the post eligible 30 minutes before the noon check; obtain
final-version/date approval and merge it before that run. The timestamp is an
eligibility cutoff, not a guarantee of the exact time it becomes live.
It compares due, non-draft article URLs in source with the live sitemap. If all
are already published, it skips the expensive build and deployment. If a post
is missing, it runs the normal clean build, site checks, tests, Pages deployment
and Cloudflare HTML/sitemap purge. Failed sitemap reads fail the check rather
than guessing. The next weekly run catches missed publication windows; use manual dispatch
on source to recover sooner after a missed or failed Wednesday run. Pushes to source
still build immediately, and manual dispatch on source remains the recovery path.
All release jobs use the same pinned source commit; non-source runs cannot deploy.
Lighthouse is not part of scheduled publication.

GitHub cron is best effort, so expect the Wednesday check plus build time, not exact
minute delivery. GitHub can disable scheduled workflows in public repositories
after 60 days of inactivity; check Actions if publication stops. A workflow failure
is visible in Actions and uses the repository's existing notification settings.

To reschedule or cancel before release, obtain approval and merge an updated date
or `draft: true` before the old time. The clean build removes stale output. Do not
reschedule an already published URL without explicit approval for its removal.
The repository and previews are public: scheduling hides content from production,
not from someone reading source or a review preview.

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
The `Verify pull request` workflow runs those steps on the merge result of every
pull request, in production and in preview mode, so a branch that fails the cover
requirement or any later gate is red in review instead of breaking the Pages
publish after a merge. A red check only stops a merge once `Build, check and
test` is a required status check on `source`. Vercel runs the build alone, which
keeps a preview to look at when a gate fails.
Check desktop light/dark layouts, generated responsive rules, card legibility,
links, canonical, dates and BlogPosting JSON-LD on the exact Vercel commit.
Ask Adrian for real-device checks where needed. Do not run Lighthouse on
routine pushes; marking a pull request ready for review runs it once.

Each article gets its own pull request, based on `source`, opened in the same
run as the first push and marked ready for review so Adrian can read it. Never
stack one article branch on another: merging the upper article would publish
the lower one too, and neither post could be reviewed on its own. State in the
PR body which commit the current approval is bound to. Only merge to source
with explicit approval; merging runs the publish workflow.

The obsolete 2016 Middleman tutorial was removed by Adrian’s request. Its old
URL should return 404; do not redirect it to unrelated content. Ideas shows no
empty writing section or Writing jump link. Both appear automatically on the
normal Eleventy build when the first reviewed article is published. This needs
no template redesign; static-site publication still requires a build/deploy.
The illustrative audit example remains on the Audit page, not Ideas.

## Article covers

One commissioned 1200×630 image serves all three placements: the cover below
the byline, the Ideas listing thumbnail, and the share and BlogPosting image.
The page uses 400/800/1200px WebP variants with dimensions reserved; social
platforms receive the 1200×630 JPEG. The build crops nothing and adds no
labels, actions or second headline, so the approved composition survives.

Required front matter on every published article:

```yaml
socialCover: scripts/assets/illustrations/your-article-cover.webp
socialCoverAlt: Describe the actual illustration, not the article.
```

`validateArticle` rejects a published article that omits either field. The
build also rejects a cover that is not exactly 1200×630 or that sits outside
`scripts/assets/illustrations/`. The typeset cobalt card the build can draw
from `socialTitle` alone is a development stand-in: it cannot publish, and it
does not pass cover review. Covers are made during authoring and committed as
optimized WebP; deployment never calls an image service.

### The creative standard

Adrian selected the controlling design reference on 21 September 2026 and it
governs every new cover. Match its visual language; design a new metaphor for
each article rather than reusing its objects or headline.

- **Palette.** Saturated cobalt across the canvas, warm cream lettering, vivid
  yellow and vermilion accents, deep navy outlines and shadows.
- **Typography.** One oversized, heavy, condensed sans headline in cream, a few
  deliberate lines, generous edge clearance. A small `Adrian Ching` attribution
  sits near the lower left and stays subordinate. Typeset the words cleanly;
  never ship garbled lettering from an image generator.
- **Composition.** Headline left, a large conceptual illustration right, joined
  by a spacious cobalt field. It should read as one designed editorial cover.
- **Illustration.** Bold simplified geometric forms with a screen-printed or
  linocut grain, crisp silhouettes, restrained dark outlines, dimensional blocks
  and long graphic shadows. Deliberately illustrated, not glossy 3D or a
  photoreal render. A small anonymous figure may set scale; it is not Adrian.
- **Storytelling.** A clear visual metaphor for the article's central decision,
  built from a few large objects. Avoid generic robots, AI brains, stock
  business clip art, clutter, fabricated screenshots or dashboards, invented
  results and generated portraits.

Headline text must match `socialTitle`. The cobalt field carries its own colour,
so one image works against both the light and dark page background without a
theme-specific variant.

### Commissioning and review

Scout writes the brief, Nexus routes it to Chroma, Chroma returns the finished
1200×630 artwork, Scout integrates and verifies it, then Adrian reviews the
complete article. Request the cover during the drafting pass, not after review.
In-body explanatory figures are different work. See below.

Before calling a cover done, look at the rendered output at the sizes readers
get: the article cover, the Ideas thumbnail at 400px wide, and the 1200×630
share JPEG. Check that the headline is readable, the metaphor is recognizable
at thumbnail size, the crop is clean, and the image separates from both page
backgrounds. A cobalt background with text on it fails this review. A new
artistic direction needs Adrian's approval.

Covers may repeat as that article's cover and thumbnail; this does not relax the
one-use rule for visible photographs.

## Explanatory visuals

Every image, diagram, flowchart, chart and table inside an article has to work in
the reading column, which is 720px wide on a desktop and 343px on a 375px phone.
Scout owns that check no matter who made the visual.

### Images are responsive already

Put the file in `src/assets/images/` and write an ordinary `<img>`. The build
emits 400px to 1280px WebP with a `srcset`, reserves the dimensions and holds the
image to `max-width:100%`. A full-width figure states its own slot, so the browser
stops fetching a 520px file for a 720px box:

```html
<figure class="article-figure">
<img src="/assets/images/posts/your-diagram.webp" alt="Say what the diagram shows."
     sizes="(max-width: 420px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 40px), 720px">
<figcaption>What the reader should take from it.</figcaption>
</figure>
```

### A flowchart, chart or diagram may be an image

It just has to be drawn for the phone, because an image scales to fit the column
and its type scales with it. Two rules make that automatic:

- **Essential type is at least 5% of the image width.** 60px on a 1200px canvas,
  which still renders at 17px in a 343px column. A label at 2% renders at 7px.
- **At most eight labels, each a few words.** A busy board survives the desktop
  and fails the phone.

Commission it like a cover: Scout briefs, Nexus routes to Chroma, Chroma returns
the artwork, Scout wires and checks it. State both rules in the brief.

Build the visual from HTML and CSS instead when its exact labels and numbers
carry the meaning, as the AC-033 and AC-034 branches do in
`src/_includes/article-figures.njk`. Text in a layout wraps, selects,
translates, follows the theme and never shrinks, because the layout stacks
rather than scaling. Text baked into an image does none of that. Either route is
fine; choose on whether the words matter.

Tables need nothing extra. `.article-body table` scrolls sideways inside its own
box, so a wide table never pushes the page. Keep to about four columns anyway.

### The check before a piece goes to review

Open the article preview, then narrow the window to roughly 375px. Confirm the
labels read without zooming, nothing overlaps or clips, the page has no sideways
scroll, and the visual still makes its point. Look in both themes. One pass, not a
protocol. Name what you looked in: a browser window at 375px is emulation, not an
iPhone, and never report a device test that did not happen.
