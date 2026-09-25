# Measurement and SEO operating guide

## What the site measures

After a visitor accepts analytics, the site can send page views and these events to configured providers:

- `founder_fit_call_click`: a Calendly click. This is interest, not a completed booking.
- `work_with_me_click`, `newsletter_click`, `youtube_click`, `outbound_click`, `link_click`: navigation and content interest.
- `scroll_depth`: first reach of 25%, 50%, 75% and 90% of a page.
- `engaged_time`: the page remained visible at 30, 60 and 120 seconds.
- `web_vital`: LCP, CLS and INP field measurements where the browser supports them.
- `javascript_error`: a sanitised runtime or unhandled-promise signal. Messages and stack traces are intentionally excluded.
- `system_theme`: light or dark system preference.

Every link event includes `page_path`, `cta_location`, `link_text`, `link_domain` and `link_path`. YouTube clicks also include `video_title` and `video_id`.

### Link-location tagging rules

The shared click tracker resolves location in this order:

1. `data-cta` on the link for an exact, controlled placement.
2. `data-analytics-location` on the nearest containing region.
3. A semantic fallback based on the nearest labelled navigation or identified landmark.
4. A stable generic value such as `page_header`, `page_footer`, `article`, `page_section` or `page`.

For a new reusable section, label the container once with `data-analytics-location="descriptive_name"` so every present and future link inside inherits it. Use lowercase snake case and reuse existing labels. Add `data-cta` only when one link needs a more specific placement. Add `data-analytics-event` only when the click needs a distinct event name rather than the standard internal or outbound fallback.

Register `cta_location`, `video_title` and `video_id` as event-scoped custom dimensions in GA4.

Do not send names, email addresses, intake answers, business data or full URL query strings to analytics.

## Newsletter signup attribution

Kit is the source of truth for confirmed subscribers. Its built-in **Referrer** and **UTM Source/Medium/Campaign/Term/Content** fields come from the page the form is submitted on: `document.referrer` and that page's query string. A visitor who lands on an article from Google and subscribes on `/newsletter/` would otherwise be credited to this site.

`src/assets/js/attribution.js` keeps the first outside source of the browser tab in `sessionStorage` (`adrian_first_touch`): the referring site only (scheme and host, never the path or query) and the five standard campaign tags, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` and `utm_content`, each cut to 200 characters. When a Kit newsletter form submits, it fills Kit's own fields with them, and only when the signup page has no outside source of its own. No custom Kit fields are needed and nothing else receives the data.

- The signup page's own outside source wins as a whole. If it has an outside referrer or campaign tags, Kit gets exactly what that page sends, so one subscriber is never credited to two sources.
- A direct visit with no outside referrer or tags changes nothing.
- The first outside source in a tab wins over later ones.
- Kit attributes a subscriber on first signup only; a returning subscriber keeps their original values.

This depends on Kit's form script (`ck.5.js`) sending its `FormData`, with the `referrer`, `host` and `search` fields, through `window.fetch` to `app.kit.com/forms/<id>/subscriptions`. `scripts/attribution.test.mjs` mirrors that request, so it cannot notice if Kit changes it. After a Kit script change, and once a quarter, recheck: open the site from a link carrying `?utm_source=test`, subscribe on another page with a test address, and confirm the subscriber's Referrer and UTM fields in Kit.

GA4's `newsletter_signup_submitted` carries `signup_placement` (`home_hero`, `article_end`, `newsletter_page`, `<page>_band`). Read it alongside GA4's session source and landing page. Only Kit shows confirmations.

## Funnel definitions

1. Website interest: offer-page view or `work_with_me_click`.
2. Booking intent: `founder_fit_call_click`.
3. Booked call: import from Calendly or record in the CRM. Do not infer it from the click.
4. Qualified opportunity: record after the call in the CRM.
5. Paid engagement: record after payment. Do not expose a public checkout.

Use UTMs on every link you control: `utm_source`, `utm_medium`, `utm_campaign`, and only when useful, `utm_content`. Write them in lowercase from a controlled naming sheet rather than inventing a new label for every post: for example `utm_source=youtube&utm_medium=video&utm_campaign=<video-slug>` in video descriptions and `utm_source=linkedin&utm_medium=social&utm_campaign=<post-topic>` on posts. ChatGPT already adds `utm_source=chatgpt.com` to the links it cites.

## Search intent map

| Route | Primary intent | Supporting language |
| --- | --- | --- |
| `/` | Adrian Ching; founder of Second Team | founder, builder, operator, writer |
| `/work-with-me/` | AI advisor for B2B founders and CEOs | AI and growth advice, independent decision support |
| `/ai-profit-opportunity-audit/` | AI opportunity audit for B2B companies | AI assessment, AI opportunities, AI ROI, revenue and efficiency |
| `/advisory/` | private AI advisor for B2B CEOs | build versus buy, vendor guidance, AI investment decisions |
| `/blog/` | AI, software and growth ideas for founders | practical owner problems and decision-led articles |
| `/client-stories/` | Adrian's software client stories and reviews | historical Upstack Studio work, clearly separated from current offers |

These are intent themes, not claims of search volume. Validate them with Search Console data after the site is accessible and collecting impressions. Write useful articles around specific owner problems; do not repeat exact keywords unnaturally.

## Account configuration

GitHub Actions builds production with Adrian's public GA4 measurement ID `G-Z7QMLP7BSE` in the publishing workflow. It is not a secret. Add `GOOGLE_SITE_VERIFICATION` as a repository secret when supplied. Add `META_PIXEL_ID` or `HOTJAR_ID` only if there is a deliberate advertising or behaviour-research need. For Vercel testing, use a separate test property's ID; never send preview traffic to the production GA4 property. The preview remains `noindex`.

Submit `https://adrianching.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Mark `founder_fit_call_click` as a key event only if booking intent is the outcome being reported; use confirmed Calendly bookings as the stronger conversion.

The scheduled `Monitor AdrianChing.com` workflow checks availability, expected content, discovery files and the public TLS certificate every six hours. Enable GitHub Actions failure notifications so a failed run becomes an alert.
