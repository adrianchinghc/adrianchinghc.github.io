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

Do not send names, email addresses, intake answers, business data or full URL query strings to analytics.

## Funnel definitions

1. Website interest: offer-page view or `work_with_me_click`.
2. Booking intent: `founder_fit_call_click`.
3. Booked call: import from Calendly or record in the CRM. Do not infer it from the click.
4. Qualified opportunity: record after the call in the CRM.
5. Paid engagement: record after payment. Do not expose a public checkout.

Use UTMs on campaign links: `utm_source`, `utm_medium`, `utm_campaign`, and only when useful, `utm_content`. Keep a controlled naming sheet rather than inventing a new label for every post.

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
