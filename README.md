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
- `KIT_URL`: public Kit landing-page or form URL. Until configured, newsletter buttons stay on the newsletter signup section.
- `CONTACT_URL`: optional public contact destination.
- `PAYMENT_URL`: reserved for a later qualified-client payment flow and not linked from the public site.
- `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `HOTJAR_ID`: optional tracking IDs. No tracking scripts are emitted when blank.

When analytics is configured, outbound Calendly clicks emit a `founder_fit_call_click` event. The commercial flow remains: website → Founder Fit Call → qualification → paid engagement → intake.

## Publishing after approval

The established branch model is preserved: source code belongs on `source`; generated GitHub Pages files belong on `master`.

1. Merge the approved pull request into `source`.
2. Check out `source` locally and pull the merge.
3. Supply final newsletter configuration if available.
4. Run `npm install`, `npm run build`, and `npm run check`.
5. Run `npm run deploy` to publish `_site` to `master`.

Do not run the deployment command before Adrian approves the production release.

See [`docs/LEGACY-AUDIT.md`](docs/LEGACY-AUDIT.md) for the migration constraints and retained assets.

## Preview and editorial maintenance

Work stays on `rebuild-2026` in PR #116. Vercel automatically builds branch pushes using `vercel.json`; the stable preview is https://adrianchingcom-git-rebuild-2026-upstackstudio.vercel.app/. Never promote a preview or change production domains without Adrian's approval. Preview protection is managed in Vercel.

- `src/_data/media.js` owns the three curated YouTube links and dated audience snapshots. The first video is featured; the other two are popular supporting picks. Recheck public counts when refreshing the selection. No API key, live feed or heavy player is needed.
- The Ideas page distinguishes curated picks from the latest uploads link. Do not invent articles, dates, engagement or live-feed claims.
- The homepage story uses Adrian's confirmed history. Founder situations are explicitly illustrative, not invented client stories. The Teleme proof comes from the legacy work page; the quoted excerpt and attribution are preserved. Past software proof is not presented as an AI Audit result.
- Each page can set `socialImage` and `socialImageAlt` to an existing, relevant photograph. Keep the canonical production URL even on previews.
- Navigation remains available without JavaScript. With JavaScript, the mobile menu supports Escape, outside click, focus exit and viewport changes.
- Newsletter signup still needs a real `KIT_URL` before launch. The fallback is a same-page section, not a working signup form.
