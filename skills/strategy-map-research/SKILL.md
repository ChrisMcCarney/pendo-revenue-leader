---
name: strategy-map-research
description: Conduct comprehensive research on prospect companies and compile strategic information for creating Strategic Alignment Value Strategy Maps. Use when user requests to research a company for a strategy map, create a strategy map, or start strategy map research. Guides through a 10-step workflow including company verification, industry classification, comprehensive research using extended search, and interactive content curation for mission statements, strategic priorities, key initiatives, business outcomes, and value drivers with Pendo product alignments.
---

# Strategy map research skill

## Purpose
Conduct comprehensive research on prospect companies and compile strategic information for creating Strategic Alignment Value Strategy Maps. This skill handles research, content curation, and slide rendering - it builds a Pendo-branded HTML deck via the `pendo-design` skill.

**Brand inheritance is mandatory.** Output is a Pendo-branded HTML deck. All brand decisions (colour, type, gradient, logo placement, iconography) come from the `pendo-design` skill. Do not override brand decisions in this skill. If the deck looks off-brand, fix it in `pendo-design`, not here. Before generating output, read the `pendo-design` skill's `SKILL.md`, `README.md`, `BRAND.md`, and `colors_and_type.css`. Reference the `pendo-design` skill's `ui_kits/slides/` for working slide component patterns. The brand rule that most often gets violated in research decks: Pendo Pank (`#FF4876`) is accent only, never a body-text colour and never a body-content background.

## Output format

Generate a single self-contained HTML file. Inline (or `<link>`) the `pendo-design` skill's `colors_and_type.css`. Copy referenced assets from the `pendo-design` skill's `assets/` folder alongside your output. Save to the user's project at `04_Accounts/Active/{account}/Resources/{date}-strategy-map.html` if a workstation exists, otherwise `01_Inbox/{date}-{account}-strategy-map.html`. No `.pptx` output; the brand system is HTML-first.

## Prerequisites check
Before starting any research, verify these features are enabled:
- Extended Thinking
- Web Search
- Research (Advanced Research)

If any are missing, display:
```
**Warning:** Required features missing

To use Strategy Map Research, please enable these features:
- Extended Thinking
- Web Search
- Research (Advanced Research)

Enable them in Settings, then restart this conversation.
```

Stop workflow and do not proceed without all three features.

## Activation commands
Start this workflow when user says:
- "Research [Company] for a strategy map"
- "Create a strategy map for [Company]"
- "Start strategy map research on [Company]"

## Research workflow

### Step 1: Company verification

1. Use `web_search` to find the company
2. If multiple matches found, present options with:
   - Company name
   - Brief description
   - Location
   - Size/employees
3. Ask user to confirm correct company
4. Wait for confirmation before proceeding

Example:
```
I found several matches for "Apple":

1. Apple Inc. - Consumer electronics and software, Cupertino, CA, 164,000 employees
2. Apple Bank - Financial services, New York, NY, 800 employees

Which company would you like to research? [1/2]
```

### Step 2: Industry classification

1. Based on initial research, suggest an industry classification
2. Present suggestion to user
3. Ask user to confirm or provide alternative
4. Store confirmed industry for later cataloguing

Example:
```
Based on my research, I'd classify Apple Inc. as "Consumer Electronics / Technology"

Is this classification correct, or would you like to change it?
```

### Step 3: Comprehensive research

Use `launch_extended_search_task` with detailed command to research:

**Mission/Vision:**
- Find 1-3 official mission or vision statements
- Source from company website, about pages, investor materials

**Strategic Priorities (find 5-7):**
- Current strategic focus areas
- Major initiatives or transformation efforts
- Business model shifts
- Market expansion plans
- Technology/innovation priorities

**Key Initiatives (2-3 per priority):**
- Specific programs or projects
- Recent announcements
- Investments and acquisitions
- Product launches
- Organisational changes

**Desired Business Outcomes (find 6-10):**
- Revenue targets
- Market share goals
- Customer satisfaction metrics
- Operational efficiency targets
- Sustainability goals
- Growth objectives
- Compliance/regulatory goals

**Value Drivers (find 7-10):**
- Core capabilities
- Competitive advantages
- Customer-facing strengths
- Operational excellence areas
- Innovation capabilities
- Brand/trust factors
- Technology leadership
- Partnership ecosystems

