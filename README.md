# AdrianChing.com

The 2026 rebuild of Adrian Ching's personal website. The site is a static Eleventy project designed for GitHub Pages.

## Why Eleventy

Eleventy keeps the output as plain HTML, CSS and a tiny amount of JavaScript. It supports Markdown writing without a database or client-side framework, has a fast build, and keeps future maintenance straightforward.

## Local development

Requires Node.js 22 or newer, as Wrangler does. CI and Cloudflare builds use Node 24 (`.node-version`).

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
npm run check
```

## Configuration

Copy `.env.example` to `.env` or provide the variables in the shell used for the build.

- Founder Fit Call buttons link directly to Adrian's active 30-minute Calendly event at `https://calendly.com/adrianchinghc/30-minute-call`. The event uses Google Meet and intentionally limited availability. No scheduling embed or public checkout is included.
- Newsletter uses the public Kit form `9916003` (`ab0394af6d`) directly on `/newsletter/` and at the end of every article whose next step is the newsletter. No API key or `KIT_URL` is needed. The official Kit script handles inline responses and validation.
- `CONTACT_URL`: optional public contact destination.
- `PAYMENT_URL`: reserved for a later qualified-client payment flow and not linked from the public site.
- `GA_MEASUREMENT_ID`: Google Analytics 4 measurement ID. `GOOGLE_SITE_VERIFICATION`: Search Console verification token.
- `META_PIXEL_ID`, `HOTJAR_ID`: optional advertising and behaviour-research tools. Leave them blank unless there is a specific need. No optional analytics loads before consent, and no configuration is emitted when all IDs are blank.

When analytics is configured and accepted, the site measures navigation, outbound clicks, scroll depth, engaged time, supported Core Web Vitals and sanitised JavaScript errors. Founder Fit Call clicks emit `founder_fit_call_click`; they are not treated as completed bookings. Every link click includes `page_path`, `cta_location`, `link_text`, `link_domain` and `link_path`. New links inherit a semantic location automatically; use `data-analytics-location` on a containing region or `data-cta` on an individual link when a controlled reporting label is needed. See [`docs/MEASUREMENT-SEO.md`](docs/MEASUREMENT-SEO.md) for the event dictionary, tagging rules, funnel definitions, search-intent map and account setup.

## Publishing after approval

Source code belongs on `source`. Merging an approved pull request into `source` is the production release signal. `.github/workflows/publish.yml` installs dependencies, builds the site, runs the site checks and deploys the generated `_site` artifact through GitHub Pages. `master` no longer needs to be updated.

The site is moving to Cloudflare Workers static assets. Until the cutover, Cloudflare's Workers Builds deploys every push to `source` alongside GitHub Pages on a `workers.dev` address, and builds a protected preview for every other branch. [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md) covers the setup, cutover, rollback and cleanup.

Before the first automated release, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. This is a one-time repository setting. The workflow can also be run manually from the Actions tab when a release needs to be retried.

See [`docs/LEGACY-AUDIT.md`](docs/LEGACY-AUDIT.md) for the migration constraints and retained assets.

### Navigation caching

Rocket Loader stays off. HTML uses browser revalidation while Cloudflare can retain a short-lived shared copy using the origin's ten-minute lifetime. CSS and JavaScript retain content-hashed filenames.

After page load, browsers supporting Speculation Rules prefetch up to six same-origin primary navigation destinations. This downloads HTML only; it does not prerender, execute analytics, submit forms, replace the document, or intercept link clicks. Unsupported browsers keep native navigation. Data Saver and 2G connections skip this enhancement.

The publishing workflow clears all generated HTML and previous sitemap HTML URLs, including directory aliases, after GitHub Pages reports a successful deployment. Configure the GitHub Actions secret `CLOUDFLARE_CACHE_PURGE_TOKEN` with only Cache Purge permission for the adrianching.com zone. A missing secret produces an explicit workflow warning and skips automatic clearing; an API purge failure fails the workflow and can be retried. Arbitrary query-string variants are not enumerated by the sitemap and expire according to the short edge TTL; an already prefetched browser document can also remain until the browser discards it.

Validate with `node --test scripts/navigation.test.mjs`, `npm run build`, and `npm run check`.

## Preview and editorial maintenance

