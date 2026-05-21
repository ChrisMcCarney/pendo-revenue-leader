---
name: avp-pipeline-review
description: "Builds a live, weekly AVP or RVP pipeline review artifact connected to Salesforce. Generates weighted floor / forecast / upside math (100 / 80 / 25%), MEDDPICC gap detection, per-rep risk signals, copyable plain-text team reports, and an educated edge call that discounts deals with multiple risk flags. Triggers on /avp-pipeline-review, pipeline review, forecast tracker, deal review dashboard, weekly pipeline call prep, Salesforce opportunity review with MEDDPICC scoring, floor/forecast/upside, educated edge call, pipeline health, rep-level deal review."
---

# AVP pipeline review

**Brand inheritance is mandatory.** The rendered HTML dashboard must follow the Pendo FY27 brand via the `pendo-design` skill. Before generating the artifact:

1. Read the `pendo-design` skill's `SKILL.md`, `README.md`, and `BRAND.md` for the non-negotiable rules (Pank `#FF4876` as accent only, Sora Bold for display, Inter for body, sentence case headings, no emoji, radial gradients on edges, rounded card corners 12-16px, fixed logo placement).
2. Link or inline the `pendo-design` skill's `colors_and_type.css` in the artifact so the dashboard's CSS variables match the brand tokens exactly.
3. Tab labels are sentence case, no emojis. Pink (`#FF4876`) is reserved for risk-flag chips, the educated-edge delta, the active-tab indicator, and stat numerals only - never as a card background for body content. Risk flag chip backgrounds may use the pink-scale tints (P1-P3 from the brand spec).
4. Use the brand's icon vocabulary for any visual markers: pink chevron, lightning bolt, pink check, pink arrow, number circle, pill or badge. No emoji and no unicode decorations (`★`, `◆`, `●`).

The artifact template in `assets/artifact-template.html` must already include these styles. If it does not, fix the template before invoking the skill.

---

## What this skill creates

This skill creates a live Cowork artifact that pulls Salesforce opportunity data on demand and renders a full pipeline review dashboard with:

- Weighted math call: 100% Commit plus 80% Forecast plus 25% Upside (deals ≥ the leader-set Net ARR floor, default A$75k; configurable per team in AVP mode).
- MEDDPICC gap detection with per-field highlighting.
- Risk flags per deal: excessive pushes, close-date proximity, MEDDPICC gaps, missing next steps.
- Educated edge call: math call minus a 50% haircut on deals with two or more risk flags.
- Per-team copyable plain-text (account-grouped, paste-ready for Slack or email).
- AVP rollup tab with combined edge call and risk narrative.
- Methodology tab that explains the math, the risk flags, the MEDDPICC field mapping, the scope and data source, and what the dashboard is not. This tab is static (no SFDC dependency) so a viewer can always see how the numbers were computed.

The skill works in two modes:

- **RVP mode (default):** reads `System/team.yaml` and treats `direct_reports` as the single team to review.
- **AVP mode:** if `System/avp-teams.yaml` exists, reads multiple teams from it and renders one tab per team plus an AVP rollup. See "Multi-team config" near the bottom of this skill.

---

## Config to load at skill init

Read at runtime, never hardcode:

- `System/user-profile.yaml`: `name`, `role`, `region`, `timezone`, `fiscal_year_start_month`. Drives artifact title, quarter labels, and rollup branding.
- `System/team.yaml`: `direct_reports`, `region_peers`, `manager`. RVP mode uses `direct_reports` as the reviewed team.
- `System/avp-teams.yaml` (optional): if present, switch to AVP mode.

---

## Step 1. Detect the Salesforce SOQL tool

Before asking the user anything, scan available MCP tools for one whose name contains `soqlQuery`. Note the exact full tool name (for example `mcp__claude_ai_Salesforce_Prod__soqlQuery`). The artifact's JavaScript hardcodes this string so the rendered dashboard can call SFDC at view time.

If no SOQL tool is available, tell the user verbatim:

`Salesforce is not connected in your Cowork instance. Open Settings then Connectors, enable the Salesforce connector, then come back and I will build your pipeline review.`

