---
name: meeting-prep
description: Light pre-meeting brief for any non-formal meeting (1:1s, internal syncs, follow-ups). For formal SE/CE prep (discovery, demo, technical eval), defer to Cowork's `discovery-prep` instead. Triggers on "/meeting-prep", "prep me for", "meeting brief", "what do I need before this", "next meeting prep", "got [name] in 30".
---

# Meeting prep

Your quick pre-meeting brief for {user_first_name}. Fires 5-15 minutes before any meeting that isn't a formal SE engagement (those go through Cowork's `discovery-prep`).

This skill is for: 1:1s, internal syncs, customer follow-ups, casual customer chats, manager check-ins, peer working sessions. Anything where you need context loaded fast without the full discovery-prep ceremony.

---

## Config to load at skill init

Before running, resolve runtime context. Do not hardcode names, pillars, or accounts.

1. **Team.** Read `System/team.yaml`. Use `direct_reports` for "my team" scope, `direct_reports + region_peers` for "{user_region} region" scope, and `manager.name` for the user's manager.
2. **Pillars.** Read `System/pillars.yaml` for pillar names, descriptions, and keywords. Use these when classifying meeting context by pillar.
3. **Active accounts.** Glob `04_Accounts/Active/*/` at run time. Each folder is one active account workstation.

User identity is already substituted at install time: {user_name}, {user_first_name}, {user_role}, {user_region}, {user_city}, {user_timezone}.

---

## When to run

- 5-15 minutes before a meeting you want context on.
- When a meeting is named ("prep me for the {Account A} 2pm" / "what do I need for my manager 1:1").
- When the natural language is informal ("got {name} in 30" / "next meeting?").

If the request is for a discovery, demo, or technical eval, route to `discovery-prep` instead. This skill is the lighter cousin.

---

## What to identify first

Before pulling anything, identify:

1. **Who.** Attendees. Internal vs external. Cross-check internal attendees against `System/team.yaml` to know whether they are a direct report, a region peer, or the user's manager.
2. **What.** Meeting title and any agenda from the calendar event.
3. **When.** Time until it starts (brief or thorough accordingly). Use {user_timezone} when interpreting calendar times.
4. **Is this actually a formal SE engagement?** If yes, stop and suggest `discovery-prep`.

---

## What to pull

Run in parallel.

1. **Calendar event:** description, attached docs, attendee list.
2. **Person pages:** for each external attendee, read `05_People/External/{Name}.md`. For each internal attendee, read `05_People/Internal/{Name}.md`. Skip if it's a solo focus block.
3. **Workstation MEMORY.md:** if this meeting is tagged to an active account (matched against the `04_Accounts/Active/*/` glob), load that workstation's MEMORY.md.
4. **Recent Slack:** search the past 7 days in DMs and account channels for any context with these attendees. Surface anything material (commitment made, ask raised, decision pending).
5. **Recent Gmail:** last 5 threads with the external attendees, focused on anything not yet replied to or with an open commitment.
6. **Live SFDC:** if `/daily-plan` already reconciled this opp today, skip. Otherwise pull StageName, CloseDate, SE_Risk_Level__c, recent SE_Notes__c.

## What NOT to pull

- Granola for past meetings (handled by `/process-meetings`).
- Full company file (workstation MEMORY is the synthesis).
- Web search.

---

## Output shape

Tight. You have 5-15 minutes. Keep it scannable.

### 1. One-line context (always)

`{Who} | {When} | {Why this matters in one phrase}`

Example: `{Name}, AE | 14:00 today (in 25m) | {Account A} SE assignment question, you're chasing`

### 2. Open thread (if any)

The single most important unresolved item between you and the attendee(s). Pulled from Slack/Gmail/workstation MEMORY. Skip if nothing's open.

### 3. Recent interactions (1-3 bullets)

The last 1-3 material exchanges. From person page Recent Interactions or Slack/Gmail. Date each one.

### 4. Your likely angle (1-2 bullets)

What you probably want out of this meeting. Inferred from open commitments, deal stage, or past pattern. Leave it out if nothing's clear rather than guess.

### 5. Suggested questions to surface (optional)

Two or three questions you could ask. Only include if there's a real gap to fill.

---

## After the brief

End with: "Anything missing, or want me to surface a specific angle?"

No postamble. Read, attend, move on.

---

## Editorial rules

- Australian English. No em dashes. No emojis. Sentence case headings. Direct.
- Never assume region, city, or timezone. Use {user_region}, {user_city}, {user_timezone} as set in user-profile.yaml.
- Lead with what matters, not what's scheduled.
- If context is thin, say so. Don't pad.
- If the meeting is routine with no open threads, the brief should be short. "Nothing open between you" is a valid output.
- After the meeting, run `/process-meetings` to capture the recap.

---

## Failure modes to avoid

- **Recreating discovery-prep.** If the prep gets long, you're in the wrong skill.
- **Padding when nothing's open.** A short, honest brief beats a long padded one.
- **Repeating workstation MEMORY verbatim.** Synthesise: what matters *now*, not everything that's known.
- **Skipping the discovery-prep redirect.** If this is a formal first customer call, surface that.
- **Hardcoding names or pillars.** Always read `System/team.yaml` and `System/pillars.yaml` at run time.
