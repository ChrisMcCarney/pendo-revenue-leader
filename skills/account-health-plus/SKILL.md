---
name: account-health-plus
description: Produce a unified Account Health + Entitlements brief for any Pendo customer. Combines the existing /account-health style engagement, feature usage, NPS, feedback and CRE report with a normalised FY25 module entitlement view, adoption grading per module, module-gap upsell plays grounded in usage signals, renewal status with EB and MEDDPICC red flags, and a top-stakeholders list from SFDC. Trigger this whenever the user says "/account-health-plus", "account health plus for {name}", "deep health on {name}", "full account brief for {name}", "renewal prep for {name}", "QBR prep for {name}", or any request to deeply analyse a single named Pendo customer for adoption, expansion or renewal. Use even on casual phrasings like "what's going on with {account}" or "give me the lowdown on {account}" when context implies a customer account. The output is always a markdown brief saved to 04_Accounts/Active/{Name}/Notes/{YYYY-MM-DD}-account-health.md, with the active workstation folder created if it doesn't exist.
---

# Account Health Plus

A unified pre-call, renewal-prep, or QBR brief for any Pendo customer. The skill assumes the reader will walk into a meeting with the customer within 24 hours and needs the essential read in one document: usage, sentiment, risk, entitlement, commercial status, stakeholders, and the next-conversation prompts.

The shape extends the existing `/account-health` style report (engagement, feature usage, NPS, feedback, CRE, suggested topics) with three sections that turn it from a status doc into an action doc: a normalised FY25 entitlement view, module-gap upsell plays grounded in real usage signals, and a commercial / MEDDPICC read.

## Inputs

- **Account name** (required). Free text, e.g. "ecoPortal", "Travel CTM", "Simpro". Use SFDC `LIKE` matching for flexibility. If multiple accounts match, present a numbered list and ask the user which.
- **Time window** (optional, default 90 days). Used for all usage and feedback queries. Common values: 30, 60, 90, 180.

## Fail-fast conditions

Stop early and surface a clear error if any of these are true. Do not produce a partial report:

1. Account name resolves to zero or more than one account after disambiguation.
2. Account has no `Subscription__c` records that are `Installed__c = true` and not disabled.
3. The user does not have Pendo MCP access to at least one of the account's customer Pendo subscriptions (verify via `list_all_applications` — if none of the customer's Pendo Sub IDs appear in the accessible list, fail).
4. SFDC connector is unreachable.
5. `00_Resources/pricing-packaging-mapping.md` is missing from the workstation. This file is the legacy-to-FY25 crosswalk and is required for Step 3. If absent, surface: `This skill requires 00_Resources/pricing-packaging-mapping.md in your workstation (the legacy-to-FY25 packaging crosswalk). Drop the file in and re-run, or ask Chris where the latest version lives.` and stop.

The Pendo MCP access check is the most important. The skill exists to fuse usage data with commercial data. Without Pendo data the result would be misleading.

## Workflow

Execute steps in this order. Steps 4-7 can run in parallel.

### Step 1: Resolve the account

Query SFDC for accounts matching the name:

```sql
SELECT Id, Name, Website, BillingCountry, Owner.Name, Type,
       pendo_d__PendoRevenue__c, Active_Subscription_Count__c,
       Pendo_Installed__c, Pendo_Actively_Installed__c
FROM Account
WHERE Name LIKE '%{name}%'
ORDER BY Active_Subscription_Count__c DESC
LIMIT 10
```

If more than one match, show the user the candidates with country, owner and active sub count, and ask which to use.

### Step 2: Pull live entitlements

Two queries. First, the live `Subscription__c` records for usage signals:

```sql
SELECT Id, Name, Pendo_Subscription_Name__c, Pendo_Sub_Pendo_ID__c,
       Pendo_Environment__c, ARR__c, Renewal_Date__c, Installed__c,
       MAU_Type__c, da_visitors30__c, da_visitors90__c,
       da_Identified_MAUs_Last_30_Days__c, da_Anonymous_MAUs_Last_30_Days__c,
       da_Session_Replay_MAUs_Last_30_Days__c,
       da_Agent_Prompts_Total_Last_30_Days__c,
       Pendo_Current_Published_Guides_Count__c,
       Pendo_NPS_Guides_Published__c, da_apps__c, da_activeApps__c,
       Pendo_Number_Of_Days_Active_Last_30_Days__c,
       pendo_Last_Login__c, da_observedAt__c
FROM Subscription__c
WHERE Account__c = '{AccountId}' AND Disabled_Account__c = false
ORDER BY ARR__c DESC
```

