---
name: account-health-plus
description: Produce a unified Account Health + Entitlements brief for any Pendo customer. Combines the existing /account-health style engagement, feature usage, NPS, feedback and CRE report with a normalised FY25 module entitlement view, adoption grading per module, module-gap upsell plays grounded in usage signals, renewal status with EB and MEDDPICC red flags, and a top-stakeholders list from SFDC. Trigger this whenever the user says "/account-health-plus", "account health plus for {name}", "deep health on {name}", "full account brief for {name}", "renewal prep for {name}", "QBR prep for {name}", or any request to deeply analyse a single named Pendo customer for adoption, expansion or renewal. Use even on casual phrasings like "what's going on with {account}" or "give me the lowdown on {account}" when context implies a customer account. The output is always a markdown brief saved to 04_Accounts/Active/{Name}/Notes/{YYYY-MM-DD}-account-health.md, with the active workstation folder created if it doesn't exist.
---

# Account Health Plus

A unified pre-call, renewal-prep, or QBR brief for any Pendo customer. The skill assumes the reader will walk into a meeting with the customer within 24 hours and needs the essential read in one document: usage, sentiment, risk, entitlement, commercial status, stakeholders, and the next-conversation prompts.

The scope is entirely the customer's use of the Pendo application. The usage signal comes from **pendo-internal** (the subscription that tracks Pendo's own product, app.pendo.io). Each Pendo customer appears in pendo-internal as an account whose visitors are their employees logging in to administer guides, analytics, surveys, and so on. Pendo employees (sellers, SEs, CS) almost always have access to pendo-internal, which is why this skill anchors its usage view there. End-user metrics on the customer's own product (guide views by end users, NPS responses they answered, feedback they submitted, session replays) are out of scope. The brief covers how the customer's team uses Pendo, not how their end users use their product.

The shape extends the existing `/account-health` style report (engagement, feature usage, NPS, feedback, CRE, suggested topics) with three sections that turn it from a status doc into an action doc: a normalised FY25 entitlement view, module-gap upsell plays grounded in real usage signals, and a commercial / MEDDPICC read.

## Inputs

- **Account name** (required). Free text, e.g. "ecoPortal", "Travel CTM", "Simpro". Use SFDC `LIKE` matching for flexibility. If multiple accounts match, present a numbered list and ask the user which.
- **Time window** (optional, default 90 days). Used for all usage and feedback queries. Common values: 30, 60, 90, 180.

## Fail-fast conditions

Stop early and surface a clear error if any of these are true. Do not produce a partial report:

1. Account name resolves to zero or more than one account after disambiguation.
2. Account has no `Subscription__c` records that are `Installed__c = true` and not disabled.
3. SFDC connector is unreachable.
4. `00_Resources/pricing-packaging-mapping.md` is missing from the workstation. This file is the legacy-to-FY25 crosswalk and is required for Step 3. If absent, surface: `This skill requires 00_Resources/pricing-packaging-mapping.md in your workstation (the legacy-to-FY25 packaging crosswalk). Drop the file in and re-run, or ask Chris where the latest version lives.` and stop.
5. Pendo MCP access is blocked. The account cannot be found in pendo-internal by SFDC name. Surface: `The account doesn't appear in pendo-internal by SFDC name - I can't produce a Pendo usage view.` and stop.

The skill exists to fuse usage data with commercial data. Without Pendo data the result would be misleading.

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

### Step 4: Pull Pendo usage from pendo-internal

Pendo usage data for this skill comes exclusively from pendo-internal (subId `5668600916475904`), the subscription that tracks Pendo's own product (app.pendo.io). Each Pendo customer appears here as an account whose visitors are the customer's employees administering Pendo (configuring guides, viewing analytics, etc.). This is the strongest signal of which Pendo modules are real vs. paid-but-unused, and it's almost always accessible to Pendo employees. Customer-owned Pendo subscriptions are out of scope: the brief intentionally does not query end-user data from the customer's own product.

1. Resolve the Pendo account ID(s) for this SFDC customer:

   ```
   accountQuery(
     subId="5668600916475904",
     metadataFilter={
       "metadata.salesforce.account_name__c": "{Account Name}"
     }
   )
   ```

   This returns zero, one, or several Pendo account IDs (e.g. `["Tradiecore", "Tradiecore1"]`). Cross-instance customers commonly have more than one. If zero results, stop with fail-fast condition 5.

