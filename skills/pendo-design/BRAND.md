# Pendo Brand Context — FY27

> Portable brand context for AI-assisted development tools.
> Drop this into your project as BRAND.md, Cursor rules, Claude CLAUDE.md, Lovable context, or Builder.io Fusion instructions.

---

## Color Tokens

### Primary Palette

| Name | Hex | CSS Variable | Tailwind |
|------|-----|-------------|----------|
| Pendo Pank | #FF4876 | var(--color-pendo-pink) | bg-pendo-pink |
| Black | #000000 | var(--color-black) | bg-black |
| Graphite | #303030 | var(--color-graphite) | bg-graphite |
| Light Mode | #EDEEE7 | var(--color-light-mode) | bg-light-mode |
| White | #FFFFFF | var(--color-white) | bg-white |

### Pink Tones (P1–P8)

Use for gradients, accents, and branded illustrations.

| Token | Hex | CSS Variable |
|-------|-----|-------------|
| P1 | #FF9ED7 | var(--color-pink-1) |
| P2 | #FE82CE | var(--color-pink-2) |
| P3 | #FD6AA5 | var(--color-pink-3) |
| P4 | #DB3DAD | var(--color-pink-4) |
| P5 | #D80574 | var(--color-pink-5) |
| P6 | #BB076B | var(--color-pink-6) |
| P7 | #97127A | var(--color-pink-7) |
| P8 | #6C286A | var(--color-pink-8) |

### Neutrals (warm-toned)

| Name | Hex | CSS Variable |
|------|-----|-------------|
| Gray 1 | #C7C8C2 | var(--color-neutral-1) |
| Gray 2 | #A1A29E | var(--color-neutral-2) |
| Gray 3 | #7C7C79 | var(--color-neutral-3) |
| Gray 4 | #565655 | var(--color-neutral-4) |
| Gray 5 | #181818 | var(--color-neutral-5) |

### Semantic Tokens (light / dark mode)

| Token | Light | Dark |
|-------|-------|------|
| --bg | #EDEEE7 | #000000 |
| --bg-card | #FFFFFF | #121212 |
| --bg-elevated | #EDEEE7 | #181818 |
| --text-primary | #181818 | #FFFFFF |
| --text-secondary | #565655 | #A1A29E |
| --text-muted | #A1A29E | #7C7C79 |
| --border | #C7C8C2 | #303030 |
| --border-subtle | #EDEEE7 | #181818 |
| --accent | #FF4876 | #FF4876 |

---

## Typography

### Fonts

- **Sora Bold (700)** — Display font. Hero headlines, page titles. Bold only — never SemiBold/600.
- **Inter** — Workhorse font. Light (300), Regular (400), Medium (500), Bold (700). Body copy, secondary headlines, data.
- **JetBrains Mono** — Code snippets and technical content.

### Headline Scale

| Style | Font | Weight | Use Case |
|-------|------|--------|----------|
| H1 Large | Sora | Bold (700) | Hero, page titles — use with restraint |
| H2 Medium | Inter | Medium (500) | Section breaks, navigation |
| H3 Small | Inter | Regular (400) | Minor sections, callouts |
| Eyebrow | Inter | Bold (700), uppercase, tracked | Section intros |
| Subhead | Inter | Regular (400) | Paired with display headings |
| Body | Inter | Regular (400) | All running copy |

### Font Setup

```css
--font-sans: var(--font-inter);     /* Inter */
--font-display: var(--font-sora);   /* Sora Bold */
--font-mono: var(--font-jetbrains-mono);
```

---

## Gradients

Always radial gradients with center on the edge of the page.

Dark background:
```css
background: radial-gradient(ellipse at 0% 50%, #FF9ED7 0%, #FD6AA5 25%, #D80574 50%, #97127A 75%, #000000 100%);
```

Light background:
```css
background: radial-gradient(ellipse at 0% 50%, #97127A 0%, #D80574 25%, #FD6AA5 50%, #FF9ED7 75%, #EDEEE7 100%);
```

---

## Logo Usage

