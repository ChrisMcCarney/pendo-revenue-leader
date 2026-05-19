---
name: company-research
description: Conduct fully automated research on a prospect or customer company and produce a Pendo-branded internal research deck (HTML slides) ready for AE review. Use this skill whenever the user asks to "research a company", "do company research", "research [company name]", "build a research deck for [company]", "prep for my call with [company]", "look into [company]", or any similar request to investigate a prospect, customer, or target account. Always trigger this skill for any company research request, even casual ones like "what can you find on [company]" or "give me the lowdown on [company]". The output is always a Pendo-branded HTML deck optimised for internal AE use with explicit Pendo use case suggestions mapped to each research finding.
---

# Company Research Skill

Fully automated prospect/customer research that produces a Pendo-branded internal slide deck with explicit Pendo use case suggestions mapped to findings.

**Brand inheritance is mandatory.** This skill produces a Pendo-branded HTML deck by routing through the `pendo-design` skill. All brand decisions (colour, type, gradient, logo placement, iconography) come from `pendo-design`. Do not override brand decisions in this skill. If the deck looks off-brand, fix it in `pendo-design`, not here. The upstream source of truth lives inside the `pendo-design` skill at `BRAND.md` plus `colors_and_type.css` plus the assets, preview, and ui_kits folders.

## Before starting

Read these files in order:
1. The `pendo-design` skill's `SKILL.md` and `README.md` for the non-negotiable brand rules (Pank accent only, Sora Bold for display only, sentence case, no emoji, radial gradients on edges, fixed slide logo placement, rounded card corners).
2. The `pendo-design` skill's `BRAND.md` and `colors_and_type.css` for the canonical tokens.
3. The `pendo-design` skill's `ui_kits/slides/` for working slide component examples (cover, agenda, section divider, stat 3-up, feature, customer story, closing).
4. `references/pendo-use-cases.md` for Pendo product area mappings (reference when writing use case suggestions).
5. `references/competitor-list.md` for the full competitor list to detect in tech stack.

## Output format

Generate a single self-contained HTML file. Inline (or `<link>`) the `pendo-design` skill's `colors_and_type.css`. Copy the assets you reference (logos, icons, Pankiverse imagery) out of the `pendo-design` skill's `assets/` folder into the same directory as your output, then link to them. Save to the user's project at `04_Accounts/Active/{account}/Resources/{date}-research-deck.html` if a workstation exists, otherwise `01_Inbox/{date}-{account}-research.html`. Do not produce `.pptx` from this skill; the brand system is HTML-first.

---

## Research Philosophy

- **Recency first**: Prioritise information from the last 6 months. If recent information is unavailable for a given area, use the most recent available and note the date.
- **Always use web search**: Never rely on training knowledge alone. Every research area requires at least one web search.
- **Depth over speed**: Run multiple targeted searches per area. Broad searches first, then narrow down to specific findings.
- **Source quality**: Prefer company website, press releases, LinkedIn, Crunchbase, G2, BuiltWith, Stackshare, job postings, and news outlets over aggregators.
- **Be specific**: Extract concrete facts (numbers, dates, names, product names) rather than generic descriptions.

---

## Research Workflow

### Step 1: Company Verification (1-2 searches)

Before anything else, confirm the company exists and resolve any ambiguity:
- Search `[company name] company overview`
- Confirm: full legal name, HQ location, industry, employee count (approx), website URL
- If multiple companies share the name, pause and ask the user to clarify

### Step 2: Run All Research Areas in Parallel

Execute searches across all 4 required areas. For each area, run **at least 2 targeted searches**. Optimise every query for recency. Anchor to a rolling window like "in the last 12 months" or "in the current calendar year" (computed from the env date at runtime) rather than to a hardcoded year.

#### Area A: Company Overview & Recent News
Searches to run:
- `[company] news in the last 12 months`
- `[company] announcement product launch in the last 12 months`
- `[company] leadership changes in the last 12 months`
- `[company] strategy expansion in the last 12 months`

Extract:
- What the company does (1-2 sentences, specific)
- Key recent announcements (product, partnership, acquisition, restructure)
- Leadership changes or executive hires
- Any public signals of growth, contraction, or strategic shift
- Customer base / target market

#### Area B: Financial Health & Funding
Searches to run:
- `[company] funding revenue valuation in the last 12 months`
- `[company] IPO acquisition investment in the last 12 months`
- `[company] Crunchbase OR Pitchbook funding rounds`
- For public companies: `[company] earnings revenue growth`

Extract:
- Funding stage and total raised (or public company financials)
- Most recent funding round: date, amount, investors
- Revenue or ARR if available
- Profitability signals (layoffs, cost-cutting, or growth investment)
- Valuation if known

#### Area C: Tech Stack & Current Tools
Searches to run:
- `[company] tech stack tools software`
- `[company] BuiltWith OR Stackshare technologies`
- `[company] jobs "product analytics" OR "user onboarding" OR "digital adoption" OR "product management"`
- Cross-reference against the competitor list in `references/competitor-list.md`

Extract:
- Known analytics, product, marketing, CRM, and engineering tools
- Any tools from the Pendo competitor list (flag these explicitly as "Competing tool detected")
- Job postings that signal tool gaps or upcoming evaluations
- Data infrastructure and integration patterns

#### Area D: Strategic Priorities & Initiatives
Searches to run:
- `[company] strategy priorities in the last 12 months`
- `[company] annual report OR investor presentation OR CEO letter`
- `[company] product roadmap OR digital transformation OR customer experience`
- `[company] OKR OR goals OR mission`
- `[company] LinkedIn company page about`

