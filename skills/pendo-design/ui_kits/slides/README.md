# Pendo Slides UI Kit

React recreation of the FY27 slide template. Seven canonical layouts
built from the BRAND.md spec:

1. `CoverSlide.jsx` — `cover-dark` · logo top-left, hero headline bottom-left, pink rule, subtitle
2. `SectionDividerSlide.jsx` — `section-divider-gradient` · pink number circle + Sora headline on dark gradient
3. `AgendaSlide.jsx` — `agenda-numbered-dark` · split Sora headline + 4 numbered items
4. `StatSlide.jsx` — `stat-3up` on dark gradient · pink bolts + Sora ExtraBold numerals
5. `FeatureSlide.jsx` — `feature-layout-dark` · eyebrow + COMING SOON pill + bullets + image card
6. `QuoteSlide.jsx` — `quote-light-gradient` · oversized quote mark + bold Sora quote + headshot
7. `ClosingSlide.jsx` — `closing-gradient-top` · centered logo + headline + URL

Shared primitives live in `_common.jsx`: `<Logo>`, `<LogoTopLeft>`,
`<LogoBottomLeft>`, `<Eyebrow>`, `<PinkRule>`, `<Bolt>`, `<NumberCircle>`,
`<Pill>`, `<SlideFrame>`.

## Open

`index.html` renders the deck with keyboard navigation (← / →) using
the `deck_stage` starter component. Slides are 1920 × 1080 and scale to
fit the viewport.
