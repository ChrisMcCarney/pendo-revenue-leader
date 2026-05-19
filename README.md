# Pendo Revenue Leader

A Cowork plugin for RVPs and sales managers. Live Salesforce data, weighted forecast math, brand-ready artefacts. Fifteen minutes from install to a working operating system.

---

## Most pipeline reviews are built from memory

You walk into Monday's commit call holding three things: a screenshot from Friday, a half-finished spreadsheet, and whatever you remember from last week's 1:1s. Salesforce is the source of truth, but it is rarely the place you actually look. Your forecast is opinion dressed up as data.

The deck you build for it is off-brand. The action items you walk out with never make it back into Salesforce. By Friday you are doing it all again.

This plugin is the alternative.

## Run your week through Cowork instead

Type `/setup` once. Fifteen minutes later, your project is scaffolded from live Salesforce: every active deal is a folder, every direct report is a coaching page, every pillar of your role is a tag. From then on, Cowork is the surface you use to plan, prep, review, and forecast.

- Monday morning starts with `/daily-plan`. A short narrative paragraph followed by an open punch list, pulled from your calendar, Slack DMs, Gmail, Tasks.md, and every active workstation. Two minutes of reading sets the day.
- Pipeline calls run on `/avp-pipeline-review`. A live, interactive Cowork artifact that pulls every open opportunity for your team, weighs them at 100% commit, 80% forecast, and 25% upside, and calls out the deals where MEDDPICC is thin or pushes are stacking up. Numbers refresh on reload. No more screenshots.
- After every meeting, `/process-meetings` opens the Granola transcript, extracts decisions and action items, updates the workstation MEMORY, drops next steps onto the right person pages, and writes a two-sentence SE_Notes summary back to Salesforce.
- Friday wraps with `/week-review`. Shipped versus planned. Pillar balance. What slipped and why. The retrospective writes itself.

By the time you sit down with your manager for your forecast call, you have a defensible educated-edge number, a list of risks named by deal, and the next-step commitments for every one of them.

## What you get when you install

Thirteen skills, each scoped tightly.

### Planning and reflection

- `/setup`. The eight-step wizard. Reads your Salesforce User record, pulls your reports, lets you pick which deals to promote to active workstations, and writes a populated `System/team.yaml`, `pillars.yaml`, and `user-profile.yaml`. Resumable. Defaults to Pendo's fiscal calendar but always asks.
- `/daily-plan`. Morning brief plus open punch list. Pulls calendar, Slack DMs, Gmail, active workstation deltas, and Tasks.md. Three minutes of reading, no ranking.
- `/daily-review`. End-of-day reflection that closes the loop on the morning plan. What shipped, what slipped, what carries to tomorrow.
- `/week-plan`. Monday morning planning. Carryover from last week, this week's priorities by pillar, your interactive task board.
- `/week-review`. Friday retrospective. Pillar balance, completed versus carried, the patterns worth noticing.

### Meeting flow

- `/meeting-prep`. A short pre-meeting brief for any non-formal meeting. The right workstation, the relevant Slack history, the recent SFDC stage moves, the questions you should be asking.
- `/process-meetings`. Post-meeting capture. Granola transcripts in, structured updates out: workstation MEMORY, person pages, SE_Notes in Salesforce, Tasks.md with pillar tags.

### Pipeline and forecast

- `/regenerate-pipeline`. Rebuilds the full pipeline view from live Salesforce. Diffs against yesterday's snapshot to surface what changed. Organises the output by fiscal quarter (current quarter primary, next quarter secondary). Computes the fiscal year and quarter labels at runtime from your `fiscal_year_start_month`.
- `/avp-pipeline-review`. The big one. A live Cowork artifact rendered in your project at `08_Pipeline/`. Three tabs (rollup, team one, team two) plus a methodology tab. Weighted floor/forecast/upside math, MEDDPICC gap detection per deal, four risk flags, educated-edge call with a 50% haircut on deals carrying two or more flags. Reads team config from `System/team.yaml` in RVP mode or `System/avp-teams.yaml` in AVP mode. Refreshes on every reload.

### Account research

- `/company-research`. Fully automated prospect research. Pendo-branded HTML deck saved into the active workstation's `Resources/` folder. Maps every finding to a specific Pendo use case.
- `/strategy-map-research`. Ten-step research workflow for Strategic Alignment Value Strategy Maps. Mission statements, strategic priorities, key initiatives, business outcomes, value drivers, with Pendo product alignments. HTML output, brand-compliant.

