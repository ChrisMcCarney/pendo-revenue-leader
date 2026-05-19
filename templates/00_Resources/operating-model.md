# Pendo CE Operating Model

The shared lens for how Pendo Customer Engineers (CEs) and Account Directors (ADs) work together to drive customer outcomes. Read this any time you're discussing a deal in any depth.

---

## CE + AD motion

Pendo runs a unified end-to-end customer motion. Two roles, one process:

- **Customer Engineer (CE)** owns the **technical motion** across the customer lifecycle: discovery, evaluation, implementation, adoption, and ongoing success.
- **Account Director (AD)** owns the **commercial motion**: deal strategy, stakeholder management, commercials, revenue outcomes.

Older language ("Solutions Engineer," "Pre-sales") is being retired. Use CE/AD framing in all new work.

---

## Customer Engagement Process (CEP)

Stages 0 to 6, treated as one continuous motion from prospect to renewal:

| Stage | Name | What's happening |
| --- | --- | --- |
| **0** | Identify | Prospect identified. Account research, ICP fit. |
| **1** | Engage | First conversations. Discovery, qualification, MEDDPICC begins. |
| **2** | Evaluate | Technical evaluation. Demo, reverse demo, POC, snippet deployment, integration check. |
| **3** | Business Case | Value framing, ROI, business case, executive alignment. |
| **4** | Technical Win | Technical decision criteria validated. Champion confirmed. Procurement begins. |
| **5** | Commercial Close | Pricing, contracts, signature. |
| **6** | Implementation & Success | Onboarding, adoption, expansion, renewal. CE remains involved. |

Don't skip stages. Don't move forward without the gates being met. The CEP is on the company page or workstation MEMORY.md as `Stage: {0–6}`.

---

## MEDDPICC

The default qualification and progression frame. All eight elements must be tracked, ideally on each active account's workstation `MEMORY.md`.

| Element | What it means | Typical owner |
| --- | --- | --- |
| **Metrics** | The customer's quantified pain or value (cost, time, revenue, churn) | CE |
| **Economic Buyer** | The person who can release the budget | AD |
| **Decision Criteria** | The technical and business criteria the customer will use to choose | CE |
| **Decision Process** | The customer's internal process for deciding | AD |
| **Identify Pain** | The specific business pain we're solving | Shared |
| **Champion** | The internal advocate who will sell on our behalf | Shared |
| **Competition** | Who else is in the deal (named or implied) | Shared |
| **Compelling Event** | The reason to buy *now* (deadline, contract end, board mandate) | AD |

Track each element with a status: **GAP / WIP / DONE** and a date-stamped notes field. Append, don't overwrite.

---

## Command of the Message (CoM)

Frame every customer-facing conversation around three things, in this order:

1. **Current challenge.** What is the customer struggling with right now? Be specific. Numbers if possible.
2. **Business impact.** What does the challenge cost them? Revenue? Time? Risk? People?
3. **Value of solving.** What changes when this is fixed? Quantify where possible.

Don't lead with features. Don't lead with the product. Lead with the customer's situation, then connect to capability.

---

## Pillars

Three strategic pillars that ladder up to time-bound goals. Pillars are role-specific: a CE's three differ from an AD's, which differ from a sales leader's. Define yours in `System/pillars.yaml`. Starting-point suggestions per role are at the bottom of that file.

Tasks are categorised against these pillars. Pillar inference keywords are in `System/pillars.yaml`.

---

## How CE and AD divide the work

| Activity | Primary owner | Notes |
| --- | --- | --- |
| Account research | AD | CE supports for technical fit |
| Discovery call | Shared | AD leads commercial; CE leads technical |
| Demo | CE | AD attends; AD opens and closes |
| Reverse demo | CE | Customer shows their current state; CE listens for pain |
| POC / snippet deployment | CE | CE owns end-to-end |
| Business case | Shared | AD owns commercials; CE owns metrics |
| Technical decision criteria | CE | CE owns mapping criteria to capability |
| Procurement | AD | CE supports security questionnaires |
| Implementation kickoff | CE | CE hands off to CSM |
| Renewal | AD | CE supports adoption review |

The handoffs between stages are explicit, not implicit. Every CEP stage transition should have a quick written confirmation in the workstation MEMORY.md.

---

## Risk and progression

Apply this lens before declaring an account "healthy":

- **Stale?** When was the last meaningful customer touch? More than 14 days = stale unless intentionally paused.
- **MEDDPICC gaps?** Any element still GAP at stage 3 or later is a risk flag.
- **Champion strength?** Single champion is single-point-of-failure. Two named champions or stronger.
- **Compelling event?** No event = deal won't close on time.

Flag risk explicitly in workstation MEMORY.md under "Risk."

---

## Common pitfalls

- **Demo-first selling.** Showing capability before understanding pain. Don't.
- **Single-thread champion.** Whole deal lives or dies with one person. Diversify.
- **Optimistic forecasting.** "It feels good" isn't a stage gate. MEDDPICC is.
- **Quiet account.** No customer touch in 21 days = the deal is stalling, even if the AD insists otherwise.
- **Tech-first scoping.** Scoping integration before validating value. Always validate value first.

---

## Reference

For Pendo-specific product context, competitive intelligence, and case studies, see `00_Resources/competitive-intel/` and your team's enablement portal.
