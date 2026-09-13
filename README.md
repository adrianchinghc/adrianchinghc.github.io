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

- `CALCOM_URL`: public Cal.com URL for the 30-Minute Fit Call. Until configured, booking buttons stay on the fit-call section.
- `KIT_URL`: public Kit landing-page or form URL. Until configured, newsletter buttons stay on the newsletter signup section.
- `CONTACT_URL`: optional public contact destination.
- `PAYMENT_URL`: reserved for a later qualified-client payment flow and not linked from the public site.
- `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `HOTJAR_ID`: optional tracking IDs. No tracking scripts are emitted when blank.

## Publishing after approval

The established branch model is preserved: source code belongs on `source`; generated GitHub Pages files belong on `master`.

1. Merge the approved pull request into `source`.
2. Check out `source` locally and pull the merge.
3. Supply final booking/newsletter configuration.
4. Run `npm install`, `npm run build`, and `npm run check`.
5. Run `npm run deploy` to publish `_site` to `master`.

Do not run the deployment command before Adrian approves the production release.

See [`docs/LEGACY-AUDIT.md`](docs/LEGACY-AUDIT.md) for the migration constraints and retained assets.
