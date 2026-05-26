---
name: setup
description: "One-shot interactive wizard that scaffolds a working Pendo Sales Leader project from zero. Eight guided steps walk a brand new RVP or sales manager from folder pick through identity, pillars, team, accounts, voice, pipeline seed, and sanity check. Reads live data from Salesforce and Slack. State persists so users can quit and resume. Triggers on \"/setup\", \"set up my project\", \"first time setup\", \"install pendo os\", \"scaffold pendo os\", \"start from scratch\"."
---

# Setup wizard

The first thing a new user runs. This skill builds a populated Pendo Sales Leader project from a clean folder in under 20 minutes by walking the user through eight guided steps. Every step uses Cowork's structured question UI; the user never edits YAML by hand, never opens a terminal, never sees a file path they did not pick.

When this skill finishes, the user has:

- A populated project folder at the path they chose.
- Identity, manager, region, and timezone written into `System/user-profile.yaml`, `CLAUDE.md`, and `MEMORY.md`.
- Three pillars in `System/pillars.yaml`.
- Their direct reports and region peers in `System/team.yaml`, with one stub person page per rep in `05_People/Internal/`.
- Up to ten active deals scaffolded as workstations under `04_Accounts/Active/`, each with `CLAUDE.md` and `MEMORY.md` seeded from live Salesforce.
- A generic voice template at `00_Resources/voice-principles.md` that they can edit later.
- A first pipeline view at `08_Pipeline/Deal_Pipeline.md`.
- A plain-English summary of everything created.

## When to run

- The first time a user invokes the plugin.
- When a user wants to start over (the wizard archives the existing project to a timestamped backup folder and starts fresh).
- When a user wants to update a single section, for example refresh the team list after a re-org.

## Constraints

These apply to every prompt the user sees and every file written.

- Australian English spelling throughout.
- No em dashes anywhere. Use a plain hyphen or rewrite the sentence.
- No emojis in any prompt, status line, or written file.
- Sentence case for headings.
- Wizard voice is direct and plain. No hype, no apologies, no filler.
- Do not ask free-text questions unless the user picked an `Other` option in an `AskUserQuestion`.
- Do not assume the user is in APAC. Do not assume they live in Melbourne. Do not assume their fiscal calendar without confirming.

---

## State machine

```
ENTRY
  | /setup invoked
  v
S0 PRECHECK
  | read .setup-state.yaml if present; ping Salesforce and Slack connectors
  | resume?            new install?
  |     |                  |
  |     v                  v
R RESUME PROMPT       S1 FOLDER PICK
  | options:               |
  | Resume / Start over    v
  | / Update one section   S2 IDENTITY
  | / Cancel               |
  |                        v
  +----------------->    S3 PILLARS
                          |
                          v
                       S4 TEAM
                          |
                          v
                       S5 ACCOUNTS
                          |
                          v
                       S6 VOICE
                          |
                          v
                       S7 PIPELINE SEED
                          |
                          v
                       S8 SANITY CHECK
                          |
                          v
                        DONE

Any step can transition to:
  E_SFDC   (Salesforce unreachable)
  E_SLACK  (Slack unreachable)
  E_WRITE  (disk write failed)
  Q        (user quit)

On recovery, control returns to the originating state at the same sub-step.
```

---

## State file

`.setup-state.yaml` sits at the user's project root. Write it after every successful step. Read it on every `/setup` invocation. Do not edit by hand and do not delete unless the user chooses `Start over`.

