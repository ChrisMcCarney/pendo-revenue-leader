---
name: pendo-design
description: Use this skill to generate well-branded interfaces and assets for Pendo, either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in the Pendo brand (FY27).
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — full brand context, content fundamentals, visual foundations, iconography, and project index
- `colors_and_type.css` — CSS variables, `@font-face` rules, and base element styles
- `assets/` — logo chevron + lockup, lightning bolt, check, arrow, Pankiverse imagery, portrait placeholder
- `preview/` — design-system cards (colors, type, spacing, components, brand motifs)
- `ui_kits/marketing/` — React marketing landing kit (nav, hero, feature grid, stats, logos, quote, CTA footer)
- `ui_kits/slides/` — React slide template (cover, section divider, agenda, stats, feature, quote, closing)
- `uploads/BRAND (1).md` — the upstream FY27 brand spec

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

Absolute rules (non-negotiable):
- Pink `#FF4876` ("Pendo Pank") is **accent only** — never a background for body text, never body text color
- Sora Bold (700) for display / hero / stats only; Inter for everything else; JetBrains Mono for code
- Sentence case everywhere; ALL CAPS + tracked (`0.22em`) is reserved for eyebrow labels only
- No emoji; icon vocabulary = chevron, lightning bolt, pink check, pink arrow, number circle, pill/badge
- Gradients are always **radial**, focal point on an **edge** (never centered, never linear)
- On slides: logo top-left large on cover/closing, bottom-left small on every other slide
- Card corners are always rounded (`12px` or `16px`); never sharp

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
