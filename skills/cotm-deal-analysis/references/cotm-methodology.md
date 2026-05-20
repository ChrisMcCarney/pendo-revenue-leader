# COTM Methodology - Reference for the Brief

Distilled from Pendo's COTM Lab (May 2026). Use this to decide what counts as a Before Scenario vs a Negative Consequence, what a real PBO looks like, and how to construct a Mantra honestly.

The skill's job is to extract these from transcripts. Not to invent them. Not to confirm hypotheses.

---

## The framework

The COTM conversation has two halves connected by a delta.

```
CURRENT STATE              DELTA                    FUTURE STATE
──────────────             ─────                    ──────────────
Before Scenario     →    Required Capabilities  →   After Scenario
Negative            →    Success Criteria       →   Positive Business
Consequences                                        Outcomes (PBOs)
```

Customer must own both ends. The rep's job is to surface the delta - the capabilities the customer needs to move from current to future state. Those capabilities become the evaluation criteria.

---

## Definitions

### Before Scenario
The undesirable current state, **in the customer's own language**. Qualitative. Paints the picture of pain. If the rep has to summarise it in their own words rather than quote the customer, it's weak.

**Strong:** "Every time the product team wants to message a merchant in-app, it takes multiple teams and multiple days." (Peter Scott, Mar 4)

**Weak:** "They have analytics fragmentation." (rep summary, no quote)

### Negative Consequences
Bad outcomes resulting from the Before Scenario. Operational or financial. **Quantitative.** The basis for ROI conversations with the EB.

**Strong:** "Tyro's onboarding web form drops 82% of visitors before conversion." (numbered, attached to a specific workflow)

**Weak:** "Their conversion rate is bad." (no number)

### After Scenario
A stand-in-the-future vision of how life is better. Qualitative. **In the customer's language.** Educates them on best practices.

**Strong:** "Steen wants to be able to message merchants in-product without engineering for every change."

**Weak:** "They want a better experience." (generic)

### Positive Business Outcomes (PBOs)
Business performance improvements from the After Scenario. **Defined in terms the EB cares about: revenue, cost, risk.** The R in ROI.

**Strong:** "Reduce merchant churn from 20% by fixing the 82% onboarding drop-off - protects NRR."

**Weak:** "Improve user engagement." (not EB language)

### Required Capabilities
What the customer needs the solution to do, **in their language, not ours**. Becomes the evaluation criteria. Should be shaped during discovery using trap-setting questions so Pendo's differentiators become must-haves.

**Strong:** "Full-funnel analytics from website through to active user, without engineering dependency."