### Brand and design

- `/pendo-design`. The Pendo FY27 Brand Design System bundled inside the plugin. `BRAND.md` spec, `colors_and_type.css` tokens, Sora and Inter variable font files, every logo and chevron asset, marketing and slides UI kits, preview cards for every component. Invoke it directly to brief Cowork on the brand, or let the asset-producing skills read it as a dependency.

## How it works under the bonnet

The plugin is built around three principles.

**Salesforce is the source of truth.** Skills that touch deal stage, close date, ARR, or owner never read those from local files. They run SOQL queries against your Salesforce connector at the moment they need the data. Local Markdown is for context, coaching notes, and narrative, not for canonical deal fields.

**Configuration lives in your project, not in skill prompts.** Your team membership, your pillar definitions, your fiscal calendar, your timezone, your manager all live in three small YAML files under `System/`. The skills read them at runtime. When your team changes, you edit `team.yaml` and every skill picks up the change immediately. No re-install, no re-setup.

**Brand discipline is non-negotiable.** Every asset-producing skill (`/company-research`, `/strategy-map-research`, `/avp-pipeline-review`) reads the bundled Pendo Design System before generating output. Pendo Pank `#FF4876` as accent only, Sora Bold for display, Inter for body, sentence case throughout, no emoji, radial gradients on edges, rounded card corners. The methodology tab in `/avp-pipeline-review` is itself a worked example of the brand applied to a live data dashboard.

## Install

### Option A: install from GitHub (recommended)

```
/plugin marketplace add https://github.com/ChrisMcCarney/pendo-revenue-leader
/plugin install pendo-revenue-leader@pendo-revenue-leader
```

Or via the Cowork UI: plugins panel, "Add marketplace from URL", paste the repo URL, install.

You get automatic updates whenever new commits land on `main`. No manual zip uploads.

### Option B: side-load a local clone

```
git clone https://github.com/ChrisMcCarney/pendo-revenue-leader
```

Then in Cowork's plugins panel choose "Install from local folder" and point at the clone. Useful if you want to fork or modify.

### Option C: download a release zip

Each tagged release on GitHub attaches a `pendo-revenue-leader-<version>.zip` asset. Download it, then upload via the Cowork plugins panel.

## Set up your project

The first thing to run after install:

```
/setup
```

Eight steps. The wizard:

1. **Picks the folder.** Cowork directory picker, with a free-text fallback if the picker is not available in your build.
2. **Captures your identity.** Name, role, region, city, timezone, work email, manager, fiscal calendar. Pre-fills from Salesforce and Slack where it can. Asks before assuming.
3. **Defines your pillars.** Three Pendo RVP starter pillars (Sales Partnership, Tech Win Rate, Thought Leadership), or rename them, or start blank.
4. **Pulls your team.** SOQL query against `User.ManagerId` returns your direct reports. Slack handles auto-resolve via email match. You classify each rep as direct report or region peer.
5. **Selects your top accounts.** SOQL returns your team's top twenty open opportunities by Net ARR. You multi-select the ones to promote to active workstations. Each gets a `04_Accounts/Active/{Name}/` folder seeded from live SFDC.
6. **Installs the voice template.** A generic Pendo RVP voice you can personalise later.
7. **Seeds your pipeline.** Invokes `/regenerate-pipeline` to validate Salesforce end-to-end and write your first `08_Pipeline/Deal_Pipeline.md`.
8. **Summarises and finishes.** Plain English read-out of what got created, plus a per-connector status line naming which optional connectors are still missing and which skills need them.

You can quit and resume any time. The state lives in `.setup-state.yaml` at your project root.

## What is in the box

```
your-project/
|-- README.md
|-- GETTING_STARTED.md
|-- CLAUDE.md                        Root operating manual
|-- MEMORY.md                        Hot-cache scaffold
|-- 00_Resources/                    Operating model, communication profile, voice
|-- 01_Inbox/                        Capture zone, daily plans, weekly notes
|-- 02_Tasks/Tasks.md                Single backlog file
|-- 03_Goals/                        Quarter and week priorities
|-- 04_Accounts/                     Unified accounts (Active/Inactive/Archived)
|   |-- Active/{Account}/            Folder workstation per active deal
|   |-- Inactive/{Account}.md        Single file per cold company
|   `-- Archived/{Account}/          Closed deals, state preserved
|-- 04_Projects/                     Cross-account work only
|-- 05_People/Internal + External/   Canonical person pages
|-- 06_Functions/                    Email_HQ, Outbound, Demos, Internal_Comms
|-- 07_Career/                       Career development
|-- 08_Pipeline/                     Generated weekly view + daily snapshots
|-- 09_Archives/                     Closed meetings, old quarters
|-- System/                          pillars.yaml, team.yaml, user-profile.yaml,
|                                    cep-stages.yaml
|-- memory/glossary.md               Decoder (acronyms, nicknames, terms)
`-- Templates/                       Person, company, meeting, project, rep
```

