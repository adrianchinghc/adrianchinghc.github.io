# Legacy repository audit

This audit was completed from `source` before the rebuild removed any legacy files.

## Deployment and domain

- The repository default branch is `source`.
- The production GitHub Pages output is committed to `master`.
- The Middleman deploy task built the site and pushed generated files to `master`.
- `CNAME` contains `adrianching.com` and is preserved in every new build.
- `BingSiteAuth.xml` is preserved unchanged.

## URLs and SEO

- Existing public routes were `/`, `/about/`, `/work/`, `/ventures/`, `/blog/`, and `/how-to-build-a-website-using-middleman-and-github-pages/`.
- `/about/`, `/blog/`, and the historical article remain live at their original paths.
- Static redirect pages preserve `/work/` and `/ventures/` while pointing search engines to their new canonical destinations.
- The old sitemap used `http://`; the rebuild uses canonical `https://adrianching.com` URLs.
- The existing 1200×630 social preview images and favicon are retained.

## Analytics found

The old build contained these IDs. They are documented but intentionally not enabled by default because their current ownership, consent setup, and usefulness have not been reconfirmed.

- Google Universal Analytics: `UA-44406969-2` (legacy product)
- Meta Pixel: `191202051419060`
- Hotjar: `887098`

Current IDs can be supplied through the environment variables documented in `.env.example`.

## Proof and assets

- Reused: Adrian portrait, iWealth, Teleme and The Malaysian Insight product images, Kevin Ong testimonial and portrait, Samuel Khew testimonial and portrait.
- Retained but not surfaced: the remaining historical Upstack Studio project assets, so no legitimate source material is lost.
- No metrics, client claims, testimonials or articles were invented.

## Removed from the rebuild branch

- Middleman, Ruby gems, Haml, Sass, Gulp, Bower, jQuery and their configuration.
- Stale Mailchimp form, Disqus integration and old agency-first navigation/copy.
- The old generated output on `master` has not been touched.
