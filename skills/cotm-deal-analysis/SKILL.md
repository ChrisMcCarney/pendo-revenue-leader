---
name: cotm-deal-analysis
description: Produce a Pendo COTM Deal Analysis markdown brief for a single opportunity, using uploaded Gong call transcripts plus live Salesforce data. Use whenever the user asks to "build a COTM analysis", "run a COTM brief", "deal analysis for [account]", "MEDDPICC scorecard for [account]", "what's the COTM read on [account]", "give me the deal one-pager for [account]", or any similar request to inspect a single named opportunity through the Command of the Message + MEDDPICC lens. Trigger even on casual phrasings like "what's the state of [deal]" or "pull together the COTM doc for [deal]" when transcripts are provided or implied. The output is always a single `.md` file structured around the COTM framework (Mantra → Current State → Future State → Why Pendo & trap-setting → MEDDPICC scorecard → Recommended Next Actions → SFDC housekeeping) with customer quotes verbatim where they exist and inferences clearly labelled.
---

# COTM Deal Analysis

A focused, repeatable brief that turns a stack of Gong transcripts + a Salesforce opportunity into a single markdown file an AE or sales leader can read in five minutes before a call.

The shape mirrors the COTM Framework slide: Current State (Before + Negative Consequences) → Future State (After + PBOs) → the trap-setting moves that connect them to Pendo's differentiators. The output template (`references/output-template.md`) is the contract. Every section must exist in every brief, in the same order, with the same headings.

**The brief is a discovery audit.** Its job is not just to summarise the deal - it's to show the rep, section by section, where the COTM framework is well-populated and where it's thin. Every section either has rich customer evidence in it or has an explicit gap callout pointing to what's missing. The Recommended Next Actions at the bottom are then framed as moves to *close those framework gaps* on the next call.

**Length is calibrated to evidence depth, not capped.** Target ~700-900 words for a deal with multiple discovery calls. Shorter when evidence is thin. Longer is fine if the customer's actual words add colour the rep should hear in their head before the call - that colour is the point. What's *not* fine is padding with rep-summary prose. Every sentence must either be the customer's voice or change what the rep does next.

What changes between briefs is the evidence - and that evidence must come from the transcripts and from Salesforce, not from training knowledge or web search.

---

## When to trigger

Trigger when the user names a single account and either:
- attaches/uploads call transcripts (Gong export), OR
- asks for a COTM/MEDDPICC/deal analysis brief on that account.

If the user names an account but hasn't uploaded transcripts, **ask them to download from Gong first** (see "Getting transcripts from Gong" below). Don't try to substitute Granola or other sources - Gong transcripts are the source of truth for the customer's own words, and the customer's own words are what the brief is built on.

---

## Inputs

1. **Account / opportunity name** - required.
2. **Gong call transcripts (.txt or .vtt)** - required. Usually 2-6 files covering the deal cycle so far. The user uploads them.
3. **Salesforce opportunity** - pulled at runtime via the SFDC connector. Optional but strongly recommended; the SFDC housekeeping section can't be completed without it.

---

## Workflow

### Step 1 - Confirm inputs

Before doing anything else, run these checks in order. Don't proceed past a failed check - surface the gap to the user and wait.

**1a. Confirm the Salesforce Prod connector is enabled.**

