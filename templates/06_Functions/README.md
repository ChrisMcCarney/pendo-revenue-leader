# Functions

*Per-function isolated contexts. Permanent and cross-account.*

When the conversation routes into a function workstation, that workstation's `CLAUDE.md` and `MEMORY.md` scope the context. The root `CLAUDE.md` still applies; everything else is read on demand.

## Typical functions

- `Email_HQ/`, your inbox triage and email drafting hub
- `Outbound/`, outbound prospecting workflow
- `Demos/`, demo prep and library
- `Internal_Comms/`, leadership updates, recognition, FAQs
- `Career_Dev/`, your own career, evidence, reviews
- `Team_Coaching/`, optional for leaders, coaching plans and feedback

Add or remove functions to match your role.

## Creating a new function

1. Copy `_TEMPLATE/` to `{Function_Name}/`.
2. Edit the new `CLAUDE.md` (Identity, Resources, Workflow, Editorial Rules).
3. Edit the new `MEMORY.md` (snapshot of cadence, in-flight work).

No routing-map edit needed. Cowork picks the function up by folder name.

## Account workstations live elsewhere

Per-account workstations live in `04_Accounts/Active/{Account}/`, not here. See `04_Accounts/README.md`.
