# Pendo Brand Design System — Conversation Handoff

Use this to continue work in a fresh chat. Everything substantive is in the
project files; this doc summarizes what's been built, what's pending, and
where to pick up.

## Current state

Project title: **Pendo Brand Design System**
Source material: `uploads/BRAND (1).md` — the FY27 brand spec (complete).
No codebase, no Figma, no product screenshots were provided.

### Built and live

- `README.md` — brand context, CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS,
  ICONOGRAPHY, project index, caveats.
- `SKILL.md` — Claude Code / Agent Skill manifest (`pendo-design`).
- `colors_and_type.css` — CSS variables for colors, pink scale P1–P8, warm
  neutrals, semantic light/dark tokens, type scale, spacing, radii,
  shadows, motion, signature gradients. `@font-face` for Sora / Inter /
  JetBrains Mono + Google Fonts `@import` fallback.
- `assets/` — chevron + wordmark lockups (approved), lightning bolt,
  pink check, pink arrow, Pankiverse imagery (5 PNGs), portrait placeholder.
- `fonts/README.md` — expected filenames for self-hosted `.woff2`.
- `preview/` — 18 design-system cards registered and grouped
  (Colors / Type / Spacing / Components / Brand). Shared styling in
  `preview/_preview.css`.
- `ui_kits/marketing/` — React landing page: NavBar, Hero, FeatureGrid,
  StatPanel, LogosStrip, QuoteBlock, CTAFooter, index.html.
- `ui_kits/slides/` — FY27 deck template using `deck-stage.js`: Cover,
  SectionDivider, Agenda, Stat, Feature, Quote, Closing + shared
  primitives in `_common.jsx`.

### Registered cards (asset manifest)

Colors · Primary palette, Pink scale P1–P8, Warm neutrals, Semantic tokens,
Gradients.
Type · Display, Body scale, Eyebrow + rule + mono.
Spacing · Scale, Radii, Shadows.
Components · Buttons, Pills/badges/number circles, Card system, Form inputs,
Marketing landing.
Brand · Signature motifs, Logo lockup, Do/don't, Slide template, Pankiverse.

## Open caveats (ask user to resolve)

1. **JetBrains Mono still on CDN** — Sora and Inter are now self-hosted
   variable fonts in `/fonts`. JetBrains Mono is still loaded via Google
   Fonts `@import` in `colors_and_type.css`; drop a local file and swap
   the import when available.
2. ~~Placeholder logo~~ — **Resolved.** Approved chevron SVGs are in
   `assets/`: `pendo-chevron.svg` (primary, pink), `pendo-chevron-square.svg`
   (white chevron on pink square), `pendo-chevron-circle.svg` (white chevron
   on pink circle). All three use the official polygon geometry.
   `pendo-lockup.svg` has been updated to use the real chevron geometry too.
3. **No product UI kit** — brand doc is marketing/deck only. To build
   real Analytics / Guides / Feedback / Session Replay kits, the user
   needs to attach the product codebase or Figma via Import.
4. **Icon set is a substitution** — recommended Lucide for product UI;
   Pendo may use a different internal set.
5. **Copy samples are my own** — "Better software starts with better
   listening" etc. is consistent with Pendo's public tone but not verified
   against their current site.

## Next steps for a fresh chat

Prompt suggestion for the user in the new chat:

> "Continue the Pendo Brand Design System work. Read `HANDOFF.md` for state.
> I'm attaching [the product codebase / Figma link / approved logo /
> product screenshots] — please [build the product UI kit / swap the
> logo / re-tune the marketing copy]."

If they attach a codebase/Figma, the next task is:
`ui_kits/<product>/` with `README.md`, `index.html`, and small, modular
JSX components following the existing marketing/slides structure.
Pull exact tokens (hex, spacing, type) from the source — don't
regenerate from screenshots alone.

## File tree

```
/
├── README.md
├── SKILL.md
├── HANDOFF.md                    ← you are here
├── colors_and_type.css
├── assets/
│   ├── pendo-chevron.svg         (primary — pink chevron)
│   ├── pendo-chevron-square.svg  (white chevron on pink square)
│   ├── pendo-chevron-circle.svg  (white chevron on pink circle)
│   ├── pendo-logo-dark.svg       (wordmark, graphite + pink chevron)
│   ├── pendo-logo-light.svg      (wordmark, off-white + pink chevron)
│   ├── pendo-logo-black.svg      (wordmark, single-color black)
│   ├── pendo-logo-white.svg      (wordmark, single-color white)
│   ├── pendo-lockup.svg          (wordmark, currentColor + pink chevron)
│   ├── icon-lightning.svg
│   ├── icon-check.svg
│   ├── icon-arrow-right.svg
│   ├── pankiverse/
│   │   └── pankiverse-0[1-5].png   (approved Pank imagery)
│   └── placeholder-portrait.svg
├── fonts/
│   └── README.md                 (expected .woff2 filenames)
├── preview/
│   ├── _preview.css
│   ├── color-{primary,pink-scale,neutrals,semantic,gradients}.html
│   ├── type-{display,body,eyebrow}.html
│   ├── spacing-{scale,radii,shadows}.html
│   ├── components-{buttons,pills,cards,inputs}.html
│   └── brand-{motifs,logo,do-dont}.html
├── ui_kits/
│   ├── marketing/
│   │   ├── README.md
│   │   ├── index.html
│   │   └── {NavBar,Hero,FeatureGrid,StatPanel,LogosStrip,QuoteBlock,CTAFooter}.jsx
│   └── slides/
│       ├── README.md
│       ├── index.html
│       ├── deck-stage.js
│       ├── _common.jsx
│       └── {Cover,SectionDivider,Agenda,Stat,Feature,Quote,Closing}Slide.jsx
└── uploads/
    └── BRAND (1).md              (source spec)
```

## Non-negotiable rules (from spec)

- Pink `#FF4876` is **accent only** — never body-text bg, never body color.
- Sora Bold for hero / stats only; Inter for everything else; JetBrains
  Mono for code.
- Sentence case everywhere; ALL CAPS + `0.22em` tracking is eyebrows only.
- No emoji. Iconography is chevron, bolt, check, arrow, number circle, pill.
- Gradients are always radial, focal point on an edge (never centered,
  never linear).
- Slide logo placement: top-left large on cover/closing, bottom-left small
  on every other slide.
- Card corners always rounded (12px or 16px); never sharp.
