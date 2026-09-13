# AdrianChing.com

The 2026 rebuild of Adrian Ching's personal website. The site is a static Eleventy project designed for GitHub Pages.

## Why Eleventy

Eleventy keeps the output as plain HTML, CSS and a tiny amount of JavaScript. It supports Markdown writing without a database or client-side framework, has a fast build, and keeps future maintenance straightforward.

## Local development

Requires Node.js 20.12 or newer.

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
- `KIT_URL`: public Kit landing-page or form URL. Until configured, the newsletter page states that signup is not yet available and offers a working YouTube link. No fake form or self-link is shown.
- `CONTACT_URL`: optional public contact destination.
- `PAYMENT_URL`: reserved for a later qualified-client payment flow and not linked from the public site.
- `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `HOTJAR_ID`: optional tracking IDs. No tracking scripts are emitted when blank.

When analytics is configured, outbound Calendly clicks emit a `founder_fit_call_click` event. The commercial flow remains: website → Founder Fit Call → qualification → paid engagement → intake.

## Publishing after approval

Source code belongs on `source`. Merging an approved pull request into `source` is the production release signal. `.github/workflows/publish.yml` installs dependencies, builds the site, runs the site checks and deploys the generated `_site` artifact through GitHub Pages. `master` no longer needs to be updated.

Before the first automated release, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. This is a one-time repository setting. The workflow can also be run manually from the Actions tab when a release needs to be retried.

See [`docs/LEGACY-AUDIT.md`](docs/LEGACY-AUDIT.md) for the migration constraints and retained assets.

## Preview and editorial maintenance

Work stays on `rebuild-2026` in PR #116. Vercel automatically builds branch pushes using `vercel.json`; the stable preview is https://adrianchingcom-git-rebuild-2026-upstackstudio.vercel.app/. Vercel is the preview environment; GitHub Pages hosts production. Never promote a Vercel preview or change production domains without Adrian's approval. Preview protection is managed in Vercel.

- `src/_data/media.js` owns the three curated YouTube links and dated audience snapshots. The first video is featured; the other two are popular supporting picks. Recheck public counts when refreshing the selection. No API key, live feed or heavy player is needed.
- The Ideas page distinguishes curated picks from the latest uploads link. Do not invent articles, dates, engagement or live-feed claims.
- The homepage story uses Adrian's confirmed history. Founder situations are explicitly illustrative, not invented client stories. The Teleme proof comes from the legacy work page; the quoted excerpt and attribution are preserved. Past software proof is not presented as an AI Audit result.
- Each page can set `socialImage` and `socialImageAlt` to an existing, relevant photograph. Keep the canonical production URL even on previews.
- Navigation remains available without JavaScript. With JavaScript, the mobile menu supports Escape, outside click, focus exit and viewport changes.
- Newsletter signup still needs a real `KIT_URL` before launch. The fallback is an honest signup-unavailable notice with a YouTube link.

## Design and conversion refinements

See `DESIGN.md` for the visual system and maintenance rules. Design skill packages are kept outside this repository. No frontend framework or animation library was added.

The visual system uses a self-hosted Latin Manrope variable font from `@fontsource-variable/manrope` 5.3.0 (OFL license beside the font). Video covers are local editorial photographs of Adrian, not claimed original YouTube thumbnails. Published video titles, links and count snapshots are unchanged.

Commercial pages expose price and scope near the primary CTA. The Work With Me page presents offer choices before the longer story and explains the fit-call → agreement/payment → intake flow. With existing Google Analytics configured, `work_with_me_click` and `newsletter_click` record interest; `founder_fit_call_click` now also records CTA location. These are click events, not completed booking or signup events. No conversion-rate increase is claimed without live traffic measurements.

### Client stories

`/client-stories/` collects historical Upstack Studio client videos, source-linked ratings, written feedback, separate colleague feedback and the dated In Real Life feature. Content lives in `src/_data/clientStories.js`; homepage excerpts remain in `src/_data/testimonials.js`. See `docs/PROOF-SOURCES.md` before changing attribution, quotes, ratings or photos. Ratings are dated snapshots, not live widgets or reviews of the current offers.