2. For each matched Pendo account ID, in parallel:

   **a) Full account metadata** via accountQuery select clause (or accountMetadata if available):

   ```
   da_visitors30, da_visitors90,
   da_events30, da_events90,
   da_apps, da_activeapps,
   publishedguidescount, draftguidescount, disabledguidescount, stagedguidescount,
   npsguidespublished, publishednpscount, publishedcsatcount,
   da_pricing_model, da_subscriptiontype, da_visitor_type,
   da_percentmauutilized,
   da_guideevents30, da_guideviews30,
   da_agent_total_conversations_30, da_agent_total_prompts_30, da_agent_num_agents,
   featurescount, pagescount, tracktypescount, sentimentsurveycount,
   da_featurespagesproductareahealth,
   salesforce.customer_health_2_0__c,
   auto.lastvisit
   ```

   **b) Employee visitor list:**

   ```
   visitorQuery(
     metadataFilter={"metadata.auto.accountid": "{Pendo Account ID}"},
     select=[
       "agent.email", "agent.full_name", "agent.role",
       "salesforce.title",
       "auto.firstvisit", "auto.lastvisit"
     ]
   )
   ```

   Use this to rank the customer's employees by recency and identify role-tagged users (Data Analyst, PM, CS, etc.). The heaviest individual user is a coaching/champion signal.

   **c) Top features the customer's employees use:**

   ```
   activityQuery(
     entityType="feature",
     accountId="{Pendo Account ID}",
     group=["featureId"],
     sort=["-uniqueVisitorCount"],
     limit=15,
     dateRange={range:"relative", lastNDays:90}
   )
   ```

   Mentally group results by area: Analytics features (Reports, Dashboards, Track Events, Funnels, Retention, Paths), Guides features (Guide Studio, Guide List, Guide Analytics), Settings (Apps, Pages, Features, Track Events config), Nav (page navigations).

   **d) Top pages employees visit:**

   ```
   activityQuery(
     entityType="page",
     accountId="{Pendo Account ID}",
     group=["pageId"],
     sort=["-numEvents"],
     limit=15,
     dateRange={range:"relative", lastNDays:90}
   )
   ```

   **e) Top visitors by activity:**

   ```
   activityQuery(
     entityType="visitor",
     accountId="{Pendo Account ID}",
     group=["visitorId"],
     sort=["-numEvents"],
     limit=15,
     dateRange={range:"relative", lastNDays:90}
   )
   ```

   **f) Customer's NPS and feedback to Pendo:**

   The pendo-internal subscription runs Pendo's own NPS and Listen programmes against its customers. These calls capture what THIS customer's employees have said about Pendo - in scope because the responses live in pendo-internal, not in the customer's own product.

   - `npsScore` on subId `5668600916475904`, scoped to the customer's Pendo account ID. Returns promoter/passive/detractor breakdown and score for the window. Compare against the prior equivalent window to compute the delta.
   - `get_feedback_items` on subId `5668600916475904`, scoped to the customer's Pendo account ID. Returns the verbatim feedback the customer's employees have submitted about Pendo over the window.
   - `get_feedback_insights` for thematic grouping where available.

   Scoping is by visitor metadata (typically `auto.accountid = {Pendo Account ID}`). If the Pendo MCP signature requires a different filter shape, pull the raw responses and filter by visitor account ID post-hoc. The key constraint: these calls are always against pendo-internal (subId `5668600916475904`), never against the customer's own sub.

If the customer has multiple Pendo account IDs (e.g. multiple instances), report each separately in the Engagement section. Do not silently merge.

#### Fail-fast at the end of Step 4

If the pendo-internal `accountQuery` returns no matching Pendo account ID, stop with fail-fast condition 5 above.

#### Trend deltas

For visitor counts and similar metrics, query the prior equivalent window (e.g. days 91-180 if window is 90 days) to compute the % change. The narrative needs the trend, not just the absolute number. Apply this to pendo-internal employee counts and the synced end-user counters (`da_visitors30/90`, `da_events30/90`) that ride on pendo-internal's account metadata.

#### Partial failures

If any single Pendo call fails but others succeed, continue with what's available and note the gap in the relevant report section rather than failing the whole skill.

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

For each FY25 module the customer is entitled to, assign one of five adoption grades. The strongest evidence is **which Pendo features the customer's employees actually use** in pendo-internal (Step 4a, top features list). Each grade must cite a specific data point in the "Evidence" column.

