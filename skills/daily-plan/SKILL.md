---
name: daily-plan
description: "Morning planning skill. Produces the Daily Brief: a short narrative paragraph followed by an open punch list, pulled from calendar, Slack DMs, Gmail, Tasks.md, and active workstations. Triggers on \"/daily-plan\", \"daily brief\", \"plan my day\", \"morning brief\", \"what's my day looking like\", \"what's on for today\", \"kick off the day\"."
---

# Daily brief

{user_name}'s first action of the working day. Produces a **brief + open punch list**: short narrative paragraph on what matters today and what's at risk, followed by an unranked list of open commitments. {user_name} decides priority.

This is not a ranked to-do list. It is a clear-eyed read of the day so {user_name} can choose what to attack first.

---

## Skill init: read config

Before doing any work, load these runtime config files into context:

- `System/user-profile.yaml` - read `timezone`, `city`, `region`, `manager`, `fiscal_year_start_month` (default 2 for Pendo if absent).
- `System/team.yaml` - read `direct_reports`, `region_peers`, and `manager`. This is the canonical source for who is on the team. Do not hardcode names.
- `System/pillars.yaml` - read the list of pillars. Refer to them by their configured `name` value. Never assume pillar names.
- `04_Accounts/Active/*/` - glob this directory to discover the user's actual active accounts. Do not hardcode account names.

All references below to "the user's timezone", "the user's pillars", "the team", "the manager", or "active accounts" resolve from these sources at run time.

---

## When to run

