---
name: process-meetings
description: Pull Granola transcripts from recent meetings, extract decisions and action items, and auto-update workstation MEMORY.md, Tasks.md, person pages, and SFDC SE_Notes__c. The post-meeting capture skill. Triggers on "/process-meetings", "process my meetings", "capture from yesterday", "update workstations from meetings", "log my calls", "what did I commit to in [meeting]".
---

# Process Meetings

{user_name}'s post-meeting capture skill. Reads Granola transcripts from recent meetings, extracts decisions, commitments, and action items, then propagates updates to all the right places: workstation MEMORY.md, Tasks.md, person pages' Recent Interactions, and SFDC SE_Notes__c.

This is the highest-leverage skill in the set: every customer call generates context that disappears unless captured. Run it daily or after each customer block.

---

## Configuration to load at run time

Before processing, read the following config files. Do not assume any team member, pillar, or account is hardcoded.

- **Team membership.** Read `System/team.yaml`. The `direct_reports`, `region_peers`, and `manager` blocks define who counts as "internal team". Any meeting where every external-looking attendee is actually in one of those lists is an internal meeting and should not produce SFDC updates.
- **Pillars.** Read `System/pillars.yaml`. Use the `name` and `keywords` of each entry to assign a pillar tag to every Tasks.md commitment. Never hardcode pillar names.
- **Active accounts.** Glob `04_Accounts/Active/*/` at run time. Each folder is one workstation. Use the folder names to match meeting attendees and titles to accounts.

---

## When to run

- End of day, before `/daily-review`.
- Immediately after a high-stakes customer call.
- When {user_first_name} says "process meetings", "what did I commit to", "log yesterday's calls", or names a specific meeting.
- After an extended absence to catch up on a backlog of unprocessed calls.

---

## What to identify first

Before pulling transcripts, scope:

1. **Time window.** Default: meetings since the last `/process-meetings` run. If never run, default to the last 24h. If {user_first_name} says "yesterday" or names a date, use that.
2. **Which meetings.** Pull from Granola via `query_granola_meetings` or `list_meetings`. Filter to meetings that were actually attended (not declined, not no-shows).
3. **Account tagging.** For each meeting, identify if it maps to an active workstation by checking `04_Accounts/Active/*/`. If every external-looking attendee is in `System/team.yaml` (direct reports, region peers, or manager), tag the meeting as internal.

---

## What to pull (per meeting)

1. **Granola transcript:** `get_meeting_transcript` for the meeting ID.
2. **Granola summary:** Granola's own AI summary if present, as a sanity check against your extraction.
3. **Workstation MEMORY.md:** if the meeting is account-tagged, read the workstation's current MEMORY.md so you know what to update vs duplicate.
4. **Live SFDC:** for account-tagged meetings, pull the Opportunity record so SE_Notes__c append is accurate.

## What to extract from each transcript

For every meeting, extract:

- **Decisions made:** anything the customer or {user_first_name} agreed to. Mark who said what.
- **Action items:** commitments by {user_first_name} (go in Tasks.md) and commitments by the customer (go in workstation MEMORY.md as open questions).
- **Risk signals:** champion volatility, competitor mentions, pricing pushback, executive churn, timeline slips.
- **MEDDPICC updates:** new info on Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion, Competition, Compelling Event.
- **Quotes worth keeping:** customer language that captures pain or value better than {user_first_name} could paraphrase.

If the transcript is thin or the meeting was administrative (e.g., scheduling), skip extraction and just log the meeting happened.

---

## What to write (auto-update everything)

Per {user_first_name}'s preference, write all updates without asking permission. Report what was done at the end. Order matters: update local files first (cheap, reversible), then SFDC (more friction to roll back).

### 1. Workstation MEMORY.md (if account-tagged)

Append to the workstation's `MEMORY.md`:

- **Snapshot section:** update if stage, close target, or risk has shifted. Reference the meeting date and Granola link.
- **Contacts section:** update champion strength, add new contacts surfaced.
- **Open questions:** add any unresolved items from the call.
- **Key Decisions log:** date-stamped entry: `{DD/M} - {one-line decision summary}`.
- **Risks:** if a new risk emerged, add it explicitly.

Keep the workstation MEMORY.md narrative tight. Don't dump the transcript in. Synthesise.