## Configuration files

Three files in `System/` shape every skill.

- **`user-profile.yaml`**. Name, role, region, city, timezone, manager, fiscal year start month, communication preferences. Edit any field directly and skills pick up the change.
- **`team.yaml`**. Direct reports, region peers, manager. Each entry has `name`, `sfdc_owner_name`, `slack`, and `role`. Optionally `like_pattern` for fuzzy SOQL matching. Skills that scope by team read this at runtime.
- **`pillars.yaml`**. Three pillar objects with `id`, `name`, `description`, and `keywords`. Skills tag tasks, action items, and meeting outputs against these.

Optional:

- **`avp-teams.yaml`**. If present, `/avp-pipeline-review` runs in AVP mode and renders one tab per team rather than treating `team.yaml` as a single team. Schema lives in the `avp-pipeline-review` SKILL.md.

## Update workflow

When a new commit lands on `main`, Cowork pulls it automatically. No action needed.

If you want to contribute changes:

```
git clone https://github.com/ChrisMcCarney/pendo-revenue-leader
cd pendo-revenue-leader
# make edits
git add <files>
git commit -m "..."
git push
```

Open a pull request if you want changes reviewed before they hit `main`.

## Connectors

The setup wizard pings each connector at start. Required connectors block; optional connectors degrade gracefully.

| Connector | Required for | Skills affected if disconnected |
|---|---|---|
| Salesforce | `/setup`, all pipeline and forecast skills | `/setup`, `/regenerate-pipeline`, `/avp-pipeline-review`, `/process-meetings` (SE_Notes write) |
| Slack | `/setup` team handle resolution (degrades) | `/daily-plan`, `/meeting-prep`, `/process-meetings` |
| Google Calendar | Daily and weekly cadence | `/daily-plan`, `/daily-review`, `/week-plan`, `/week-review`, `/meeting-prep` |
| Gmail | Daily and weekly cadence | `/daily-plan`, `/week-review` |
| Granola | Meeting capture | `/process-meetings` |

When an optional connector is missing, the dependent skill surfaces a clear "connect X to use this" message rather than failing silently.

## Editorial conventions

The plugin enforces a small set of rules everywhere it produces output.

- **Australian English** spelling throughout (organise, colour, prioritise, behaviour).
- **No em dashes**. Plain hyphens or rewrites.
- **No emojis** in any branded output. The icon vocabulary is chevron, lightning, pink check, pink arrow, number circle, pill or badge, all from the bundled Pendo Design System.
- **Sentence case** for headings, titles, buttons, navigation. ALL CAPS reserved for eyebrow labels with the brand's 0.22em tracking.
- **Salesforce as the source of truth** for stage, ARR, close date, owner. Local files never override.
- **No assumptions about region, city, timezone, or fiscal calendar**. The setup wizard always asks.

These rules are baked into every skill prompt and verified by the bundled brand system.

## Roadmap

Deferred from 0.1.0 to 0.2.0:

- `/consolidate-memory`. Structured pass that summarises and dedupes accumulated entries in MEMORY.md and per-workstation MEMORYs.
- Voice auto-customisation from your sent-Slack history.
- Multi-team AVP support beyond two teams in `/avp-pipeline-review`.
- Non-Salesforce CRM support.

## Feedback

Open an issue at [github.com/ChrisMcCarney/pendo-revenue-leader/issues](https://github.com/ChrisMcCarney/pendo-revenue-leader/issues).

For Pendo-internal questions, message Chris McCarney in Slack.

## Licence and credits

Proprietary, internal Pendo distribution. See `LICENCE` if one is added later in the repo.

Derived from a personal RVP operating system. The bundled skills inherit conventions and the CEP stage model from Pendo's GTM playbook. The Pendo FY27 Brand Design System is bundled under the `pendo-design` skill with permission from Pendo Brand.
