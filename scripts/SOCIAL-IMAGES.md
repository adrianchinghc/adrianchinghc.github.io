# Share images: earn the click, deliver the promise

Every public page needs deliberate share copy. This is the publishing standard
for current and future pages. Optimize for relevant visitors who will value the
page; do not claim measured CTR gains without evidence.

## Editorial requirements

- Lead with one specific reader decision, useful outcome, or honest curiosity.
  The image should answer “Why open this?” without surrounding post text.
- Write a short, plain headline (10–72 characters). Avoid generic phrases such
  as “Ideas worth exploring”, exaggerated promises, invented numbers, urgency,
  or withholding the basic subject just to provoke a click.
- Deliver that promise on the destination page. Distinguish historical client
  feedback, illustrative examples, and current services. Label archived advice.
- Add a factual topic/audience label (3–46 characters), a concrete next action
  (5–34 characters), and supporting share description (40–200 characters).
  The description adds context; it should not simply repeat the headline.
- Keep utility pages useful and accurate: privacy explains choices; confirmation
  points to the next read; 404 helps someone recover. Do not sell on those pages
  or suggest that sharing a confirmation URL subscribes the viewer.
- Use real photographs with deliberate crops. Keep faces unobstructed and clear
  at small sizes. Never generate a likeness or imply a photo proves a result.
- Keep the established editorial design: strong contrast, a large headline,
  restrained rust accent, one clear action. No fake interface buttons or badges.

## Adding a page

Curated existing pages live in the `cards` map in `social-images.mjs`. New pages
using the base layout must supply these front-matter fields; a build fails when
share copy is missing or outside the length limits. There is intentionally no
silent generic title fallback. A build cannot judge the truth or quality of a
headline: the author must apply the editorial requirements above.

```yaml
socialTitle: "A specific question the page answers"
socialLabel: "THE TOPIC OR AUDIENCE"
socialDescription: "Explain the concrete value of opening this page, using only claims supported by its contents."
socialAction: "Read the guide →"
# Optional existing local photo. Omit for a typography-only card.
# socialImage: /assets/images/adrian/reading.webp
```

Use newlines in `socialTitle` only when they improve the composition. Authored
lines must fit without extra wrapping at 48px or larger; the build rejects
overlong lines instead of producing a one-word orphan. Do not
reuse the placeholder copy above. For a curated page, change its `cards` entry;
that entry takes precedence over front matter. `/work/` and `/ventures/` reuse
their destination's card and metadata.

## Generation and verification

Sharp renders 1200 × 630 JPEGs using the licensed local Manrope font. Headline
size never falls below 48px: an overlong composition fails instead of becoming
unreadable. Every page gets matching OG/Twitter headlines, descriptions, image
URLs, image dimensions and alt text. Search titles and visible page copy remain
independent. Card images do not add duplicate visible photos to site pages.

Output: `_site/social/<page>.<content-hash>.jpg`. Images get a new URL whenever
the rendering changes. Metadata uses the production origin, like canonical
URLs; before merging, view that image path on the Vercel preview. New production
files are available only after deployment. Platform caches may need a rescrape.

Before publishing:

1. Run `npm run build`, `npm run check`, and `git diff --check`.
2. Inspect every changed card at full size and about 360px wide. Check the face,
   headline, line breaks, topic and action. Confirm the headline remains legible.
3. Compare the card's promise and share description with the actual page.
4. Verify the exact commit on Vercel, inspect live metadata and deployed JPEGs.
5. Obtain Adrian's approval before merging into production.

For future iteration, change one headline or visual treatment at a time and
compare clicks relative to impressions for comparable posts and audiences.
Use social-platform data where available; website visits alone do not establish
CTR. Retain the wording, dates and channel for each comparison. Do not label a
variant a winner without data, and never send subscriber details to analytics.
