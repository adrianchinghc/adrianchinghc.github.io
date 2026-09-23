manrope-extrabold.ttf is the Manrope **variable** font, not a static ExtraBold.
Its `fvar` table carries one `wght` axis spanning 200–800 and its default instance
is ExtraLight 200, so a CSS weight token alone renders ExtraLight. Anything that
uses it for headline weight has to pin the axis explicitly — see
`scripts/article-cover-master/cover-fonts.mjs`, which registers it as
`AC Cover ExtraBold` and sets `font-variation-settings: 'wght' 800`. The filename
is kept because committed provenance records reference it. License: OFL.txt.

manrope-semibold.ttf is a weight-600 static instance of the same Manrope source,
generated with fontTools. It has no `fvar` table, so no axis is set for it. Its
internal name table still reads `Manrope ExtraLight`; address it by registration
alias, never by its embedded family name. It is used for build-time social-card
rendering and for the cover attribution line. License: OFL.txt.

manrope-cover.ttf is the same weight-600 outlines with a correct `Manrope Cover
SemiBold` family name, so Pango selects the right face in
`scripts/social-images.mjs`. It is not shipped as a web font. License: OFL.txt.

Article illustration and reviewed-cover sources belong under illustrations/.
Add artwork for each real article during authoring. The retired design demo and
its images are not required by the featured-image system. Rendering tests create
and remove their own synthetic fixtures.
