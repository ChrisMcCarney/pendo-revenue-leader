---
name: daily-review
description: End-of-day reflection that closes the loop on /daily-plan. Compares planned vs shipped, surfaces what slipped, sets up tomorrow. Triggers on "/daily-review", "wrap up the day", "end of day", "what did I get done", "close out today", "review today".
---

# Daily review

{user_first_name}'s end-of-day skill. Pairs with `/daily-plan`: morning produces the brief, evening closes the loop. Reads today's `/daily-plan` output (if it exists), compares to actual activity, and sets up tomorrow.

The point is reflection without ceremony. 5 minutes, not 30.

## Runtime config to load at skill init

Before producing the review, read the following config files. These are user-specific and must not be hardcoded:

- `System/team.yaml` for direct reports, regional peers, and manager.
- `System/pillars.yaml` for the user's pillar names, descriptions, and keywords.
- `System/user-profile.yaml` for `fiscal_year_start_month` (used when computing fiscal week/quarter context).
- `04_Accounts/Active/*/` glob for the current set of active account workstations.

All references to "the user's pillars", "the team", and "active accounts" in this skill resolve from those sources at runtime.

---

## When to run

- End of the working day (typically 5-7pm in {user_timezone}).
- After all customer meetings have been processed by `/process-meetings`.
- When invoked via "wrap up", "close out", "what did I get done today".

If `/process-meetings` hasn't run yet, suggest running it first. The review is stronger with today's call activity captured.

---

## What to pull

1. **Today's daily plan:** read `01_Inbox/Daily_Plans/{today}.md`. If missing, note it and reconstruct from connectors.
2. **Today's calendar (actual):** what actually ran vs what was on the calendar (declines, no-shows, rescheduled).
3. **Tasks.md changes since this morning:** what was completed, what was added.
4. **Slack DMs sent today:** commitments made that may not be in Tasks.md.
5. **SFDC SE_Notes appended today:** sanity check that customer call activity was captured.
6. **Workstation MEMORY.md changes:** any updates from `/process-meetings`.

## What not to pull

- Live SFDC stage data (already pulled this morning, no fresh signal in 8 hours).
- Granola transcripts (already processed by `/process-meetings`).
- Web search.

---

## Output shape

Tight. Five sections, in this order. The whole thing should fit on one screen.

### 1. Done today (3-5 bullets)

Headline accomplishments. Meaningful outputs, not a meeting log:

```
- {Account} call run, {outcome agreed}
- {Account} question sent to {Contact}
- {N} tasks completed
```

### 2. What slipped (if anything)

Items in this morning's plan that didn't ship. One-line each, with reason if known:

```
- {Task}: still draft, focus block consumed by {other thing}
- {Item}: deferred to tomorrow
```

If nothing slipped, skip this section and write "Nothing material slipped."

### 3. Surfaced today (commitments not yet captured)

New tasks or commitments that came up today and aren't in Tasks.md yet. Ask to confirm before writing them in:

```
- "{Commitment}" ({source}, {time}) - add to Tasks.md as {pillar}?
```

### 4. Tomorrow's setup (1-3 bullets)

Brief forward look. What's the first thing to attack tomorrow, based on today's slips and tomorrow's calendar:

```
- Tomorrow opens with {meeting} at {time}, then {block}
- {Account} follow-up due, chase if no reply by {time}
```

### 5. Pillar balance check (optional, weekly use)

Only include on Fridays or when something feels skewed. One line, naming each of the user's pillars as defined in `System/pillars.yaml`:

```
This week: {N} {pillar_1_name}, {N} {pillar_2_name}, {N} {pillar_3_name}. {Observation if imbalanced.}
```

---

## Save the output

After producing the review in chat, write the same content to `01_Inbox/Daily_Reviews/{YYYY-MM-DD}.md`. Read by `/week-review` to reconstruct the week.

## Interactive task board (live artifact)

After producing the text review, render an interactive task board using `mcp__visualize__show_widget` (call `mcp__visualize__read_me` with module `interactive` first if not already loaded this session).

**Board variant: daily-review (done-first)**

- Show **two sections**, in this order: "Done today" at the top, then "Still open" below.
- "Done today" contains tasks marked `[x]` in Tasks.md with today's completion date, plus any tasks the user checked off during this session. These are displayed with a checked (filled) checkbox and struck-through text. Clicking the checkbox un-completes them (moves back to open).
- "Still open" contains all remaining `[ ]` tasks from the "This week" section, sorted by priority.
- Each task row has: checkbox, task text, pillar pill, priority pill, people pills.
- Hover actions on open tasks: **Edit** (inline text + pillar + priority), **Remove**.
- No "+ Add task" button on the review board (that's a morning action).
- A **"Save changes to Tasks.md"** button at the bottom using `sendPrompt()`.

**Widget title:** `daily_review_task_board`

**Parsing and save mechanism:** Same as the daily-plan variant. Read `02_Tasks/Tasks.md`, parse all sections, preserve Next Week/Backlog in the save output even though they're not displayed.

**Styling:** Same CSS variable rules, pill colours, and dark mode overrides as the daily-plan variant.

## After the review

End with: "Want me to add any of the surfaced commitments to Tasks.md, or open a workstation for tomorrow?"

No long postamble.

---

## Editorial rules

- Australian English. No em dashes. No emojis. Sentence case headings. Direct.
- Don't restate the morning brief. The review is about delta, not repetition.
- If today was light (focus day, no meetings), the review should be 4-6 lines. Don't pad.
- Tomorrow's setup is forward-looking but short. The morning brief does the real work.

---

## Failure modes to avoid

- **Restating the daily plan.** That's already saved. The review is about *what changed*.
- **Asking to confirm every micro-update.** Surfaced commitments need confirmation; routine done-items don't.
- **Producing a slip list when nothing slipped.** "Nothing material slipped" is a valid answer.
- **Recommending tomorrow's priorities in detail.** That's `/daily-plan`'s job.
