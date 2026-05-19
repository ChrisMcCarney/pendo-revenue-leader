---
name: week-review
description: Friday afternoon weekly retrospective. Reads the week's daily plans, daily reviews, and SFDC activity, produces a reflection on shipped vs planned, pillar balance, and lessons learnt. Triggers on "/week-review", "wrap the week", "Friday review", "what did I ship this week", "weekly retro".
---

# Week Review

{user_first_name}'s Friday-afternoon skill. Closes the loop on `/week-plan`. Reads everything that happened across the week and produces a retrospective: what shipped, what slipped, what was learnt, and what next week needs to absorb.

This is the reflection skill in the planning loop. It feeds the next `/week-plan`.

---

## Skill initialisation (read at runtime)

Before producing the review, read the following config files:

- `System/team.yaml` for direct reports, regional peers, and manager. Never hardcode team member names.
- `System/pillars.yaml` for the user's pillar names, descriptions, and keywords. Refer to pillars by their configured names or by index (pillar 1, pillar 2, pillar 3). Never hardcode pillar names in this prompt.
- `System/user-profile.yaml` for `fiscal_year_start_month`. Compute the current fiscal quarter at runtime from today's date plus this value.
- `04_Accounts/Active/*/` globbed at run time to enumerate active account workstations. Never hardcode account names.

---

## When to run

- Friday afternoon, ideally 4-5pm {user_timezone} local time.
- When invoked via "wrap the week", "Friday review", "what did I ship", "weekly retro".

If run before Friday, surface that the week isn't complete and ask whether to proceed or wait.

---

## What to pull

Hybrid: read all the daily artefacts that exist, fall back to live connectors for missing days.

1. **This week's `/week-plan` artefact:** `01_Inbox/Weekly/{YYYY-WW}.md`. The priorities the week was supposed to ship.
2. **This week's daily plans + reviews:** `01_Inbox/Daily_Plans/{date}.md` and `01_Inbox/Daily_Reviews/{date}.md` for Mon-Fri.
3. **Tasks.md changes this week:** what was added, what was completed, by pillar.
4. **SFDC SE_Notes appended this week:** count by account, surface anything material.
5. **SFDC stage changes this week:** any opp that moved stage or had SE_Risk_Level changed.
6. **Workstation MEMORY.md changes:** which workstations got updated, which didn't.
7. **Slack/Gmail volume (light read):** count of customer-facing messages sent. Don't read content.

## What NOT to pull

- Granola transcripts (already processed daily).
- Web search.
- Live SFDC pipeline (that's `/week-plan`'s job for next week).

---

## Output shape

A single artefact written to `01_Inbox/Weekly/{YYYY-WW}_review.md` and shown in chat. Six sections.

### 1. Shipped vs planned

Compare this week's `/week-plan` priorities against actuals. For each priority: shipped, partial, or missed.

```
**Shipped ({N} of {total})**
- {Priority}: {outcome}

**Partial ({N} of {total})**
- {Priority}: {partial outcome}. Carrying to next week.

**Missed ({N} of {total})**
- {Priority}: {reason for miss}.
```

### 2. Outside-of-plan

Things that consumed time but weren't planned. Pulled from daily reviews and Tasks.md additions:

```
- {Day}: {unplanned item} ({N} min)
```

### 3. Pillar balance (this week)

Quantified read against the user's pillars (loaded from `System/pillars.yaml`). Use Tasks.md completed items + SE_Notes activity:

```
- {pillar_1_name}: {N}
- {pillar_2_name}: {N}
- {pillar_3_name}: {N}
```

If any pillar has been at 0 for multiple weeks, flag it explicitly: it's a pattern worth surfacing.

### 4. Wins (1-3 bullets)

The week's high points. What worked, what to do more of.

### 5. Slips and lessons (1-3 bullets)

What broke, why, what to change. No flagellation, just the read. If the same thing has slipped 3+ weeks running, name the pattern and suggest a structural fix.

### 6. Carry into next week

3-5 items that need to land in next Monday's `/week-plan`. Pulled from misses, partials, and outside-of-plan items that should have been planned:

```
- {Item} ({status, risk level})
- {Item}, hard-block for Monday morning
```

---

## Save the output

Write to `01_Inbox/Weekly/{YYYY-WW}_review.md` (e.g., `2026-19_review.md`).

## Interactive task summary (live artifact)

After producing the text review, render a read-only task summary using `mcp__visualize__show_widget` (call `mcp__visualize__read_me` with module `interactive` first if not already loaded this session).

**Board variant: week-review (read-only summary)**

This is NOT an editable board. It is a visual summary of the week's task activity for reflection.

**Layout (top to bottom):**

1. **Metric cards row** (3-4 cards in a grid):
   - "Completed this week" (count of tasks moved to Done with this week's dates)
   - "Carried over" (count of open tasks still in This Week that were there at week start)
   - "Added this week" (count of tasks added during the week, if detectable from context)
   - "Net change" (completed minus added, shows whether the backlog grew or shrank)

2. **Pillar balance bar** (horizontal stacked bar or simple breakdown):
   - Show completed tasks grouped by the user's pillars (read from `System/pillars.yaml`) with proportional segments.
   - Colour-code: use the same pillar colour from the editable boards (blue for pillar pills).
   - Label each segment with pillar name and count.
   - If a pillar has 0 completed tasks for 2+ consecutive weeks, highlight it with a subtle warning border.

3. **Carry-forward list** (compact, non-editable):
   - List open tasks from "This week" that didn't get done, with pillar and priority pills.
   - These are the items that will seed next Monday's `/week-plan`.

**Widget title:** `week_review_task_summary`

**No save button.** This is read-only. No checkboxes, no edit actions. The week-review is for reflection, not task management.

**Parsing:** Read `02_Tasks/Tasks.md` for current state. Cross-reference with the week's daily review files (`01_Inbox/Daily_Reviews/`) to count completions by day if available.

**Styling:** Same CSS variable rules. Metric cards use `background: var(--color-background-secondary)`, no border, `border-radius: var(--border-radius-md)`. Pillar bar uses inline colour from the palette (one colour per configured pillar). Dark mode safe.

## After the review

End with: "Want me to set up next week's plan now, or save it for Monday morning?"

---

## Editorial rules

- Australian English. No em dashes. No emojis. Sentence case headings. Direct.
- Lead with what's working before what to change.
- Slips and lessons are observations, not self-criticism. State the pattern, suggest the change, move on.
- If pillar balance has been broken for multiple weeks, name the pattern.
- If the week was light (illness, leave), note that and adjust the read accordingly.
- Never assume the user's region, city, or timezone. Use `{user_region}`, `{user_city}`, `{user_timezone}` as substituted at /setup time.

---

## Failure modes to avoid

- **Reframing slips as wins.** If something missed, it missed. Don't pad.
- **Producing identical "carry into next week" lists week after week.** If something has carried 3+ weeks, surface that as a decision: kill, escalate, or restructure.
- **Skipping the pillar pattern check.** Weekly reviews are where you catch chronic imbalance.
- **Asking too many follow-up questions.** One offer is enough.
- **Hardcoding team members, pillars, or accounts.** Always read from `System/team.yaml`, `System/pillars.yaml`, and `04_Accounts/Active/*/` at runtime.