- First thing in the morning (typically before 9am in the user's timezone, from `System/user-profile.yaml`).
- After a long absence (more than 2 days unread Slack/email/SFDC).
- When {user_name} explicitly invokes it via `/daily-plan` or natural language ("plan my day", "kick off the day", "what's on").

If {user_name} runs this after 11am, behave per the time-of-day rule in root CLAUDE.md (recap what's already happened, then focus forward).

If today is a weekend or there are no calendar events, no open tasks, and no fresh Slack DMs, produce a one-line brief ("Quiet day: no meetings, no fresh asks.") and skip the punch list. Don't fabricate substance.

---

## What to pull (always)

Run these in parallel where possible. Don't serialise unless one depends on another.

1. **Calendar:** today's events + first half of tomorrow. Filter out `DO NOT BOOK OVER` (just show up; no prep needed). Highlight `[Focus]` blocks (don't suggest tasks during them).
2. **Slack DMs (last 24h):** unread or unresponded. Look for commitments, asks, deal updates. Cross-reference: is each commitment captured in Tasks.md? If not, flag it.
3. **Gmail (last 24h):** scan for unread customer threads or anything escalated. Don't list every email, just the threads that need a response today.
4. **Tasks.md open items:** read `02_Tasks/Tasks.md`, group by pillar (using pillar names from `System/pillars.yaml`), surface anything tagged for today or overdue.
5. **Pipeline changes:** check `08_Pipeline/changes/` for today's change log (YYYY-MM-DD.md matching today's date in the user's timezone). If it exists, surface any Critical items directly in the brief and list Notable items in the punch list. If no change log exists for today, note "Pipeline not yet refreshed today" and skip.
6. **Rep pages + active workstations:** read `System/team.yaml` for the direct reports list, then read `05_People/Internal/{Name}.md` for each name in `direct_reports`. (Do not iterate `type: rep` blindly; team.yaml is the canonical source.) Surface any deals tagged Red risk, commitments overdue, or 1:1 notes from the last 7 days. Then glob `04_Accounts/Active/*/MEMORY.md` for deals {user_first_name} is personally engaged in. Surface stale open questions, decisions {user_first_name} said they'd make, or risks tagged Yellow/Red. Skip workstations not touched in 14+ days.

## What to pull (conditional)

7. **Live SFDC:** if today's calendar has any meeting tagged to an active account (any folder discovered under `04_Accounts/Active/` at run time), run `soqlQuery` for that Opportunity to pull StageName, CloseDate, Net_ARR__c, SE_Risk_Level__c, and any SE_Notes__c entries from the last 7 days. Reconcile against the workstation MEMORY.md before producing the brief. If anything has drifted, note it in the brief.

## What NOT to pull

- Granola transcripts (handled by `/process-meetings`).
- Notion or Drive (only when {user_name} names a specific doc).
- Web search (this is internal-state planning; no external lookup needed).

---

## Connector health check

Before producing output, confirm Salesforce, Pendo MCP, Slack, Gmail, and Calendar are reachable. If any critical connector is unreachable, tell {user_name} at the top of the response and produce the brief from what's available rather than silently working from cached state. Reference: `00_Resources/connectors.md`.

---

## Output shape

A single message in this exact order. Keep it tight.

### 1. Today's brief (3-5 sentences, prose)

What matters today, framed for {user_name}'s attention. Lead with the highest-stakes item. If a deal is at risk or moving, name it. If today is a focus day with no meetings, say so plainly. If a commitment is at risk because of how the day is structured, flag it.

Voice rules from root CLAUDE.md: Australian English, no em dashes, direct. Not "today is shaping up to be" or "you have a busy day ahead". Just the things that matter.

### 2. Calendar (today)

Compact list with time, title, and a one-line note where useful. Strip routine items (no commentary on `[Focus]` blocks beyond "protected"; don't pad standing internal meetings).

```
09:30  {Account A} discovery ({Champion A}) - SFDC reconciled, MEMORY current
11:00  [Focus] - Non-Trivial - protected
14:00  {Account C} prep - close 20/5, gating step still TBD
```

### 3. Open punch list (unranked)

Headed by source. Pillar tags inline (use the pillar names loaded from `System/pillars.yaml`). No prioritisation, {user_name} decides.

```
From Tasks.md:
- [{pillar_1_name}] Send {AE A} the {Account D} SE-assignment question
- [{pillar_2_name}] Update {Account B} trial scoping doc

From Slack DMs:
- @{manager handle from team.yaml}: needs your read on Q2 {Team} charter by Wed
- @{AE}: replied to your {Account C} channel, hasn't seen response

From workstation memory (open questions):
- {Account A}: {competitor} renewal pushed to July, demo reset still unscheduled
- {Account C}: gating step before 20/5 close not identified
- {Account D}: SE assignment unconfirmed (logged 5/5)
```

### 4. Risk and balance check (1-2 lines, optional)

Only if there's something worth saying. Examples:

- "Three of four meetings today are tagged to pillar 1; no pillar 3 work scheduled this week."
- "Two commitments from yesterday's DMs aren't in Tasks.md yet. Want me to add them?"

Skip this section if the day is balanced and nothing is slipping.

---

## Save the output

After producing the brief in chat, write the same content to `01_Inbox/Daily_Plans/{YYYY-MM-DD}.md`. This file is read by `/week-plan` and `/week-review` to reconstruct the week. Use today's date in the user's timezone (from `System/user-profile.yaml`). Overwrite if the file already exists (re-running the skill replaces, doesn't append).

---

## Daily command centre artifact (live)

After the markdown is written, render a Cowork artifact called the **Daily command centre**: a four-tab dashboard (Day, Tasks, Inbox, Methodology) backed by `assets/artifact-template.html` in this skill folder. This supplements the markdown brief, it does not replace it. The markdown remains the audit log read by `/daily-review`, `/week-plan`, and `/week-review`.

**Brand inheritance is mandatory.** Before generating the artifact:

1. Read the `pendo-design` skill's `SKILL.md`, `README.md`, and `BRAND.md` for the non-negotiable rules (Pank `#FF4876` as accent only, Sora Bold for display, Inter for body, sentence case headings, no emoji, radial gradients on edges, rounded card corners 12-16px).
2. The template already inlines the brand tokens so the artifact renders correctly inside the Cowork sandbox. If the inlined tokens diverge from `pendo-design/colors_and_type.css`, fix the template before invoking the skill.
3. Pank is reserved for: the active-tab indicator, drift chips on the Day tab, priority P0 pill, the eyebrow labels, and the brief card border. Never as a body-content background.

### Step 1. Detect the Salesforce SOQL tool

Scan available MCP tools for one whose name contains `soqlQuery`. Note the exact full tool name (for example `mcp__claude_ai_Salesforce_Prod__soqlQuery`). The artifact's JavaScript hardcodes this string so the rendered dashboard can query SFDC at view time for the Day-tab drift chips.

If no SOQL tool is available, render the artifact anyway. The drift chips will degrade to a grey "No SFDC" state and the rest of the tabs work unchanged. Do not abort: a daily artifact without live drift is still useful.

### Step 2. Gather build-time data

Re-use everything the skill already pulled for the chat brief (calendar, Slack DMs, Gmail, `Tasks.md`, today's `08_Pipeline/changes/`, workstation MEMORYs). No new MCP calls are needed. Additionally, build the **account baselines** object: for each calendar event tagged to an active account folder, look up the opp from the workstation `MEMORY.md` and snapshot `{stage, close_date, net_arr, risk}` keyed by SFDC opportunity Id. This baseline is what view-time drift comparisons run against.

### Step 3. Generate the artifact

Read the template from `assets/artifact-template.html` in this skill folder. Apply the following substitutions:

| Placeholder | Replace with |
|-------------|--------------|
| `{{SOQL_TOOL}}` | Exact MCP tool name detected in Step 1, or the literal string `none` if unavailable. |
| `{{USER_NAME}}` | From `System/user-profile.yaml`. |
| `{{USER_TITLE}}` | From `System/user-profile.yaml` `role`. |
| `{{USER_TIMEZONE}}` | From `System/user-profile.yaml` `timezone`. |
| `{{TODAY_ISO}}` | Today's date YYYY-MM-DD in the user's timezone. |
| `{{TODAY_HUMAN}}` | Long form e.g. `Tuesday, May 19, 2026` in `en-AU` locale. |
| `{{NARRATIVE_BRIEF}}` | The 3-5 sentence prose brief, JSON-string-encoded (use `JSON.stringify`). |
| `{{CALENDAR_JS}}` | JS array literal of today's events. See "Calendar event shape" below. |
| `{{ACCOUNT_BASELINES_JS}}` | JS object literal keyed by opp Id, value `{stage, close_date, net_arr, risk}`. |
| `{{TASKS_MD}}` | Raw `02_Tasks/Tasks.md` content, JSON-string-encoded. |
| `{{INBOX_JS}}` | JS array of Slack and Gmail items. See "Inbox item shape" below. |
| `{{PIPELINE_CHANGES_MD}}` | Today's `08_Pipeline/changes/{date}.md` content JSON-string-encoded, or empty string `""`. |
| `{{ACTIVE_ACCOUNTS_JS}}` | JS array of active account folder names from globbing `04_Accounts/Active/*/`. |
| `{{PILLARS_JS}}` | JS array of pillar names from `System/pillars.yaml`. |

**Calendar event shape** (one entry per event in the array):

```js
{
  time: "09:30",                  // start time HH:MM in user timezone
  end: "10:00",                   // optional end time
  title: "Account A discovery",   // event title, sentence case where possible
  attendees: "Champion A",        // short attendee summary, optional
  note: "SFDC reconciled",        // one-line note, optional
  account_folder: "Account A",    // folder name under 04_Accounts/Active/, optional
  opp_id: "0061a000xxxxxxx",      // SFDC opportunity Id; required for drift chip
  is_focus: false,                // true for [Focus] blocks
  is_no_book_over: false          // true for DO NOT BOOK OVER blocks
}
```

**Inbox item shape**:

```js
{
  source: "Slack",                       // "Slack" or "Gmail"
  sender: "@manager-handle",
  snippet: "Needs your read on Q2...",
  permalink: "https://...",              // optional
  captured_in_tasks: false,              // true if a matching task already exists
  suggested_task: "Reply to manager..."  // optional pre-filled task text for + Capture
}
```

Then call the Cowork artifact-creation MCP tool (look for one with `artifact` in the name) with:

- `name`: `Daily command centre - {YYYY-MM-DD}`
- `description`: brief one-liner describing the artifact.
- `mcpTools`: `[<SOQL_TOOL>]` (omit the entry if no SOQL tool was detected).
- `html`: the fully substituted HTML.

### Step 4. Template missing fallback

If `assets/artifact-template.html` is missing from this skill folder, tell {user_first_name} verbatim:

`The artifact template file at assets/artifact-template.html is missing from the daily-plan skill folder. Drop the template file in and run /daily-plan again. The markdown brief above is still saved and the standalone task board widget still works without it.`

Do not fabricate the template. The markdown brief and the standalone task board widget remain available.

### Step 5. Offer the static snapshot

After the artifact is created, offer:

`Want a shareable static snapshot? I can bake in the current view so you can email this to someone without needing a Cowork connection.`

If yes:

1. Re-render the template with the live SFDC data injected as static JS rather than a `callMcpTool` call.
2. Save to `01_Inbox/Daily_Plans/snapshots/{YYYY-MM-DD}-command-centre.html`.
3. Tell {user_first_name} the path.

---

## Interactive task board (live artifact)

**Note:** the same widget code described below is also rendered as the Tasks tab inside the Daily command centre artifact (above). This standalone widget remains available for sessions where {user_first_name} wants a focused task view without the full Cowork dashboard.

After producing the text brief, render an interactive task board using `mcp__visualize__show_widget` (call `mcp__visualize__read_me` with module `interactive` first if not already loaded this session).

**Board variant: daily-plan (compact)**

- Show only the **"This week"** section from Tasks.md, sorted by priority (P0 first, then P1, then P2).
- Each task row has: checkbox (toggle done), task text, pillar pill, priority pill, people pills.
- Hover actions: **Edit** (inline text + pillar + priority dropdowns), **Remove**.
- A **"+ Add task"** button at the bottom to create new tasks inline.
- A **"Save changes to Tasks.md"** button at the bottom that uses `sendPrompt()` to send the updated markdown back into chat for writing to the file.
- Do NOT show Next Week, Backlog, or Done sections. This is a focused daily view.

**Widget title:** `daily_plan_task_board`

**Parsing Tasks.md:** Read `02_Tasks/Tasks.md` at runtime. Parse each `- [ ]` / `- [x]` line extracting: checkbox state, pillar (text in square brackets, matched against pillar names loaded from `System/pillars.yaml`), task text, people (pipe-separated after task text), priority (P0/P1/P2), and source context (parenthetical "from ..." text). Skip template placeholder lines containing `{Task}`.

**Styling rules:**
- Use CSS variables for all colours (light/dark mode safe).
- Pillar pills: blue ramp. Priority pills: P0 = red, P1 = amber, P2 = teal. People pills: grey ramp.
- Dark mode overrides for all pill colours.
- Flat design, 0.5px borders, `var(--border-radius-md)` corners.
- No emoji, no gradients, no shadows.
- Hover to reveal action buttons (Edit, Remove).

**Save mechanism:** The "Save changes to Tasks.md" button reconstructs the full Tasks.md markdown (including sections not shown in this view: Next Week, Backlog, Done, which are preserved from the original parse) and sends it via `sendPrompt("Update my Tasks.md with these changes. Here is the new content:\n\n```markdown\n" + fullMarkdown + "\n```")`.

## After the brief

End with a single offer: "Want me to expand any item, draft anything, or add the unsurfaced commitments to Tasks.md?"

Do not append a long postamble. Do not summarise what you just did. {user_name} reads the brief and decides what to action.

---

## Editorial rules

- Use Australian English.
- No em dashes anywhere. Use commas, parentheses, or colons.
- No corporate filler ("today is shaping up to be", "you have a productive day ahead", "let's dive in").
- No emojis.
- Bullet points only for genuine multi-item lists.
- If something is uncertain, say so plainly. Don't pad.
- Lead with what matters. Bury status, surface decisions.
- Sentence case for headings.

---

## Failure modes to avoid

- **Padding the brief because a connector returned little.** If today is light, say "Today is light: one meeting, focus block 11-1." Don't invent significance.
- **Restating the calendar as the brief.** The brief is *what matters*, not *what's scheduled*. A 9am {Account A} meeting is not interesting unless something has changed in SFDC or workstation MEMORY since the last sync.
- **Surfacing every Slack DM.** Only DMs that contain a commitment, ask, or material deal update. Standing pings ("how's it going") don't belong here.
- **Pulling live SFDC twice for the same account.** If the Daily Brief already reconciled, `/meeting-prep` doesn't need to repeat the SOQL call within the same session.
- **Hardcoding team, pillar, or account names.** All such references must be loaded from `System/team.yaml`, `System/pillars.yaml`, and a glob of `04_Accounts/Active/*/` at skill init. If config files are missing, prompt {user_first_name} to run `/setup` rather than guessing.
