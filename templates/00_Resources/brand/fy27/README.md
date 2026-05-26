# Pendo Brand Design System — Q2 FY27

A portable brand + component system for building Pendo-branded interfaces,
slide decks, marketing pages, and throwaway prototypes. This project is the
design system; the Design System tab in the sidebar shows every registered
preview card.

## About Pendo

Pendo is a product-experience platform: product analytics, in-app guides,
feedback, session replay, and roadmapping, built for product and digital
teams. Customer logos include Verizon, Morgan Stanley, OpenTable, Okta,
Salesforce, and Zendesk (per Pendo's public materials). Their stated mission
is to "elevate the world's experience with software."

For FY27, Pendo's brand leans into a bold, high-contrast, almost-editorial
aesthetic: black backgrounds dominate, **Pendo Pank** (#FF4876) is the single
heroic accent, and radial pink → black gradients provide drama and texture.
Sora Bold is used sparingly for hero headlines; Inter carries everything else.

## Source materials

| Source | Path / link | Notes |
|---|---|---|
| Brand spec (FY27) | `uploads/BRAND (1).md` | Complete color, type, gradient, logo, and slide-layout spec |
| Official brand guide (public) | https://brand.pendo.io/ | Logo rules, chevron geometry |
| Media kit | https://www.pendo.io/media-kit/ | "Our brand fonts – Sora/Inter – can be downloaded at fonts.google.com" |

No codebase, Figma, or production screenshots were attached. **The UI kit
included here is built from the brand spec's visual vocabulary — not from
real product screens.** To get pixel-perfect recreations of the Pendo app
itself (Analytics, Guides, Feedback, etc.), please attach the codebase or
Figma via the Import menu.

## Products represented here

The FY27 brand spec is product-agnostic — it's primarily a marketing /
presentation / web-surface system. The UI kits in `ui_kits/` therefore
cover:

- **`marketing/`** — a Pendo-style marketing landing page using the visual
  foundations (dark hero, pink accents, radial gradients, feature grid).
- **`slides/`** — the FY27 slide template recreated as React components
  (cover, agenda, section divider, feature layout, stat 3-up, customer
  story, closing).

When a product codebase / Figma is provided, new kits should be added as
siblings of these — e.g. `ui_kits/analytics/`, `ui_kits/guides/`.

---

## CONTENT FUNDAMENTALS

### Voice

Pendo's voice is confident, declarative, and slightly playful. They are
the adults in the product-analytics room but they are not boring — the
color "Pendo **Pank**" (not "Pink") is proof that self-awareness lives in
the brand. Sentences are short. Claims are specific. Hedging is rare.

### Tone per surface

| Surface | Tone |
|---|---|
| Marketing hero | Declarative, ambitious. "Better software starts here." |
| Product UI | Plain-spoken, second-person, action-led. "Create guide", "See retention". |
| Docs | Direct, neutral, technical. No marketing voice. |
| Slides | Punchy. One idea per slide. Stats and quotes do the heavy lifting. |

### Point of view

- **"You"** for the product user; **"we"** when speaking as Pendo.
- Avoid "our platform" / "our solution" marketing-speak on product surfaces.
- Avoid "users" — prefer "customers" (in copy about their customers) or
  "people" (in copy about humans).

### Casing

- **Sentence case everywhere.** Titles, headings, buttons, nav items.
- **ALL CAPS + tracked** only for eyebrow labels and pill/badge text
  (e.g. "LISTEN", "COMING SOON", "FROM", "TO"). This is the only place
  caps appear.
- No Title Case for headings. No smart quotes in UI strings.

### Emoji

Pendo's marketing and brand system does **not** use emoji. The brand
vocabulary is pink accents, lightning bolts, and chevrons — not 🚀, ✨,
🎉. Do not add emoji to headings, buttons, or navigation. If a status
indicator is needed, use the pink check (✔), arrow (→), or a proper icon.

### Numbers

- Write out numbers one through nine in running prose; numerals for 10+.
- Stats on slides and landing pages are **always** numerals, Sora ExtraBold,
  pink. ("73%", "2.4×", "$4.2B").
- "FY27" (not "fiscal year 2027") when referring to the year in brand
  contexts.

### Example copy specimens

> **Hero:**
> Better software starts with better listening.
> Pendo helps product teams understand every signal — behavior, feedback,
> friction — and act on it in one place.

> **Section eyebrow + heading:**
> LISTEN
> See what your customers can't say.

> **Product UI button:** `Create guide` · `See retention` · `Publish`
> **Empty state:** "No guides yet. Make your first one to see it here."

> **Stat callout:** 73% · Of product teams report faster time-to-insight
> after adopting Pendo.

---

## VISUAL FOUNDATIONS

### Color

**Dark dominates.** The FY27 system is designed to feel confident on black
and graphite (`#000000`, `#303030`). Light mode (`#EDEEE7` cream, white)
is reserved for data-heavy, customer-facing, or agenda content. Pink
(`#FF4876`) is an **accent only** — never a background fill for body
content, never a body-text color.

- Primary accent: **Pendo Pank `#FF4876`**
- Backgrounds: Black, Graphite, Light (`#EDEEE7` cream), White
- Pink scale `P1–P8` is used for gradients, illustrations, stat tiles
- Neutrals are **warm** (gray-green tinted), not cool blue-grays

### Type

- **Sora Bold (700)** — display / hero. Never SemiBold, never Light.
  Used for: hero titles, section headings, big stat numerals (ExtraBold 800).
- **Inter** — everything else. Light / Regular / Medium / SemiBold / Bold.
- **JetBrains Mono** — code snippets and technical strings.
- Sentence case. Tight tracking on Sora headlines (`-0.02em`).
- Eyebrow label: Inter Bold 11–12px, `letter-spacing: 0.22em`, pink,
  ALL CAPS.

### Backgrounds

Four modes, in this order of frequency:
1. **Dark** (`#000000`) — default for most content
2. **Graphite** (`#303030`) — dark content slides, card-heavy layouts
3. **Gradient** — radial pink→black (or cream→pink) on section dividers,
   stat slides, and closing moments. Mesh-like / grainy quality.
4. **Light** (`#EDEEE7` cream, or white) — agendas, data tables, customer
   stories, long-form content.

Gradients are **always radial**, with the focal point on an **edge** of
the frame (top, left, or corner). Never centered. Never linear.
Full-bleed imagery is rare; when used, imagery lives inside a dark
graphite rounded card (`#303030`, ~12pt radius) on dark backgrounds or a
cream card on light.

### Animation

The brand is mostly static — slides and marketing pages don't animate
aggressively. When motion is used:
- **Fades + subtle rises** (8–16px, 240–420ms) on page-load and reveal.
- **Ease:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out for entries).
- **Pink accent** elements may pulse or glow subtly on hover — never
  bouncy, never playful.
- No parallax, no scroll-jacking, no spring physics on UI.

### Hover & press states

- **Primary buttons (Pink):** on hover, darken to `#E53B66` (≈ P5-adjacent);
  on press, shrink to `scale(0.985)` and drop to P5 `#D80574`.
- **Secondary buttons (outline):** on hover, fill with 6% white (dark bg)
  or 6% black (light bg); border brightens to solid pink.
- **Text links:** underline on hover; pink `#FF4876` color stays.
- **Cards:** on hover, border color transitions from subtle neutral →
  `#FF4876`. Cards may also lift with `translateY(-2px)` + subtle shadow.
- Never use opacity-only hover states; always color or position.

### Borders

- **Default card border:** none on dark backgrounds; `1px solid #C7C8C2`
  (neutral-1) on light backgrounds.
- **Emphasis card border:** `1.5px solid #FF4876` (pink) — used on
  "outlined" cards, from/to pills, number circles.
- **Hairline dividers:** `1px solid #303030` on dark, `1px solid #EDEEE7`
  on light.
- **Pink rule:** short, thick (`44px × 5px` rounded `2px`) — the signature
  separator between a headline and subtitle on covers/section dividers.

### Shadows

Minimal. The brand is **flat-forward with high contrast** — not
Material-inspired. Shadows exist for elevation feedback but are
restrained:
- `--shadow-xs` — 1px drop, 6% alpha, for pressed inputs
- `--shadow-sm` — 2px offset, 6px blur, 8% alpha, for hover cards
- `--shadow-md` — 8px offset, 24px blur, 10% alpha, for overlays / menus
- `--shadow-lg` — 24px offset, 60px blur, 16% alpha, for modals
- `--shadow-pink-glow` — `0 0 0 4px rgba(255, 72, 118, .18)` focus ring

Never use inset shadows for card chrome (not a skeuomorphic brand). Pink
glow is used for focus only.

### Transparency & blur

- **Backdrop blur** only on fixed headers that overlay content
  (`backdrop-filter: blur(16px) saturate(1.1)`), and only when the header
  sits on imagery or gradient.
- Semi-transparent overlays (`rgba(0,0,0,0.6)`) on modal scrims.
- Do **not** use frosted-glass cards or panels on solid backgrounds —
  Pendo's aesthetic is solid color, not translucent.

### Corner radii

| Element | Radius |
|---|---|
| Buttons, inputs | 8px (`--radius-md`) |
| Cards, tiles | 12px (`--radius-lg`) |
| Outer wrapper cards (slides) | 16px (`--radius-xl`) |
| Pills, badges, avatar | 999px |

No sharp 90° corners on content cards; hard corners are reserved for
full-bleed background panels and data tables.

### Cards

- **Dark card:** `#303030` fill, no border, `12px` radius
- **Dark + pink outline:** `#303030` fill, `1.5px #FF4876` border —
  for emphasis
- **Dark + pink top-bar:** 4px pink gradient strip across the top edge
- **Light card:** white fill, optional `1px #C7C8C2` border
- **Soft-gray card:** `#EDEEE7` fill, no border — used on light bg for
  secondary content
- **Pankiverse box:** cropped pink imagery from the approved Pankiverse
  set, no border, `16px` radius — decorative, imagery, or stat containers.
  Use sparingly — hero moments, Aha reveals, or platform-power visuals only.

### Imagery

- **Warm** color vibe (pinks, magentas) when imagery is stylized.
- **Neutral** color treatment on real product screenshots — no filters.
- **Graphite card frames** on dark, cream card frames on light; imagery
  always sits in a rounded container, never full-bleed into the slide
  edge.
- Slight **grain / noise** texture in decorative pink gradient panels.
- No stock-photo business imagery; when humans appear, it's in circular
  or portrait-framed presenter cards with a neutral dark/graphite
  background.

### Layout

- **Fixed logo placement on slides:** top-left larger on cover/closing,
  bottom-left small on every other slide.
- Marketing pages use a 12-column grid, max width ~1280px, generous
  section padding (96–128px).
- Outer wrapper cards (radius 16px) are common on slides as a content
  "frame" — especially on light backgrounds where the page edge is
  cream and the content lives on white.
- Pink rule + pink eyebrow + Sora headline is the signature cover /
  section-divider stack.

---

## ICONOGRAPHY

Pendo's brand system is **light on iconography**. Almost all visual
accent comes from color (pink), type (Sora Bold), and gradient — not
from illustrative icons.

Where icons **do** appear, they follow this vocabulary:

1. **Pink chevron (Pendo logomark)** — always points up-and-right,
   "directing toward growth." Used as the wordmark and occasionally as
   a decorative element in spaces where the brand is already
   established. Colors: white or Pendo Pank only (never charcoal unless
   part of the secondary horizontal lockup).

2. **Pink lightning bolt** — the brand's one recurring illustrative
   icon. Placed above stats in the `stat-3up` slide layout. Solid
   Pendo Pank fill.

3. **Pink check (✔) and right-arrow (→)** — used as bullet markers on
   feature slides. Replace traditional disc bullets.

4. **Number circles** — pink-outline circles with a numeral inside,
   used for agenda ordering and section-divider numbering.

5. **Pill / badge icons** — not icons exactly, but the pink-outline
   pill shape is part of the iconographic vocabulary (FROM, TO,
   COMING SOON, section numbers).

Pendo does **not**:
- use a custom icon font
- use emoji in marketing or product UI
- use unicode symbols decoratively (no ★, ◆, ●)
- use multi-color illustrated icons (no gradients *inside* an icon)
- draw skeuomorphic or 3D icons

For product-UI icons (nav, toolbar, action icons), the spec doesn't
commit to a library. **Recommendation for prototypes: use
[Lucide](https://lucide.dev) (`stroke-width: 1.75–2`, 20–24px)** — it
matches the clean, geometric, slightly-rounded feel of Pendo's chevron
and the stroke-based check/arrow used in the brand. This is a
**substitution** — flag it to engineering if building production UI,
since Pendo may ship with a different internal set.

Icon assets included in `assets/`:
- `pendo-chevron.svg` — primary logomark (pink chevron)
- `pendo-chevron-square.svg` — white chevron on pink square badge
- `pendo-chevron-circle.svg` — white chevron on pink circle badge
- `pendo-logo-dark.svg` — full wordmark, graphite text + pink chevron (for light bg)
- `pendo-logo-light.svg` — full wordmark, off-white text + pink chevron (for dark bg)
- `pendo-logo-black.svg` — full wordmark, single-color black
- `pendo-logo-white.svg` — full wordmark, single-color white
- `pendo-lockup.svg` — full wordmark, `currentColor` text + pink chevron (CSS-themeable)
- `icon-lightning.svg` — stat bolt
- `icon-check.svg` — pink bullet check
- `icon-arrow-right.svg` — pink bullet arrow
- `pankiverse/pankiverse-0[1-5].png` — approved Pankiverse imagery
- `placeholder-portrait.svg` — presenter-card portrait placeholder

---

## Index of this project

```
/
├── README.md                 — you are here
├── SKILL.md                  — Claude Code / Agent Skill manifest
├── colors_and_type.css       — CSS variables, fonts, base styles
│
├── assets/                   — brand visuals (logos, icons, decorative)
├── fonts/                    — web-font files (currently empty; see caveats)
├── preview/                  — Design System tab cards (typography, color,
│                               spacing, components, brand)
├── ui_kits/
│   ├── marketing/            — landing-page UI kit (hero, features, CTA)
│   └── slides/               — slide-template recreation (cover, section,
│                               stat, feature, customer story, closing)
└── uploads/                  — source materials (BRAND.md)
```

### Next best files to open

- **See the whole system at a glance:** open the Design System tab.
- **Start a marketing page:** `ui_kits/marketing/index.html`
- **Build a deck:** `ui_kits/slides/index.html`
- **Pull tokens into new work:** `colors_and_type.css`

---

## Available skills

- `SKILL.md` — drop this folder into Claude Code (or any skill-aware agent)
  and invoke the `pendo-design` skill. Contains essential guidelines, colors,
  type, assets, and UI kit pointers for prototyping in the Pendo brand.

## Caveats

- **No font files are bundled.** Sora, Inter, and JetBrains Mono are
  loaded via Google Fonts CDN for now. For production / offline use,
  download the `.woff2` files from [fonts.google.com](https://fonts.google.com)
  and drop them into `fonts/` — the `@font-face` rules in
  `colors_and_type.css` already reference the expected filenames.
- ~~**Logo files are placeholder SVGs**~~ — Resolved. Approved chevron
  SVGs are in `assets/` (primary, square badge, circle badge) using the
  official polygon geometry.
- **No product UI kit** (Analytics, Guides, Feedback, etc.) — the
  spec we received is a brand / marketing / deck system, not a product
  design system. Attach the product codebase or Figma to extend.
- **Icon set is a substitution.** We recommend Lucide for prototype
  UIs; Pendo may use a different internal set in-product.