**Weak:** "Product analytics." (too generic - doesn't favour Pendo)

### Success Criteria
Requirements made measurable. KPIs with numbers and timeframes. **"A requirement without a success criterion is a wish."**

**Strong:** "Reduce onboarding drop-off from 82% to under 50% within 90 days of POC."

**Weak:** "Improve onboarding." (no metric, no timeframe)

---

## The Know vs Confirmed vs Inferred test

For every element in the brief, ask:

- **Did the customer say this, in these words, on a recorded call?** → quote it, attribute it, mark as confirmed.
- **Did the rep say it and the customer agree (or not push back)?** → mark as partial, flag as "needs explicit customer confirmation on next call".
- **Am I reasoning my way to this from titles, org structure, or what was *not* said?** → prefix with `[INFERRED]` and explain the reasoning briefly.

Smuggling inferences in as facts is the single biggest failure mode of automated deal analysis. Don't do it.

---

## The Mantra - what makes it real

The Mantra is the pivot from discovery to solution. Structure:

> "What I hear you saying, [customer], is that the positive business outcomes you're trying to achieve are [PBOs in their words].
>
> In order to achieve that, you need [Required Capabilities in their words].
>
> And you'll measure these using [Success Criteria - specific KPIs with timeframes]."

**Rules for writing the Mantra in a brief:**

1. **PBOs come from the customer's mouth.** If you only have inferred PBOs, write the Mantra with the inferences clearly marked and note that PBO confirmation is the #1 next action.

2. **Required Capabilities should map to Pendo differentiators.** Not because we're pitching, but because if the customer's stated requirements happen to favour Mixpanel or Whatfix, this deal is in trouble and the brief needs to say so.

3. **Success Criteria are the most often-missing piece.** If you don't have customer-stated SC, write `[TBC - agree on {next call date}]` and call it out as a gap. The COTM Lab teaches this explicitly: a Mantra without Success Criteria can't be used internally by the champion to sell to the EB.

4. **Half a Mantra is honest. A fabricated full Mantra is dangerous.** If only PBOs are confirmed and Capabilities + Success Criteria are still TBC, write that. The brief's job is to surface the gap, not paper over it.

---

## Pain implication - the question that gets to negative consequences

Surface-level pain doesn't move budget. Quantified, EB-relevant pain does. When extracting pain from transcripts, look for the moment the customer connects the symptom to a number, a deadline, a budget owner, or a board-level concern.

The COTM Lab's diagnosis: "Most teams have surface-level pain - they know something is broken. Few have implicated pain - the dollar cost, the headcount cost, the customer cost, the strategic cost of doing nothing."

When the brief writes Negative Consequences, prioritise:

1. Customer quotes with **numbers attached** ("we're losing X% of merchants", "we waste Y engineering hours per release", "Z renewals at risk").
2. Customer quotes that name a **stakeholder feeling the pain** ("the CPO is asking", "the board wants to know").
3. Customer quotes with a **forcing function** ("we're entering the TPP cycle in 2 weeks", "the renewal is in 90 days").

If the transcripts don't contain these, that absence is itself the headline gap. Note it.

---

## Brief structure - mirrors the COTM Framework slide

The brief is built around the COTM Framework slide (Day 1 deck, "How It Builds"). The strategic narrative lives in three sections that mirror the slide directly:

- **Current State** = Before Scenarios + Negative Consequences. Bullet form. Customer's language for Before; quantified for NC. The pain that makes doing nothing more expensive than buying.
- **Future State** = After Scenarios + Positive Business Outcomes. Bullet form. Customer's vision for After; EB-relevant numbers for PBO. The vision that justifies the spend.
- **Why Pendo & trap-setting** = the differentiators that map to the customer's stated pain, framed as trap-setting moves rather than descriptive claims. Pulled from `pendo-differentiators.md`. Pick 1-3, never all 7.

The compelling event ("why now?") sits inside Negative Consequences when it's pain-driven (e.g. Mixpanel contract on monthly hold, TPP planning cycle closing), or inside Recommended Next Actions when the rep needs to land it next call. It doesn't need its own section.

Why this shape: the Day 1 deck explicitly teaches that Current State → Delta → Future State is the building block. By organising the brief the same way, the rep reads the brief in the same shape they're going to deliver the conversation. The brief is the rep's mental rehearsal.

---

## The framework-gap framing for Recommended Next Actions

The brief's Recommended Next Actions section is **not** a generic next-steps list. It is a list of **COTM framework elements that are under-evidenced**, each paired with a discovery move designed to close that specific gap on the next call.

The pattern:

> **{COTM element that is shallow or missing}.** {The specific move to fill it - who to ask, what to ask, by when.}

Examples:

> **Negative Consequences are shallow.** Peter has named the problems but not quantified their cost. On 20 May reset demo, ask: "What's the cost of the 82% drop-off in dollars or merchant LTV?" Goal: quantify pain in EB language before TPP submission.

> **Required Capabilities incomplete on mobile.** Web pain is well-articulated; the Kotlin / terminal scope is only inferred. Ask Peter: "If we ran a POC on the partner-led onboarding product, would mobile be in scope or web-only?"

> **EB not yet engaged.** Michael Nufio is the operational EB but no direct Pendo conversation has occurred. Ask Peter: "When you brief Michael, would it help for me to join for 20 minutes to walk the business case directly?"

Why this matters: ordinary "next steps" lists drift into calendar items ("send recap email", "follow up"). Framework-gap framing forces every action to be tied to a specific COTM element the customer hasn't yet given us. If an action can't be tied to one of these elements, it doesn't belong in the brief.

### Mapping COTM elements to gap actions

| If this is thin in the transcripts... | The action is to surface... |
| --- | --- |
| Before Scenarios sparse | More customer-voice pain - ask broader, open-ended discovery questions |
| Negative Consequences sparse | Quantification - dollar / time / customer / headcount cost |
| After Scenarios sparse | The customer's vision of the future state - "what does good look like 90 days post-Pendo?" |
| PBOs sparse | EB-relevant outcomes - revenue / cost / risk in numbers |
| Required Capabilities sparse | The minimum capabilities the customer needs - shape with trap-setting |
| Success Criteria sparse | KPIs and timeframes - "how will you measure this working?" |
| EB unknown | Direct EB access - ask champion for an intro or co-meeting |
| Champion weak | Champion test - has the contact acted independently for us? |
| Competition unknown | The honest competitive picture - including do-nothing |
| Decision Process generic | Named approvers + sequenced steps |
| Paper Process unknown | Procurement / legal / security engagement and timeline |

This mapping is the source for the bullets in Recommended Next Actions. Read the transcripts, find which elements above are thin, and write one action per thin element (capped at 5).
