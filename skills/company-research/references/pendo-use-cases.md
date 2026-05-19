# Pendo Use Cases (FY27 taxonomy)

*Mapping research findings to Pendo product capabilities. The `company-research` skill reads this file to produce explicit Pendo angles on each slide of the prospect deck.*

Each section follows the same shape:

- **What it does** - one paragraph plain-English description
- **Map to these findings** - the kinds of research signals that should trigger this use case
- **Use case angles** - one-line value propositions to land on a slide

The FY27 product line-up is structured as five pillars - **Listen, Orchestrate, Predict, Agent Analytics, Data Sync** - sitting over the existing capability set. Use the pillar names in headings and angles where possible.

---

## Listen

### What it does

Pendo Listen captures customer voice inside the product surface: NPS, in-app surveys, sentiment polls, Sentiment AI on free-text responses, and an aggregated voice-of-customer pipeline that ties back to behaviour. Unlike standalone survey tools, the signal lands in the same workspace as analytics and guides, so a product team can act on it without leaving Pendo.

### Map to these findings

- Public references to NPS programs, voice-of-customer initiatives, "customer feedback loop", "customer obsession" language
- Recent customer-experience hires (Head of CX, VP Customer Insights, Customer Research Director)
- Earnings-call mentions of retention pressure, churn, satisfaction scores
- Customer-community surveys, public forums, or G2 / Trustpilot review trends
- Tooling stack mentions of Qualtrics, Sprig, Survicate, Wootric

### Use case angles

- "Replace survey-tool tab-switching with in-product feedback collection at the moment of friction."
- "Tie NPS to behaviour: Pendo links the score to the user's actual product journey."
- "Sentiment AI turns thousands of free-text comments into actionable themes in minutes."
- "Stop sampling at survey-tool rates and start hearing from the long tail of customers."

---

## Orchestrate

### What it does

Pendo Orchestrate is the in-product guidance layer: guides, walkthroughs, tooltips, in-app messaging, onboarding flows, feature announcements, and re-engagement campaigns. Targeting is driven by Pendo's auto-captured behaviour data, so a guide can fire on "users who clicked X but didn't reach Y" without requiring an engineer to instrument anything.

### Map to these findings

- Product-led-growth language, free-trial / freemium funnel mentions
- Recent product launches needing adoption push
- Onboarding-experience hires (Head of Onboarding, PLG lead, Growth PM)
- Public references to WalkMe, Appcues, Userflow, Pendo Free, Userpilot
- New feature rollouts that the company is talking about externally but not yet adopting internally
- Customer-success motion mentions ("time-to-value", "first-value", "activation")

### Use case angles

- "Ship a guide in an hour, not a sprint - no engineering ticket required."
- "Target on behaviour: who clicked, who didn't, who got stuck."
- "Stop building one-off email campaigns for feature adoption - run them in-product where users are."
- "Onboarding flow personalised to the user's role, persona, and inferred maturity."

---

## Predict

### What it does

Pendo Predict is the AI layer over the analytics + guide + feedback data: churn forecasting, expansion-likelihood scoring, next-best-action recommendations, and AI suggestions inside the product (suggested guides, suggested surveys, suggested cohorts). It is the difference between knowing what happened and being told what to do.

### Map to these findings

- Public AI strategy mentions, "AI roadmap", "AI-native", "agent-first" language
- Recent data-science / ML hires, or data-team build-outs
- Analytics-tool mentions (Amplitude, Mixpanel) where the company is asking "what do we do with all this data"
- Earnings-call references to churn risk, retention modelling, expansion targets
- Roadmap mentions of recommendation engines, personalisation, predictive scoring

### Use case angles

- "Predictive churn scoring on the same data your team already reviews in dashboards."
- "Recommended actions, not just dashboards - Pendo tells you what to do next."
- "AI features ship inside the product workflow, not as a separate analytics seat."
- "Pendo Predict is built on first-party behavioural data, not survey samples or third-party signals."

---

## Agent Analytics

### What it does

A new FY27 category covering the analytics and reliability layer for AI agents and AI-powered product experiences: rage-prompt detection (the AI equivalent of rage-clicks), agent retention curves, hallucination flagging, agent path tracing, AI-feature engagement, and quality telemetry for LLM-powered features in your own product.

### Map to these findings

- Public AI agent product launches by the company
- "Customer-facing AI" or "in-product AI" feature mentions
- LangSmith, Helicone, Arize, LangFuse mentions in engineering blogs
- AI / ML platform hires
- Earnings or roadmap references to "agent product", "AI assistant", "AI copilot"
- Concerns publicly raised about AI quality, hallucination, or AI feature adoption

### Use case angles

- "If your product ships AI features, you need rage-prompt analytics the same way you needed rage-click analytics ten years ago."
- "Quality telemetry for your AI: when it works, when it doesn't, when users give up."
- "Agent retention curves - the new activation funnel."
- "Pendo measures AI features with the same instrumentation backbone you trust for everything else."

---

