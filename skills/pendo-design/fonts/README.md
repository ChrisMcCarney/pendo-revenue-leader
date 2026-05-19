# Fonts

Self-hosted variable fonts for the Pendo design system.

## In place

- `Sora-Variable.ttf` — weights 100–900 (use 700 for display/hero, 800 for
  max-impact hero only).
- `Inter-Variable.ttf` — weights 100–900, optical-size axis included.
- `Inter-Italic-Variable.ttf` — italic companion, 100–900.

A single `@font-face` block in `/colors_and_type.css` covers the full weight
range for each family via `font-weight: 100 900` and
`format("truetype-variations")`. Request any weight in CSS — it resolves
against the variable axis.

## Still missing

- **JetBrains Mono** — currently loaded from Google Fonts CDN. Drop
  `JetBrainsMono-Variable.ttf` (or a `.woff2`) in here and update the
  `@import` in `colors_and_type.css` to self-host it.

## Notes

- `.ttf` is fine for variable fonts but `.woff2` is ~30% smaller. If you
  have the variable `.woff2` builds, replace the files and update
  `format("truetype-variations")` → `format("woff2-variations")` in the
  `@font-face` declarations.