### 2. Tasks.md

Append {user_first_name}'s commitments as new tasks. Format per existing Tasks.md convention. Tag the right pillar by matching task text against the `keywords` of each pillar in `System/pillars.yaml`. If no keywords match for an account-tagged commitment, default to the first pillar listed in `pillars.yaml`. Format:

```
- [ ] [{pillar_name}] {action} (from {Account} {DD/M})
```

### 3. Person pages

For each external attendee, append a one-line entry to their `05_People/External/{Name}.md` Recent Interactions section:

```
- {YYYY-MM-DD}: {meeting type}, {one-line outcome or quote}
```

For internal attendees (anyone in `System/team.yaml`), only update if the meeting surfaced something material about them (career news, role change, project ownership shift).

### 4. SFDC SE_Notes__c

For each account-tagged meeting, append to the Opportunity's `SE_Notes__c` field. Format per `00_Resources/salesforce-fields.md`: `DD/M - note text`. Append-only, never rewrite. Keep each note 2-4 lines max:

```
6/5 - Discovery call with {Champion A} + 2 others. They confirmed {competitor} renewal pushed to July, gives us a wider window. Risk: {contact} leaving end of May, {contact} interim. Demo reset planned for week 3 May, agenda TBD. Action: send revised demo flow by 12/5.
```

If SE_Risk_Level__c needs to shift based on the call (e.g., new risk surfaced, or risk resolved), update that field too. Only adjust the level, don't touch SE_Deal_Risk_Notes__c without asking.

### 5. Connector health

If Granola is unreachable for any meeting, surface that meeting at the end as "transcript unavailable, manual capture needed in `04_Accounts/Active/{Account}/Notes/`". Don't fabricate content from calendar metadata.

---

## Output shape

After all updates are written, produce a single summary message in this shape:

### Processed meetings

Compact list:
```
- 6/5 09:30 {Account A} discovery ({Champion A} +2): MEMORY updated, 2 tasks added, SE_Notes appended, person page touched ({Champion A})
- 6/5 14:00 {Account C} prep ({Contact}): MEMORY updated (risk: gating step still TBD), 1 task added, SE_Notes appended
- 6/5 16:00 Internal 1:1 ({manager_name}): person page touched, no workstation/SFDC updates
```

### Items needing your attention

Anything the skill couldn't auto-decide:
```
- {Account A}: customer raised pricing concern, didn't reach a number. Worth following up with {Champion A} offline?
- {Account C}: {Contact} mentioned {competitor} did a similar bake-off with another customer in the same sector. Want me to pull that into competitive-intel?
```

### Unresolved

Meetings the skill couldn't process (transcript missing, account untagged, ambiguous content):
```
- 6/5 11:00 [Calendar event with no Granola transcript]: capture manually if relevant.
```

End with: "Want to expand any of these or roll back a specific update?"

---

## Editorial rules

- Australian English. No em dashes. No emojis. Sentence case headings. Direct.
- Never assume the user is in a specific city, timezone, or region. Use {user_timezone} and {user_region} from identity config.
- Don't write paragraphs into MEMORY.md. Synthesise into one or two lines per update.
- SE_Notes are append-only and dated. Never rewrite history.
- When in doubt about a person's role or context, check `05_People/` before updating their page.
- If a meeting was a focus block or `DO NOT BOOK OVER`, don't process. Those aren't external commitments.

---

## Failure modes to avoid

- **Dumping transcript content into MEMORY.md.** The whole point is synthesis. If you're copying sentences verbatim, you're doing it wrong.
- **Writing duplicate tasks.** Before adding a task, scan Tasks.md for the same commitment already logged.
- **Writing duplicate SE_Notes.** Before appending, scan the last 7 days of SE_Notes__c for the same content.
- **Updating SE_Risk_Level__c without justification.** Only flip Green->Yellow->Red when there's a specific transcript signal. Note the signal in SE_Notes too.
- **Processing internal-only meetings as if they're customer calls.** A 1:1 with anyone listed in `System/team.yaml` doesn't need an SFDC update.
- **Hardcoding pillars, team members, or accounts.** Always resolve from `System/pillars.yaml`, `System/team.yaml`, and `04_Accounts/Active/*/` at run time.
- **Silently failing.** If Granola is down for one meeting, say so. Don't pretend you processed it.
