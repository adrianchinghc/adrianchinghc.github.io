# Adrian Ching: design direction

## Audience and purpose

A personal founder, builder and writer website for established B2B owners. Second Team remains the main company. Useful content, real work and the founder story earn trust before selective paid work appears. The commercial journey ends in the existing 30-minute Calendly fit call, not checkout.

## Visual direction

Refine the existing editorial identity: quiet light surfaces, dark text, a restrained rust accent, Adrian's real photography and strong but readable sans-serif type. Keep the page's story and route structure. Remove decorative section numbers and excessive labels. Reserve dividers for genuinely distinct groups.

Keep this a reading-oriented publication with restrained motion and generous whitespace. Both colour themes must preserve the same quiet editorial character. No scroll hijacking, parallax, reveal gate or faux dashboard.

## Rules

- One self-hosted Manrope family with system sans fallback, swap loading, restrained weight steps and display tracking no tighter than -0.04em.
- Body 17px, 1.7 line height, paragraphs up to 65ch. Main reading content up to 720px. Display headings scale with screen width rather than forcing line breaks.
- Shell up to 1160px, mobile gutter 20px (16px at narrow sizes). One mobile layout boundary at 760px, an intermediate adjustment at 1000px, and a narrow-screen adjustment at 420px.
- Consistent light and dark themes, following the system until a visitor uses the persistent header toggle. Soft tinted surfaces group content without harsh black blocks. Keep photographs unfiltered and render their faces with deliberate crops.
- Buttons at least 48px high; navigation and standalone links at least 44px. Visible focus, keyboard menu controls, no-JavaScript navigation and reduced motion remain supported.
- Motion only acknowledges interactions: press feedback 140ms, directional link feedback 160ms, pointer hover 180ms, and a mobile menu that opens in 180ms and closes in 140ms. Keyboard and reduced-motion interactions are immediate. No automatic animation hides content.
- Sharp editorial image edges; small 4px control radii. The existing AC monogram and favicon stay intact.
- Layers: content 0, sticky header 20, skip link 100. No arbitrary high z-index values.
- Video covers use Adrian's local editorial photographs, not claimed original YouTube thumbnails. Published titles, links and verified counts stay unchanged. No video player loads before a visitor chooses to leave for YouTube.
- Newsletter configuration is a known launch dependency. Do not suggest a successful signup without a working Kit destination.

## Evidence and maintenance

Prices, scope, historical client quotes, canonical URLs and analytics event names are preserved. Every page supplies deliberate social share copy; existing local photography is optional and image alt text is generated. Font licensing accompanies the local font asset. Design tooling stays outside this repository.

## Page composition

Use one visual language with a distinct purpose for each page. The homepage introduces Adrian and gives immediate paths to ideas and selective work; its introduction and actions precede the portrait on phones. About develops the agency chapter, the decision to close it and the businesses being built now. Ideas brings real published work close to the top and organizes it around the visitor’s questions.

Commercial pages put price, session duration, outcome and scope together, with jump links for readers scanning details. Newsletter invitations say “About the newsletter” while Kit is unconfigured. Editorial photographs link explicitly to YouTube; they are not original video thumbnails.

Taste guidance is calibrated to moderate layout variation, low motion and generous reading space. Impeccable critique, layout, typography, adaptation and polish guide refinements; project constraints take priority over generic defaults. No skill packages belong in this repository.

## Photography, icons and motion

Additional photographs show Adrian working, recording and away from the desk. Keep captions factual; do not imply a photograph documents an advisory session or client result. New images are WebP exports of Adrian’s supplied photographs, loaded lazily with explicit dimensions. Photo cropping is handled in CSS.

The small inline SVG set in `src/_includes/icons.njk` uses a consistent 24px grid and 1.6px line. Icons always supplement visible labels and are hidden from assistive technology. Rust marks editorial subjects; action icons inherit the text colour. Play controls stay in a lower corner so they do not cover faces.

Emil’s opportunity filter and animation recipes guide pointer feedback and the mobile navigation transition. Animate only transforms and opacity; visibility only controls the menu’s discrete hidden state. Menu transitions can reverse without timers; closed mobile links are inert immediately. Keyboard actions and reduced-motion preferences remain instant. Reading content, prices and static photographs do not animate on scroll.

## Article diagrams

Explanatory diagrams live in `src/_includes/article-figures.njk` and are built from
ordinary HTML and CSS, not from a fixed-width drawing. A wide SVG set to `width:100%`
shrinks its own type as the reading column narrows: a 720-unit board with 14-unit
labels renders those labels at under 7px on a 375px phone. Compose instead so the
layout stacks and the lines shorten while the type stays put. Size every label in
`rem`, never in viewport or user units, and never below 14px rendered; aim for 16px.
Captions in `.article-figure` sit at 15px, above the site default, because they carry
the illustrative-figures disclosure. Colour comes from the theme tokens so both
themes work, and `--signal` marks the one thing the reader should look at.

Check every diagram in a browser at 1280px, 390px and 375px, in both themes, before
calling it done. A passing build and an absence of horizontal page overflow prove
nothing about whether a label can be read.

## Social share cards

Follow `scripts/SOCIAL-IMAGES.md` for every new page and share-image change.
Lead with a specific reader benefit, decision or truthful curiosity, supported
by the destination. Pair the image with matching OG/Twitter text and a clear
next action. New pages require authored socialTitle, socialDescription,
socialLabel and socialAction fields; the build must not silently substitute
a generic title. Review at feed size and preserve the 48px headline floor.
Use accurate labels for archives, historical testimonials and illustrative
examples. Optimize utility pages for clarity and recovery. CTR improvements
are hypotheses until measured; no invented performance claims.

## Article covers

Article artwork may use saturated cobalt, yellow, vermilion and warm ivory, as
requested by Adrian. Keep the page itself quiet and readable. Prefer one clear
object-based editorial metaphor, bold type and small branding. See ARTICLES.md
for the automatic featured-image pipeline; art is reviewed before publication.

Adrian selected cobalt backgrounds with warm ivory headlines and flat editorial
illustrations, using vermilion and yellow accents. Use one identical composition
in both themes. Keep only the headline, illustration and discreet author branding
on article covers. The surrounding site retains its quiet editorial surfaces.
