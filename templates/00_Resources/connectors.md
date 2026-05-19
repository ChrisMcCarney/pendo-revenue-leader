# Connector reference

*Loaded on trigger when something connector-related happens (failure, new connector, debugging). Behaviour rules live in root `CLAUDE.md`.*

---

## Critical, always-on

Must be reachable for default workflows. If one is down, surface that before producing output. Never silently work from cached `MEMORY.md`.

| Connector | What it's for | Failure mode if offline |
| --- | --- | --- |
| **Salesforce** | Source of truth for opportunity, account, MEDDPICC, deal notes. Always pull live before any deal-stage decision. | Recommendations made off stale workstation `MEMORY.md` |
| **Pendo MCP** | Customer Pendo product data (visitors, accounts, guides, NPS, segments, agent analytics). | Adoption signals invented from web search |
| **Slack** | DMs (commitments, asks), channel posts (team channel, practice channel, account channels). | Slack context check skipped; commitments missed |
| **Gmail** | Email threads, follow-ups, customer comms history. | Replies drafted without thread state |
| **Google Calendar** | Schedule, meeting prep, time-of-day awareness. | `/daily-plan` and time-of-day awareness can't run |
| **Google Drive** | Decks, business cases, demo materials, working docs. | Can't attach or reference shared documents |

---

## Standard, often-on

Reach for these when relevant; not part of every workflow.

| Connector | What it's for | Reach for it when... |
| --- | --- | --- |
| **Granola** | Meeting transcripts, summaries, action items. | `/process-meetings`, post-call recap, pulling decisions from a specific meeting. Skip if not used for that meeting. |
| **Notion** | Internal Pendo wiki and team docs. | Finding internal best-practice content, team enablement, or shared playbooks. |

---

## Personal extensions

Role-specific connectors you choose to add. Examples:

- **Looker / Tableau / Mode** for sales leaders pulling pipeline analytics.
- **Gong / Chorus** for call review and coaching workflows.
- **LinkedIn Sales Navigator** for prospecting and account research.

Add a row when one becomes part of the routine.

| Connector | What it's for | When to use |
| --- | --- | --- |
| {add} | {add} | {add} |

---

## Fallbacks

- If Granola is missing for a meeting, fall back to manual notes in the workstation `Notes/` folder.
- Never silently substitute web search for a connector that's down. Surface what's offline and offer the next-best path.
- If Salesforce is down for a planning run, work from workstation `MEMORY.md` and flag every line as "from cached state, SFDC unreachable".