Second, the live SBQQ contract line items (current state only — see crosswalk note below):

```sql
SELECT SBQQ__Product__r.Family, SBQQ__Product__r.Name,
       SBQQ__Product__r.ProductCode, SBQQ__Quantity__c,
       SBQQ__StartDate__c, SBQQ__EndDate__c
FROM SBQQ__Subscription__c
WHERE SBQQ__Account__c = '{AccountId}'
  AND SBQQ__TerminatedDate__c = null
  AND SBQQ__StartDate__c <= TODAY
  AND SBQQ__EndDate__c >= TODAY
  AND SBQQ__Quantity__c > 0
ORDER BY SBQQ__Product__r.Family, SBQQ__StartDate__c DESC
```

**Why both queries:** `Subscription__c` carries the Pendo Sub IDs (needed for Step 4) and the synced usage fields. `SBQQ__Subscription__c` carries the contract truth — what the customer is actually paying for. CPQ amendments append rather than update, so the date filter is critical to get the current state.

### Step 3: Translate entitlements via the mapping doc

Read `00_Resources/pricing-packaging-mapping.md` (required; see fail-fast condition 5). Apply the capability-by-era crosswalk to each SBQQ line item. The output of this step is a normalised list of FY25 modules the customer is entitled to, regardless of which pricing era their contract is on.

Determine the pricing era from the line items:
- Any `PPP-PKG` or Bundle family SKU -> **FY25**
- Any `TOT-APP-KEY-{Team|Pro|Enterprise|Guidance|Insights|Feedback}` -> **Legacy**
- Any `MAU-only` Pricing Model on `Subscription__c` + no Bundle SKUs -> **MAU-Only**
- Otherwise -> **Legacy** (default)

Capture the FY25 bundle equivalent if applicable (Base / Core / Pulse / Ultimate) — see the mapping doc's bundle section.

### Step 4: Verify Pendo MCP access and pull usage

Call `list_all_applications` from the Pendo MCP. For each `Pendo_Sub_Pendo_ID__c` returned in Step 2, check whether it appears in the accessible subscriptions list. If none do, stop and return the fail-fast message:

> "I don't have Pendo MCP access to any of {Account}'s customer subscriptions ({list of Pendo Sub IDs}). The Account Health Plus report requires live Pendo data to be meaningful. Ask CS or product ops who has admin scope on this customer's subscription, or request access."

For each accessible Pendo sub + app, in parallel:

- `visitorQuery` with `count=false` to pull unique visitor list with last visit time -> derive unique visitor count, top 5 by days-active.
- `productEngagementScore` -> high-level engagement signal.
- `guideMetrics` -> guide views/completions, used for Guides Pro adoption grade.
- `listGuides` -> count of published guides.
- `npsScore` -> promoter/passive/detractor breakdown over the window.
- `get_feedback_insights` and `get_feedback_items` -> feedback topics in window.
- `sessionReplayList` -> Session Replay activity, used for SR adoption grade.
- `agent_analytics_key_metrics` -> Agent Analytics prompts, used as upsell signal even if not entitled.

If any single Pendo call fails but others succeed, continue with what's available and note the gap in the report rather than failing the whole skill.

**Trend deltas:** For "unique visitor count" and similar metrics, also query the prior equivalent window (e.g. days 91-180 if window is 90 days) to compute the % change. The narrative needs the trend, not just the absolute number.

### Step 5: Pull CRE, contacts, EB, and opportunities

Three SFDC queries, runnable in parallel:

**CRE (Customer Risk Escalation):** First, check the SFDC schema — the exact object name varies by org. Likely candidates:
- A custom object `Customer_Risk_Escalation__c`
- A `Case` record type filtered by `RecordType.Name LIKE '%Risk%'` or `'%Escalation%'`
- A field on `Account` like `Customer_Health__c` or `Risk_Status__c`

Query `getObjectSchema` to find what exists. Pull the most recent open CRE record(s) for the account: status, severity, reason, owner, opened date, latest note. If none, explicitly note "no active CRE".

