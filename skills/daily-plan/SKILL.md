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

## Interactive task board (live artifact)

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