Do not proceed.

---

## Step 2. Resolve team configuration from project files

The original version of this skill prompted the user for team config. In this plugin we read it from disk instead so the wizard ran by `/setup` is the single source of truth.

**Procedure:**

1. Read `System/user-profile.yaml`. Capture `name`, `role`, `region`, `fiscal_year_start_month`.
2. Compute the current fiscal quarter at runtime from today's date plus `fiscal_year_start_month`. Use the same algorithm `/regenerate-pipeline` uses (months `[start, start+1, start+2]`, wrap mod 12, label `Q{n} FY{label}` where `{label}` is the calendar year in which the fiscal year ends if `start_month > 1`, else the same calendar year).
3. Check whether `System/avp-teams.yaml` exists:
   - If yes, AVP mode. Read the team list (see "Multi-team config" below).
   - If no, RVP mode. Read `System/team.yaml`. Build a single team object:

     ```
     team_name: "{user_region} team"   # or any short name; user can edit later
     manager_name: "{user_name}"        # the user is the manager in RVP mode
     reps: list of names from direct_reports[].sfdc_owner_name
     like_clauses: []                   # populated only if a rep entry has a like_pattern field
     ```

4. If a rep entry includes `like_pattern: "%Surname%"`, add it to that team's `like_clauses` for fuzzy SOQL matching. Otherwise match on exact `Owner.Name`.

If `team.yaml` has no `direct_reports`, surface:

`No direct reports found in System/team.yaml. Run /setup step 4 first, then come back.`

Do not proceed.

---

## Step 2b. Resolve the upside dollar floor

The math call's upside slice is filtered by a Net ARR minimum (default A$75,000). Each leader sets their own floor once; AVPs may also set per-manager overrides. The 25% upside weight is fixed and not configurable.

**RVP mode procedure:**

1. Read `team.yaml`. Check whether the top-level key `upside_threshold` is present (an integer dollar amount).
2. If missing, ask the user **once**:

   `Set the upside dollar floor for the math call. Deals in the Upside category below this Net ARR are excluded. Default A$75,000. Enter a dollar value (digits only, no commas):`

   Validate as a positive integer. Reject zero, negatives, and non-numeric input by re-asking.
3. Write the value back to `team.yaml` as a new top-level field `upside_threshold: <int>`. Preserve all existing keys, comments, and ordering — read the file, parse YAML, mutate the dict, dump back. Never blind-replace strings.
4. Echo: `Saved upside_threshold = A$<value> to System/team.yaml. Edit the file directly to change later.`
5. Set `team_threshold_team1 = team.yaml.upside_threshold`. RVP mode has no team 2 threshold; set `team_threshold_team2 = 0`.

**AVP mode procedure:**

1. Read `avp-teams.yaml`. Check whether the top-level key `upside_threshold_default` is present.
2. If missing, ask:

   `Set the default upside dollar floor across all teams. Default A$75,000. Enter a dollar value (digits only, no commas):`

   Validate as above. Write `upside_threshold_default: <int>` to the file (preserve order/comments).
3. Then ask:

   `Want to override the floor for any specific manager? (y/n)`

4. If yes, render a numbered list of managers from `teams[].manager`. Accept comma-separated indices (e.g. `1,3`). For each chosen manager prompt:

   `Floor for {manager}? (default = A$<default>):`

   Write the per-team override as `upside_threshold: <int>` inside that team's entry in `teams[]`. Leave non-overridden teams' entries untouched.
5. For each team in `teams[]`, compute `team_threshold = team.upside_threshold || upside_threshold_default`. Use TEAM1's and TEAM2's resolved values for the Step 4 substitutions below.

**Re-prompt rule (subsequent runs):**

- If `upside_threshold_default` is already set but a team entry lacks `upside_threshold`, that team simply uses the default. Do not interactively prompt — instead, on AVP runs, before generating the artifact, echo once per new manager:

  `Manager {name} uses the default floor of A$<default>. Edit avp-teams.yaml to add upside_threshold for an override.`

  "New" means: a manager whose name was not present the last time the skill ran. The skill is not required to track this precisely; emitting the line for any team without `upside_threshold` set is acceptable.