Extract:
- Stated strategic priorities (growth, efficiency, product-led, international expansion, etc.)
- Digital transformation or platform modernisation signals
- Product or engineering team size / structure (from LinkedIn or job postings)
- Customer experience or NPS / CSAT initiatives
- Key business outcomes they appear to be chasing

### Step 3: Competitive Signal Analysis

After completing Areas A-D, run one additional check:
- Search `[company] Pendo OR [any detected competitors] review OR case study`
- Identify: are they actively evaluating? Have they recently reviewed competitors on G2/Capterra?
- Note any public sentiment about their current tooling

### Step 4: Pendo Use Case Mapping

For each significant finding across all 4 areas, map it to a Pendo use case using `references/pendo-use-cases.md`.

**Mapping rules:**
- Be explicit: "Finding: [X] → Pendo use case: [Y], because [Z]"
- Prefer specificity over breadth: 3 sharp use cases beat 8 vague ones
- If a competitor tool is detected, write a displacement angle: "They're using [tool] for [function]; Pendo can replace or augment this with [capability]"
- Flag the 2-3 highest-confidence use cases as **Priority Angles** for the deck

**Use FY27 product taxonomy.** Research findings must be expressed using Pendo's FY27 product line-up: **Listen**, **Orchestrate**, **Predict**, **Agent Analytics**, **Data Sync**, plus the underlying capabilities (Guides, Analytics, Session Replay, Feedback / NPS, Roadmap, Integrations). Lead each slide's Pendo angle with the relevant pillar name. Avoid the pre-FY27 phrase "Pendo for Product"; that umbrella has been retired.

See `references/pendo-use-cases.md` for the full mapping of findings -> pillar -> use case angles.

---

## Slide Deck Construction

Once research is complete, build the HTML deck using the `pendo-design` skill's slide UI kit (`pendo-design/ui_kits/slides/`) as the structural pattern and `colors_and_type.css` for tokens.

### Mandatory Slides (always present)

| Position | Slide | Layout |
|----------|-------|--------|
| 1 | Cover: "[Company Name] AE Research Brief" + today's date | S1 Cover |
| 2 | Company Snapshot (overview, industry, size, HQ, website) | S3 Dark Header |
| Last | Closing | S10 Closing |

### Dynamic Slides (include if findings are strong enough)

Add slides only if you have concrete findings to fill them. Do not include a slide with vague or speculative content.

| Slide Topic | Include if... | Preferred Layout |
|-------------|--------------|-----------------|
| Recent News & Signals | Any significant announcements in last 6 months | S8 Pink Header |
| Financial Health | Funding data, revenue signals, or growth/contraction signals available | S3 Dark Header |
| Tech Stack | 3+ tools identified, especially if competitor tools detected | S2 Split |
| Competitor Tools Detected | Any tools from the competitor list identified | S9 Section Pink (as callout) |
| Strategic Priorities | 2+ concrete strategic priorities identified | S8 Pink Header |
| Product & Engineering Signals | Job postings or org signals worth noting | S3 Dark Header |
| Pendo Priority Angles | Always include. Top 2-3 use cases mapped to findings | S8 Pink Header |
| Open Questions for Discovery | Always include. 3-5 questions the research raised | S3 Dark Header |

### Slide Ordering

Cover → Company Snapshot → [News] → [Financials] → [Tech Stack] → [Competitor Tools] → [Strategic Priorities] → [Product/Eng Signals] → Pendo Priority Angles → Open Questions → Closing

### Auto-Scaling Rules

- **Compact (6-9 slides)**: Company is small/early-stage, limited public info, or research yields thin findings
- **Standard (10-14 slides)**: Mid-market or enterprise company with solid public presence
- **Comprehensive (15+ slides)**: Large enterprise, public company, or unusually rich findings. Split dense topics across multiple slides

---

## Writing Style for Slides

- Titles: short, punchy, sentence case. State the finding, not the category  
  - Good: "Raised $45M Series C in Jan"  
  - Bad: "Funding Information"
- Bullets: concrete, specific, dated where possible
- Pendo use case callouts: format as a distinct bullet with a "→ Pendo:" prefix
  - Example: "Scaling onboarding across 3 new markets in the current calendar year → Pendo: in-app guides + localisation without engineering lift"
- Never use em dashes
- Never pad slides with generic filler. Blank space is better than vague content
- Flag data age when older than 6 months: add "(as of [month year])" after the fact

---

## Output

Deliver a single self-contained HTML file rendered against the `pendo-design` skill's brand system. File name format:
`[CompanyName]_Research_Brief_[YYYYMMDD].pptx`

Save the final deck to the user's selected workspace folder (passed in via the Cowork harness). Return the artifact as a `computer://` link per the Cowork file-handling rules, e.g.:

```
[Open the research deck](computer://{workspace_path}/{company_slug}_research.pptx)
```

If no workspace folder is set, fall back to `/mnt/user-data/outputs/` and warn the user that the file is in the sandbox.

After presenting the file, provide a **3-5 sentence spoken summary** of the most important findings and the top Pendo angle, written as if you're briefing the AE verbally before their call.

---

## Quality Checklist

Before delivering:
- [ ] All 4 research areas covered with web search evidence
- [ ] Recency confirmed or date-flagged for older data
- [ ] Competitor tools cross-checked against full list
- [ ] Every Pendo use case tied to a specific finding (no generic claims)
- [ ] No slide has fewer than 2 concrete bullets
- [ ] No placeholder text remaining in deck
- [ ] File named correctly and saved to the user's selected workspace folder, returned as a `computer://` link (sandbox fallback only if no workspace is set)