## Data Sync

### What it does

Pendo Data Sync moves behavioural, feedback, and engagement data into and out of the data warehouse (Snowflake, BigQuery, Databricks) and reverse-ETLs it back into the operational stack (Salesforce, HubSpot, marketing automation, CSM tools). It removes the "Pendo lives on an island" objection that was common in pre-FY27 enterprise deals.

### Map to these findings

- Data-team build-outs, head-of-data hires, data engineering hires
- Public mentions of warehouse (Snowflake, BigQuery, Databricks)
- Reverse-ETL tool mentions (Hightouch, Census, RudderStack)
- Modern data stack initiatives, "single source of truth" language
- CRM and CSM tool overlap (Salesforce, Gainsight, ChurnZero)
- Compliance / data-residency public statements

### Use case angles

- "Pendo data flows into Snowflake / BigQuery / Databricks natively - no Hightouch tax."
- "Push behavioural cohorts back into Salesforce so AEs see them on the account record."
- "Stop arguing about whether Pendo lives next to or inside the modern data stack - it does both."
- "Power CSM playbooks with the behavioural data your CSMs can't get from CRM alone."

---

## Capability layer (sitting under the pillars)

The five pillars above are the FY27 marketing frame. The underlying capabilities are still recognisable from pre-FY27 language. Lead with the pillar name; mention the capability if the prospect already uses pre-FY27 language internally.

### Product Analytics

**What it does:** Auto-captured behavioural analytics (events, paths, funnels, retention) covering web, mobile, and back-end product surfaces. Ships under the **Listen** / **Predict** umbrella in FY27 framing.

**Map to these findings:** Mentions of Amplitude, Mixpanel, Heap, Google Analytics; new analytics or data hires; PLG motion; "we don't know which features are used" admissions.

**Use case angles:**

- "Auto-capture means a new feature is instrumented the day it ships - not a sprint later."
- "Retention curves segmented by persona, plan, account size - without an engineering ticket."
- "Funnel analysis on the same dataset your onboarding team uses for guides."

### Guides

**What it does:** In-product walkthroughs, tooltips, banners, modals, and onboarding flows. Now positioned as the delivery vehicle for **Orchestrate**.

**Map to these findings:** Onboarding hires, low feature adoption complaints, WalkMe / Appcues mentions, feature-announcement campaigns.

**Use case angles:**

- "Same auto-capture data that drives analytics now targets your guides."
- "Codeless authoring - the marketing team owns the guide, not engineering."
- "A/B test a guide variant in an afternoon."

### Surveys / Feedback / NPS

**What it does:** In-product surveys, NPS programs, sentiment polling, feedback inbox. Sits inside **Listen**.

**Map to these findings:** Qualtrics / Sprig / Survicate mentions, CX hires, public NPS programs, customer-research initiatives.

**Use case angles:**

- "Survey at the moment of friction - sentiment within seconds of the action."
- "Pipe survey results into the same cohort engine that drives analytics."
- "Free-text sentiment analysis without exporting to a separate AI tool."

### Session Replay

**What it does:** Watch a recorded user session to understand exactly what happened. Now positioned under **Listen** for the qualitative signal layer.

**Map to these findings:** FullStory, Hotjar, LogRocket mentions; product-quality complaints; UX research hires.

**Use case angles:**

- "Replay tied to the user's cohort, behaviour, and feedback - not a standalone replay tool."
- "Privacy-first masking by default."
- "Replay segments triggered by sentiment or analytics events, not just URL."

### Roadmap

**What it does:** Public roadmap, request portal, and feedback-to-roadmap pipeline. Sits inside **Listen** / **Orchestrate** at the boundary.

**Map to these findings:** Productboard, Aha, Canny mentions; product-marketing comms hires; quarterly roadmap public reveals.

**Use case angles:**

- "Customer requests, sentiment, and behaviour all feed the same roadmap conversation."
- "Show customers the roadmap inside the product, not on a separate marketing page."

### Integrations

**What it does:** Native integrations into the CRM, CSM, support, and marketing stack. Surfaces inside **Data Sync** in FY27 framing.

**Map to these findings:** Salesforce, HubSpot, Gainsight, Zendesk mentions; integration-platform tool (Workato, Tray) mentions.

**Use case angles:**

- "Pendo data appears on the Salesforce account record automatically."
- "CSM playbooks fire based on Pendo cohorts."
- "Drop into the existing stack rather than displace it."

---

## How `company-research` should use this file

1. Map each prospect finding to one (or two) of the FY27 pillars.
2. Use the relevant **Use case angles** verbatim or lightly tailored as the explicit Pendo angle on the slide.
3. Lead with the pillar name (Listen / Orchestrate / Predict / Agent Analytics / Data Sync) in the slide title or eyebrow.
4. Cite the underlying capability (Guides, Analytics, etc.) in the body when the prospect's stack mentions it explicitly.
5. Avoid the pre-FY27 phrase "Pendo for Product" - the FY27 brand has retired that umbrella.