---

## Step 3. Probe Salesforce field names for this org

Run a quick SOQL probe so the artifact does not blow up on field-name mismatches. The known Pendo Salesforce orgs use:

- `Net_ARR__c` for net ARR.
- `Sales_Forecast_Category__c` for forecast category (values Commit, Forecast, Upside).
- `Next_Steps__c` for next steps (rich text).
- MEDDPICC fields: `Metrics__c`, `Economic_Buyer__c`, `Decision_Criteria__c`, `Decision_Process_Actual__c`, `Paper_Process__c`, `Identified_Pain__c`, `Champion_Actual__c`, `Competition__c`.

Probe query:

```sql
SELECT Id, Name, StageName, ForecastCategoryName, Sales_Forecast_Category__c,
       Net_ARR__c, CloseDate, Owner.Name
FROM Opportunity
WHERE IsClosed = false
LIMIT 3
```

If any field errors, call `getObjectSchema` on `Opportunity` to find the correct API names and either substitute live or warn the user with the mismatch list before continuing. Note common alternatives:

- `Net_ARR__c` may be absent in some orgs. Fall back to `Amount` and warn.
- `Sales_Forecast_Category__c` is the explicit category; `ForecastCategoryName` is the SFDC built-in. The artifact reads `Sales_Forecast_Category__c` first and falls back to `ForecastCategoryName`.

**Key field notes from prior use:**

- `Economic_Buyer__c` and `Champion_Actual__c` are lookup or reference fields. Check for non-null, not text content.
- `LastStageChangeDate` powers "days in stage". LeanData fields are often null; do not rely on them.
- `LastActivityDate` may be unreliable if activity sync is broken. Skip it in risk logic unless the user confirms it works.

---

## Step 4. Generate the artifact

Read the template from `assets/artifact-template.html` in this skill folder. The template renders three tabs: a rollup tab plus one tab per team. Apply the following substitutions:

| Placeholder | Replace with |
|-------------|--------------|
| `{{ARTIFACT_NAME}}` | `{TEAM1_NAME} pipeline review - {QUARTER_LABEL}` |
| `{{ARTIFACT_DESCRIPTION}}` | one-line description of the artifact |
| `{{SOQL_TOOL}}` | exact MCP tool name detected in Step 1 |
| `{{DASHBOARD_TITLE}}` | e.g. `EMEA pipeline review` or `APAC pipeline review` |
| `{{USER_NAME}}` | from `user-profile.yaml` |
| `{{USER_TITLE}}` | from `user-profile.yaml` `role` |
| `{{QUARTER_LABEL}}` | computed in Step 2 (e.g. `Q2 FY27`) |
| `{{QUARTER_DATES}}` | human dates e.g. `May 1 to Jul 31, 2026` |
| `{{QUARTER_START}}` | ISO date of fiscal-quarter start (for SOQL) |
| `{{QUARTER_END}}` | ISO date of fiscal-quarter end (for SOQL) |
| `{{ROLLUP_LABEL}}` | `Rollup` (RVP mode) or `AVP rollup` (AVP mode) |
| `{{TEAM1_NAME}}` | first team's display name |
| `{{TEAM1_MANAGER}}` | first team's manager name |
| `{{TEAM1_REPS_JS}}` | JS array literal of rep names, e.g. `['Jordan Diaz','Sam Wu','Riley Brooks']` |
| `{{TEAM2_NAME}}` | second team's display name. In RVP single-team mode set to a placeholder like `Region peers`; the template hides the tab if `TEAM2_REPS` is empty. |
| `{{TEAM2_MANAGER}}` | second team's manager name (or empty string) |
| `{{TEAM2_REPS_JS}}` | JS array of rep names, or empty array `[]` in single-team mode |
| `{{TEAM2_LIKE_JS}}` | optional JS branch that matches fuzzy patterns and returns `'team2'`. Empty string `''` if no LIKE patterns. Example for one pattern: `if (/Surname/i.test(name)) return 'team2';` |
| `{{LIKE_CLAUSES}}` | SOQL `OR Owner.Name LIKE '%Surname%' ...` clauses, or empty string |
| `{{UPSIDE_THRESHOLD_TEAM1}}` | integer Net ARR floor for TEAM1 (resolved in Step 2b: per-team override or default). E.g. `75000`. |
| `{{UPSIDE_THRESHOLD_TEAM2}}` | integer for TEAM2; `0` if TEAM2 is empty (RVP single-team mode). |
| `{{METHODOLOGY_UPSIDE_FLOOR}}` | RVP mode: `Net ARR ≥ $75,000 only` (use the actual TEAM1 value). AVP mode: `Net ARR ≥ each team's configured floor (default $75,000). See team metric tiles for each team's value.` Format the dollar amount with thousands separators. |