The brief reconciles transcripts against the live opportunity in Salesforce and writes housekeeping items against the real custom field names. Without SFDC the output is degraded (no housekeeping section, no contradiction-check between transcript evidence and what's in the CRM).

Detect the SFDC tool at runtime: scan available MCP tools for one whose name contains `soqlQuery` (for example `mcp__claude_ai_Salesforce_Prod__soqlQuery`). This is the same runtime-detection pattern used by `avp-pipeline-review` and `regenerate-pipeline`. Probe by calling a cheap query against `Account` (or the matching `getUserInfo` if exposed) and watch for auth / connection errors. If the connector is reachable, continue to 1b. If it isn't, stop and give the user this instruction:

> Before I can run the full analysis I need the **Salesforce Prod connector** enabled. To turn it on:
>
> 1. Open the Cowork connectors panel (sidebar → **Connectors** or the plug icon).
> 2. Find **Salesforce Prod** in the list.
> 3. Click **Connect** and sign in with your Pendo SFDC credentials.
> 4. Tell me when it's done and I'll continue.
>
> If you'd rather proceed without SFDC, say so - I'll work from transcripts only and skip the housekeeping section.

Wait for either the connector to come online or the user's explicit OK to proceed in transcripts-only mode.

**1b. Confirm the account name.**

If the user wrote "build a COTM brief on Tyro", confirm: "Tyro Payments?" - many account names are ambiguous. Once SFDC is reachable, cross-check by running a quick account lookup so you have the canonical name.

**1c. Check for uploaded transcripts.**

Look in the current session's uploads directory (typically `mnt/uploads/` or the session-relative equivalent) for files matching `call-transcript-*` or `*Gong*` or that contain the account name. List what you found back to the user.

If no transcripts are uploaded, stop and ask for them. Use this exact instruction so the user has the click path:

> To run this analysis I need the Gong transcripts. To download them:
>
> 1. Navigate to Gong.
> 2. Use the search in the top right-hand corner to search for the account.
> 3. Click on **"Calls with Account"**.
> 4. For each relevant call, click on the three dots and download the transcript.
> 5. Upload the transcripts to this chat.
>
> Tell me when you're done.

Wait for the upload before continuing.

**1d. Identify the opportunity owner.**

Ask the user which rep owns the deal (or infer from CLAUDE.md / project context / SFDC `Owner.Name` if available). This matters because the brief is written *for* the owner - the action items are theirs.

### Step 2 - Read all transcripts in full

Read every uploaded transcript end-to-end. Don't sample. Don't skim the first 50 lines. The whole point of this skill is to surface exact customer quotes, the "shit fight" moments, the throwaway lines that contain the actual pain. You will miss them if you skim.

While reading, build a working notes file in the current working directory (e.g. `cotm-{account-slug}-notes.md`) and capture:

- **Customer participants** - name, title, role on calls. Especially: who shows up consistently (potential champion), who shows up once (information node), who never shows up (potential EB / blocker).
- **Direct customer quotes** that map to Before Scenarios, Negative Consequences, After Scenarios, PBOs, Requirements, or Success Criteria. **Use timestamps and the speaker's name** so quotes are traceable.
- **Pendo participants** - for tone matching and attributing internal commitments.
- **Numbers** the customer cited - drop-off rates, ticket volumes, contract values, headcount, timelines. These become Metrics.
- **Competitors named or implied** - what tool they use today, what they're evaluating, what they've considered building.
- **Decision process signals** - names of approvers, committee processes, internal frameworks (TPP, OKR cycles, planning cycles), procurement steps.
- **Compelling events** - anything tied to a date or a forcing function.
- **Champion behaviour** - did they brief anyone internally without being asked? Did they introduce other stakeholders? Did they describe themselves as an advocate?

Read `references/cotm-methodology.md` and `references/meddpicc-discipline.md` before writing the brief - they tell you exactly what counts as a Before Scenario vs a Negative Consequence vs a PBO, and what "Know" vs "Assume" means for each MEDDPICC letter. The brief is graded on that discipline.

### Step 3 - Pull live Salesforce data

If the SFDC SOQL tool detected in Step 1a is available:

1. Find the opportunity:
   ```
   soqlQuery: SELECT Id, Name, StageName, CloseDate, Net_ARR__c, Amount,
                     ForecastCategoryName, Owner.Name, Account.Name,
                     Account.Industry, NextStep, Management_Notes__c
              FROM Opportunity
              WHERE Account.Name LIKE '%{account}%' AND IsClosed = false
              ORDER BY LastModifiedDate DESC LIMIT 5
   ```
   If multiple match, list them to the user and ask which one. Don't guess.

2. Pull the MEDDPICC custom fields. Field names vary by org - use `getObjectSchema` on `Opportunity` first to find the actual API names, then SOQL for them. Look for fields like `Champion_Identified__c`, `Champion_Notes__c`, `Economic_Buyer_Notes__c`, `Metrics__c`, `Before_Scenarios__c`, `After_Scenarios__c`, `Decision_Process_Actual__c`, `Competition_Notes__c`, `Identified_Pain__c`, `Paper_Process__c`. Capture whatever the org actually has.

3. Note any field where SFDC contradicts what the transcripts show - these become **SFDC housekeeping** items. (In the Tyro example: SFDC `Champion_Identified__c` was set to No, but Peter had been actively advocating across four calls. That contradiction was called out.)

If the SFDC connector isn't available, skip this step and note in the brief that SFDC was not reconciled.

### Step 4 - Compose the brief

Open `references/output-template.md` and follow it section by section. The template is the contract - every heading and subheading must be present. Fill each section from your notes and SFDC pull, applying these discipline rules:

1. **Use customer quotes verbatim** wherever you have them. Format: `"quote" - Speaker, MMM DD` or with timestamp. The Mantra and the Current/Future State sections depend on this - they read as hollow when paraphrased.

2. **Label inferred content explicitly.** When you don't have a customer quote and you're inferring from context (e.g. inferring an EB based on title hierarchy, or inferring competitive pressure from what was unsaid), prepend the inference with `[INFERRED]` so the reader can audit it. Don't smuggle inferences in as facts. Example:

   > ✅ Confirmed: Peter described himself as "advocate" (May 15 call).
   > [INFERRED] Steen Andersson is likely the EB based on title and Peter's Mar 27 briefing, but no direct Pendo conversation has occurred - needs confirmation.

3. **The Mantra phrasing is verbatim.** Use the exact COTM phrasing pattern - don't compress it. The pattern, with no abbreviations:

   > "What I hear you saying, [Account], is that the positive business outcomes you're trying to achieve are [PBOs in the customer's own language - multiple PBOs, expressed as the customer would express them].
   >
   > In order to achieve that, you need [Required Capabilities in the customer's language - multiple capabilities, descriptive enough to feel real].
   >
   > And you'll measure these using [Success Criteria - specific KPIs with timeframes. Use [TBC - agree on {next call date}] if not confirmed]."

   Don't write "the outcomes you're after are X. To get there you need Y." That collapses the rhythm. The full phrasing is how reps deliver this in a meeting - the brief is their script.

4. **Current State and Future State use real customer language.** Bullet form, but the bullets capture the customer's actual phrasing - colour, emotion, the specific words that make the rep *feel* the challenge before they walk into the next call. Target ~15-30 words per bullet. Always attribute quotes (speaker, date). If a section is sparse because the transcripts don't contain that evidence, **don't pad with rep summary** - leave the bullet list short and add an explicit gap callout (see point 7 below).

5. **Why Pendo & trap-setting.** This section turns the framework into action. Pick the **1-3 differentiators** from `references/pendo-differentiators.md` that map to the customer's stated pain. For each one, name the trap (the requirement we want the customer to articulate themselves), provide the specific close-trap question, and **point to the Pendo feature(s) or use cases** that would be in scope if the trap closes (this gives the rep richer ICP-aligned context for the demo or POC scoping conversation that follows). Don't list all seven differentiators - that's a feature dump.

6. **MEDDPICC status indicators.** Use `✅` (Know - backed by evidence), `⚠️` (Partial - some evidence, gap remains), `❌` (Assume / Blank - no evidence). Apply the Know vs Assume test from `references/meddpicc-discipline.md` strictly. If the answer is "we think" or "probably", that's `⚠️` at best.

7. **Gap callouts inside sections.** When a section has missing or thin evidence - e.g. Current State has Before Scenarios but no quantified Negative Consequences, or Future State has PBOs but no After Scenarios - add a one-line gap callout *inside that section* using this format:

   > **Gap to close:** Negative Consequences are shallow - Peter named the problems but didn't quantify their cost. Surface dollar / time / customer impact on next call.

   The brief is a discovery audit. Gaps inside sections are a feature, not a failure. They make the next call's discovery agenda obvious.

8. **Recommended Next Actions - framed as COTM framework gaps to close.** This is the takeaway. Pull from the gap callouts above + MEDDPICC ⚠️/❌ rows and reframe each as a discovery move tied to a specific COTM element. The format that lands:

   > 1. **Negative Consequences are shallow.** On 20 May reset demo, ask Peter: "What's the cost of the 82% drop-off in dollars or merchant lifetime value? What does that translate to over a year?" Goal: quantify pain in EB language before the TPP submission.

   Each action: which COTM element is underdeveloped + the specific question or move + who + when. Maximum 5 actions. Order by impact on this quarter's close. Bad: "Follow up with Peter." Good: see the example above.

9. **SFDC housekeeping** - list the exact fields that need updating after the next call and what to populate them with, drawing from the gaps SFDC has vs what you learned from transcripts. Use the API names from the schema lookup. Keep to one line per field. Avoid commercial / pricing framing (deal sizing is a gut call, not part of the brief).

### Step 5 - Write the full brief

Save using the plugin's per-account artifact convention (same pattern as `company-research` and `strategy-map-research`):

1. If a workstation exists with an active account folder for this deal, save to `04_Accounts/Active/{account}/Resources/{YYYY-MM-DD}-cotm-brief.md`.
2. Otherwise, fall back to `01_Inbox/{YYYY-MM-DD}-{account-slug}-cotm-brief.md`.

`present_files` works from either location.

### Step 6 - Write the 3 Whys companion card

The full brief is the rep's pre-call prep document - 700-2000 words, designed to be read once carefully. The 3 Whys card is the rep's *in-call* artifact - a tight one-screen distillation in the format the AD will actually rehearse the conversation around.

Generate a second file using `references/three-whys-card-template.md`, saved alongside the main brief: either `04_Accounts/Active/{account}/Resources/{YYYY-MM-DD}-cotm-3whys.md` or `01_Inbox/{YYYY-MM-DD}-{account-slug}-cotm-3whys.md`. The card is ~250-350 words. Structure:

- **Why anything?** - one paragraph distilling the Current State pain. Uses 1-2 of the most powerful customer quotes verbatim. Names the cost of doing nothing in one line.
- **Why now?** - one paragraph naming the compelling event with a date or deadline.
- **Why Pendo?** - one paragraph naming the 1-2 lead differentiators and the close-trap question for each.
- **The one move on next call** - a single, named-person + specific-question + date sentence. The thing the AD will write on a sticky note before walking in.

Save the card alongside the brief. Both files get presented together - the brief for prep, the card for the meeting.

### Step 7 - Present both files

1. Call `present_files` with both the full brief AND the 3 Whys card so the user can open or download either.
2. If `present_files` isn't available, give `computer://` links for both.
3. Finish with a one-sentence summary: deal stage, headline gap, and the single most important next action. Nothing more.

**Other companion formats.** If the user explicitly asks for a slide (.pptx), an HTML one-pager, or a Slack-ready block, build it from the 3 Whys card content - that's already the tight, presentable form. For pptx, route through the `pptx` skill and use the `pendo-design` skill for branding if it's available.

---

## Voice and formatting

This brief is **internal AE/SE-facing**. Mode 2 (internal email) tone: direct, conversational, structured but not formal. Australian English. No em dashes (use ` - ` or rewrite). No emoji except the MEDDPICC status icons (`✅` `⚠️` `❌`) and section markers borrowed from the Tyro template. Sentence case headings.

The reader is the deal owner. Write *for* them. Don't explain what MEDDPICC is. Don't explain what a Mantra is. Don't add "Executive Summary" sections - the Mantra IS the summary.

---

## What not to do

- Don't substitute Granola, Slack, or web research for missing Gong transcripts. The customer's own words are the foundation; without them, you don't have a brief - you have a guess.
- Don't write a Mantra the customer hasn't earned. If the transcripts don't contain confirmed PBOs, Requirements, AND Success Criteria, write the Mantra section with explicit `[TBC]` placeholders for the missing parts and call them out as the next discovery target. Half a Mantra is honest. A fabricated full Mantra is dangerous.
- Don't grade MEDDPICC generously. The discipline only works if `⚠️` and `❌` outnumber `✅` early in a deal. A brief with seven green checks on a Stage 1 deal is a signal you're confirming hypotheses instead of testing them.
- **Don't pad with rep-summary prose.** The brief is calibrated to evidence depth (~700-900 words for a multi-call deal, shorter when evidence is thin). Length isn't capped - but every sentence must either be the customer's voice or change what the rep does next. If you can't cite the transcript or name a specific next move, cut.
- Don't write a "Why now?" header. The compelling event lives inside Negative Consequences or Recommended Next Actions, not in its own section.
- Don't list all seven differentiators. Pick the 1-3 that the customer's stated pain maps to. The trap-setting section is for action, not coverage.
- **Don't include commercial framing** - pricing, seat counts, deal sizing, phased pricing, MAU bands. Deal sizing is a gut decision, not part of the COTM brief. If you find yourself writing about Phase 1 ARR, you've drifted into proposal-writing.
- Don't smooth over thin sections. If Negative Consequences is empty because the customer never quantified pain, write the explicit gap callout - that's the most valuable thing the brief can do. Smoothing it over with rep-paraphrased pain is the worst failure mode.

---

## References

- `references/output-template.md` - the exact markdown shape the full brief must follow.
- `references/three-whys-card-template.md` - the tight companion card written alongside the full brief, in 3 Whys format for the AD's in-call use.
- `references/cotm-methodology.md` - Before/After, NC/PBO, Requirements/Success Criteria, the Mantra, what counts and what doesn't.
- `references/meddpicc-discipline.md` - Know vs Assume, the question each letter answers, contact type comparisons (Champion vs Coach vs Fan, EB vs Authorizer vs Influencer).
- `references/pendo-differentiators.md` - the seven Pendo differentiators with **the trap-setting questions for each** (set topic / open trap / close trap) and a pain-to-differentiator lookup table.
- `references/sfdc-fields.md` - Salesforce field names to look up at runtime, and the housekeeping mapping (what evidence updates which field).
