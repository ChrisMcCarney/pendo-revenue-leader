# Pendo GTM operating model

*Read this before deal-depth conversations. The shared frame that lets CE, AD, sales leadership, and CS work the same deal. Positioning content (5-lead context layer, CIO and CPO pitches, expansion thesis) lives in `positioning.md`.*

---

## Roles

Pendo runs different account team shapes by segment. Commercial moved to an AD + CE pairing in FY27. Enterprise retains the AD + SE + CSM + TAM quad.

- **Customer Engineer (CE)** - FY27 commercial-segment role. Consolidates SE, CSM, TAM, and Onboarding Specialist into one full-lifecycle technical owner. Carries pre-sales, onboarding (free, replaces Launch Premium), customer success, and TAM. Existing customer opportunities route to the CE on the account. New business assigned via deal engagement request. Transition: April 2026 book-of-business handoffs and training, May 1 CE owns new customer books, June 1 CEs own pre-sales and implementations independently.
- **Sales Engineer (SE)** - enterprise pre-sales technical role. Owns demos, POCs, technical evaluations, competitive benchmarking. Sits under Director of Sales Engineering. Specialisation across Commercial and Enterprise pillars.
- **Account Director (AD)** - commercial motion. Hybrid model from FY26 onward: carries both an existing book (renewals, expansions) and a new logo expectation. Formal titles: AD Mid-Market Sales, AD Enterprise Sales. The EAD title is converging into AD. Partners with RS on pull-forward and renewals.
- **Account Executive (AE)** - core commercial and mid-market new business. Career path runs SDR/BDR > Commercial AE > MM AE > Enterprise AD.
- **Sr. Renewals Specialist (RS)** - FY26 renewals-focused role with separate quota and comp from AD. ADs partner with RS to identify pull-forward and at-risk renewals.
- **Sales leadership** - tiers: RVP (segment by region, e.g. RVP APAC, RVP Mid-Market Sales), VP (multi-RVP), CRO / President level. Owns coaching, forecast accuracy, strategic accounts, escalations, and cross-region partnership.
- **Customer Success Manager (CSM)** - enterprise post-sale role for adoption, retention, and expansion. Commercial CSM is folded into the CE role from May 1 2026.

---

## CEP (Customer Engagement Process)

Stages 0 to 6. Three-phase frame: Pipeline Generation (Stage 0), Visible Opportunity (Stages 1 to 4), Value Realisation (Stages 5 and 6). Defined in `System/cep-stages.yaml`. Every active opportunity sits at a known stage with exit criteria.

| Stage | Customer state | Exit criteria | Key activity | Example activities |
| --- | --- | --- | --- | --- |
| 0 | Open to further conversations | Pendo Overview delivered. Potential pain, champion, next steps. | Deliver Pendo Overview | Discovery and intros. Initial demo. Multi-thread PG. Self-guided tours. Field marketing. Account research. |
| 1 | Open to change and sharing info | FLM inspects and confirms pain and champion. Stage should sit for less than 30 days. | 1:1 with champion to test power and influence, vested interest, next steps | Second or custom demo. Reverse demo. Low-calorie on-site (coffee, lunch, Top Golf). Reference call. Install Pendo Free. |
| 2 | Tells us problems and impacts | EB identified and intro requested. Decision criteria documented. | Evaluation kickoff | MAP. PG other stakeholders. Pendo-on-Pendo demo. Pendo leader intro. High-calorie on-site (whiteboard, transformation workshop, exec alignment). |
| 3 | Tells us benefits of our solution | Documented Value Summary. Met with the EB. | Build BVA (Business Value Assessment) | Evaluation tech syncs. Evaluation playback. Transform workshops. Scope services. Initial pricing. Reference calls. Procurement and legal kickoff. |
| 4 | Provides access to procurement and legal | Contract signed | BVA playback and negotiation | Final pricing. Legal and procurement. Deposits with champions. Intro to CS and TAM. |
| 5 | Ready to move forward and purchase Pendo | Deal Desk approved | IKT (Internal Knowledge Transfer) and review JVP | Announcement writeup. Thank the team and the customer. |
| 6 | Actively using Pendo and sharing successes | Implementation completed. Value realised. Expansion identified. | QBR or EBR on value realisation vs JVP | New customer kickoff. Services implementation. QBR or EBR. CABs. Field events. Pendomonium. Return to Stage 0 for the next expansion. |

Notes:
- Buyer concern progression across stages runs Needs > Cost > Solution > Risk. Peaks at Stage 3 and 4.
- Closed Won and Closed Lost are SFDC `StageName` outcomes, not CEP stages. Loss reason captured at Closed Lost.

