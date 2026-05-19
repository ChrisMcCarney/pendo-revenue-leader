---
name: regenerate-pipeline
description: Rebuilds the full {user_region} pipeline from live Salesforce data, writes a dated snapshot, diffs against the previous day to surface changes, and updates Deal_Pipeline.md organised by fiscal quarter (current Q primary, next Q secondary). Triggers on "/regenerate-pipeline", "rebuild pipeline", "refresh pipeline", "update pipeline view", "what changed in the pipeline", "pipeline changes".
---

# Regenerate Pipeline

Pulls every open opportunity for all in-scope reps directly from Salesforce, writes a dated snapshot, diffs against the previous snapshot to detect changes, and produces a clean `08_Pipeline/Deal_Pipeline.md` that is **organised by fiscal quarter**. The user reads pipeline current-quarter first, next-quarter second (roughly 80/20), so the doc mirrors that view.

This skill does not make decisions. It reads, compares, and writes. {user_first_name} decides what to act on.

---

## Skill init: read config

Before doing anything else, read these config files:

1. `System/team.yaml`: load `direct_reports` and `region_peers`. The in-scope owner list for SOQL is the union of both groups, keyed by each entry's `sfdc_owner_name`. If `region_peers` is empty or absent, scope is `direct_reports` only.
2. `System/user-profile.yaml`: load `fiscal_year_start_month` (integer 1 to 12, default 2 if missing), `timezone`, `region`, `city`.
3. `System/pillars.yaml`: load pillar names (used only when surfacing coaching context in per-rep sections; do not hardcode pillar names anywhere in this skill).

Cache these in working memory for the run. Do not hardcode any rep name, fiscal month, region label, or pillar in this skill.

---

## Reps in scope

The owner list is the union of `direct_reports[].sfdc_owner_name` and `region_peers[].sfdc_owner_name` from `System/team.yaml`. Build a comma-separated quoted list at runtime for the SOQL `IN (...)` clause. Do not filter by rep page, go direct to SFDC.

---

## Quarter logic (fiscal)

Read `fiscal_year_start_month` from `System/user-profile.yaml`. Compute quarters from today's date in `{user_timezone}`:

- Q1 covers months `[start, start+1, start+2]`
- Q2 covers months `[start+3, start+4, start+5]`
- Q3 covers months `[start+6, start+7, start+8]`
- Q4 covers months `[start+9, start+10, start+11]`

Wrap month arithmetic modulo 12. If `fiscal_year_start_month > 1`, the fiscal year crosses a calendar boundary; in that case the fiscal year label `FY{N}` refers to the calendar year in which the fiscal year ends. Example: with start month 2, FY ending January of calendar year N is labelled `FY{N}` and runs from 1 Feb of calendar year `N-1` to 31 Jan of calendar year `N`. If `fiscal_year_start_month == 1`, the fiscal year matches the calendar year.

At runtime, derive:
- `current_q_label` (e.g. `Q2 FY{N}`)
- `current_q_start`, `current_q_end` (date range, inclusive)
- `next_q_label`, `next_q_start`, `next_q_end`

A deal's quarter bucket is determined by its `CloseDate`:
- **Current Q** if `current_q_start <= CloseDate <= current_q_end`
- **Next Q** if `next_q_start <= CloseDate <= next_q_end`
- **Later** if `CloseDate > next_q_end`
- **Past** if `CloseDate < current_q_start` (stale; surface in current Q with a past-due flag, these are deals that should have closed and slipped silently)

---

## Step 1: Pull live from Salesforce

Build the owner list dynamically from the cached team config (see "Skill init"). Use LIMIT 300 (headroom for growth).

```sql
SELECT Id, Name, StageName, CloseDate, Net_ARR__c, Current_ARR__c,
       SE_Risk_Level__c, SE_Notes__c, SE_Deal_Risk_Notes__c,
       Account.Name, Owner.Name, Type, IsClosed
FROM Opportunity
WHERE Owner.Name IN (<comma-separated quoted names from team.yaml>)
AND IsClosed = false
ORDER BY Owner.Name ASC, CloseDate ASC
LIMIT 300
```

Field mapping:
- **Net_ARR__c** = Net ARR. Primary deal value metric. Always use this.
- **Current_ARR__c** = ATV (Available to Renew). Use for renewals.
- **Amount** = TCV. Do not surface this.
- **SE_Risk_Level__c** = risk level (Red / Yellow / Green / null).

---

## Step 2: Write snapshot

Write today's results to `08_Pipeline/snapshots/YYYY-MM-DD.json` (date computed in `{user_timezone}`).

Format:

```json
{
  "generated": "YYYY-MM-DD",
  "fiscal_quarter": "<current_q_label>",
  "current_q_end": "YYYY-MM-DD",
  "next_q_end": "YYYY-MM-DD",
  "total_opps": 0,
  "opportunities": [
    {
      "id": "006...",
      "name": "Account - Type - Year",
      "account": "Account Name",
      "owner": "Owner Name",
      "stage": "2",
      "close_date": "YYYY-MM-DD",
      "net_arr": 0,
      "atv": null,
      "risk": "Yellow",
      "type": "New Subscription",
      "q_bucket": "current"
    }
  ]
}
```

`q_bucket` values: `"past"`, `"current"`, `"next"`, `"later"`. Compute from `close_date` against the fiscal quarter boundaries (see "Quarter logic" above).

Use `net_arr` for new business, `atv` for renewals (Type contains "Renewal" or "Renew"). Set `atv` from `Current_ARR__c`; set `net_arr` from `Net_ARR__c`. Both may be populated on the same record, include both.

Create the `08_Pipeline/snapshots/` directory if it doesn't exist. Overwrite if today's snapshot already exists (re-running the skill replaces, doesn't append).

---

## Step 3: Diff against previous snapshot

Find the most recent snapshot file before today in `08_Pipeline/snapshots/`. If none exists, skip the diff and note "First run, no previous snapshot to compare."

Compare by Opportunity Id. Detect the following changes:

| Change type | Severity | Condition |
| --- | --- | --- |
| Stage regression | Critical | StageName moved to a lower stage number |
| Deal dropped | Critical | Id present yesterday, absent today (IsClosed true or removed) |
| New Red risk | Critical | SE_Risk_Level__c changed to Red |
| Pushed out of current Q | Critical | Was in current Q yesterday, now in next Q or later |
| Stage advance | Notable | StageName moved to a higher stage number |
| Close date slip | Notable | CloseDate pushed out by 30 days or fewer (and stays in same quarter) |
| Pulled into current Q | Notable | Was next Q or later yesterday, now in current Q |
| ARR change > $20k | Notable | Net_ARR__c changed by more than $20,000 |
| Risk change (non-Red) | Notable | SE_Risk_Level__c changed but not to Red |
| New deal | Info | Id absent yesterday, present today (note the quarter bucket) |
| Close date pulled in | Info | CloseDate moved earlier, same quarter |

Write the diff to `08_Pipeline/changes/YYYY-MM-DD.md` using this format:

```markdown
# Pipeline changes, YYYY-MM-DD

*Compared against YYYY-MM-DD snapshot. N changes detected. Current quarter: <current_q_label>.*

## Critical

- **[Account]** (Owner) [Q<x>] Stage regressed from X to Y. Close: YYYY-MM-DD. Net ARR: $Xk.
- **[Account]** (Owner) [Q<x> to Q<y>] Pushed out of current quarter (was YYYY-MM-DD, now YYYY-MM-DD).

## Notable

- **[Account]** (Owner) [Q<x>] Stage advanced from X to Y. Close: YYYY-MM-DD. Net ARR: $Xk.
- **[Account]** (Owner) [Q<y> to Q<x>] Pulled into current quarter (was YYYY-MM-DD, now YYYY-MM-DD).

## Info

- **[Account]** (Owner) [Q<x>] New deal added. Stage 1. Close: YYYY-MM-DD. Net ARR: $Xk.

---
*No changes: [list any reps with zero changes]*
```

Quarter tag in each line is the **current** quarter bucket of the deal (or `Qx to Qy` for movements between buckets). If a movement crosses fiscal year (e.g. Q4 FY{N} to Q1 FY{N+1}), use the full label.

If there are zero changes across all categories, write: "No changes detected since YYYY-MM-DD."

---

## Step 4: Write Deal_Pipeline.md

Overwrite `08_Pipeline/Deal_Pipeline.md`. Per rep, split deals into three buckets driven by `q_bucket`:

1. **Current quarter** (full table), primary focus, always shown even if empty
2. **Next quarter** (full table), secondary focus, always shown even if empty
3. **Later** (one-line summary), `Later quarters: N deals, $Xk Net ARR, $Xk ATV` (omit the section if zero)

Past-dated deals (close date earlier than today and still open) appear at the **top of the current-quarter table** with a past-due marker on the close date column, these are slips that need attention.

Within each quarter table, sort by SE Risk (Red, Yellow, Green, Unknown), then `CloseDate` ascending.

For rep coaching context (MEDDPICC notes, development focus), read `05_People/Internal/{Rep}.md` if it exists. The rep page top-deals table is reference only; the snapshot is the source of truth.

Example layout (illustrative only; the literal quarter label is computed at runtime):

```markdown
# Deal pipeline

*Generated: YYYY-MM-DD HH:MM <tz>. Source: live Salesforce.*
*N total open opportunities across <N reps>. Current quarter: <current_q_label> (ends YYYY-MM-DD).*
*Previous snapshot: YYYY-MM-DD. Changes this run: N critical, N notable, N info.*

---

## <Rep Name> [Territory] | Quota: [from rep page if known]

### <current_q_label> (current, ends YYYY-MM-DD)

| Account | Type | Stage | CEP | Close | Net ARR | ATV | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account A | New | 3 | BizCase | YYYY-MM-DD | $108k | --- | Yellow |
| Account B | Renewal | 0 | Lead | past-due YYYY-MM-DD | --- | $67k | Unknown |

**Current Q: N deals | Net ARR: $Xk | ATV: $Xk**

### <next_q_label> (next, ends YYYY-MM-DD)

| Account | Type | Stage | CEP | Close | Net ARR | ATV | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account C | New | 2 | Eval | YYYY-MM-DD | $50k | --- | Green |

**Next Q: N deals | Net ARR: $Xk | ATV: $Xk**

### Later quarters

*Later quarters: N deals, $Xk Net ARR, $Xk ATV.*

---

## <Next Rep Name> ...

[repeat per rep]

---

## Region summary (current quarter)

| | Count | Net ARR | ATV |
| --- | --- | --- | --- |
| Total open | N | $XXXk | $XXXk |
| Red risk | N | $XXXk | $XXXk |
| Yellow risk | N | $XXXk | $XXXk |
| Green risk | N | $XXXk | $XXXk |
| Unknown risk | N | $XXXk | $XXXk |
| Closing within 30 days | N | $XXXk | $XXXk |
| Past-dated, still open | N | $XXXk | $XXXk |

*All region summary numbers are current-quarter only. For visibility into next Q and later, use the per-rep tables above.*

### Next quarter snapshot (reference)

*<next_q_label>: N deals, $Xk Net ARR, $Xk ATV.*

---

## Watch list (current Q, Red or past-dated)

| Account | Owner | Stage | Close | Net ARR | ATV | Flag |
| --- | --- | --- | --- | --- | --- | --- |

Watch list includes any current-quarter deal that is either Red risk or past its close date and still open.

---

## Action items for {user_first_name}

*Auto-generated. Clear before next run.*

[List from today's diff: critical items first, then notable. One line each. Tag each with its quarter.]
```

Risk markers: Red, Yellow, Green, Unknown (use text, not emojis).

Round all dollar amounts to nearest $k.

If a rep has zero current-Q and zero next-Q deals, write a one-liner: "{Rep} no open deals in current or next quarter." (Still show Later total if any.)

---

## Step 5: Confirm

Output a brief summary in chat:

```
Pipeline rebuilt. N open deals across <N reps>.
Current Q (<current_q_label>): N deals, $Xk Net ARR, $Xk ATV.
Next Q (<next_q_label>): N deals, $Xk Net ARR, $Xk ATV.
Later: N deals.
Changes vs [previous date]: N critical, N notable, N info.
```

If any critical changes exist, list them inline (one line each, with quarter tag).

If SFDC was unreachable:
> Warning: SFDC unavailable. Pipeline not updated. Re-run when Salesforce is reachable.

Never silently fall back to cached data.

---

## Reporting

When {user_first_name} asks to "report on the pipeline" or "what changed this week", read the `08_Pipeline/changes/` directory for the relevant date range and summarise. Do not re-query SFDC unless {user_first_name} explicitly asks for a fresh pull.

For a weekly summary, aggregate all change files from Mon to Fri and group by rep. Surface: net stage movements, deals added or dropped, close date slips, deals pulled into or pushed out of the current quarter, and any deals that moved to Red.

When {user_first_name} asks "how am I tracking for the quarter" without a fresh pull request, read the most recent `Deal_Pipeline.md` and answer from the current-Q section only.

---

## Editorial rules

- Australian English. No em dashes. No emojis. Sentence case headings.
- Dollar amounts rounded to nearest $k.
- Stage numbers shown as integers (1, 2, 3...) with CEP labels where known (2 = Eval, 3 = BizCase, 4 = TechWin).
- Quarter labels always in fiscal form computed at runtime (e.g. `Q2 FY{N}`), never `CY{N} Q2`.
- Do not editorialise. Facts and flags only. {user_first_name} reads the risk; the skill does not declare what to do about it.
- If a rep has zero open deals at all, write: "{Rep} no open deals in Salesforce."
