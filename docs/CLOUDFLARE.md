# Cloudflare Workers hosting

AdrianChing.com is moving from GitHub Pages to Cloudflare Workers static assets, on Cloudflare's free plan. Until the cutover, GitHub Pages stays production and the Worker runs alongside it on its `workers.dev` address.

## How it works

- `wrangler.jsonc` serves the built `_site` folder. There is no Worker script, so every request is a free static-asset request.
- `src/_headers` sets caching and response headers. Hashed files under `/static/` and `/responsive/` are cached for a year. Other images, fonts and share cards are cached for eight days. Pages are revalidated on every visit.
- `src/_redirects` holds hand-written redirects. The build appends a 301 from every page's address without its trailing slash, and with `index.html`, to the canonical address (`scripts/cloudflare.mjs`). Cloudflare would otherwise answer these with temporary 307s.
- `.assetsignore` keeps `CNAME`, which only GitHub Pages needs, off the Worker.
- `npm run check` fails a build whose redirects lead to a missing page or anchor, or whose caching rules have drifted.

Cloudflare's Workers Builds builds every push:

| Branch | Build | Then |
| --- | --- | --- |
| `source` | Production: build, site checks, tests (`npm run build:cloudflare`) | Deploys, checks the live site and rolls back if the check fails (`npm run deploy:cloudflare`) |
| Any other | Review preview: `SITE_ENV=preview`, scheduled articles shown, no analytics, `noindex` | Deploys a preview and posts its link on the pull request |

A failed build deploys nothing. The live check (`scripts/smoke-check.mjs`) confirms that the homepage references this release's CSS and JavaScript, the sitemap and `robots.txt` match the build, versioned files are cached as immutable, redirects are permanent and a missing page returns 404. It runs only once the Worker serves adrianching.com.

`SITE_ENV` replaces Vercel's `VERCEL_ENV`, which still counts while Vercel builds previews: `production` (default), `preview`, or `audit` (production output plus scheduled articles, used by Lighthouse).

## One-time dashboard setup

1. **Connect the repository.** In the Cloudflare dashboard go to **Workers & Pages → Create → Import a repository**. Authorise the Cloudflare GitHub app for `adrianchinghc/adrianchinghc.github.io` and choose it.
2. **Build settings:**
   - Worker name: `adrianching` (must match `wrangler.jsonc`)
   - Production branch: `source`
   - Build command: `npm run build:cloudflare`
   - Deploy command: `npm run deploy:cloudflare`
   - Builds for non-production branches: on. Leave the preview command as `npx wrangler preview`.
   - Root directory: empty. API token: let Cloudflare create one.
   - Build variables: none needed. The public GA4 ID is in `scripts/cloudflare-build.mjs`.
3. **Build caching and watch paths** (save build minutes): turn on build caching, and in build watch paths exclude `docs/*`, `.github/*`, `README.md`, `DESIGN.md`, `scripts/*.md` and `lighthouserc.cjs`.
4. **Protect previews.** Previews show scheduled articles before they publish. Go to the Worker's **Settings → Domains & Routes**. For **Preview URLs**, choose **Enable Cloudflare Access** and allow only Adrian's email. This is free for up to 50 users. Leave the production `workers.dev` address public until the cutover so it can be compared with production. It sends `X-Robots-Tag: noindex`.

Free-plan limits that apply:
- 20,000 files per deploy; the site has about 350.
- 3,000 build minutes a month, one build at a time.
- 100 header rules and 2,100 redirects.

## Cutover

1. Compare the `workers.dev` address with production. Check every sitemap page, redirect and header, and time responses from a few regions.
2. **Deploy hook for scheduled publishing:**
   - In the Worker's **Settings → Builds → Deploy Hooks**, create a hook for `source`.
   - Save its URL as the GitHub Actions secret `CLOUDFLARE_DEPLOY_HOOK`.
   - The cutover pull request switches the Wednesday schedule in `publish.yml` to call it.
3. **Merge the cutover pull request.** It:
   - adds the route `adrianching.com/*` (zone `adrianching.com`) to `wrangler.jsonc`;
   - turns `workers_dev` off.

   The route takes over from GitHub Pages as soon as the production build deploys. The live check then runs against adrianching.com.
4. Keep GitHub Pages publishing for a week, so rollback stays one step.

The zone's existing rules keep working in front of the Worker, because Cloudflare applies them before Workers:
- HTTPS enforcement;
- `www` to apex;
- the `/work/` and `/ventures/` Redirect Rules.

## Rollback

- **Bad release after the cutover:**
  - The deploy script rolls back automatically when the live check fails.
  - To roll back by hand, open the Worker's **Deployments** tab and roll back to an earlier version, or run `npx wrangler rollback`.
- **Undo the cutover:**
  - Delete the `adrianching.com/*` route in the Worker's **Settings → Domains & Routes**, or revert the cutover pull request.
  - Traffic returns to GitHub Pages immediately, because its DNS record and deployments are untouched until the cleanup.

## Cleanup, a week after the cutover

- Remove the GitHub Pages deploy and the Cloudflare cache purge (`scripts/purge-cloudflare.mjs`, secret `CLOUDFLARE_CACHE_PURGE_TOKEN`) from `publish.yml`, then turn off GitHub Pages.
- Remove `src/CNAME` and its `.assetsignore` entry.
- Replace the six-hourly `health-check.yml` with a free uptime monitor. The deploy script already checks every release.
- Disconnect Vercel, delete `vercel.json` and drop the `VERCEL_ENV` fallback in `scripts/publication.mjs`.
- Delete the dashboard Redirect Rules and Cache Rules that `_redirects` and `_headers` now cover, and confirm the live headers are unchanged.
- Make the repository private.
