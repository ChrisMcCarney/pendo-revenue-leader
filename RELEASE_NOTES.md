# Release notes

## 0.6.6

Tighten `/account-health-plus` scope to the customer's use of the Pendo application. The previous version pulled end-user data from the customer's own Pendo subscriptions as a secondary enrichment path; this version removes that path and grades adoption only on how the customer's employees use Pendo.

- Delete Step 4b (customer-owned-sub Pendo MCP calls): `visitorQuery`, `productEngagementScore`, `guideMetrics`, `listGuides`, `npsScore`, `get_feedback_insights`, `get_feedback_items`, `sessionReplayList`, `agent_analytics_key_metrics`. Step 4 is now a single path against pendo-internal.
- Fail-fast condition 5 triggers when the account cannot be found in pendo-internal; customer-owned-sub access is no longer evaluated.
- Step 6 drops the MAU/published-guides/feedback-items fallback rubric. Adoption is graded only from the pendo-internal employee top-features signal. MAU figures remain in Section 4 as billing/entitlement reference, not adoption evidence.
- Report template: remove the "End-user deep usage" subsection. Synced end-user counters (`da_visitors30/90`, `da_events30/90`) stay as billing/entitlement reference only, clearly labelled. NPS and Feedback subsections now surface Pendo-module usage (Sentiment surveys published, Listen admin engagement) rather than end-user responses.
- Drop the "not in pendo-internal but using their own Pendo sub" edge case; that path now fails fast under condition 5.

## 0.6.5

Close a setup-time gap that broke `/account-health-plus` on fresh installs and surfaced as a missing-file error on a new device.

- Ship `templates/00_Resources/pricing-packaging-mapping.md` so `/account-health-plus` no longer fail-fasts on a fresh install with "this skill requires `00_Resources/pricing-packaging-mapping.md` in your workstation". The file is now plugin-managed; previously it was documented as user-supplied.
- Ship `templates/00_Resources/brand/fy27/INDEX.md` and `templates/00_Resources/brand/fy27/README.md` so the FY27 brand reference cited in `CLAUDE.md`'s References table resolves on first install.
- Register all three files in `placeholder-map.yaml` as `managed_reference` so `/update` backfills them for existing workstations on the next session.
- Add a required-files audit at `/setup` step S8 (renumbered: new step 7, close moved to step 8). After the state file finalises, the audit walks the `managed_reference`, `system_schema`, and `user_owned_seed` entries in `placeholder-map.yaml` and surfaces any missing file as a warning in the summary. Belt-and-braces guardrail against interrupted template copies.
- Trim the now-outdated "Not shipped with the plugin" note from `skills/account-health-plus/SKILL.md` line 522. The fail-fast logic at line 28 is unchanged.

## 0.6.4

`/avp-pipeline-review` now lets each leader set the upside dollar floor used in the math call (previously hardcoded to A$75,000). On first run the skill prompts for the value and persists it.

- RVP mode: prompts once, writes `upside_threshold:` to `System/team.yaml`.
- AVP mode: prompts for `upside_threshold_default:` in `System/avp-teams.yaml`, then offers optional per-leader overrides as `upside_threshold:` inside each team entry. Subsequent runs are silent unless a new manager appears without a configured floor.
- The 25% upside weight is unchanged.
- The generated artifact now renders the chosen floor in every place it was previously hardcoded (metric tiles, methodology tab, deal-detail headers, copyable plain-text reports). In AVP mode where teams differ, each team's tile shows its own floor and the rollup tile shows "team floor".

New template: `templates/System/avp-teams.example.yaml` documents the AVP schema with one default and one per-leader override.

## 0.6.3

Patch fix to the SessionStart hook manifest location and shape. v0.6.2 declared the hook at `.claude-plugin/hooks.json` with a top-level `{"SessionStart": [...]}` structure; Cowork didn't recognise either and the hook stayed invisible in the Customize panel.

Corrected per the Claude Code plugin reference:

- File moved to `hooks/hooks.json` (the plugin's `hooks/` directory, alongside `check-update.sh`).
- JSON wrapped in `{"hooks": {...}}` per the documented schema:
  ```json
  {
    "hooks": {
      "SessionStart": [
        {
          "matcher": "",
          "hooks": [
            {"type": "command",
             "command": "bash \"${CLAUDE_PLUGIN_ROOT}\"/hooks/check-update.sh"}
          ]
        }
      ]
    }
  }
  ```
- `${CLAUDE_PLUGIN_ROOT}` is now quoted so paths with spaces resolve correctly.

`hooks/check-update.sh` itself is unchanged.

## 0.6.2

Patch fix to the SessionStart hook delivery mechanism.

- The 0.5.1 design wired the hook by having `/setup` and `/update` write a `SessionStart` entry into the workstation's `.claude/settings.json`. That meant the hook was invisible in Cowork's Customize panel (Cowork only surfaces what the plugin declares in its manifest), and it never activated for users until they ran `/update` at least once — which they couldn't be reminded to do because the hook wasn't yet installed. Classic chicken-and-egg.
- New `.claude-plugin/hooks.json` declares the SessionStart hook at the plugin level. Cowork auto-installs it as soon as the plugin is enabled. The Customize panel surfaces it alongside Skills. No `/setup` or `/update` step required to wire it.
- `.claude-plugin/hooks.json` uses `${CLAUDE_PLUGIN_ROOT}` to reference the bundled `hooks/check-update.sh` script portably; the path resolves at runtime to wherever Cowork installs the plugin.
- `/setup` S5b simplified to a status line only (no longer prompts to register; Cowork handles it).
- `/update` U5 hook-registration step removed (no longer prompts to register; Cowork handles it). The "Settings hook" cross-cutting subsection in `skills/update/SKILL.md` is rewritten to describe the new mechanism.
- `README.md` "Auto-update reminder" section rewritten to reflect plugin-manifest install rather than opt-in registration.
- `hooks/check-update.sh` itself is unchanged. The script's logic (walk up from CWD for `.setup-state.yaml`, hash-compare, emit `additionalContext` only on mismatch, silent otherwise) is identical to v0.5.1.

**Migration story for workstations that were on v0.5.1-0.6.1 with manually-registered hooks:** the old `.claude/settings.json` entry still works (it points to the same `check-update.sh` script). You don't have to touch it. If you want to clean it up, delete the SessionStart block from `.claude/settings.json` after v0.6.2 lands; Cowork's plugin-managed hook covers the same ground.

## 0.6.1

Patch for `/account-health-plus`: fix the two-tier Pendo data model so the skill actually runs for Pendo employees instead of fail-fasting on customer-sub access.

- The 0.6.0 skill assumed Pendo employees had admin scope on the customer-owned Pendo subscription (where end users live). In practice they almost never do, so the original fail-fast at Step 4 killed the brief on most accounts. The skill now anchors its primary usage view on **pendo-internal** (subId `5668600916475904`), where each Pendo customer appears as an account whose visitors are the customer's employees administering Pendo. Pendo sellers, SEs, and CS almost always have access to pendo-internal.
- Step 4 rewritten with two clearly labelled paths: PRIMARY (`accountQuery` + `visitorQuery` + `activityQuery` against pendo-internal for employee usage, top features, top pages, top visitors) and SECONDARY (only when accessible: original deep queries against customer-owned subs for end-user guide views, NPS, feedback, session replay).
- New fail-fast: only stop if neither plane is accessible (no pendo-internal match AND no accessible customer-owned subs). The old "no customer-sub access" fail-fast is gone.
- Report Section 1 split into "Admin-side activity (customer's employees using Pendo)" and "End-user activity (customer's product, synced into pendo-internal)" plus an optional deep-dive subsection when customer-owned sub access exists.
- Report Section 2 reframed as "Pendo modules employees actually use" with the top 15 features grouped by Analytics / Guides / Settings / Nav. Surfaces the data-analyst headline explicitly (canonical Mixpanel-vs-Pendo signal).
- Section 4 adoption-grading rubric in Step 6 now defaults to a feature-usage-based grade (employee top-features list) with the old MAU-based rubric retained as a fallback when customer-owned sub access exists. When both signals disagree, the report names the disagreement and leans on feature-usage.
- New "Common edge cases" entries for (a) account not in pendo-internal but customer-owned sub accessible, (b) customer with multiple Pendo account IDs in pendo-internal.

Entitlement crosswalk, CRE pull, opportunity/EB pull, MEDDPICC red flags, and the report writing rules are unchanged.

## 0.6.0

New skill: `/account-health-plus`. A unified pre-call, renewal-prep, or QBR brief for any Pendo customer. Fuses live SFDC entitlements with live Pendo product usage to produce a single markdown document covering engagement, feature usage, NPS, feedback, CRE, normalised FY25 module entitlements (with legacy-to-FY25 crosswalk), per-module adoption grading, evidence-backed upsell plays, renewal status with EB and MEDDPICC red flags, top stakeholders, and discussion topics.

- `skills/account-health-plus/SKILL.md` added. Output saves to `04_Accounts/Active/{Name}/Notes/{YYYY-MM-DD}-account-health.md` and auto-creates the workstation folder from `04_Accounts/Active/_TEMPLATE/` if it doesn't exist.
- Requires the Salesforce connector, Pendo MCP access to at least one of the account's customer subscriptions, and a workstation-local `00_Resources/pricing-packaging-mapping.md` (the legacy-to-FY25 packaging crosswalk; not shipped with the plugin because it contains proprietary Pendo packaging detail). The skill fails fast with a warm message if any of these are missing.
- Triggers on `/account-health-plus`, "deep health on {name}", "full account brief for {name}", "renewal prep for {name}", "QBR prep for {name}", and casual phrasings like "what's going on with {account}" when context implies a customer.

## 0.5.1

Locks down `CLAUDE.md` and pairs it with a user-owned `CLAUDE_USER.md` companion. Adds a `SessionStart` hook that auto-invokes `/update` when the plugin has new content. Fixes two outright misclassifications from v0.5.0 where files that should be user-owned were being treated as plugin-managed.

- `templates/CLAUDE.md` gains a Section 0 "User overrides" callout. The section tells the runtime (and the user) that `CLAUDE.md` is plugin-managed and replaced on every `/update`; user customizations belong in `CLAUDE_USER.md` at the workstation root; on conflict, `CLAUDE.md` wins.
- New `templates/CLAUDE_USER.md` ships as a thin starter with named sections (Local references, Local skills, Local preferences, Local people / accounts / projects). Classified as `user_owned_seed` in `placeholder-map.yaml` Section 11: created once if missing, never overwritten.
- Reclassified to `user_owned_seed`:
  - `00_Resources/voice-principles.md` (the setup wizard's S6 explicitly described it as a starter template the user customizes; previous `managed_reference` classification was a bug).
  - `System/Backlog.md` (a user capture zone, not plugin reference content).
- New `hooks/check-update.sh` SessionStart hook. Walks up from CWD looking for `.setup-state.yaml`, compares the workstation's stored `plugin_version_hash` against the plugin's current `plugin.json` hash, and emits `additionalContext` instructing Claude to invoke `/update` only on mismatch. 99% of session starts are silent.
- `/setup` S8 prompts to register the SessionStart hook in `.claude/settings.json` at the workstation root (opt-in, recommended).
- `/update` U5 detects an unregistered hook on existing workstations and prompts once to add it. Pre-existing hooks from other sources are preserved.
- `/update` confirm and report copy refreshed: surfaces the CLAUDE.md / CLAUDE_USER.md migration callout for first-time runs to v0.5.1, names the absolute backup path for the old CLAUDE.md, and explicitly lists CLAUDE_USER.md among the untouched user-owned files.

**Migration story for existing workstations:** run `/update` once. Your customized `CLAUDE.md` will be backed up to `_update_backups/{ISO}/CLAUDE.md`. The new plugin `CLAUDE.md` and a starter `CLAUDE_USER.md` will land in place. Copy any custom references, skills, or preferences from the backup into `CLAUDE_USER.md`. The hook gets registered (with your consent). From then on, plugin updates auto-detect at session start and `CLAUDE_USER.md` is untouched on every future `/update`.

## 0.5.0

`/update` skill lands. Existing users can pull in new reference docs, system schemas, and folder structure without re-running `/setup` or losing local content.

- `skills/update/SKILL.md` added. State machine mirrors `/setup`: precheck, diff, plan, confirm, backup, apply, verify, report. Default conflict policy is auto-replace with backup; user-owned files (`MEMORY.md`, `team.yaml`, `pillars.yaml`, `user-profile.yaml`, account workstations, person pages) are never touched. Plain-English confirm prompt, warm failure copy, dry-run mode, prompt-per-change mode, crash recovery via `.update-in-progress.yaml`.
- `placeholder-map.yaml` gains Section 11 (`update_categories`). Every plugin-managed file is explicitly classified as `managed_reference`, `system_schema`, `templated`, `user_owned_seed`, or `optional_scaffolding`. Files absent from the section are out of scope and never touched by `/update`.
- `skills/setup/SKILL.md` S8 now writes `installed_plugin_version` into `.setup-state.yaml` alongside `plugin_version_hash`. `/update` reads this to name the from-version in its summary.
- `_update_backups/{ISO}/` directory at the workstation root holds the prior version of every file `/update` overwrites. Discoverable (no dot prefix) so users can recover from Cowork's file tree.
- `RELEASE_NOTES.md` is read at U2 of every `/update` run; entries between the user's installed version and the current plugin version are surfaced in the confirm prompt so users see what they are about to pull in.

## 0.4.1

No-op release to verify the Cowork marketplace update flow. No template, skill, or behaviour changes.

## 0.4.0

Operating model enrichment landed across the templated reference set.

- `templates/00_Resources/operating-model.md` rewritten with nine sections sourced from the official Pendo CEP, COTM Day 1, and COTM Day 2 decks. Adds the FY27 CE role, hybrid AD, RS, sales leadership tiers; corrects CEP stages 5 and 6 to the post-sale value journey (Ready to purchase, Value realisation); adds MEDDPICC "know or assume" discipline and per-letter pressure tests; introduces the MEDDPICC-to-COTM bridge; new Champion and Economic Buyer sections; full COTM frame with eleven-element glossary, Mantra ritual, trap-setting, Pitch vs COTM, Tell / Show / Tell.
- `templates/00_Resources/positioning.md` added. 5-lead context layer thesis, earned-right narrative, five-verb model (Observe / Understand / Act / Prove / Optimise), CIO pitch, CPO pitch, expansion thesis. Split from operating-model so deal mechanics and product positioning stay distinct.
- `templates/System/cep-stages.yaml` rewritten with customer-state framing. Stage 5 = Ready to purchase, Stage 6 = Value realisation. Closed Won and Closed Lost reclassified as SFDC `StageName` outcomes rather than CEP stages.
- `templates/MEMORY.md` common-terms table fixes the MEDDPICC decode (was missing Paper Process, treated Compelling Event as a separate letter). Adds lifecycle acronyms (PBO, NC, RBO, BVA, JVP, MAP, IKT, CRE, WWNTBT) and role acronyms (SE, AE, EAD, RS, FLM, RVP).
- `skills/cotm-deal-analysis/SKILL.md` step 1a expanded to require both Salesforce Prod and Pendo MCP connectors. Without Pendo MCP the "Why Pendo & trap-setting" section is theoretical rather than account-specific; the skill now probes both, surfaces only the missing one(s), and tags the brief sections that were degraded.

## 0.1.0 (initial release)

The first shareable version of the Pendo Revenue Leader plugin, derived from a personal RVP operating system and templatised for any Pendo revenue leader.

Source: [github.com/ChrisMcCarney/pendo-revenue-leader](https://github.com/ChrisMcCarney/pendo-revenue-leader).

### What ships

**Skills (12):**

1. `/setup` - eight-step wizard that scaffolds a working project in 15 minutes.
2. `/daily-plan` - morning brief plus open punch list.
3. `/daily-review` - end-of-day reflection.
4. `/week-plan` - Monday morning planning.
5. `/week-review` - Friday retrospective.
6. `/meeting-prep` - pre-meeting brief.
7. `/process-meetings` - post-meeting capture into workstations, person pages, SFDC SE notes.
8. `/regenerate-pipeline` - rebuild the pipeline view from live Salesforce, with daily diffs.
9. `/avp-pipeline-review` - live Cowork artifact with weighted floor/forecast/upside math, MEDDPICC gap detection, risk flags, copyable per-team reports, and an educated-edge call. Reads team config from `System/team.yaml` (RVP mode) or `System/avp-teams.yaml` (AVP mode). Requires the user to drop their `assets/artifact-template.html` into the skill folder before first invocation; the skill prompts clearly when missing.
10. `/company-research` - HTML account research deck, Pendo-branded.
11. `/strategy-map-research` - HTML strategy map research deck, Pendo-branded.
12. `/pendo-design` - the Pendo FY27 Brand Design System. Bundles `BRAND.md`, `colors_and_type.css`, fonts (Sora, Inter variable TTFs), logos and icons, marketing and slides UI kits, and preview cards for every component. Single source of truth for all Pendo-branded output.

**Templates:** a complete scaffolded project tree at `templates/`, including the operating model, communication profile, CEP stage definitions, MEDDPICC framing, person and meeting templates, and a derived active-account workstation template. The Pendo brand system is no longer scaffolded into the user's project as a duplicate; it lives inside the `pendo-design` skill and is read from there by the skills that produce branded assets.

**Brand compliance:** every asset-producing skill (`/company-research`, `/strategy-map-research`, `/avp-pipeline-review`) is wired to read the `pendo-design` skill before generating output. Non-negotiable rules enforced: Pank `#FF4876` as accent only, Sora Bold for display, Inter for body, sentence case throughout, no emoji, radial gradients on edges only, rounded card corners.

**Change from earlier draft:** `pendo-brand-guidelines` and `pendo-slides` were consolidated into a single `pendo-design` skill. `.pptx` output is no longer produced; the Pendo FY27 design system is HTML-first, and the research skills now generate self-contained HTML decks.

**Configuration:** `placeholder-map.yaml` documents every token the `/setup` wizard captures, plus the runtime config-lookup pattern for skills that read team, pillars, or fiscal calendar at run time.

### Deferred to 0.2.0

- `consolidate-memory` skill: the source did not include this skill at any expected path. Recorded in `BLOCKERS.md` as B1. Will be authored in 0.2.0 as a structured pass that summarises and dedupes MEMORY.md entries.
- Marketplace submission automation: 0.1.0 produces a packaged `.plugin` archive and a publish-ready README; the actual marketplace publish remains manual.
- Voice auto-customisation from Slack history.
- Non-Salesforce CRM support.

### Constraints applied throughout

- Australian English spelling.
- No em dashes anywhere.
- No emojis in branded output.
- Sentence case headings.
- Salesforce is the source of truth for structured deal data; skills never read deal stage, close date, or ARR from `MEMORY.md`.
- Templates and skills never assume a region, city, timezone, or fiscal calendar. `/setup` always asks.

### Plugin distribution

- Source tree: `~/Developer/PendoOS_Plugin/`
- Packaged archive: `dist/pendo-revenue-leader-0.1.0.plugin`
- Manifest: `.claude-plugin/plugin.json`
- Marketplace stub: `.claude-plugin/marketplace.json`

### Acknowledgements

Derived from a personal RVP operating system. The bundled skills inherit conventions and the CEP stage model from Pendo's GTM playbook.