**Research Sources:**
- Company website (investor relations, about, newsroom)
- Latest annual report
- Recent earnings calls (last 2-3 quarters)
- Press releases (last 12 months)
- Recent executive interviews
- Industry analyst reports
- Recent news coverage

**Critical Rules:**
- Only include information from last 6 months
- Do NOT include stale or outdated data
- Cite sources and dates
- Focus on official company communications
- Verify information across multiple sources

Display research progress:
```
Conducting comprehensive research on [Company]...
Status: Company website analyzed
Status: Latest earnings materials reviewed
Status: Recent press releases gathered
Status: Strategic priorities identified
Status: Research complete
```

### Step 4: Content curation - mission statement

1. Present 1-3 mission/vision options found
2. Number each option
3. Ask user to select one

Format:
```
Mission/Vision Statement Options:

1. "[First mission statement]"
2. "[Second mission statement]"

Which would you prefer for the Strategy Map? [1/2/Edit]
```

### Step 5: Content curation - strategic priorities

1. Present 5-7 researched priorities
2. For each priority show:
   - **Title** (bold, concise)
   - Description (1-2 sentences)
   - **Pendo alignment:** Specific Pendo pillar + capability recommendations

3. Ask user to select 3-4 priorities
4. Number each priority clearly

**FY27 product line-up:**

Five pillars: **Listen** (NPS, sentiment, surveys, feedback), **Orchestrate** (Guides, in-app messaging, walkthroughs), **Predict** (AI features, forecasting, recommendations), **Agent Analytics** (rage-prompt detection, agent retention, AI feature telemetry), **Data Sync** (warehouse sync, reverse-ETL, integrations).

Underlying capabilities still recognisable from pre-FY27 language: Product Analytics, Guides, Surveys / Feedback / NPS, Session Replay, Roadmap, Integrations.

When mapping a prospect's strategic priority to a Pendo capability, **lead with the pillar name**, not the underlying capability. Example:

- "Customer experience" priority maps to Pendo **Listen** (NPS and Sentiment AI surface the early signals; underlying capability is the survey and feedback engine)
- "Activation" priority maps to Pendo **Orchestrate** (Guides target users mid-funnel; underlying capability is the auto-capture-driven targeting engine)
- "Churn reduction" priority maps to Pendo **Predict** (forecasting and recommended actions; underlying capability is the behavioural-data model)

If the prospect references product marketing taxonomy that doesn't match FY27, footnote the discrepancy and keep the prospect's language intact in their slide titles - but use the FY27 names in the Pendo-side analysis.

Format:
```
Strategic Priorities - Select 3-4:

1. **AI-Driven Innovation**
   Expanding AI capabilities across product platform
   Pendo alignment: Pendo Predict surfaces AI feature adoption signals and recommended actions; Pendo Orchestrate (Guides) improves AI feature onboarding.

2. **Customer Experience Excellence**
   Creating unified, seamless customer experiences
   Pendo alignment: Pendo Listen (Session Replay + Sentiment AI) surfaces friction; Pendo Orchestrate (Guides) reduces time-to-value.

[...continue with 5-7 total]

Please select 3-4 priorities (e.g., "1, 3, 4, 5" or "I want priorities 1, 2, and 4")
```

### Step 6: Content curation - key initiatives

For EACH selected priority:
1. Show 2-3 specific initiatives
2. Number them
3. Ask user to select which initiative(s) to include
4. Include Pendo alignment for initiatives when relevant

Format:
```
For Priority: "AI-Driven Innovation"

Select initiative(s):

1. Launch next-gen AI assistant platform
2. Implement machine learning across product suite
3. Partner with leading AI research institutions

Which initiative(s) for this priority? [1/2/3/Multiple/All]
```

Repeat for each selected priority.

### Step 7: Content curation - desired outcomes

1. Present 6-10 business outcomes discovered
2. Include Pendo alignment notes (lead with pillar)
3. Ask user to select 3-4

Format:
```
Desired Business Outcomes - Select 3-4:

1. Increase user adoption by 40% year-over-year
   Pendo alignment: Pendo Orchestrate + Predict measure and improve adoption via Guides + behavioural Analytics.

2. Achieve 95% customer satisfaction score
   Pendo alignment: Pendo Listen captures satisfaction (NPS / Feedback); underlying Analytics identifies improvement areas.

3. Reduce time-to-value for new customers by 50%
   Pendo alignment: Pendo Orchestrate accelerates onboarding (Guides); underlying Analytics tracks time-to-value.

[...continue with 6-10 total]

Please select 3-4 outcomes (e.g., "1, 3, 5, 7")
```