- Clear space: At least half the logo height on all sides.
- No modifications: Do not stretch, rotate, recolor, or add effects.
- Fills: Pendo Pank (#FF4876) on light backgrounds; white on dark.
- Always use approved logo files — never recreate or redraw.

---

## Code Patterns

```tsx
// Color via CSS variable
<div style={{ background: "var(--color-pendo-pink)" }} />

// Color via Tailwind
<div className="bg-pendo-pink" />

// Semantic tokens for light/dark mode
<div style={{ color: "var(--text-primary)", background: "var(--bg-card)" }} />
```

---

## Slide Decks

### Slide Dimensions
- **Format:** 16:9, 10" × 5.625" (PowerPoint/Google Slides standard widescreen)

---

### Background Modes

Every slide uses one of four background modes. Dark backgrounds should dominate — light mode is reserved for data-heavy or customer-facing content.

| Mode | Background | Text Color | When to Use |
|------|-----------|-----------|-------------|
| **Dark** | `#000000` | White | Titles, section dividers, closing, dramatic statements |
| **Graphite** | `#303030` | White | Dark content slides, card-heavy layouts |
| **Light** | `#FFFFFF` or `#EDEEE7` | `#000000` | Agendas, data, customer stories, two-column content |
| **Gradient** | See gradient variants below | White (dark gradient) or Black (light gradient) | Section dividers, stats, dramatic moments, closing slides |

**Typical deck flow:** Dark title → Light or Dark content slides → Gradient section dividers → Dark or Gradient close.

---

### Gradient Variants

There are three named gradient backgrounds used in slides:

| Name | Description | Use For |
|------|-------------|---------|
| **Dark Gradient** (Black→Pink) | Radial gradient from black at left/bottom → deep pink/magenta at right/top | Section dividers, stats slides, high-impact moments |
| **Light Gradient** (Cream→Pink) | Radial from off-white `#EDEEE7` at top-left → `#FF4876` pink at bottom-right | Agendas, customer story slides, numbered card layouts |
| **Top-glow Gradient** | Black background with pink/magenta glow radiating from the top edge | Closing slide, logo-centered endings |

The gradients are mesh/radial in character — not linear. They have a soft, textured, almost grain-like quality. Approximate in CSS:
```css
/* Dark Gradient */
background: radial-gradient(ellipse at 100% 0%, #FF9ED7 0%, #FD6AA5 20%, #D80574 45%, #97127A 70%, #000000 100%);

/* Light Gradient */
background: radial-gradient(ellipse at 100% 100%, #FF4876 0%, #FD6AA5 30%, #FF9ED7 60%, #EDEEE7 100%);

/* Top-glow */
background: radial-gradient(ellipse at 50% 0%, #D80574 0%, #97127A 30%, #000000 70%);
```

---

### Logo Placement

**Title slide / closing slide:** Logo appears top-left, larger — approximately `w: 1.5", h: 0.6"` at `x: 0.4", y: 0.35"`.

**All other slides:** Logo appears bottom-left, small — approximately `w: 0.85", h: 0.35"` at `x: 0.25", y: 5.1"`.

- On dark/gradient backgrounds: use the white+pink logo
- On light backgrounds: use the dark+pink logo
- Logo must appear on **every slide** — no exceptions

---

### Slide Layout Library

The FY27 template contains these canonical layouts:

| Layout Name | Background | Description |
|-------------|-----------|-------------|
| `cover-dark` | Dark | Logo top-left (large), hero headline bottom-left, pink rule + label below headline |
| `cover-gradient-dark` | Dark Gradient | Same as cover-dark but with black→pink gradient bg |
| `cover-gradient-light` | Light Gradient | Same structure, black text on cream→pink gradient |
| `instructions / how-to` | Light | Top-bar dark strip with title; 4-column step layout below |
| `agenda-simple` | Dark | Left half black with large Sora headline; right half white with bullet list |
| `agenda-numbered-dark` | Dark | Left Sora headline; right column of numbered pink-circle items with title + body |
| `agenda-numbered-light` | Light | Same as above on white background |
| `presenter-4up` | Dark | Centered "Presenting today" title; 4 portrait cards with photo + name + role + location badge |
| `presenter-1up` | Dark | Single presenter: large photo left, name/role/org/location right |
| `presenter-2up` | Dark | Two large photos side by side, name below each |
| `section-divider-gradient` | Dark Gradient | Pink circle number top-left; large Sora headline; pink rule; subtitle below |
| `section-divider-light-gradient` | Light Gradient | Same layout on light gradient |
| `section-divider-graphite` | Graphite | Same layout on graphite background |
| `2col-plain-light` | Light (in rounded outer card) | Centered title + subhead; two soft-gray rounded cards side by side |
| `2col-outlined-light` | Light (in rounded outer card) | Two white cards with pink outlines and pink icon; centered title |
| `2col-bullets-light` | Light (in rounded outer card) | Two graphite rounded cards with pink icon + title + bullets |
| `from-to-dark` | Dark | Two graphite cards with pill labels "FROM" and "TO" (pink outline pill, white text) |
| `3col-graphite` | Graphite | Centered title + subhead; three black rounded cards with pink icon + title + muted body |
| `3col-dark` | Dark | Three graphite rounded cards with pink icon + bold title + body; bottom-left logo only |
| `3col-numbered-light` | Light (in outer card) | Three dark cards with pink circle number + title; light background outer wrapper |
| `3col-numbered-gradient` | Light Gradient | Same as above on light gradient background |
| `3col-pink-top-bar` | Dark | Three graphite cards each with a pink gradient bar across the top; bold title + body |
| `4col-sequence-light` | Light (in outer card) | Four portrait cards in sequence connected by `>` arrows; pink outline borders |
| `4col-sequence-dark` | Dark | Same 4-column sequence layout, dark background, pink outline cards |
| `list-light-pills` | Light (in outer card) | Two-column list of pill/tag items with ↑/↓ arrows; pink vs. purple outlines |
| `bullets-image-dark` | Dark (in graphite outer card) | Left: 2-column bullet list with pink checkmarks + bold label + body; Right: image placeholder |
| `bullets-image-graphite` | Graphite | Same layout, full-bleed graphite background |
| `stat-3up` | Dark Gradient | Centered title; three large Sora stats each with pink lightning bolt icon above |
| `stats-8up-gradient` | Light Gradient | 2×4 grid of white rounded cards each with large Sora stat in pink + white label |
| `feature-layout-dark` | Dark | Eyebrow label (pink) top-left; badge pill ("COMING SOON") top-right; large headline; left bullets with bold labels; right image/screenshot card |
| `feature-layout-light` | Light | Same layout on light background |
| `feature-layout-gradient` | Dark→Pink Gradient | Same layout on gradient background |
| `bullets-right-image-graphite` | Graphite | Left: headline + subhead + bullets; Right: dark rounded card with product screenshot |
| `customer-story-gradient` | Light Gradient | Left: customer logo + stat cards (pink numerals) + quote card; Right: 4-section detail panel (COMPANY SIZE / INDUSTRY / BACKGROUND / PROBLEM / SOLUTION) |
| `customer-story-dark` | Dark→Pink Gradient | Same layout on dark gradient |
| `customer-story-graphite` | Graphite | Same layout on graphite |
| `3col-logos-gradient` | Light Gradient | Three white rounded cards each with customer logo + body paragraph |
| `quote-light` | Light (in rounded card) | Large opening quotation mark graphic; bold body quote; circular headshot + name + italic title below |
| `quote-light-gradient` | Light Gradient | Same quote layout on gradient background |
| `data-chart-dark` | Dark (in graphite outer card) | Full-width chart in white card; centered title above |
| `closing-dark` | Dark | Logo top-left large; headline body-left large; URL below |
| `closing-cta-split` | Dark | Left: large logo + URL; Right: graphite card with CTA text + QR code |
| `closing-gradient-top` | Top-glow Gradient | Large logo + URL centered on dark bg with pink glow from top |
| `platform-diagram` | Dark | Centered title; large radial diagram with product module labels (evergreen) |

---

### Recurring UI Patterns

**Pink eyebrow label** — Inter Bold, ALL CAPS, `#FF4876`, letter-spacing 3–5pt. Always appears above the headline on feature and section slides. Used for module names (e.g., "LISTEN"), categories, or step labels.

**Pink rule** — Short, thick horizontal pink line (`#FF4876`) placed between the headline and the subtitle/body. Appears on title slides and section dividers. Approximately 0.45" wide, 0.05" tall.

**FY label / subtitle** — Small Inter Regular text (e.g., "FY27") placed directly below the pink rule on cover slides.

**Pill / badge label** — Rounded pill shape, no fill, `#FF4876` stroke. White bold Inter text inside. Used for labels like "FROM", "TO", "COMING SOON", section numbers. On dark backgrounds the pill may be filled black with pink border.

**Number circles** — Circular outline shape in `#FF4876` with a number inside (Inter Regular or Bold). Used in agenda and sequence layouts to indicate ordering.

**Pink top-bar card** — Dark graphite card with a narrow pink gradient bar across the top edge. Used for emphasis in 3-column layouts.

**Pinkaverse gradient box** — A standalone rounded-rectangle shape filled with a soft pink→magenta mesh gradient (grainy/textured). Used as a decorative element, image placeholder, or stat container. Available in square, landscape, and portrait proportions.

**Lightning bolt icon** — Small pink `#FF4876` lightning bolt icon used above stats in the `stat-3up` layout.

**Pink checkmark / arrow bullet** — Used instead of standard bullets in feature slides. Pink `#FF4876` checkmark (✔) or right arrow (→) before bold Inter label text.

**"Coming Soon" badge** — Top-right pill label, pink outline, white text. Paired with eyebrow label on feature slides.

**Image/screenshot card** — On dark backgrounds, product screenshots are placed inside dark graphite (`#303030`) rounded-rectangle cards. On light backgrounds, they sit in light-gray (`#EDEEE7`) rounded cards.

---

### Typography in Slides

| Element | Font | Weight | Size | Case |
|---------|------|--------|------|------|
| Hero / cover title | Sora | Bold (700) | 48–73pt | Sentence case |
| Section heading | Sora | Bold | 36–48pt | Sentence case |
| Content heading | Sora | Bold | 24–36pt | Sentence case |
| Body / bullets | Inter | Regular (400) | 13–16pt | Sentence case |
| Card title | Inter | SemiBold (600) | 16–18pt | Sentence case |
| Eyebrow / label | Inter | Bold (700) | 10–12pt | ALL CAPS |
| Stats / big numbers | Sora | ExtraBold (800) | 48–73pt | — |
| Captions / footnotes | Inter | Regular (400) | 9–11pt | Sentence case |
| Presenter name | Inter | Bold (700) | 18–22pt | Sentence case |
| Presenter role/org | Inter | Regular (400), muted gray | 14–16pt | Sentence case |

**Rules:**
- Sora = headlines, section titles, stats only. Always bold or extrabold.
- Inter = everything else. Never use Arial, Calibri, or fallback fonts.
- Sentence case everywhere. Eyebrow labels are the **only** exception (ALL CAPS + pink + tracked).
- Do not place text directly over pink tone fills — readability is compromised.

---

### Color Usage in Slides

**Background colors:** Black `#000000`, Graphite `#303030`, White `#FFFFFF`, Light Mode `#EDEEE7`, or gradient images.

**Text colors:** White on dark/graphite backgrounds. Black `#000000` on light backgrounds. Muted gray `#999999` or `#AEABAD` for secondary/caption text.

**Pink `#FF4876` is used only as accent:**
- Eyebrow labels
- Icon fills
- Card outline / border
- Bullet markers (checkmarks, arrows)
- Divider rules
- Pill/badge outlines
- Number circle outlines
- Lightning bolt icons
- Stat numerals on pink-background tiles

**Never use pink as:** a card background fill, body text color, or slide background.

**Pink gradient fills** (P1–P8 tones) are used in:
- Gradient backgrounds (full-slide)
- Pinkaverse decorative boxes
- Stat tiles (`stats-8up-gradient` layout)

---

### Card Styles Summary

| Card Type | Fill | Border | Corner Radius | Use On |
|-----------|------|--------|---------------|--------|
| Dark card | `#303030` graphite | None | ~12pt | Dark bg, graphite bg |
| Dark card + pink outline | `#303030` | `#FF4876` 1.5pt | ~12pt | Emphasized dark cards |
| Dark card + pink top bar | `#303030` | Pink gradient bar top | ~12pt | 3-col dark layouts |
| Light card | `#FFFFFF` | Subtle gray or none | ~12pt | Light bg |
| Soft gray card | `#EDEEE7` | None | ~12pt | Light bg alternative |
| Outer wrapper card | `#FFFFFF` or `#EDEEE7` | None | ~16pt | Wraps entire content area |
| Pinkaverse box | Pink mesh gradient | None | ~16pt | Decorative / image placeholder |

---

### Slide-Specific Rules

1. **Logo on every slide** — bottom-left on content slides; top-left (larger) on cover and closing slides.
2. **Pink as accent only** — never background fill, never body text color.
3. **No text over pink tone fills** — use as backgrounds only when no text is layered on them.
4. **Rounded corners on all cards** — never sharp-cornered content boxes.
5. **Sentence case everywhere** — eyebrow labels (ALL CAPS + pink) are the sole exception.
6. **Sora for headlines only** — never use Sora for body, bullets, or captions.
7. **Dark backgrounds dominate** — majority of slides should be dark or graphite. Light mode for data/customer content only.
8. **No `#` prefix on hex values** when building in code (pptxgenjs requirement — causes file corruption).
9. **Gradients are always image-based in pptxgenjs** — approximate with solid bg + semi-transparent pink shapes if a pre-rendered gradient image is unavailable.
