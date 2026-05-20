# COTM Deal Analysis - Output Template

The canonical structure for every COTM Deal Analysis brief. Use it verbatim. Headings, order, status icons, and section dividers are part of the contract.

The brief is **a discovery audit**: each section either has rich customer evidence in it or has an explicit gap callout pointing to what's missing. The Recommended Next Actions at the bottom are then framed as moves to close those framework gaps on the next call.

**Length:** target ~700-900 words for a multi-call deal, shorter when evidence is thin. Not capped - but every sentence must either be the customer's voice or change what the rep does next.

---

```markdown
# COTM Deal Analysis: {Account Name}

*{DD Month YYYY} - {SFDC Stage} - {Net ARR formatted as $XXX,XXX} - Owner: {Owner Name}*

> {Optional one-line evidence note, e.g. "Built from 4 Gong calls (Feb-May). SFDC not reconciled this session."}

---

## The Mantra

"What I hear you saying, {Account}, is that the positive business outcomes you're trying to achieve are {PBOs in the customer's own language - multiple PBOs, descriptive, ~30-50 words}.

In order to achieve that, you need {Required Capabilities in the customer's language - multiple capabilities, ~30-50 words}.

And you'll measure these using {Success Criteria - specific KPIs with timeframes. If not yet confirmed, write [TBC - agree on {next confirmed call date}]}."

---

## Current State

*Before Scenarios (customer's voice) + Negative Consequences (the cost of doing nothing, quantified). Capture the customer's actual phrasing - colour, emotion, the words that make the rep feel the challenge before walking into the next call.*

**Before scenarios:**
- "{verbatim quote where possible, ~15-30 words}" - {Speaker, MMM DD}
- {paraphrased only if no clean quote exists, attributed to source}
- {...}

**Negative consequences:**
- {NC with a number - drop-off %, churn rate, hours lost, dollars at risk, headcount strain}
- {...}

> **Gap to close:** {Optional one-line callout when a section is sparse. E.g. "Negative Consequences are shallow - Peter named the problems but didn't quantify their cost. Surface dollar / time / merchant impact on the next call." If the section is full, omit the callout.}

---

## Future State

*After Scenarios (customer's vision) + Positive Business Outcomes (the business case in EB language).*

**After scenarios:**
- "{customer's vision in their language, ~15-30 words}" - {Speaker, MMM DD}
- {...}

**Positive business outcomes:**
- {PBO in EB language: revenue / cost / risk reduction, with a number where the customer has given one}
- {...}

> **Gap to close:** {Optional gap callout if After/PBOs are thin.}

---

## Why Pendo & trap-setting moves

*Pick 1-3 differentiators from references/pendo-differentiators.md that map to the customer's stated pain. For each, name the trap, give the close-trap question, and point to the specific Pendo features or use cases that would be in scope if the trap closes - this gives the rep richer ICP-aligned context for the demo or POC scoping conversation.*

**{Differentiator name} - {U/C/H}**
*Trap:* {the requirement we want the customer to articulate, ~15 words}
*Close-trap question:* "{specific question, in customer language}"
*In scope if trap closes:* {1-3 specific Pendo features or use cases relevant to this customer's ICP - e.g. "Funnels + Paths to expose the 82% drop-off, Embedded Guides for partner-onboarding, Listen for merchant feedback"}

**{Differentiator 2}**
*Trap:* {...}
*Close-trap question:* "{...}"
*In scope if trap closes:* {...}

---

## MEDDPICC Scorecard

| Element | Status | Summary |
| :---- | :---- | :---- |
| M - Metrics | {✅/⚠️/❌} | {≤25 words: what the customer has actually said about measurement, quoted if possible} |
| E - Economic Buyer | {✅/⚠️/❌} | {≤25 words: named EB? Rep spoken with them directly?} |
| D - Decision Criteria | {✅/⚠️/❌} | {≤25 words: formal criteria stated, or exploratory?} |
| D - Decision Process | {✅/⚠️/❌} | {≤25 words: specific names + steps, or generic?} |
| P - Paper Process | {✅/⚠️/❌} | {≤25 words: procurement / legal status} |
| I - Identified Pain | {✅/⚠️/❌} | {≤25 words: quoted, quantified pain - or generic?} |
| C - Champion | {✅/⚠️/❌} | {≤25 words: has the contact acted when rep wasn't in the room?} |
| C - Competition | {✅/⚠️/❌} | {≤25 words: direct + internal build + do-nothing} |

---

## Recommended Next Actions

*Each action names the COTM framework element that's underdeveloped + the specific discovery move to close that gap on the next call. Maximum 5. Order by impact on this quarter's close.*

1. **{COTM element gap, e.g. "Negative Consequences are shallow"}.** {The specific move: who + question or action + when. ~30-40 words. Example: "On 20 May reset demo, ask Peter: 'What's the cost of the 82% drop-off in dollars or merchant LTV? What does that translate to over a year?' Goal: quantify pain in EB language before TPP submission."}
2. **{Next gap}.** {Move...}
3. {...}

---

**SFDC housekeeping** - update these fields after the next call:

- `{Field_API_Name__c}` → {what to populate / correct}
- `{Field_API_Name__c}` → {...}
```

---

## Notes on the template

**Why the Mantra phrasing is verbatim.** The Mantra is the rep's *script* for the meeting - it's the sentence they'll deliver to pivot from discovery into Pendo's solution. Compressed phrasing ("the outcomes you're after are X, to get there you need Y") loses the rhythm and the audibility of the standard pattern. Reps practise the long form because that's what works in the room.

**Why bullets carry the customer's voice, not the rep's summary.** A rep summary loses the colour, the emotion, the specific words. "I want to kill it with fire" lands differently than "Peter expressed frustration with the getting-started form." The brief's job is to put the customer's voice in the rep's head before the call.

**Why gap callouts inside sections.** The brief is an audit of where the COTM framework is well-populated and where it isn't. Sections with rich evidence don't need a callout. Sections with gaps need them flagged loudly - that's the most useful thing the brief can do.

**Why Recommended Next Actions are framed as framework gaps.** "Follow up with Peter" is a calendar item. "Negative Consequences are shallow - quantify the cost of the 82% drop-off" is a discovery move. The discipline is to never write an action that isn't tied to a specific COTM element the customer hasn't yet given us.

**Why Why Pendo names features / use cases.** The differentiator alone is too abstract for the rep to plan the demo. Naming the specific Pendo features (Funnels, Embedded Guides, Predict, etc.) gives the rep the ICP-aligned hooks to use when the trap closes.

**Length envelope.** Calibrated to evidence depth. A deal with 5+ calls of rich discovery may warrant 900 words. A deal with one call may warrant 500. There's no upper cap - but every sentence must be the customer's voice or change what the rep does next.