### Step 8: Content curation - value drivers

1. Present 7-10 value drivers identified
2. Show how Pendo influences each (lead with pillar)
3. Ask user to select 5-7

Format:
```
Value Drivers - Select 5-7:

1. User Experience Excellence
   Pendo alignment: Pendo Orchestrate improves UX (Guides); Pendo Listen surfaces friction (Session Replay).

2. Data-Driven Decision Making
   Pendo alignment: Pendo Predict + Listen provide usage insights via Analytics; Roadmap enables data-driven planning.

3. Product Innovation
   Pendo alignment: Pendo Listen (Feedback) validates ideas; underlying Analytics shows feature engagement.

[...continue with 7-10 total]

Please select 5-7 drivers (e.g., "1, 2, 3, 5, 7, 8")
```

### Step 9: Validation and summary

Before providing final output, validate:
- Status: 1 mission statement selected
- Status: 3-4 strategic priorities selected
- Status: Each priority has at least 1 initiative
- Status: 3-4 desired outcomes selected
- Status: 5-7 value drivers selected

If validation fails, prompt user to complete missing selections.

### Step 10: Final output

Provide comprehensive formatted output:

```
# Strategy map research complete: [Company Name]

## Company information
- **Company:** [Name]
- **Industry:** [Classification]
- **Research Date:** [Date]

---

## Mission statement
[Selected mission statement]

---

## Strategic priorities and initiatives

### 1. [Priority Title]
**Description:** [Brief description]
**Key Initiative:** [Selected initiative]

### 2. [Priority Title]
**Description:** [Brief description]
**Key Initiative:** [Selected initiative]

[...repeat for 3-4 priorities]

---

## Desired business outcomes

1. [Outcome 1]
2. [Outcome 2]
3. [Outcome 3]
4. [Outcome 4]

---

## Value drivers

1. [Driver 1]
2. [Driver 2]
3. [Driver 3]
4. [Driver 4]
5. [Driver 5]
6. [Driver 6]
7. [Driver 7]

---

## Next steps

This content is ready to render into a Strategy Map slide via the `pendo-design` skill's slide UI kit. The slide should be organised:
- **Title:** Strategic Alignment: Value Strategy Map
- **Mission** (top banner)
- **Strategic Priorities** (left column)
- **Key Initiatives** (centre-left, connected to priorities)
- **Desired Business Outcomes** (centre-right)
- **Value Drivers** (right column)

Routing: hand the curated content to the `pendo-design` skill's slide UI kit (cover, section divider, agenda, stat callout, card grid, closing components). The output is a Pendo-branded self-contained HTML deck saved to the user's workspace folder and returned as a `computer://` link.

If the user explicitly asks for Google Slides output, fall back to the legacy Google Slides hand-off (template: https://docs.google.com/presentation/d/1pV9gOqFCbTNN2RIyN8eRe5x-0gwSDTQSLlUnXG6dAO8/edit) and warn that the resulting deck will not carry the FY27 brand updates.

Would you like to research another company?
```

## Interactive commands

Allow user to say at any stage:
- **"Conduct more research"** -> Run additional web searches on current topic
- **"Go back"** -> Return to previous selection step
- **"Show alternatives"** -> Present different options for current selection
- **"Edit [section]"** -> Modify a previous selection
- **"Start over"** -> Restart entire workflow

## Error handling

**If research returns limited results:**
```
I found limited information on [aspect]. Would you like me to:
1. Proceed with available information
2. Conduct additional research
3. Skip this section
```

**If user provides invalid selection:**
```
Please select [required range]. You selected [user input].
Try again: [repeat options]
```

**If prerequisites missing:**
Stop immediately and show feature requirements.

## Quality standards

- Only use information from last 6 months
- Cite sources when presenting research findings
- Provide specific Pendo alignments (pillar names + underlying capability where relevant)
- Maintain professional, consultative tone
- Be concise in descriptions (1-2 sentences max)
- Always validate user selections before proceeding
- Never guess or fabricate information

## Output format

Provide curated content in markdown format, clearly structured, and render it into a Pendo-branded HTML deck using the `pendo-design` skill's slide UI kit. Save to the user's workspace folder (returned as a `computer://` link). Markdown is also provided in the chat as a fallback for manual copy/paste.