```yaml
schema_version: 1
plugin_version_hash: "<sha1 of plugin.json contents at run start>"
installed_plugin_version: "<semver from plugin.json, e.g. 0.5.0>"
created_at: "<ISO 8601 local time>"
updated_at: "<ISO 8601 local time>"
project_path: "<absolute path the user picked>"

current_step: "precheck | folder | identity | pillars | team | accounts | voice | pipeline | sanity | complete"
last_completed_step: "<same enum>"
one_shot_step: null
abort_reason: null

connectors:
  salesforce:       { status: "ok | failed | skipped", checked_at: "..." }
  slack:            { status: "ok | failed | skipped", checked_at: "..." }
  google_calendar:  { status: "ok | failed | skipped", checked_at: "..." }
  gmail:            { status: "ok | failed | skipped", checked_at: "..." }
  granola:          { status: "ok | failed | skipped", checked_at: "..." }

captured:
  identity: { ... }       # user_name, user_first_name, user_role, user_role_other,
                          # user_region, user_region_other, user_city, user_timezone,
                          # user_email, user_slack_handle, email_domain, company_name,
                          # fiscal_year_start_month, sfdc_user_id
  manager:  { ... }       # manager_name, manager_name_first, manager_email,
                          # manager_slack_handle, manager_sfdc_id
  pillars:  [ ... ]       # list of three pillar objects with id, name, description, keywords
  team:     { ... }       # direct_reports, region_peers, unresolved_slack
  accounts: { ... }       # queried_count, shown_count, promoted (list of workstations)
  voice:    { ... }       # copied_from, copied_at
  pipeline: { ... }       # regenerate_invoked_at, deal_pipeline_md_path, deals_written
  warnings: [ ... ]
```

On every invocation:

1. If `.setup-state.yaml` exists and `plugin_version_hash` matches the current plugin's hash, offer `Resume from {last_completed_step}`, `Start over`, `Update one section`, `Cancel`.
2. If hash mismatches, warn the user and offer `Start over` or `Continue anyway`. On `Continue anyway`, fall through to the normal resume prompt as if the hashes matched.
3. If `current_step == complete`, offer `Update one section`, `Start over`, `Cancel`.
4. If no state file, go straight to S1.

`Start over` means: rename the existing project tree (including its `.setup-state.yaml`) to `_pre_setup_backup_{ISO timestamp}/` next to it, then restart at S1 against a fresh empty folder. The backup retains everything so the user can recover. Never silently overwrite user data.

`Update one section` sets `one_shot_step` to the chosen step, runs that step only, then returns to S8 sanity check.

---

## Step S0. Precheck

**Pre-conditions:** none. Runs first on every invocation.

**Procedure:**

1. Read `.setup-state.yaml` if present; apply the resume algorithm described below.
2. Ping every connector the plugin uses:
   - Salesforce: `getUserInfo`. Required. If fails, set `connectors.salesforce.status = failed` and proceed to S1 (the SFDC-dependent steps will retry).
   - Slack: `slack_search_users` for the user's own email. Required for S4 team handle resolution but optional in degraded mode (blank handles).
   - Google Calendar: `list_calendars`. Optional. Status only.
   - Gmail: `list_labels`. Optional. Status only.
   - Granola: `get_account_info`. Optional. Status only.
3. Store each result on `connectors.{name}.status` and `checked_at`.
4. If Salesforce fails, do not abort the wizard. The user can still pick a folder and write `user-profile.yaml` from defaults; SFDC-dependent steps will retry. Surface the issue in S2 entry.

**Post-conditions:** state file written with connector statuses; control transfers to either Resume Prompt (if state existed) or S1.

---

## Step S1. Folder pick

**Pre-conditions:** S0 precheck complete; no state file, or user chose `Start over`.

**Procedure:**