**Top contacts:**

```sql
SELECT Id, Name, Title, Email, Department, LastActivityDate
FROM Contact
WHERE AccountId = '{AccountId}' AND Email != null AND LastActivityDate != null
ORDER BY LastActivityDate DESC LIMIT 10
```

Take the top 5. Annotate where useful (e.g. a CPO is likely the EB, an Accounts Payable contact isn't).

**Opportunities and EB:**

```sql
SELECT Id, Name, Type, StageName, CloseDate,
       Amount, Renewed_ARR__c, SBQQ__Renewal__c,
       Economic_Buyer__c, Economic_Buyer__r.Name,
       Economic_Buyer__r.Title, Economic_Buyer__r.Email,
       Economic_Buyer_Notes__c, Owner.Name, IsClosed
FROM Opportunity
WHERE AccountId = '{AccountId}'
ORDER BY CloseDate DESC LIMIT 20
```

Extract: all open opps for the Renewal section, plus the most recent opp with a linked `Economic_Buyer__c` for the "Last EB" line. Compare against the current renewal opp's notes — if the notes name someone different from the linked EB, flag it.

### Step 6: Grade adoption per module

For each FY25 module the customer is entitled to, assign one of five adoption grades using the rubric below. Each grade must be backed by a specific data point (the "Evidence" column in the entitlement table).

| Module | Adoption signal | Heavy | Moderate | Light | Unused |
| --- | --- | --- | --- | --- | --- |
| Platform | MAU vs entitled cap | >50% util | 20-50% | <20% but >0 | 0 |
| Analytics | Active apps + tracked features | All apps active + features tracked | Some apps active | Apps installed, no events | Installed, 0 visitors |
| Guides Pro | Published guides + views | 10+ guides published + recent views | 3-10 guides, some views | 1-2 guides, low views | 0 published |
| Listen | Feedback items in window | 50+ items | 10-50 items | 1-10 items | 0 items |
| Sentiment | NPS responses in window | 100+ responses | 20-100 | 1-20 | 0 |
| Orchestrate | Workflow executions | High volume | Some executions | Configured, no runs | Not configured |
| Session Replay | SR MAU vs SR cap | >50% util | 20-50% | <20% but >0 | 0 |
| Agent Analytics | Prompts vs entitled cap | >30% util | 10-30% | <10% but >0 | 0 |
| Data Sync | Syncs configured + last run | Daily syncs running | Recent sync | Configured, no recent run | Not configured |

For modules **not** entitled, also check whether there's a usage signal (e.g. Agent prompts observed but no Agent Analytics SKU). If so, grade as **Signal** — these feed directly into the upsell section.

### Step 7: Generate the report

Use the template below. Fill every section. If a section has no data (e.g. no feedback topics), still produce the section and explicitly state the absence — silence is a finding.

Save to:

```
04_Accounts/Active/{Account_Name_Snake_Case}/Notes/{YYYY-MM-DD}-account-health.md
```

Create the active workstation folder (`04_Accounts/Active/{Account_Name}/`) and its `Notes/` subfolder if they don't exist. If a `CLAUDE.md` and `MEMORY.md` aren't already in the workstation folder, copy them from `04_Accounts/Active/_TEMPLATE/` so the workstation is properly initialised. The assumption: if the user is running a deep health on this account, it's worth keeping as an active workstation.

### Step 8: Surface the file and the headline

After saving, output a short chat summary: 3-5 bullets covering the overall health read, the single biggest module gap, the most material upsell play, and any commercial red flag (overdue close, missing EB, open CRE). Always include the computer:// link to the saved file. Don't repeat the full report inline — the file is the deliverable.

## Report template

Always use this exact structure. The headings are sentence case (per `00_Resources/voice-principles.md`). No emoji. No em dashes — use hyphens or rewrite. Australian English throughout.

```markdown
# Account health plus: {Account Name}

**Applications covered:** {comma-separated app names}
**Time window:** Last {N} days ({start date} to {end date})
**Generated:** {YYYY-MM-DD HH:MM AEST} from SFDC live + Pendo Sub IDs {comma-separated Pendo Sub IDs}
**ARR (account total):** {sum across active subs} | **Renewal date:** {earliest active renewal}

## Overall health

{3-5 sentence narrative covering: visitor trend, guide publish activity, NPS health, MAU pressure relative to entitlement, any open CRE, top commercial signal. Written so the reader gets the essential read in 30 seconds before a meeting.}

## 1. Engagement overview

- Unique visitors over the last {N} days: **{X}**, {up/down/flat} **{Y}%** vs prior equivalent period ({prev X})
- Top engaged visitors:
  - {Name 1} - {days active} days active
  - {Name 2} - {days active} days active
  - {Name 3} - {days active} days active
  - {Name 4} - {days active} days active
  - {Name 5} - {days active} days active
- Top features by unique visitors:
  - {Feature 1} - {N} unique visitors
  - {Feature 2} - {N} unique visitors
  - {Feature 3} - {N} unique visitors
- Top page visits by unique visitors:
  - {Page 1} - {N} unique visitors
  - {Page 2} - {N} unique visitors
  - {Page 3} - {N} unique visitors

{1-2 sentence interpretation tying visitor trend to feature usage breadth.}

## 2. Feature usage trends

- {Feature 1}: {N} unique visitors, {comparison to prior period}
- {Feature 2}: {N} unique visitors, {comparison to prior period}
- {Feature 3}: {N} unique visitors, {comparison to prior period}

{1-2 sentence read on whether usage is broadening or concentrating.}

## 3. Feedback, NPS and customer risk

### Customer Risk Escalation (CRE)
{Either:}
- **Status:** {Open / Watching / Resolved}
- **Severity:** {Critical / High / Medium / Low}
- **Reason:** {Adoption / Sentiment / Commercial / Product / Renewal}
- **Owner:** {Name}
- **Opened:** {date}
- **Latest note:** "{verbatim}"

{Or, if no open CRE:}
- No active CRE on this account.

### Feedback topics
{Top 3-5 feedback topics in window with volume, or "No feedback items collected in the last {N} days."}

### NPS
- Promoters: {N} | Passives: {N} | Detractors: {N} (total {N} responses)
- NPS score: {score} ({delta vs prior period})

{Or, if zero responses:} No NPS responses collected in the last {N} days. NPS guides published: {N}.

{1-2 sentence interpretation. Tie CRE + sentiment + feedback together where signals align (e.g. "Open CRE for adoption risk aligns with the visitor decline; NPS not being collected closes off the most direct sentiment signal").}

## 4. Current entitlements

**Pricing era:** {FY25 / Legacy / MAU-Only}
**FY25 bundle equivalent:** {Base Bundle / Core Bundle / Pulse Bundle / Ultimate Bundle / Modular}
**Visitor type:** {B2B / B2C / B2E / mixed}

| Module | Entitled | Adoption | Evidence |
| --- | --- | --- | --- |
| Platform | {tick/cross} | {Heavy/Moderate/Light/Unused/Signal/-} | {specific data point} |
| Analytics Module | {tick/cross} | {grade} | {data point} |
| Guides Module | {tick/cross} | {grade} | {data point} |
| Guides Pro Module | {tick/cross} | {grade} | {data point} |
| Listen Module | {tick/cross} | {grade} | {data point} |
| Sentiment Module | {tick/cross} | {grade} | {data point} |
| Orchestrate Module | {tick/cross} | {grade} | {data point} |
| Session Replay Module | {tick/cross} | {grade} | {data point} |
| Agent Analytics | {tick/cross} | {grade} | {data point} |
| Data Sync | {tick/cross} | {grade} | {data point} |

**MAU pools and utilisation:**
- {Type} - {Module}: {Used} / {Entitled} ({util%})
- ...

**Add-ons:** {SAML, API In/Out, HubSpot 2-way, Salesforce Integration, TAM tier, etc.}

{For legacy customers, add a "Legacy notes" line: "Customer is on {legacy package} contract. Equivalent FY25 modules are {Guides Pro, Analytics} - see crosswalk in pricing-packaging-mapping.md."}

## 5. Module gaps and upsell opportunities

Each row pairs a missing or under-sized module with a usage signal that justifies the play. Sized by impact.

1. **{Module}** - {Evidence-based rationale, 1-2 sentences}. Play: {one-line AE play}.
2. **{Module}** - {Evidence}. Play: {AE play}.
3. ...

Whitespace (modules not entitled with no usage signal) is listed separately at the end so the reader can distinguish "supported by evidence" from "blue sky":

- Whitespace: {comma-separated modules}

## 6. Renewal and commercial status

**Open opportunities:**
- {Opp name} - {Type} - {Owner} - Stage {N} - ATR {currency} - close {date}
- ...

**Last Economic Buyer on file:** {Contact name, title, email}, set on {opp name} ({date}, {Stage}).
**Current renewal EB notes:** "{verbatim from Economic_Buyer_Notes__c}" - {comment on whether this matches a real contact}.

**MEDDPICC red flags:**
- {Flag, e.g. "Stage 0 with close date within 30 days"}
- {Flag, e.g. "EB notes name 'Matt - CFO' but no Contact linked"}
- {Flag, e.g. "MAU 56% over entitlement, no expansion opp open"}

{1-2 sentence read on commercial risk.}

## 7. Top stakeholders

| Name | Title | Email | Last activity | Note |
| --- | --- | --- | --- | --- |
| {Name 1} | {Title} | {email} | {date} | {EB candidate / champion / etc.} |
| {Name 2} | {Title} | {email} | {date} | |
| {Name 3} | {Title} | {email} | {date} | |
| {Name 4} | {Title} | {email} | {date} | |
| {Name 5} | {Title} | {email} | {date} | |

## 8. Suggested discussion topics

Six topics maximum. Each is a single bullet that opens a conversation. Pull from all upstream sections - adoption (engagement, feature usage), commercial (renewal, EB), expansion (module gaps), risk (CRE, NPS):

- {Topic 1}
- {Topic 2}
- {Topic 3}
- {Topic 4}
- {Topic 5}
- {Topic 6}

---

*Generated by /account-health-plus on {date} from live SFDC + Pendo data. To refresh, rerun the skill.*
```

## Writing rules for the report

- Sentence case throughout. No Title Case for headings.
- Australian English (`utilisation` not `utilization`, `prioritise` not `prioritize`).
- No em dashes. Use hyphens or rewrite.
- No emoji.
- Concrete numbers over adjectives. "25,090 MAU vs 20k cap (125%)" beats "high MAU utilisation".
- Adoption grades and evidence must agree. If you grade Guides Pro as "Heavy", the evidence column must show what makes it heavy.
- Be explicit about absences. "No NPS responses in 90 days" is more useful than omitting the NPS section.

## Reference files

- `00_Resources/pricing-packaging-mapping.md` - mandatory read in Step 3. Defines the legacy-to-FY25 crosswalk. **Not shipped with the plugin** because it contains proprietary Pendo packaging detail; users source it from Chris or product ops and drop it into their workstation's `00_Resources/` folder. The skill fails fast (condition 5) if absent.
- `00_Resources/voice-principles.md` - check before generating prose sections (overall health, interpretations, discussion topics).
- `00_Resources/salesforce-fields.md` - SFDC field reference if any query field is unclear.

## Common edge cases

- **Multiple Pendo subs on one account:** Run the engagement pulls per sub, but consolidate the report. The "Applications covered" header lists the apps across all accessible subs. If some subs are dormant (0 MAU, last login >12 months), note them but don't pad the report with their empty data.
- **Account has FY25 subs and legacy subs simultaneously:** Rare but it happens during migration. Report both eras in the Entitlements section, with the FY25 sub as primary.
- **Pendo sub is installed but customer is in early days (low data volume):** Don't fail; produce the report with the data that exists and call out the early-days context in Overall Health.
- **CRE object doesn't exist in SFDC:** Note "CRE not tracked in this org's SFDC schema" in section 3 and move on. Don't fabricate.
- **Account has no open opportunities:** Section 6 still appears, says "No open opportunities" and surfaces the most recent closed-won renewal date as the de facto renewal anchor.

## Why this skill exists

The existing `/account-health` skill answers "how are they using Pendo?" Sales leaders also need to answer "what are they paying for, what aren't they using, what should we sell next, and is the renewal in trouble?" - and they need it in one document, not three. This skill fuses the two views so an AE walking into a customer call, a CS reviewing health, or a sales leader prepping a forecast call has a single canonical source.

The fail-fast on Pendo access is intentional: a report that says "MAU utilisation is high" without the underlying number is worse than no report. If we can't get the data, we say so rather than guess.
