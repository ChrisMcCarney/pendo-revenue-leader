# FY27 Brand Design System — Asset Index

*Single grep-friendly catalogue of every file in `00_Resources/brand/fy27/`. Skills should reference paths from this index instead of re-reading the zip.*

Source: `Pendo Brand Design System.zip`, extracted 2026-05-18. Spec date: Q2 FY27.

---

## Top-level reference

| Path | Use when |
| --- | --- |
| `README.md` | Full brand spec narrative (voice, color, type, layout, hover/press, gradients, icons). The canonical written guide. |
| `SKILL.md` | Original Claude Code / Agent Skill manifest as shipped in the zip. Treat as upstream reference; the project skill at `.claude/skills/pendo-brand-guidelines/SKILL.md` is the editable copy. |
| `HANDOFF.md` | Designer handoff notes; useful when bridging a Figma file into code. |
| `colors_and_type.css` | CSS variables for every token (colors, type scale, spacing, radii, shadows, motion, gradients). Copy from here, do not redefine. |
| `uploads/BRAND (1).md` | The verbatim FY27 brand spec the design system was built from. Use as tie-breaker when the README and SKILL diverge. |

## Colour tokens (from `colors_and_type.css`)

| Token | Hex | Use |
| --- | --- | --- |
| `--color-pendo-pink` | `#FF4876` | Single brand accent. Never body bg, never body text. |
| `--color-black` | `#000000` | Default dark background. |
| `--color-graphite` | `#303030` | Dark cards, secondary dark slides, replaces the retired Charcoal. |
| `--color-light-mode` | `#EDEEE7` | Cream light background. |
| `--color-white` | `#FFFFFF` | Light cards on cream. |
| `--color-pink-1` to `--color-pink-8` | `#FF9ED7`, `#FE82CE`, `#FD6AA5`, `#DB3DAD`, `#D80574`, `#BB076B`, `#97127A`, `#6C286A` | Pink scale for gradients, illustrations, stat tiles. |
| `--color-neutral-1` to `--color-neutral-5` | `#C7C8C2`, `#A1A29E`, `#7C7C79`, `#565655`, `#181818` | Warm (green-tinted) grays. |

**Retired tokens (do not reintroduce):** yellow `#FEF484`, charcoal `#232323`, any navy, any teal `#2EC5B6`.

## Signature gradients (radial only, focal point on an edge)

| CSS var | Definition | Use |
| --- | --- | --- |
| `--gradient-dark` | radial @ 0% 50%, P1 to P3 to P5 to P7 to black | Default section divider on dark. |
| `--gradient-light` | radial @ 0% 50%, P7 to P5 to P3 to P1 to cream | Section divider on light. |
| `--gradient-dark-corner` | radial @ 100% 0% | Hero corner glow. |
| `--gradient-light-corner` | radial @ 100% 100% | Closing slide on light. |
| `--gradient-top-glow` | radial @ 50% 0% | Top-edge pink glow over dark. |
| `--gradient-pink-bar` | linear 90deg P1 to Pank to P7 | Reserved for the 4px top-of-card pink strip only. The only acceptable linear gradient. |

## Typography

| Family | Weights used | Where |
| --- | --- | --- |
| **Sora** | Bold 700, ExtraBold 800 | Hero / section headings, stat numerals. **Never** SemiBold, **never** Light. |
| **Inter** | Light / Regular / Medium / SemiBold / Bold (+ Italic variable) | Body, H2, H3, eyebrow, captions. |
| **JetBrains Mono** | Regular 400, Medium 500 | Code and technical strings. CDN-loaded until a `.woff2` is added. |

Tracking: Sora headlines `-0.02em`. Eyebrow labels `0.22em`. Body normal `0`.

Type scale (matches `colors_and_type.css`):

- H1 `clamp(48-96px)` - Sora Bold
- H2 `clamp(32-48px)` - Inter Medium
- H3 `clamp(22-28px)` - Inter Regular
- Eyebrow `12px` - Inter Bold ALL CAPS Pank, tracked 0.22em
- Subhead `20px` - Inter Regular
- Body `16px` - Inter Regular
- Slide hero `96px`, slide section `64px`, slide title `40px`, slide body `22px`, slide eyebrow `16px`

## Fonts

| Path | Use |
| --- | --- |
| `fonts/Sora-Variable.ttf` | Self-hosted Sora variable. |
| `fonts/Inter-Variable.ttf` | Self-hosted Inter variable. |
| `fonts/Inter-Italic-Variable.ttf` | Self-hosted Inter italic variable. |
| `fonts/README.md` | Source / licence notes. |

## Logos and chevrons

Primary set, `assets/`:

| Path | Use |
| --- | --- |
| `assets/pendo-chevron.svg` | Pink chevron logomark. Default. |
| `assets/pendo-chevron-square.svg` | White chevron on pink square badge. |
| `assets/pendo-chevron-circle.svg` | White chevron on pink circle badge. |
| `assets/pendo-lockup.svg` | Full wordmark, `currentColor` text + pink chevron. CSS-themeable. |
| `assets/pendo-logo-dark.svg` | Wordmark for light bg (graphite text + pink chevron). |
| `assets/pendo-logo-light.svg` | Wordmark for dark bg (off-white text + pink chevron). |
| `assets/pendo-logo-black.svg` | Single-colour black wordmark. |
| `assets/pendo-logo-white.svg` | Single-colour white wordmark. |

Source originals (designer-handoff form), `uploads/`:

`Pendo_Chevron_Pink.svg`, `Pendo_Chevron_White.svg`, `Pendo_Chevron_White_PinkBadge_Circle.svg`, `Pendo_Chevron_White_PinkBadge_Square.svg`, `Pendo_Logo_Color_Black.svg`, `Pendo_Logo_Color_Dark.svg`, `Pendo_Logo_Color_Light.svg`, `Pendo_Logo_Color_Pink.svg`, `Pendo_Logo_Color_White.svg`.

Logo placement on slides: top-left **large** on cover and closing; bottom-left **small** on every other slide. Fixed.

## Iconography (the whole approved vocabulary)

| Path | Use |
| --- | --- |
| `assets/icon-lightning.svg` | Pink lightning bolt. Above stat numerals on `stat-3up` slides. Replaces the retired teal hexagon. |
| `assets/icon-check.svg` | Pink check. Bullet marker on feature slides. Replaces disc bullets. |
| `assets/icon-arrow-right.svg` | Pink right-arrow. Bullet marker for sequenced items. |

Plus: chevron (logomark), number circle (pink-outline circle around a numeral), pill / badge.

**Banned:** emoji, unicode decoration, multi-color illustrated icons, gradients inside an icon, 3D / skeuomorphic icons. For product UI icons not specified by Pendo, default to Lucide stroke-width 1.75-2 at 20-24px, and flag the substitution.

## Pankiverse imagery

Decorative pink imagery and Pendo UI screenshots, `assets/pankiverse/`:

- `pankiverse-01.png` through `pankiverse-05.png` - approved decorative pink panels
- `ui-listen.png`, `ui-orchestrate.png`, `ui-predict.png`, `ui-agent-analytics.png`, `ui-data-sync.png` - FY27 product line screenshots
- `ui-guides.png`, `ui-product-analytics.png`, `ui-session-replay.png`, `ui-sentiment.png`, `ui-integrations.png` - adjacent product surfaces
- `ui-emergent-use-cases.png`, `ui-rageprompt-rate.png`, `ui-retention-rate.png`, `ui-unique-users.png` - stat / metric tiles

Use sparingly: hero moments, Aha reveals, platform-power visuals only. Place inside a 16px radius card.

## UI kits (React reference)

`ui_kits/marketing/`:

CTAFooter, DataSection, FAQ, FeatureGrid, Footer, Hero, LogosStrip, NavBar, QuoteBlock, ResourcesSection, StatPanel - plus `index.html` and `README.md`. Read these to inherit gradient placement, card chrome, eyebrow + headline stacks for any marketing-surface request.

`ui_kits/slides/`:

AgendaSlide, ClosingSlide, CoverSlide, FeatureSlide, PankiverseHeroSlide, QuoteSlide, SectionDividerSlide, StatCalloutSlide, StatSlide, StatementLightSlide - plus `_common.jsx`, `deck-stage.js`, `index.html`, `README.md`. **This is the canonical FY27 slide vocabulary.** A rebuilt `.pptx` template must reproduce these layouts.

## Preview cards

`preview/` contains the Design System tab cards. Open any one in a browser to see a single token / component rendered against the FY27 palette. Useful as visual-QA reference when verifying a generated deck or doc.

Key files: `brand-logo.html`, `brand-motifs.html`, `brand-pankiverse.html`, `color-gradients.html`, `color-pink-scale.html`, `color-primary.html`, `color-semantic.html`, `color-neutrals.html`, `components-buttons.html`, `components-cards.html`, `components-icons.html`, `components-inputs.html`, `components-pills.html`, `spacing-radii.html`, `spacing-scale.html`, `spacing-shadows.html`, `type-body.html`, `type-display.html`, `type-eyebrow.html`.

## Source materials

`uploads/`:

- `BRAND (1).md` - verbatim FY27 brand spec
- `PNDM Keynote 2026.pdf`, `PNDM Keynote 2026 copy.pdf` - keynote deck reference
- `Pendo-Visual-Brand-Bridge-Guide-FY27.png` - visual bridge from pre-FY27 to FY27
- `Footer.png`, `FooterBG.png` - footer reference imagery
- `Metronome-Usage-Based-Billing-Platform-04-21-2026_09_08_PM.png` and `Screenshot 2026-04-21*.png` - exemplar live applications of the system

---

## How skills should use this folder

1. **Brand questions** -> read `README.md` first, then `colors_and_type.css` for tokens.
2. **Asset paths** -> grep this INDEX, not the file system.
3. **Building a deck / slide** -> start with `ui_kits/slides/` components for layout intent; pull tokens from `colors_and_type.css`.
4. **Verifying a generated artifact** -> compare against the matching card in `preview/`.
5. **Bridging from pre-FY27** -> `uploads/Pendo-Visual-Brand-Bridge-Guide-FY27.png` shows the mapping.

## Retired (do not reintroduce)

| Retired | Replacement |
| --- | --- |
| Yellow `#FEF484` | None - yellow is gone from the system. |
| Charcoal `#232323` | Graphite `#303030`. |
| Navy section background | Graphite section background (S7 renamed Section Graphite). |
| Teal `#2EC5B6` (stat hex) | Pink lightning bolt + Sora ExtraBold pink numerals. |
| Proxima Nova | Sora (display) + Inter (everything else). |
| "Gold Deck" naming | "FY27 deck". |
| Translucent grey `#9E9E9E` numbered-panel | Graphite `#303030` card or pink-outline `1.5px #FF4876` card. |
| `https://www.pendo.io/brand-guide/` | `https://brand.pendo.io/`. |
