# AC-033 Manrope article-cover master

This is the reusable editable source for the AC-033 article-cover composition. It preserves the original cover's single cobalt field, left-aligned title, small author mark, and right-side editorial pipeline illustration. The rejected AC-034 candidate is not an input.

Files:

- `ac-033-manrope-master.svg` — four named editable groups: `background`, `illustration`, `headline`, and `author-name`.
- `ac-033-manrope-tokens.json` — locked measurements and adaptation rules.
- `render-ac-033-manrope.mjs` — non-Sharp renderer. It inlines the canonical source crop into the editable SVG and loads the licensed Manrope font at render time with `@resvg/resvg-js`.
- `render-review-evidence.mjs` — non-Sharp evidence renderer for the equal-size comparison and placement checks.
- `exports/` — generated baseline and 400px/320px checks; ignored from source control unless deliberately attached for review.

Run `node scripts/article-cover-master/render-ac-033-manrope.mjs && node scripts/article-cover-master/render-review-evidence.mjs` from the repository root. Both scripts use `@resvg/resvg-js` only; neither imports or invokes Sharp. The source renderer writes `ac-033-render-provenance.json`, including source/font hashes and output dimensions. It uses `scripts/assets/manrope-extrabold.ttf`, a build-only official Google Fonts Manrope variable TTF (SHA-256 `3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6`). Its OFL provenance is recorded in `src/assets/fonts/OFL-Manrope.txt`. The website continues to ship `src/assets/fonts/manrope-latin-variable.woff2`. The headline uses `Manrope`, weight `800`; the author uses `600`.

New article copy must follow the token file's two-line rule. When a true headline will not fit, send shortened accurate copy for approval rather than changing the master.