Images are resized at build time by Sharp into content-hashed WebP variants. Source photographs remain intact; generated HTML has intrinsic dimensions and responsive `srcset`/`sizes`. No image service runs in the browser or at request time.

The homepage, About and Newsletter hero photographs and homepage video covers also use mobile art direction through `<picture>`. Mobile crops preserve the existing CSS aspect ratios and focal positions, with AVIF preferred and WebP fallback. Generated filenames hash the final encoded bytes, so crop, quality and codec changes cannot overwrite a cached image. Only generated `/responsive/` images and hashed `/static/` CSS/JS are eligible for one-year immutable caching; original image and font URLs retain their existing policy.

The Lighthouse workflow audits every pull request that can change the site, again on each new push, before anything publishes. It covers the homepage, Client stories, Work with me and Newsletter pages, the newest article, and every page the pull request adds or changes, up to ten pages (`scripts/lighthouse-urls.mjs`). It builds with `SITE_ENV=audit`: production output that also renders scheduled articles, so a new article is audited before its publication date. Mobile takes the median of three runs and desktop one. The workflow requires performance of at least 95 on desktop and 85 on mobile, LCP under 2.5 s, CLS under 0.1, pages under 500 KB, and accessibility, best-practices and SEO scores of 100 (`lighthouserc.cjs`). Treat a failure as blocking. Reports are retained as workflow artifacts. These checks do not establish real-user performance or replace manual accessibility reviews. Review previews remain deliberately non-indexable.

Work stays on `rebuild-2026` in PR #116. Vercel automatically builds branch pushes using `vercel.json`; the stable preview is https://adrianchingcom-git-rebuild-2026-upstackstudio.vercel.app/. Vercel is the preview environment; GitHub Pages hosts production. Never promote a Vercel preview or change production domains without Adrian's approval. Preview protection is managed in Vercel.

- `src/_data/media.js` owns the three curated YouTube links and dated audience snapshots. The first video is featured; the other two are popular supporting picks. Recheck public counts when refreshing the selection. No API key, live feed or heavy player is needed.
- The Ideas page distinguishes curated picks from the latest uploads link. Do not invent articles, dates, engagement or live-feed claims.
- The homepage story uses Adrian's confirmed history. Founder situations are explicitly illustrative, not invented client stories. The Teleme proof comes from the legacy work page; the quoted excerpt and attribution are preserved. Past software proof is not presented as an AI Audit result.
- Each page can set `socialImage` and `socialImageAlt` to an existing, relevant photograph. Keep the canonical production URL even on previews.
- Navigation remains available without JavaScript. With JavaScript, the mobile menu supports Escape, outside click, focus exit and viewport changes.
- Light and dark palettes follow the visitor's operating-system preference on first visit. The header toggle remembers a manual choice in the browser.
- Before merging newsletter changes, test with your own email and confirm the incentive email, sender identity and double opt-in settings in Kit. Submission success is not proof of confirmed subscription.

## Design and conversion refinements

See `DESIGN.md` for the visual system and maintenance rules. Design skill packages are kept outside this repository. No frontend framework or animation library was added.

The visual system uses a self-hosted Latin Manrope variable font from `@fontsource-variable/manrope` 5.3.0 (OFL license beside the font). Video covers are local editorial photographs of Adrian, not claimed original YouTube thumbnails. Published video titles, links and count snapshots are unchanged.

Commercial pages expose price and scope near the primary CTA. The Work With Me page presents offer choices before the longer story and explains the fit-call → agreement/payment → intake flow. With existing Google Analytics configured, `work_with_me_click` and `newsletter_click` record interest; `founder_fit_call_click` now also records CTA location. These are click events, not completed booking or signup events. No conversion-rate increase is claimed without live traffic measurements.

### Client stories

`/client-stories/` collects historical Upstack Studio client videos, source-linked ratings, written feedback, separate colleague feedback and the dated In Real Life feature. Content lives in `src/_data/clientStories.js`; homepage excerpts remain in `src/_data/testimonials.js`. See `docs/PROOF-SOURCES.md` before changing attribution, quotes, ratings or photos. Ratings are dated snapshots, not live widgets or reviews of the current offers.

`newsletter_signup_submitted` is emitted on Kit’s completion event only when site analytics consent is accepted. No email or event-detail payload is forwarded. Kit owns confirmation metrics. With JavaScript unavailable the native POST opens Kit; normal submissions remain inline.