The template uses no emojis. Tab labels are sentence-case team names. The dashboard runs dark by default (Pendo FY27 brand: black background, graphite cards, Pendo Pank as accent, Sora Bold for display, Inter for body, sentence case throughout).

### Team mapping

- **RVP mode (no `avp-teams.yaml`):** TEAM1 is `direct_reports` from `team.yaml`. TEAM2 is `region_peers` from `team.yaml`. If `region_peers` is empty, set `TEAM2_REPS_JS` to `[]` and the template hides the second tab.
- **AVP mode (`avp-teams.yaml` present):** TEAM1 and TEAM2 are the first two entries in the `teams:` list. If more than two teams exist, surface a warning and ask the user which two to render. (A future version will support N tabs.)

Then call the Cowork artifact-creation MCP tool (the exact tool name varies by Cowork build; look for one with `artifact` in the name) with:

- `name`: `{team or first team name} pipeline review - {quarter label}`
- `description`: brief one-liner describing the artifact.
- `mcpTools`: `[<SOQL_TOOL>]`.
- `mcpServerNames`: ask the user once which Salesforce server name to use if multiple are available, otherwise default to the first matched `Salesforce` connector.
- `html`: the fully substituted HTML.

If the user has not provided `assets/artifact-template.html`, tell the user verbatim:

`The artifact template file at assets/artifact-template.html is missing from the avp-pipeline-review skill folder. Drop the template file in and run this skill again. The template is what holds the JavaScript that queries Salesforce and renders the dashboard.`

Do not try to fabricate the template.

---

## Step 5. Offer the static snapshot

After the artifact is created, offer:

`Want a shareable static snapshot? I can bake in today's data so you can email it to your manager without needing a Cowork connection.`

If yes:

1. Call the SOQL tool with the full opportunity query (see Configuration reference below).
2. Get the current data and inject it as a JS constant into a standalone HTML file.
3. Save to the project's `08_Pipeline/snapshots/{YYYY-MM-DD}-pipeline-review.html` with today's date in the filename.
4. Tell the user the path.

---

## Configuration reference

### SOQL query template

```sql
SELECT Id, Name, Account.Name, StageName, ForecastCategoryName,
       Sales_Forecast_Category__c, Net_ARR__c, CloseDate, CreatedDate,
       Owner.Name, LastStageChangeDate, PushCount,
       NextStep, Next_Steps__c,
       Metrics__c, Economic_Buyer__c, Decision_Criteria__c,
       Decision_Process_Actual__c, Paper_Process__c, Identified_Pain__c,
       Champion_Actual__c, Competition__c
FROM Opportunity
WHERE IsClosed = false
  AND CloseDate >= {{QUARTER_START}}
  AND CloseDate <= {{QUARTER_END}}
  AND (Owner.Name IN ({{REP_LIST}}) {{LIKE_CLAUSES}})
ORDER BY Net_ARR__c DESC NULLS LAST
LIMIT 500
```

Where `{{LIKE_CLAUSES}}` is the empty string for exact-match teams, or `OR Owner.Name LIKE '%Surname%' ...` for teams with fuzzy patterns.

### Weighted math

```
Math Call = sum(Commit × 1.0) + sum(Forecast × 0.8) + sum(Upside[≥ team_floor] × 0.25)
Edge Call = Math Call - sum(deals_with_2+_flags × weighted_contribution × 0.5)
```

