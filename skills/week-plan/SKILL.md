---
name: week-plan
description: Monday morning weekly planning. Reads last week's daily plans/reviews, surfaces carryover, sets the week's priorities by pillar. Triggers on "/week-plan", "plan my week", "Monday plan", "week ahead", "what's the week looking like".
---

# Week Plan

Your Monday-morning skill. Reads the prior week's `/daily-plan` and `/daily-review` files, reconciles against this week's calendar and pipeline, and produces a forward-looking weekly priority list grouped by pillar.

This is the highest-leverage planning artefact in the loop. It sets the frame `/daily-plan` works against all week.

---

## Skill init: read config at runtime

Before producing any output, load the following config from the user's workspace. Do not hardcode names, pillars, or accounts.

1. **Identity:** read `System/user-profile.yaml` for `user_name`, `user_first_name`, `user_city`, `user_timezone`, `user_region`, and `fiscal_year_start_month`.
2. **Team:** read `System/team.yaml` for `direct_reports`, `region_peers`, and `manager`. Treat "my team" as `direct_reports`, "the region" as `direct_reports + region_peers`.
3. **Pillars:** read `System/pillars.yaml` for the user's pillars (name, description, keywords). Iterate over whatever pillars are defined; never assume a fixed set.
4. **Active accounts:** glob `04_Accounts/Active/*/` and treat each folder as one active account workstation.
5. **Fiscal calendar:** compute `{fiscal_year_label}` and `{current_fiscal_quarter}` from today's date plus `fiscal_year_start_month`.

---

## When to run

- Monday morning, ideally before 9am local time ({user_timezone}).
- After a long absence (returning from leave, end-of-quarter cutover).
- When invoked via "plan my week", "Monday plan", "what's the week looking like", "week ahead".

If run later in the week (Tuesday+), still produce the plan but flag at the top that the week is partially elapsed.

---

## What to pull

Hybrid: read whatever daily files exist from last week, fall back to live connectors for anything missing.

1. **Last week's daily plans + reviews:** `01_Inbox/Daily_Plans/{date}.md` and `01_Inbox/Daily_Reviews/{date}.md` for each of the last 5 working days. Some may be missing.
2. **Last week's `03_Goals/Week_Priorities.md`:** what was set, what shipped, what slipped.
3. **This week's calendar:** Monday through Friday in {user_timezone}. Strip routine items, highlight customer commitments and `[Focus]` blocks.
4. **Live SFDC pipeline:** `soqlQuery` for active opportunities owned or supported by the user and the user's direct reports (from `System/team.yaml`). Any opp with CloseDate inside the next 30 days needs explicit attention.
5. **Tasks.md open items:** carryover from previous weeks, grouped by pillar (using the pillars from `System/pillars.yaml`), sorted by age.
6. **Active workstation MEMORY.md:** scan all workstations under `04_Accounts/Active/*/` for open questions or risks.
7. **Quarter goals:** `03_Goals/Quarter_Goals.md` for context on what the week should ladder up to within {current_fiscal_quarter}.

## What NOT to pull

- Granola transcripts (already processed).
- Slack/Gmail (covered by `/daily-plan` daily; not the unit of analysis here).
- Web search.

---

## Output shape

A single artefact written to `01_Inbox/Weekly/{YYYY-WW}.md` and shown in chat. Five sections.

### 1. Last week (compact)

3-5 bullets summarising what shipped, what slipped, and any notable wins or risks. Pulled from daily reviews. If reviews are missing, reconstruct briefly from calendar + Tasks.md changes:

```
- {Account} demo reset agreed
- {Task} still in draft (slipped from Tuesday focus block)
- {Account} gating step still TBD, two unsuccessful chases
- {N} tasks completed, {N} carried over
```

### 2. This week's calendar shape

A read of the week's structure, not a copy of the calendar. Where are the customer meetings? Where are the focus blocks?

```
- Mon: light on meetings, ideal for week setup
- Tue: {N} customer touches
- Wed: focus block 9-12; manager 1:1 in afternoon
- Thu: team ritual + {N} internal syncs
- Fri: review block, no customer commitments
```

### 3. Priorities for the week (3-5, by pillar)

Ranked by importance within the week. Each is a sentence: what to ship, why it matters. Render one block per pillar defined in `System/pillars.yaml`, using the pillar name as the heading.

```
**{pillar_1_name}**
- {Task}: {why it matters this week}.

**{pillar_2_name}**
- {Task}: {why it matters this week}.

**{pillar_3_name}**
- {Task}: {why it matters this week}.
```

If a pillar has no priority this week, say so. Don't invent work.

### 4. Risks worth flagging

Anything that could blow up if ignored. Pulled from SFDC SE_Risk_Level Yellow/Red, workstation risks, or pattern recognition from last week:

```
- {Account}: {risk description}. {Days} days to close, {status}.
```

If nothing's at risk, "Nothing flagged" is fine.

### 5. Pillar balance read (1 line)

Quick sanity check:

```
Week leans {pillar} ({N} of {total} priorities). {Observation if imbalanced.}
```

---

## Save the output

Write to `01_Inbox/Weekly/{YYYY-WW}.md` (e.g., `2026-19.md` for ISO week 19). Use ISO week numbering for sortability.

Also update `03_Goals/Week_Priorities.md` with this week's top 3-5 priorities so they're available to `/daily-plan` all week without re-reading the artefact.

## Interactive task board (live artifact)

After producing the text plan, render an interactive task board using `mcp__visualize__show_widget` (call `mcp__visualize__read_me` with module `interactive` first if not already loaded this session).

**Board variant: week-plan (full board)**

- Show **all three open sections**: "This week", "Next week", and "Backlog". Do NOT show the Done section (this is forward planning, not retrospective).
- Each task row has: checkbox (toggle done), task text, pillar pill, priority pill, people pills.
- Hover actions: **Edit** (inline text + pillar + priority dropdowns), **Move to...** (dropdown to move between This week / Next week / Backlog), **Remove**.
- A **"+ Add task"** button at the bottom of each section.
- A **"Save changes to Tasks.md"** button at the bottom using `sendPrompt()`.

**Widget title:** `week_plan_task_board`

**Design intent:** Monday morning, {user_first_name} reviews the full backlog and drags tasks into "This week". The Move dropdown replaces drag-and-drop since the widget is HTML-based. Priority can be edited inline so reprioritisation happens in one pass.

**Parsing and save mechanism:** Same as other variants. Read `02_Tasks/Tasks.md`, parse all sections, reconstruct full markdown on save (including Done section, preserved from original parse).

**Styling:** Same CSS variable rules, pill colours, and dark mode overrides as the daily-plan variant.

## After the plan

End with: "Want to expand any priority into a working session, or set up a recurring focus block?"

---

## Editorial rules

- Australian English. No em dashes. No emojis. Sentence case headings. Direct.
- Don't pad the "last week" section. If last week was light, say so.
- Priorities are sentences, not headlines. The "why" matters.
- If a pillar has no work this week, say it. Don't invent.
- Never assume a region, city, or timezone. Always derive from `System/user-profile.yaml`.

---

## Failure modes to avoid

- **Listing every meeting on the calendar.** The point is the week's *shape*, not its contents.
- **Carrying over stale priorities forever.** If something has slipped 3 weeks running, surface that as a decision: kill it, escalate it, or break it down.
- **Avoiding the hard call on risks.** If a deal is trending Red, say so.
- **Padding pillar balance.** If the week is genuinely all weighted to one pillar, that's the read.
- **Hardcoding names, pillars, or accounts.** Always read from config at runtime.