**Default rubric (feature-usage based, pendo-internal):**

- **Heavy**: the module's core admin features appear in the employee top 10, with multiple users hitting them.
- **Moderate**: the module's features appear in the employee top 15, with 5+ users.
- **Light**: module entitled, MAU counts visitors, but no module-specific features in the employee top 30.
- **Unused**: module entitled but no admin activity in pendo-internal AND no published artefacts (guides, surveys) AND no MAU.

Module-to-feature-area mapping for the top-features signal:

| Module | Heaviest signal in pendo-internal employee feature list |
| --- | --- |
| Platform | Apps, Pages, Features, Track Events config (Settings area) |
| Analytics Module | Reports, Dashboards, Funnels, Retention, Paths, Track Event views |
| Guides Module | Guide Studio open/edit, Guide List views, basic Guide Analytics |
| Guides Pro Module | Multi-step guide builds, Guide Targeting, Workflow Studio, Mobile Guide Studio |
| Listen Module | Feedback admin pages, Feedback insights |
| Sentiment Module | NPS admin, CSAT admin, Sentiment dashboards |
| Orchestrate Module | Workflow Studio, Orchestrate dashboards |
| Session Replay Module | Session Replay admin, replay search |
| Agent Analytics | Agent Analytics dashboards (only available where entitled) |
| Data Sync | Data Sync configuration pages, integration setup |

MAU figures from `Subscription__c` (Step 2) are billing/entitlement reference only and surface in Section 4's "MAU pools and utilisation" line. They are not used to grade adoption: a customer can be at 90% MAU with zero admin engagement, in which case the Pendo value isn't being captured even though the meter is full.

For modules **not** entitled, also check whether there's a usage signal in the pendo-internal employee feature list (e.g. heavy Workflow Studio feature use without Orchestrate entitlement). If so, grade as **Signal** — these feed directly into the upsell section.

**Surface the "data analyst" headline.** If the customer has a tagged Data Analyst or Analytics Lead role (Step 4a employee visitor list with `salesforce.title` like Data Analyst, Analytics Manager, Insights Lead) and that person has low days-active or hasn't logged in recently, name it explicitly. This is the canonical Mixpanel-vs-Pendo signal: when the people who *should* be in the analytics module aren't, the module's value is at risk.

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

### Admin-side activity ({Customer Name} employees using Pendo)

Source: pendo-internal, Pendo account ID(s) {comma-separated IDs}.

- Unique employee visitors over the last {N} days: **{X}**, {up/down/flat} **{Y}%** vs prior equivalent period ({prev X})
- Top engaged employees:
  - {Name 1} - {title if known} - {days active} days active, last visit {date}
  - {Name 2} - {title} - {days active} days active, last visit {date}
  - {Name 3} - {title} - {days active} days active
  - {Name 4} - {title} - {days active} days active
  - {Name 5} - {title} - {days active} days active

{1-2 sentences interpreting WHO is using Pendo: role concentration, missing roles, single-points-of-failure. Name the data analyst / analytics lead status explicitly if surfaced.}

### Synced end-user counters (pendo-internal metadata)

Billing/entitlement reference only - shown so the reader can see MAU pressure against the contract. Not used as adoption evidence; the admin-side activity above is the canonical usage signal.

Source: pendo-internal account metadata.

- da_visitors30: **{X}**
- da_visitors90: **{X}**
- da_events30: {X}
- da_events90: {X}
- da_apps total / active: {X} / {X}
- Observation freshness (auto.lastvisit): {date} ({N} days ago)

## 2. Pendo modules employees actually use

Source: pendo-internal, top features the customer's employees touched in the last {N} days.

This is the strongest single signal of which modules are real vs paid-but-unused. Grouped mentally by area:

**Analytics features:**
- {Feature} - {N} unique users, {numEvents} events

**Guides features:**
- {Feature} - {N} unique users, {numEvents} events

**Settings / configuration features:**
- {Feature} - {N} unique users, {numEvents} events

**Other (Nav, profile, etc.):**
- {Feature} - {N} unique users, {numEvents} events

{2-3 sentences on the read: where attention is concentrating, where it's absent, and the data-analyst headline. If a customer's analytics lead is barely active in Analytics features, name it; that's the canonical signal that the analytics module value isn't being captured.}

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

### Customer's NPS of Pendo

What this customer's employees have scored Pendo in the window. Sourced from pendo-internal (Pendo's own NPS programme), scoped to the customer's Pendo account ID.