`team_floor` is the per-team upside Net ARR floor resolved in Step 2b. In RVP mode it is the single value from `team.yaml.upside_threshold`. In AVP mode each team uses its own `upside_threshold` (or falls back to `upside_threshold_default`).

### Risk flags (per deal)

| Flag | Condition |
|------|-----------|
| Pushed Nx | `PushCount` ≥ 5 |
| Closes in Nd | `CloseDate` ≤ 30 days away |
| MEDDPICC N/8 | 4 or more MEDDPICC fields empty |
| No next steps | `Next_Steps__c` and `NextStep` both blank or under 5 characters |

### MEDDPICC field mapping

| Letter | Salesforce field | Type |
|--------|------------------|------|
| M (Metrics) | `Metrics__c` | text, check stripped-html length |
| E (Economic Buyer) | `Economic_Buyer__c` | lookup, check non-null |
| D (Decision Criteria) | `Decision_Criteria__c` | text |
| D (Decision Process) | `Decision_Process_Actual__c` | text |
| P (Paper Process) | `Paper_Process__c` | text |
| I (Identified Pain) | `Identified_Pain__c` | text |
| C (Champion) | `Champion_Actual__c` | lookup, check non-null |
| C (Competition) | `Competition__c` | text |

Text fields are rich-text in this org. Strip tags before checking length:

```js
function stripHtml(s) {
  return (s || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-zA-Z]+;/g, " ")
    .trim();
}
```

---

## Multi-team config (AVP mode)

If the user is an AVP managing multiple sales managers, populate `System/avp-teams.yaml` with the team list. The wizard does not currently scaffold this file; the user creates it manually or via a future `/setup` extension.

Schema:

```yaml
# System/avp-teams.yaml

# Default upside Net ARR floor across all teams. Each team can override.
upside_threshold_default: 75000

teams:
  - name: "TOLA"
    manager: "Justin Johnson"
    upside_threshold: 50000   # optional per-leader override
    reps:
      - "Nate Foss"
      - "Taylor Hooker"
      - "James Duncanson"
      - "David Parks"
    like_clauses: []

  - name: "Central"
    manager: "Laura Vancosky"
    # no upside_threshold → uses upside_threshold_default
    reps:
      - "Cassie Sweet"
      - "Elizabeth Evans"
      - "Sebastian Hickerson"
      - "Aaron Wyler"
      - "Christa Bryant"
    like_clauses:
      - "Ariela%"
      - "%Gronski%"
```

When this file is present, the skill renders one tab per team plus an AVP rollup tab that combines all reps for the math call and the educated edge call.

---

## Adapting for non-MEDDPICC orgs

If the user's Salesforce org does not use MEDDPICC, ask once what qualification framework they use (MEDDIC, BANT, SPICED, and so on) and map accordingly. Edit `getMedc()` and the chip labels in the template. The risk logic uses `countGaps()` which counts missing fields, so just change what fields are checked.

---

## Troubleshooting

- **Field does not exist SOQL error.** Run a schema probe and ask the user to confirm field names. Common variation: `Forecast_Category__c` vs `Sales_Forecast_Category__c`.
- **All MEDDPICC showing red.** Check whether fields are rich text (HTML inside). The `stripHtml` helper handles this. Ensure it is applied before length checks.
- **Wrong team assignment.** LIKE patterns are case-sensitive in SOQL. Use `%Gronski%` not `%gronski%`. Verify `Owner.Name` values by running `SELECT Owner.Name FROM Opportunity LIMIT 20`.
- **Days in stage shows 9999.** `LastStageChangeDate` may not be populated for old deals or in orgs using a custom field. Ask the user if there is a stage-change-date custom field.
- **Artifact shows no data after load.** The forecast category filter depends on `Sales_Forecast_Category__c`. Confirm the field is populated in the org, not just `ForecastCategoryName`.

---

## Constraints

- Australian English throughout the artifact and any user-facing prompts.
- No em dashes anywhere.
- No emojis in the rendered dashboard or any prompt.
- Sentence case for headings and tab labels.
- Salesforce is the source of truth for stage, ARR, and close date. Never read these from local files.
