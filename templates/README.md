# Pendo OS

A starter workspace for Pendo GTM roles (CE, AD, sales leader, CSM) using Cowork as a daily AI assistant. Install the plugin, run `/setup`, and you'll have a working setup in 15 minutes that already understands the Pendo GTM model (CEP, MEDDPICC, Command of the Message, Pank Pillars).

---

## What this is

A PII-free template that contains:

- The Pendo GTM operating model (CE / AD / leadership / CS motion, CEP stages 0 to 6, MEDDPICC, Command of the Message).
- A clean folder structure: unified `04_Accounts/` (Active / Inactive / Archived).
- Per-account workstation pattern: active deals are folders with their own `CLAUDE.md` and `MEMORY.md`; cold companies are single files; closed deals are archived folders.
- Cowork-ready `CLAUDE.md`, `MEMORY.md`, and templates for everything you'll create.
- Generic Pendo pillars: edit `System/pillars.yaml` to match your role (CE, AD, leader, CSM defaults are commented at the bottom of the file).

It does *not* contain anyone's personal data, voice, or accounts. The `/setup` wizard fills those in from your live Salesforce and Slack workspaces.

---

## What this is not

- A Claude Code repo. This runs in Cowork on the desktop.
- A replica of any specific person's setup. It's the shared Pendo GTM foundation.
- A productivity silver bullet. It works because you fill it in and use it.

---

## Quick start

1. Install the Pendo Sales Leader plugin in Cowork.
2. In any Cowork session, type `/setup`.
3. The wizard walks you through 8 steps: folder pick, identity, pillars, team, accounts, voice, pipeline seed, sanity check.
4. After about 15 minutes you have a populated project. Try `/daily-plan` next.

Full walkthrough: `GETTING_STARTED.md`.

---

## What's inside

```
{your project root}/
|-- README.md                       This file
|-- GETTING_STARTED.md              Setup walkthrough (read this second)
|-- CLAUDE.md                       Root operating manual
|-- MEMORY.md                       Hot cache scaffold
|-- 00_Resources/                   Operating model, competitive intel, voice template
|-- 01_Inbox/                       Capture zone
|-- 02_Tasks/Tasks.md               Single backlog file
|-- 03_Goals/                       Quarter + week priorities
|-- 04_Accounts/                    Unified accounts (Active/Inactive/Archived)
|   |-- Active/{Account}/           folder workstation per active deal
|   |-- Inactive/{Account}.md       single file per cold company
|   `-- Archived/{Account}/         closed deals, state preserved
|-- 04_Projects/                    Cross-account work only
|-- 05_People/Internal + External/  Canonical person pages
|-- 06_Functions/                   Email_HQ, Outbound, Demos, Internal_Comms, Career_Dev
|   `-- _TEMPLATE/                  Copy when starting a new function workstation
|-- 07_Career/                      Career development
|-- 08_Pipeline/Deal_Pipeline.md    Generated weekly view
|-- 09_Archives/                    Closed meetings, old quarters
|-- System/                         pillars.yaml, user-profile.yaml, team.yaml, cep-stages.yaml
|-- memory/glossary.md              Decoder (acronyms, nicknames, terms)
`-- Templates/                      Person, company, meeting, project, rep templates
```

---

## Maintained by

Pendo GTM Enablement. If you find a gap or have a suggestion, raise it in the plugin's distribution channel.