- Promoters: {N} | Passives: {N} | Detractors: {N} (total {N} responses)
- NPS score: {score} ({delta vs prior period})

{Or, if zero responses:} No NPS responses from this customer's employees in the last {N} days.

### Customer's feedback to Pendo

Verbatim feedback the customer's employees have submitted about Pendo. Sourced from pendo-internal Listen, scoped to the customer's Pendo account ID.

{Top 3-5 feedback themes in window with volume and a representative verbatim, or "No feedback submitted in the last {N} days."}

### Listen module usage (customer's own Listen programme)

Whether the customer is using Pendo's Listen module to capture feedback inside their own product. Distinct from the section above (which is the customer's feedback to Pendo).

- Listen admin features in employee top-features list: {yes/no, with feature names if yes}
- Last admin engagement with Listen: {date or "no engagement in window"}

{1 sentence: if Listen is entitled and no admin features appear, the module is paid-but-unused.}

### Sentiment module usage (customer's own Sentiment programme)

Whether the customer is using Pendo's Sentiment module (NPS, CSAT) to ask their own users. Distinct from "Customer's NPS of Pendo" above.

- NPS surveys published: {publishednpscount from pendo-internal metadata}
- CSAT surveys published: {publishedcsatcount from pendo-internal metadata}
- Sentiment admin features in employee top-features list: {yes/no}

{1 sentence interpretation. If both counts are zero, that is the finding: the Sentiment module is entitled but the customer isn't running a sentiment programme.}

{1-2 sentence joint interpretation. Tie CRE + the customer's own NPS of Pendo + their use of Listen/Sentiment modules together where signals align (e.g. "Open CRE for adoption risk aligns with three detractor responses and no Sentiment activity in the window").}

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

*Generated by /account-health-plus on {date} from live SFDC + Pendo MCP via pendo-internal cross-account lookup. Scope is the customer's use of Pendo only; end-user metrics on the customer's own product are intentionally out of scope. To refresh, rerun the skill.*
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

- `00_Resources/pricing-packaging-mapping.md` - mandatory read in Step 3. Defines the legacy-to-FY25 crosswalk. Ships with the plugin as of v0.6.5 and is written into the workstation by `/setup` (and backfilled by `/update`). The skill still fails fast (condition 4) if absent — for example if a user deleted the file or installed an older plugin version that predates v0.6.5.
- `00_Resources/voice-principles.md` - check before generating prose sections (overall health, interpretations, discussion topics).
- `00_Resources/salesforce-fields.md` - SFDC field reference if any query field is unclear.

## Common edge cases

- **Multiple Pendo subs on one account:** Run the engagement pulls per sub, but consolidate the report. The "Applications covered" header lists the apps across all accessible subs. If some subs are dormant (0 MAU, last login >12 months), note them but don't pad the report with their empty data.
- **Account has FY25 subs and legacy subs simultaneously:** Rare but it happens during migration. Report both eras in the Entitlements section, with the FY25 sub as primary.
- **Pendo sub is installed but customer is in early days (low data volume):** Don't fail; produce the report with the data that exists and call out the early-days context in Overall Health.
- **CRE object doesn't exist in SFDC:** Note "CRE not tracked in this org's SFDC schema" in section 3 and move on. Don't fabricate.
- **Account has no open opportunities:** Section 6 still appears, says "No open opportunities" and surfaces the most recent closed-won renewal date as the de facto renewal anchor.
- **Customer has multiple Pendo account IDs in pendo-internal** (e.g. `Tradiecore` and `Tradiecore1`, separate instances). Report each Pendo account ID separately in Section 1 admin-side activity. Do not silently merge employee lists, feature usage, or visitor counts; separate instances often have different operating teams and adoption levels.

## Why this skill exists

The existing `/account-health` skill answers "how are they using Pendo?" Sales leaders also need to answer "what are they paying for, what aren't they using, what should we sell next, and is the renewal in trouble?" - and they need it in one document, not three. This skill fuses the two views so an AE walking into a customer call, a CS reviewing health, or a sales leader prepping a forecast call has a single canonical source.

The fail-fast on pendo-internal access is intentional: if we can't see how the customer's team uses Pendo, we stop rather than guess at adoption. The scope is deliberately narrow - the customer's use of Pendo, not their end users' use of their own product - so the brief stays honest about what it can and can't tell you.