---

## MEDDPICC

> *MEDDPICC tells you what is missing. COTM tells you what to do about it.*

Three governing principles:

1. It tells you where you are. Every gap is a revenue risk, not a paperwork gap.
2. It forces the honest question. "I think" is not MEDDPICC. "I know" is.
3. It tells you what to do next. A gap is a next action, not a dead end.

Central discipline: **Know or assume?** Each field is binary. Confirmed (know) or assumed (assume).

| Letter | Pendo definition | Pressure test |
| --- | --- | --- |
| **M** Metrics | Quantified value of solving. Measurable economic impact. | What does success look like in numbers 12 months from now? Have you and the buyer agreed, or is it still your estimate? |
| **E** Economic Buyer | The one person who can say yes when others say no, and no when others say yes. | Have you spoken to the EB directly, not through your champion? What did they say about the business impact? |
| **D** Decision Criteria | Formal or informal requirements used to compare vendors. Shape these early. | Does the customer have formal evaluation criteria, or is this still exploratory? |
| **D** Decision Process | The internal buying journey: approvals, legal, procurement, security. | Can you map every step and every name in the approval chain? |
| **P** Paper Process | Legal, procurement, compliance steps required to execute. | Is procurement engaged? Has legal started? What is the actual timeline? |
| **I** Implicate the Pain | The critical business problem driving urgency. No pain, no deal. | Is the pain specific, quantified, and in the customer's words, or still assumed? |
| **C** Champion | Internal advocate with power, influence, urgency. | Has your champion stuck their neck out for you? What have they done when you were not in the room? |
| **C** Competition | All alternatives including status quo and DIY. | What does your champion say when they are being honest about the competition? |

The "I" is **Implicate the Pain**, not "Identify pain". Active rep verb.

Meta-test for any answer: *"You said 'I think'. Do you think, or do you know? What would it take to know?"*

**Action-item standard.** Not acceptable: "Follow up with Mike". "Try to get a meeting with the EB". "Work on the business case". Standard: named person, specific action, date. Example: "Text Mike by EOD Thursday: one question about who owns budget for internal tooling".

**SFDC field signals.**
- `NextStep` blank in deal inspection is a warning flag.
- `CloseDate` must tie to a forcing function. "The date you want" is not a close date.

---

## MEDDPICC and COTM

*The cross-walk. Each MEDDPICC field maps to a specific COTM artefact. This table is the connective tissue between the diagnostic frame and the conversation frame.*

| MEDDPICC | COTM element |
| --- | --- |
| **M** Metrics | Success Criteria |
| **E** Economic Buyer | Positive Business Outcomes |
| **D** Decision Criteria | Requirements |
| **D** Decision Process | Requirements + Success Criteria |
| **P** Paper Process | Value Summary / Business Case |
| **I** Implicate the Pain | Before Scenario + Negative Consequences |
| **C** Champion | After Scenario + Mantra |
| **C** Competition | How We Do It Better |

---

## Champion

*Power, influence, urgency. Actively sells the solution internally and is personally accountable for driving change.*

Six observable behaviours:

1. Articulates the business problem and impact in their own words.
2. Aligned on Required Business Outcomes (RBOs).
3. Advocates internally when you are not present.
4. Creates access to the Economic Buyer.
5. Drives next steps and internal momentum.
6. Personally invested. Something is at stake for them.

**The Champion test.** If any answer is no, you do not have a champion. You have someone you like.

1. If I am not in the room, would they advocate for this initiative?
2. Have they taken specific action internally on my behalf?
3. Can they clearly explain the business problem and impact?
4. Have they helped me gain access to the Economic Buyer?
5. If this deal depended entirely on them, would it move forward?

**Contact-type taxonomy.** Anti-patterns to watch for:

| Type | Behaviour |
| --- | --- |
| Champion / Mobiliser | Takes action. Advocates when you are not present. Creates access. Credibility on the line. |
| Coach / Informer | Shares info. Responsive. Likes the solution. Does not push it forward. |
| Fan / Informal | Positive sentiment. Verbal agreement. No action. Avoids conflict. |
| Guide / Navigator | Helps navigate the org. Not invested in the outcome. Provides intros when asked. |
| Blocker / Resistor | Resists change. Prefers status quo. Creates friction. Influences others against you. |

---

## Economic buyer

*Discretionary authority to approve spend. Owns the Required Business Outcomes. Says yes when others say no, and no when others say yes.*

Six confirmation criteria:

- Controls the budget without further approval.
- Owns the business outcome this solves.
- Engages on business impact, not product features.
- Has urgency to act (compelling event).
- Defines success in measurable business terms (RBO clarity).
- Can unilaterally approve or kill the deal.

EB anti-patterns:

- **Authoriser / Approver.** Signs the contract but needs others' buy-in. Does not own the outcome. Engages late on terms only.
- **Influencer / Stakeholder.** Has a voice, not a vote. Can recommend or block. Often a department head. Does not control budget. Easily mistaken for the EB.

> *No champion, no deal. No EB access, no deal.*

---

## Command of the Message

*Two-way discovery method. The conversation starts with pain and earns the right to talk about Pendo.*

The frame:

```
Current state                Delta                       Future state
Before Scenario          +   Required Capabilities   +   After Scenario
Negative Consequences        Success Criteria             Positive Business Outcomes

                             How We Do It / Better / Proof Points
```

Eleven named elements (the COTM glossary):

| Element | Definition |
| --- | --- |
| Value Drivers | What a prospect is proactively looking for. Revenue, cost, or risk. Exist even if Pendo does not. |
| Before Scenario | Undesirable current state. In customer language, not PMM language. |
| Negative Consequences (NC) | Bad outcomes from the Before Scenario. Operational or financial. Basis for quantifying pain with the EB. |
| After Scenario | Stand-in-the-future vision after resolving the pain. |
| Positive Business Outcomes (PBO) | Business performance improvements in EB language. The R in ROI. |
| Requirements | What the customer needs to get from Before to After. Customer language. Becomes their evaluation criteria. |
| Success Criteria | Requirements made measurable. KPIs with timeframes. A requirement without a success criterion is a wish. |
| How We Do It | How Pendo satisfies the Requirements. Has no selling power until requirements are established. |
| Better | Why Pendo satisfies requirements more completely than alternatives. Requirements-anchored, not feature comparison. |
| Proof Points | Verifiable evidence. Case studies, references, real numbers. |
| Mantra | One-line positioning the champion can repeat internally. The pivot from discovery to solution. |

**The Mantra** (the pivot ritual from discovery to solution):

> What I hear you saying is that these are the Positive Business Outcomes you are trying to achieve.
> In order to achieve these PBOs, we agreed that these are the Requirements you are going to need.
> And you will measure these requirements using these Success Criteria.

This is a pivot technique, not a script. If the customer has not said it, do not pivot yet.

**Who owns what.**
- **PMM** provides hypotheses (Before, NC, After, PBO language, capabilities, discovery questions, differentiators, trap-setting questions, proof points, sample Mantra).
- **AD and CE** provide the questions and the synthesis. Walk in with PMM hypotheses in head. Never state them out loud unprompted. Ask questions until the customer says the Before and After themselves.
- **Customer** provides the actual Before and After in their own language. This is the only version that matters.

**Trap-setting.** Set topic, open trap, close trap. Open-ended questions that introduce Pendo's defensible differentiators into the requirements conversation. A trap is set when the customer states the requirement that favours Pendo, not when you state your capability.

**Pitch vs COTM.** Sequential, not competing.
- **The Pitch** is one-way, rehearsed, structured. Used at exec presentations, first-call credibility moments, demo intro, proposal walkthrough.
- **COTM** is two-way, reactive. Used at discovery, objection handling, QBR, expansion, multi-stakeholder.

**Tell / Show / Tell.** The demo operating format.
- **Tell (before):** set up the pain. "You mentioned your team cannot tell where users are dropping off. Here is exactly what that looks like in Pendo."
- **Show (during):** navigate purposefully. Show only what you set up.
- **Tell (after):** land the "so what" before moving on.
- The "so what" test: if you cannot connect a feature to their pain in one sentence, cut it.

> *Confirmation is not discovery. If you state the Before or the Requirement yourself, even as a leading question, it is a pitch.*

For Pendo's current platform positioning (5-lead context layer, CIO and CPO pitches, expansion thesis), see `positioning.md`.

---

## Forecast categories

Use `ForecastCategoryName` as the deal health signal:

- **Commit** - high confidence, in the number.
- **Best Case** - probable, not yet committed.
- **Pipeline** - in play, not in the forecast.
- **Omitted** - out of the forecast (don't include in pipeline reviews).

`SE_Risk_Level__c` is a CE metric. Don't surface it in sales leader pipeline views or forecast conversations.

---

## Net ARR

Always use **Net ARR** (SFDC field `Net_ARR__c`) for forecast and pipeline values. Not `Amount` (TCV), not `AnnualRevenue`. Skills enforce this default.
