# Getting started with Pendo OS

A 15-minute Cowork-native walkthrough. Zero terminal required.

---

## Step 0: Install the plugin in Cowork (1 min)

Install the Pendo Sales Leader plugin from Cowork's plugin marketplace, or side-load the `.plugin` archive. Once installed, the plugin's skills (`/setup`, `/daily-plan`, `/meeting-prep`, and the rest) appear in Cowork's slash menu automatically.

---

## Step 1: Run /setup (12 min)

In Cowork, type:

> `/setup`

The wizard walks you through eight steps. Each step uses a confirmation prompt so you can quit and resume at any point.

1. **Folder pick.** Choose where your project lives on disk. Cowork creates the folder and writes the templated tree into it.
2. **Identity.** Name, role, manager, region, city, timezone, work email, fiscal year start month (default February for Pendo). Cowork writes `System/user-profile.yaml` and fills the identity block in `CLAUDE.md` and `MEMORY.md`.
3. **Pillars.** Three sensible defaults for your role; edit names if you want. Cowork writes `System/pillars.yaml`.
4. **Team composition.** Pulled live from Salesforce: your direct reports and region peers. Slack handles resolved automatically. Cowork writes `System/team.yaml` and stubs `05_People/Internal/{Name}.md` per rep.
5. **Top accounts.** Pulled live from Salesforce: your top 10 open opportunities by Net ARR. Multi-select which to promote to active workstations. Cowork creates `04_Accounts/Active/{Account}/` for each, seeded with live SFDC data.
6. **Voice.** Copy the generic Pendo voice template. You can refresh from your real Slack and email later.
7. **Pipeline seed.** Invokes `/regenerate-pipeline` to write your first `08_Pipeline/Deal_Pipeline.md`. Validates the Salesforce connection end-to-end.
8. **Sanity check.** Plain-English summary of what was created. Offers a quick fix-up if anything looks off.

---

## Step 2: Try it (1 min)

In Cowork, type:

> `/daily-plan`

Cowork reads your calendar, Slack DMs, Tasks.md, and active workstation memory, then produces a brief.

---

## Step 3: Set up your Monday pipeline regen (1 min)

The `/regenerate-pipeline` skill can run automatically every Monday morning.

In Cowork, type:

> "Create a scheduled task `weekly-pipeline-regen` that fires every Monday at 7am {user_city} time. It should run `/regenerate-pipeline`: discover all `04_Accounts/Active/*/` workstations, pull live Salesforce data for each Opportunity ID, reconcile against MEMORY.md, write `08_Pipeline/Deal_Pipeline.md`, and surface flags."

Cowork creates the task. Click "Run now" once in the Scheduled UI to pre-approve the Salesforce connector for unattended Monday runs.

If you prefer manual: just say "rebuild pipeline" any time.

---

## What's next

- **Day 1:** Top accounts and top people in. One workstation set up. Try `/daily-plan` and `/meeting-prep`.
- **Week 1:** Add the next tier. After meetings, try `/process-meetings`. Try Cowork built-ins (`discovery-prep`, `se-deal-room`, `pendo-outbound`).
- **Month 1:** Workstation pattern feels natural. Monday pipeline regen runs automatically. `memory/glossary.md` has 30+ entries.

---

## Connectors to install in Cowork

Install via Cowork's connector menu (one-time):

- **Salesforce** (deal source of truth)
- **Pendo MCP** (customer Pendo product data)
- **Slack** (DMs, channels, search)
- **Gmail** (drafts, search, labels)
- **Google Calendar** (events, scheduling)
- **Google Drive** (decks, business cases)
- **Granola** (meeting transcripts)
- **Notion** (Pendo wiki), optional

---

## Troubleshooting

- **Cowork doesn't seem to know me.** Did `/setup` complete cleanly? Open `MEMORY.md` and `System/user-profile.yaml` and confirm they're populated.
- **Slash commands don't fire.** Confirm the plugin is enabled in Cowork's plugin manager. Restart Cowork after toggling.
- **Cowork doesn't know about an account.** Tell it the account name. If the folder doesn't exist under `04_Accounts/Active/{Name}/`, ask Cowork to promote it.
- **Cowork's draft doesn't sound like me.** Voice template is generic. Update `00_Resources/voice-principles.md` or ask Cowork to refresh from Slack.
- **Folder feels heavy.** Keep MEMORY.md under about 90 lines. Active workstations under 10.

---

## Keeping your workstation up to date

When Cowork installs a new version of the plugin, run `/update` to pull in any new reference docs, system schemas, or folder additions. Your `MEMORY.md`, `team.yaml`, `pillars.yaml`, account folders, and person pages are never touched. Anything overwritten lands in `_update_backups/{ISO}/` at your project root so you can recover prior versions.

---

## File structure reference

```
{your project root}/
|-- CLAUDE.md                       behaviour rules (~150 lines)
|-- MEMORY.md                       hot cache (~80 lines)
|-- 00_Resources/                   loaded on trigger
|-- 01_Inbox/                       capture
|-- 02_Tasks/Tasks.md               single backlog
|-- 03_Goals/                       quarter + week
|-- 04_Accounts/
|   |-- Active/{Account}/           folder workstation
|   |-- Inactive/{Account}.md       single file
|   `-- Archived/{Account}/         closed
|-- 04_Projects/                    cross-account only
|-- 05_People/Internal | External/  canonical person pages
|-- 06_Functions/                   Email_HQ, Outbound, Demos, etc.
|-- 07_Career/
|-- 08_Pipeline/Deal_Pipeline.md    generated
|-- 09_Archives/
|-- System/                         config
`-- memory/glossary.md              decoder
```