1. Try `request_cowork_directory` (Cowork's directory picker primitive) to get a path from the user. If the primitive is unavailable on this Cowork build, fall through to step 1b.
1b. Fallback path: `AskUserQuestion` `How would you like to set the project folder?` options `Use my default Cowork workspace` / `Type a different path` / `Quit setup`. On `Type a different path`, accept a free-text absolute path.
2. `AskUserQuestion`: `Use this folder for your Pendo OS project?` Options: `Yes, write here` / `Pick a different folder` / `Quit setup`.
3. If the folder already contains a Pendo OS layout (look for `System/cep-stages.yaml`), ask `Existing project detected at this path:` with options `Resume from saved step` / `Use a different folder` / `Overwrite and start fresh`.

**Writes:** the templated tree skeleton from `templates/` into the chosen path, but only the empty directories and the static files at this stage (do not substitute placeholders until S2). Save `.setup-state.yaml` with `project_path` set.

**Failure modes:**

- Path not writable -> E_WRITE (show the path, the reason, options `Retry` / `Choose other folder` / `Quit`).
- Directory picker primitive unavailable -> E_PICKER. Surface message: `Cowork's directory picker is not available in this build. Type the absolute path to the folder where you want Pendo OS to live.` Then proceed via the free-text fallback in step 1b.

**Post-conditions:** `last_completed_step: folder`; state saved.

---

## Step S2. Identity

**Pre-conditions:** folder pick complete; Salesforce reachable (if not, go to E_SFDC).

**External calls (run in parallel first):**

- Salesforce `getUserInfo` to capture the running user's `sfdc_user_id`, name, email, and `ManagerId`.
- Salesforce SOQL for manager prefill:
  ```
  SELECT Id, Name, Email FROM User WHERE Id = '{ManagerId}' LIMIT 1
  ```
- Slack `slack_search_users` by email for both the user and the manager.

**AskUserQuestion calls in this order:**

1. `Confirm your name` - options: `{sfdc_name_returned}` / `Use a different name`. `Use a different name` opens a free-text prompt, the same Other-branch pattern as below.
2. `Your role` - options: `RVP Sales` / `Sales Manager` / `Sales Director` / `Other`.
3. `Your region` - options: `APAC` / `EMEA` / `Americas` / `Other`.
4. `Your city` - options: `{slack_city_if_available}` / `Enter a different city`. If Slack returned no city, present a single option `Enter your city` and go straight to the free-text prompt.
5. `Your timezone` - options: three IANA timezones matching the region the user picked, plus `Other`. List the options in alphabetical order so no single timezone reads as a soft default. For APAC offer `Asia/Singapore`, `Australia/Melbourne`, `Australia/Sydney`. For EMEA `Europe/Amsterdam`, `Europe/Dublin`, `Europe/London`. For Americas `America/Chicago`, `America/Los_Angeles`, `America/New_York`. Never default to a single timezone without asking.
6. `Confirm your manager` - options: `{sfdc_manager_name_returned}` / `Use a different manager` / `I do not have a manager in Salesforce`.
7. `Fiscal year start month` - options: `February (Pendo default)` / `January` / `Other month`.

When the user picks `Other` on any of these, follow up with a single free-text prompt scoped to that one value. Store the verbatim value in `captured.identity.{field}_other` and also as the primary `{field}` for substitution.

**Writes:**

- `System/user-profile.yaml` substituted from `templates/System/user-profile.example.yaml`.
- A substitution pass on `CLAUDE.md` and `MEMORY.md` replacing the identity tokens `{user_name}`, `{user_first_name}`, `{user_role}`, `{user_region}`, `{user_city}`, `{user_timezone}`, `{user_email}`, `{user_slack_handle}`, `{manager_name}`, `{manager_name_first}`, `{company_name}`, `{email_domain}`, `{fiscal_year_start_month}`.
- `CLAUDE_USER.md` copied verbatim from `templates/CLAUDE_USER.md` (no substitution; the starter file has no identity tokens). This is the user-owned companion to `CLAUDE.md`; `/update` never touches it after this point.

**Failure modes:**

- SOQL failure -> E_SFDC.
- Slack lookup failure -> proceed; leave `user_slack_handle` blank, flag in sanity check.
- Manager record missing or inactive in SFDC -> ask `Your Salesforce manager record looks stale. Pick how to proceed.` options `Enter manager name manually` / `Continue with no manager` / `Quit and fix in SFDC`.
- User name is a single token (no last name) -> set `user_first_name = user_name`.

**Post-conditions:** `captured.identity` and `captured.manager` populated; state saved.

---

## Step S3. Pillars

**Pre-conditions:** identity complete.

**AskUserQuestion calls:**

1. `Pillar setup` - options: `Use the Pendo RVP starter pillars (Sales Partnership, Tech Win Rate, Thought Leadership; you can rename later)` / `Edit pillar names now` / `Start with three blank pillars` / `Skip pillars for now`.

Note for the user: the starter pillars are a sensible default frame for any region. They are not Pendo-sanctioned policy. Edit them whenever your focus changes.
2. If the user picked `Edit pillar names`, run three follow-up prompts, each: `Pillar 1 name` with options `Keep {default}` / `Rename`. Free-text only fires when the user picks `Rename`.

**Writes:** `System/pillars.yaml` from `templates/System/pillars.example.yaml` with the three pillar names substituted into the `name:` fields. Descriptions and keywords stay as one-line placeholders the user can flesh out later.

**Failure modes:** none material. Disk write -> E_WRITE.

**Post-conditions:** `captured.pillars` populated as a list of three objects with `id`, `name`, `description`, `keywords`; state saved.

---

## Step S4. Team composition

**Pre-conditions:** identity complete; `sfdc_user_id` and `manager_sfdc_id` captured.

**External calls:**

- Direct reports SOQL:
  ```
  SELECT Id, Name, Email, ManagerId, UserRole.Name
  FROM User
  WHERE ManagerId = '{sfdc_user_id}' AND IsActive = true
  ```
- Region peers SOQL (only if a manager was captured):
  ```
  SELECT Id, Name, Email, UserRole.Name
  FROM User
  WHERE ManagerId = '{manager_sfdc_id}'
    AND Id != '{sfdc_user_id}'
    AND IsActive = true
  ```
- For each returned user, `slack_search_users` by email. If no email match, fall back to `slack_search_users` by full name and require both first and last name token match with exactly one result. Otherwise leave the handle blank and append the person to `captured.team.unresolved_slack`.

**AskUserQuestion calls:**

1. For each rep returned by either SOQL, `Classify {Name}` - options: `Direct report` / `Region peer` / `Exclude from team.yaml`. Single-select.
2. If both SOQLs return zero rows, single confirm: `No direct reports found in Salesforce. Continue without team?` options `Yes, continue` / `Quit and fix in Salesforce`.

**Writes:**

- `System/team.yaml` written from `templates/System/team.example.yaml` shape, with `direct_reports`, `region_peers`, and `manager` lists populated.
- One stubbed person page per included rep at `05_People/Internal/{Name}.md`, with YAML frontmatter only (`name`, `role`, `type: rep | person`, `manager`, `slack`). No body.

**Failure modes:**

- SOQL fails -> E_SFDC.
- Slack lookup fails for the connector entirely -> E_SLACK. Slack lookup fails per individual -> handle blank, name to `unresolved_slack`.

**Post-conditions:** `captured.team` populated; per-rep stubs on disk; state saved.

---

## Step S5. Top accounts

**Pre-conditions:** team complete.

**Pre-condition check:** before the SOQL, call `getObjectSchema` on `Opportunity` to confirm `Net_ARR__c` exists. If it does not, use `Amount` as the deal-value field for this org. Remember the choice on `captured.accounts.value_field` so `regenerate-pipeline` can use the same one.

**External call:**

Primary (one-hop hierarchy):

```
SELECT Id, Name, StageName, CloseDate, {value_field}, Owner.Name,
       AccountId, Account.Name, Account.Industry,
       Account.AnnualRevenue, Account.NumberOfEmployees
FROM Opportunity
WHERE Owner.ManagerId = '{sfdc_user_id}'
  AND IsClosed = false
ORDER BY {value_field} DESC NULLS LAST
LIMIT 20
```

If the primary query returns zero rows (common for RVPs whose direct reports are themselves Sales Managers rather than Account Directors), fall through to a two-hop query:

```
SELECT Id, Name, StageName, CloseDate, {value_field}, Owner.Name,
       AccountId, Account.Name, Account.Industry,
       Account.AnnualRevenue, Account.NumberOfEmployees
FROM Opportunity
WHERE Owner.Manager.ManagerId = '{sfdc_user_id}'
  AND IsClosed = false
ORDER BY {value_field} DESC NULLS LAST
LIMIT 20
```

Tell the user verbatim: `No deals owned by your direct reports. Pulling deals owned by your second-line reports instead.` so the diagnosis is visible.

**AskUserQuestion calls:**

1. `Promote to active workstations (multi-select)` - options are the top ten results formatted as `{account_name} - ${net_arr_k}k - {stage} - {owner}`. Set `multiSelect: true`.
2. If 11 to 20 rows exist, follow-up `Show next 10?` options `Yes, show more` / `Continue with what I picked`. When `Yes`, present the next ten as a second `multiSelect: true` prompt and merge the user's selections.
3. Confirm: `Create {N} workstations?` options `Yes, create` / `Adjust selection` / `Skip workstations for now`. On `Adjust selection`, return to sub-step 1 with the user's prior picks pre-checked so they can refine without restarting.

**Writes:** for each promoted opportunity:

- Copy `templates/04_Accounts/Active/_TEMPLATE/` to `04_Accounts/Active/{account_name}/`.
- Substitute SFDC fields into the workstation's `MEMORY.md` using the seeded field set defined in `placeholder-map.yaml` Section 6: `{account_name}`, `{opportunity_id}`, `{account_id}`, `{stage_name}`, `{close_date}`, `{net_arr}`, `{owner_name}`, `{account_industry}`, `{account_annual_revenue}`, `{account_number_of_employees}`.
- If `04_Accounts/Active/{account_name}/` already exists, append a numeric suffix (`{account_name}_2`) and surface a warning in `captured.warnings`.

**Failure modes:**

- SOQL fails -> E_SFDC.
- Zero open opportunities -> tell the user, offer `Continue without workstations`.

**Post-conditions:** `captured.accounts.promoted` populated; folders on disk; state saved.

---

## Step S6. Voice

**Pre-conditions:** accounts step complete or explicitly skipped.

**Procedure:** copy `templates/00_Resources/voice-principles.md` to `{project_path}/00_Resources/voice-principles.md`. No substitution beyond the identity tokens already handled in S2. No prompts; just a status line: `Copying the generic voice template. You can edit 00_Resources/voice-principles.md any time.`

**Failure modes:** disk write -> E_WRITE.

**Post-conditions:** `captured.voice` recorded; state saved.

---

## Step S7. Pipeline seed

**Pre-conditions:** voice step complete; Salesforce reachable.

**AskUserQuestion:**

1. `Build your first pipeline view now?` options `Yes, run regenerate-pipeline` / `Skip for now`.

**Procedure:** invoke this plugin's `regenerate-pipeline` skill as a sub-skill. It runs its own SOQL queries over direct reports plus region peers and writes `08_Pipeline/Deal_Pipeline.md` plus a dated snapshot under `08_Pipeline/snapshots/`.

**Failure modes:** sub-skill error -> E_SFDC; surface the underlying message verbatim. Empty pipeline -> proceed; flag in sanity check.

**Post-conditions:** `captured.pipeline.deals_written` set from the sub-skill output; state saved.

---

## Step S8. Sanity check

**Pre-conditions:** all prior steps complete or explicitly skipped.

**Procedure:**

1. Read the new project read-only. Count direct reports, region peers, workstations, pillars, deals.
2. Present the summary as a plain English paragraph followed by an `AskUserQuestion`:

   `Setup summary: {N} reps, {M} workstations, {K} deals, {P} pillars, voice template installed. Anything to adjust?`

   Options: `All good, finish` / `Re-run identity` / `Re-run pillars` / `Re-run team` / `Re-run accounts`. Picking any re-run sets `one_shot_step` and jumps back to that step.

3. If `captured.team.unresolved_slack` is non-empty, follow up: `These Slack handles could not be resolved: {list}. Add them now?` options `Add now (one at a time)` / `Leave blank, fix later`. On `Add now`, loop a free-text prompt per name: `Slack handle for {name}?` Accept any non-empty string. Strip any leading `@` and trim whitespace before writing it into `team.yaml`.

4. If `captured.pipeline.deals_written == 0`, surface: `Your first pipeline run returned zero open deals. Check Salesforce ownership and rerun /regenerate-pipeline.`

5. Surface a per-connector status line: `Connectors:` followed by one bullet per connector with the status from S0 precheck (re-pinged here). For each `failed` or `skipped` connector, name which skills will be affected (Calendar -> /daily-plan, /meeting-prep, /week-plan, /week-review; Gmail -> /daily-plan, /week-review; Granola -> /process-meetings). User can ignore now and connect later when they invoke a dependent skill.

5b. Note the SessionStart hook. The plugin declares a SessionStart hook in `.claude-plugin/hooks.json` that Cowork auto-installs whenever the plugin is enabled. It silently checks the workstation's recorded `plugin_version_hash` against the plugin's current `plugin.json` hash at every session start; on mismatch it invokes `/update`. No user action is required — surface a status line only: `SessionStart hook: managed by the plugin (Cowork). Quiet by default; only fires when the plugin has new content.`

6. Set `current_step: complete`, `last_completed_step: sanity`. Update `updated_at`. Write `installed_plugin_version` from the current `plugin.json` `version` field. This is what `/update` reads later to name the from-version in its summary copy.

7. Required files audit. Read the `update_categories.files` block from the plugin's `placeholder-map.yaml`. For every entry whose `category` is `managed_reference` or `system_schema` and whose path starts with `00_Resources/`, `System/`, or `Templates/`, confirm the file exists in the new workstation. For every entry whose `category` is `user_owned_seed`, confirm the file exists (it should have been seeded by an earlier step). Any missing file is a regression — append it to `captured.warnings` and surface a single line in the summary: `Missing required file: {path}. Re-run /setup with "Update one section" and pick the closest matching step, or run /update to backfill.` Do not block completion; this is a guardrail to catch interrupted template copies or new plugin files that an old install missed. Skills that fail-fast on these paths (for example `/account-health-plus` on `00_Resources/pricing-packaging-mapping.md`) need them present, so surface the gap loudly.

8. Close with one of two lines depending on local time:
   - If today is a weekday before 4pm in `{user_timezone}`: `You are set up. Run /daily-plan now to see today's brief, or tomorrow morning as your regular rhythm.`
   - Otherwise: `You are set up. Try /daily-plan tomorrow morning.`

**Post-conditions:** `.setup-state.yaml` retained for future re-runs.

---

## Cross-cutting

### Substitution engine

A flat `replace` pass over file contents. Token set is the keys in Sections 1, 2, and 3 of `placeholder-map.yaml`, plus the derived tokens `{user_first_name}`, `{manager_name_first}`, `{email_domain}`, `{fiscal_year_start_month}`. Tokens that resolve at skill runtime (for example `{current_fiscal_quarter}`, `{fiscal_year_label}`) are deliberately left in place; the substitution pass must enforce a deny-list so they aren't touched.

```
def substitute(file_text, captured):
    tokens = build_token_map(captured)
    for token, value in tokens.items():
        if token in RUNTIME_TOKENS:
            continue
        file_text = file_text.replace(token, str(value))
    return file_text
```

Files in scope for substitution: `CLAUDE.md`, `MEMORY.md`, `GETTING_STARTED.md`, `README.md`, `System/user-profile.yaml`, `System/pillars.yaml`, `System/team.yaml`, per-workstation `MEMORY.md` files.

### Resume algorithm

```
on /setup invocation:
  if .setup-state.yaml exists:
    read it
    if plugin_version_hash != current_plugin_hash:
      AskUserQuestion "Plugin updated since you last ran setup."
        options: Start over / Continue anyway / Cancel
    if current_step == "complete":
      AskUserQuestion "This project is already set up."
        options: Update one section / Start over / Cancel
    else:
      AskUserQuestion "Resume from {last_completed_step}?"
        options: Resume / Start over / Update one section / Cancel
    apply choice
  else:
    go to S1
```

### Abort handling

If the user types `quit`, `cancel`, or picks a `Quit setup` option at any `AskUserQuestion`:

1. Write `abort_reason: "user_quit_at_{current_step}"` to `.setup-state.yaml`.
2. Do not roll back files already written in completed steps.
3. Print: `Setup paused. Resume any time by running /setup again.`
4. Return control to Cowork.

### Salesforce auth flow

Before every SFDC-dependent step, run `getUserInfo` as a cheap ping. On failure transition to E_SFDC:

1. First failure message: `Salesforce is not connected. Open Cowork's connector settings, enable the Salesforce connector, then come back here.`
2. `AskUserQuestion`: `Have you reconnected Salesforce?` options `Yes, retry` / `Skip this step` / `Quit setup`.
3. On Retry, re-ping; on success return to the originating state; on fail loop. On the second consecutive failure, escalate the message to: `Salesforce still cannot connect. Common causes: connector not installed in Cowork, OAuth token expired, or your Pendo IT admin has not granted API access to your account. Options below.` and offer `Retry` / `Skip` / `Quit and email IT support` (the last option closes the wizard and surfaces the IT support email if available in the user-profile, otherwise prints `Email it-support@{email_domain} with the message above.`).
4. Never silently continue a SFDC-dependent step without a successful ping.

### Slack auth flow

Same shape as Salesforce, with the message `Slack is not connected. Open Cowork's connector settings, enable the Slack connector, then come back here.` Slack failures degrade gracefully: blank handles populate sanity-check follow-ups.

### Adversarial cases

- **No direct reports.** S4 SOQL returns zero rows. Wizard explains, offers `Continue without team`. Writes `team.yaml` with empty `direct_reports:` list and any region peers populated.
- **More than 10 open opportunities.** Top 10 by Net ARR, follow-up `Show next 10?` page-2 multi-select.
- **Slack handle unresolvable for one person.** Handle blank, name to `unresolved_slack`. Sanity check re-surfaces and offers per-name free-text input.
- **User picks Other for region or role.** Free-text branch stores verbatim in `captured.identity.{field}_other` and the primary `{field}` token for substitution.
- **Second run on populated project.** Detected by existing `.setup-state.yaml` with `current_step: complete` OR by populated `System/team.yaml`. Offer `Update one section` / `Start over` / `Cancel`. `Start over` archives the existing project tree to `_pre_setup_backup_{ISO timestamp}/`.
- **Pendo fiscal default.** February is the first option in the fiscal-year-start question but never assumed; the wizard always asks.
- **Single-token user name.** Derive `user_first_name = user_name`.
- **Stale manager record.** Offer manual name entry, no manager, or quit.
- **Path with spaces.** Use language-level file APIs throughout; do not pipe paths through shells.

### What the wizard never does

- Never assumes the user's region, city, timezone, or fiscal calendar.
- Never proceeds past a connector failure with a silent shrug. Always pauses, explains, offers retry or skip with consequences.
- Never overwrites a populated project without explicit user confirmation and a timestamped backup.
- Never writes a real `team.yaml` or `user-profile.yaml` from the templates directory shipped with the plugin (those are example files only).
- Never emits em dashes, emojis, ALL CAPS, or American spellings.
