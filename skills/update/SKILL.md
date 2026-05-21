---
name: update
description: "Brings an existing Pendo Sales Leader workstation in sync with the current plugin version's reference docs, system config, and folder structure. Compares the plugin's templates/ tree against the user's project, applies only the deltas, always backs up anything it overwrites, and surfaces release-note context. User-owned files (MEMORY.md, team.yaml, pillars.yaml, account workstations, person pages) are never touched. Triggers on \"/update\", \"update my workstation\", \"update pendo os\", \"sync pendo os\", \"pull plugin changes\", \"refresh my plugin context\"."
---

# Update reconciliation

The skill a user runs after the plugin auto-updates in Cowork. Cowork refreshes the skills themselves, but template-derived files in the user's workstation (reference docs, system schemas, identity-token files, folder scaffolding) were copied one-way by `/setup` and never touched again. As the plugin evolves, that gap widens; `/update` closes it without ever asking the user to re-run `/setup`.

When this skill finishes, the user has:

- Every plugin-managed reference file under `00_Resources/`, `Templates/`, `06_Functions/` brought up to the current version.
- Every system schema file under `System/` that the plugin controls (e.g. `cep-stages.yaml`) refreshed and parse-checked.
- Identity-token files (`CLAUDE.md`, `GETTING_STARTED.md`, `README.md` at workstation root) re-rendered with their existing captured identity.
- Any new top-level folders the plugin added since their install (e.g. `08_Pipeline/snapshots/`).
- A timestamped backup at `_update_backups/{ISO}/` containing the prior version of every file that changed.
- A plain-English summary naming what changed, what stayed user-owned, and where the backup lives.

User-owned content is never touched: `MEMORY.md`, `System/team.yaml`, `System/pillars.yaml`, `System/user-profile.yaml`, anything under `04_Accounts/Active/`, `05_People/`, `01_Inbox/`, `02_Tasks/`, `03_Goals/`, `04_Projects/`, `07_Career/`, `09_Archives/`.

## When to run

- After Cowork installs a new version of the Pendo Revenue Leader plugin.
- When a skill complains that a reference file or system schema looks stale.
- When the user notices a new template file in the changelog they want to pull in.
- Anytime, safely. If the workstation is already up to date, the skill exits cleanly with `Already on v{X}. Nothing to do.` and writes nothing.

## Constraints

These apply to every prompt the user sees and every file written.

- Australian English spelling throughout.
- No em dashes anywhere. Use a plain hyphen or rewrite the sentence.
- No emojis in any prompt, status line, or written file.
- Sentence case for headings.
- Voice is direct and plain. No hype, no apologies, no filler.
- Never overwrite a file without first copying its current content into the backup directory.
- Never touch files outside the explicit allowlist in `placeholder-map.yaml` Section 11.
- Never delete the `_update_backups/` directory or any prior backup.

---

## State machine

```
ENTRY
  | /update invoked
  v
U0 PRECHECK
  | locate .setup-state.yaml at the working dir
  | locate .claude-plugin/plugin.json on the plugin side
  | hash plugin.json, compare to state.plugin_version_hash
  |
  | no state file?      -> E_NO_STATE (warm message, point to /setup)
  | no plugin.json?     -> E_PLUGIN_MISSING (point to Cowork reinstall)
  | hash unchanged?     -> exit cleanly with "Already on v{X}"
  | in-progress flag?   -> R_RECOVER prompt
  | otherwise           -> U1
  v
U1 DIFF
  | walk placeholder-map.yaml `update_categories`
  | per file: compute H_plugin (render templated files), read H_live
  | build action list: CREATE / REPLACE / SEED / SKIP per the decision table
  | walk `dirs`: mark CREATE_DIR for any missing optional_scaffolding
  v
U2 PLAN
  | group actions for the confirm summary
  | read RELEASE_NOTES.md, extract entries between
  |   installed_plugin_version and current plugin.json version
  v
U3 CONFIRM
  | plain-English summary; AskUserQuestion options:
  |   Proceed (auto, recommended)
  |   Show full file list
  |   Prompt before each change
  |   Dry run (preview only, no writes)
  |   Cancel
  v
U4 BACKUP
  | write .update-in-progress.yaml with the planned action list
  | mkdir _update_backups/{ISO}/
  | copy every file the plan will REPLACE, preserving relative paths
  v
U5 APPLY
  | for each REPLACE: re-hash H_live (concurrent-edit guard);
  |   if changed since U1, refresh the backup; then write new content
  | for each CREATE: write the new file
  | for each SEED: write only if missing (race-safe re-check)
  | for each CREATE_DIR: mkdir, drop .gitkeep if requested
  v
U6 VERIFY
  | re-hash all writes
  | for entries with parse_check: yaml, parse the result
  | on any failure: restore from _update_backups/{ISO}/<path>,
  |   surface E_WRITE with path and reason
  v
U7 REPORT
  | print plain-English summary with absolute path to backup dir
  | bump .setup-state.yaml.installed_plugin_version to the new version
  | append the last_update block (at, from_version, to_version, backup_dir)
  | delete .update-in-progress.yaml
  v
DONE

Any step can transition to:
  E_NO_STATE      (no .setup-state.yaml at the working directory)
  E_PLUGIN_MISSING (no .claude-plugin/plugin.json reachable)
  E_MANIFEST      (placeholder-map.yaml missing the update_categories section)
  E_WRITE         (disk write failed at U4, U5, or U6)
  Q               (user picked Cancel at U3)
  R_RECOVER       (.update-in-progress.yaml from a prior interrupted run)
```

---

## State file additions

`/update` reads and writes the same `.setup-state.yaml` that `/setup` owns. It never reformats unrelated fields. After a successful run it adds (or overwrites) two top-level entries:

```yaml
installed_plugin_version: "0.5.0"   # bumped at U7 from whatever it was

last_update:
  at: "2026-05-21T09:14:03+10:00"
  from_version: "0.4.1"
  to_version: "0.5.0"
  backup_dir: "_update_backups/2026-05-21T09-14-03+10-00/"
  actions:
    replaced:    ["00_Resources/operating-model.md", "System/cep-stages.yaml"]
    created:     ["00_Resources/positioning.md"]
    seeded:      []
    created_dir: ["08_Pipeline/snapshots"]
    skipped:     ["CLAUDE.md"]
```

`plugin_version_hash` is also rewritten at U7 to match the now-installed version.

If `installed_plugin_version` is missing on entry (workstations set up before 0.5.0 that never recorded it), `/update` infers the from-version label from `plugin_version_hash` if it has a mapping, otherwise from the timestamp of `created_at`, otherwise prints "from an earlier version" in the summary copy. The diff itself does not need a precise from-version; the version label is for the user-facing summary only.

---

## Step U0. Precheck

**Pre-conditions:** none. Runs first on every invocation.

**Procedure:**

1. Resolve the user's project root. Start at the current working directory and walk up looking for `.setup-state.yaml`. Stop at the first hit. If none is found within five parent directories, raise E_NO_STATE.
2. Resolve the plugin root. Read the Cowork plugin install path for `pendo-revenue-leader`. From the plugin root, read `.claude-plugin/plugin.json`. On read failure raise E_PLUGIN_MISSING.
3. Compute SHA1 of `plugin.json` contents. Read the current `version` field as `plugin.version`.
4. Load `.setup-state.yaml`. Read `plugin_version_hash`, `installed_plugin_version`, and `captured.identity` (needed at U1 for templated re-renders).
5. If `plugin_version_hash` equals the freshly computed hash, print verbatim: `Already on v{plugin.version}. Nothing to do.` and exit cleanly. Skip U3 entirely.
6. If `_update_backups/.update-in-progress.yaml` (or `.update-in-progress.yaml` at the project root) is present, branch to R_RECOVER.
7. Otherwise proceed to U1.

**Failure modes:**

- **E_NO_STATE**: print `I can't find a Pendo workstation here yet. Try /setup if this is a new project, or run /update from the folder where your account workstations live.` then exit.
- **E_PLUGIN_MISSING**: print `The plugin files look incomplete. Try reinstalling Pendo Revenue Leader from the Cowork plugins panel, then come back.` then exit.

**R_RECOVER procedure:**

1. Read `.update-in-progress.yaml`. Pull `started_at` and `backup_dir`.
2. `AskUserQuestion`: `Looks like a previous /update was interrupted on {started_at}. I can put things back to how they were using {backup_dir}, or discard the partial run and try again. Which?` Options: `Restore from backup` / `Discard and retry` / `Cancel`.
3. On `Restore from backup`: for every file listed in the in-progress action list, copy `{backup_dir}/<path>` back to the workstation. Delete `.update-in-progress.yaml`. Print: `Restored {N} files from {backup_dir}. Your workstation is back to where it was before the interrupted run.`
4. On `Discard and retry`: delete `.update-in-progress.yaml` (keep `_update_backups/{ISO}/` untouched for the user's reference) and continue at U1.
5. On `Cancel`: exit without changes.

**Post-conditions:** project root resolved, plugin root resolved, action proceeds to U1 or exits.

---

## Step U1. Diff

**Pre-conditions:** U0 passed, plugin and project roots resolved.

**Procedure:**

1. Load the `update_categories` block from `placeholder-map.yaml`. If missing, raise E_MANIFEST.
2. For each entry in `update_categories.files`:
   a. Resolve the path in the plugin tree (prefer `templates/<path>`, fall back to `<path>` at the plugin root for `Templates/` and `06_Functions/` which already live there).
   b. Compute `H_plugin`. For `templated` entries, render the file first via the setup substitution engine using `captured.identity` from `.setup-state.yaml`, then hash the rendered output.
   c. Resolve the live path in the user's project. Compute `H_live` (null if the file does not exist).
   d. Apply the decision table:

      | Category | Live present | Hashes match | Action |
      |---|---|---|---|
      | managed_reference / system_schema / templated | no | n/a | CREATE |
      | managed_reference / system_schema / templated | yes | yes | SKIP |
      | managed_reference / system_schema / templated | yes | no | REPLACE |
      | user_owned_seed | no | n/a | SEED |
      | user_owned_seed | yes | n/a | SKIP |

3. For each entry in `update_categories.dirs`:
   - If the directory does not exist in the project, mark CREATE_DIR (with `.gitkeep` if `gitkeep: true`).
   - If it exists, SKIP. Never remove an existing scaffolding directory.

4. Files present in the user's project but not listed in `update_categories` are out of scope and ignored. Do not enumerate them.

**Decision-table edge cases:**

- A file marked `system_schema` is hashed exactly like `managed_reference`. The parse check happens at U6, not here.
- A file marked `templated` whose live hash differs only because the user's identity changed (e.g. role change) is correctly flagged REPLACE. The re-rendered output reflects current identity.
- A file marked `user_owned_seed` that the user has deleted (rare) is re-seeded from `seed_from` if defined, otherwise from `templates/<path>`.

**Failure modes:**

- **E_MANIFEST**: print `The plugin's update manifest looks malformed. Section 11 of placeholder-map.yaml is missing or unreadable. This is a plugin bug; share the version with Chris.` then exit.

**Post-conditions:** in-memory action list built, no disk writes yet.

---

## Step U2. Plan

**Pre-conditions:** U1 produced an action list.

**Procedure:**

1. Group the action list by action type. Count CREATE, REPLACE, SEED, CREATE_DIR, SKIP.
2. If every action is SKIP (no real changes after hash compare, even though the plugin version moved), print `The plugin version moved from v{from_version} to v{plugin.version} but nothing in your reference files changed. Updating the version pointer.` then jump to U7 to write the new version and exit. Do not show U3.
3. Otherwise, read `RELEASE_NOTES.md`. Extract all entries whose version header is strictly greater than `installed_plugin_version` and less than or equal to `plugin.version`. Use a simple semver lexical compare. Strip the version header lines and keep the bullet text.
4. Build the U3 summary copy (see below).

**Post-conditions:** summary ready to present.

---

## Step U3. Confirm

**Pre-conditions:** U2 built a non-trivial action list.

**Confirm copy** (compose dynamically; this is the shape):

```
Updating your Pendo workstation from v{from_version} to v{plugin.version}.

What is new since you installed:
 - v0.3.0: added /cotm-deal-analysis skill
 - v0.4.0: enriched operating model with MEDDPICC plus COTM plus CEP detail;
           added new positioning doc; rewrote CEP stages config
 - v0.5.0: this update flow

I will change {N_replace} files and add {N_create} new ones:
 - Refresh 00_Resources/operating-model.md
 - Refresh 00_Resources/communication-profile.md
 - Refresh System/cep-stages.yaml
 - Re-render CLAUDE.md with your current identity
 - Add 00_Resources/positioning.md (new in v0.4.0)

What I will not touch: your MEMORY.md, account folders, person pages,
team.yaml, pillars.yaml, anything under 01_Inbox/, 02_Tasks/, etc.

Your current versions of the changed files will be saved to:
  {absolute_path}/_update_backups/{ISO}/
```

**AskUserQuestion:** header `Update plan`, options:

1. `Proceed (auto, recommended)` - run U4 through U7.
2. `Show full file list` - print every action (one line per file with action and path), then re-prompt with the same options minus `Show full file list`.
3. `Prompt before each change` - run U4 through U7 but at U5 ask the user `Apply: {action} {path}?` per file with options `Apply` / `Skip this file` / `Cancel update`.
4. `Dry run (preview only, no writes)` - print the full action list, do not touch disk, do not write backup, exit. Tell the user `No changes made. Re-run /update when you are ready.`
5. `Cancel` - exit without changes.

**Post-conditions:** chosen path recorded; control transfers to U4 (or exits).

---

## Step U4. Backup

**Pre-conditions:** U3 returned Proceed or Prompt.

**Procedure:**

1. Compute the ISO timestamp `{ISO}` (local time with timezone offset, colons replaced with hyphens for filesystem safety: `2026-05-21T09-14-03+10-00`).
2. Write `.update-in-progress.yaml` at the project root with:

   ```yaml
   started_at: "<ISO 8601 local time>"
   from_version: "<state.installed_plugin_version or unknown>"
   to_version: "<plugin.version>"
   backup_dir: "_update_backups/{ISO}/"
   actions:
     replaced: [ ... ]   # full list
     created:  [ ... ]
     seeded:   [ ... ]
     created_dir: [ ... ]
   ```

3. `mkdir -p _update_backups/{ISO}/`.
4. For every file in `actions.replaced`, copy the live file to `_update_backups/{ISO}/<relative path>`, preserving the directory tree (mkdir as needed).
5. Files in `actions.created`, `actions.seeded`, and `actions.created_dir` produce no backup (no prior content to preserve).

**Failure modes:**

- Disk write fail -> E_WRITE. Delete `.update-in-progress.yaml` if it was written; print path and reason.

**Post-conditions:** backup directory populated, in-progress flag in place.

---

## Step U5. Apply

**Pre-conditions:** U4 succeeded.

**Procedure (in this order):**

1. For each entry in `actions.created_dir`: `mkdir -p` the directory. If the manifest entry has `gitkeep: true` and the directory is empty, write a zero-byte `.gitkeep` inside.
2. For each entry in `actions.created` (in lexical path order): write the plugin's content. For `templated` entries, render with `captured.identity` first.
3. For each entry in `actions.replaced` (in lexical path order):
   a. Re-hash the live file. Call this `H_live_now`.
   b. If `H_live_now` differs from `H_live` recorded at U1, the user edited the file between U1 and now. Refresh the backup: copy the current live file over `_update_backups/{ISO}/<path>` so the user can recover whatever they had at the moment of overwrite.
   c. Write the plugin's content (rendered if `templated`).
4. For each entry in `actions.seeded` (in lexical path order): re-check existence. If the file now exists, SKIP (a race created it between U1 and now). Otherwise copy from `seed_from` (or `templates/<path>` if no `seed_from`).
5. If U3 chose `Prompt before each change`: gate each of the above writes behind a per-file `AskUserQuestion` `Apply: {action} {path}?` with options `Apply` / `Skip this file` / `Cancel update`. On `Cancel update`, halt at the current file and proceed to U7 reporting what was done so far.

**Failure modes:**

- Disk write failure on any individual file -> attempt to restore from `_update_backups/{ISO}/<path>` if a backup exists, then raise E_WRITE with path and underlying message. Leave `.update-in-progress.yaml` in place so the next `/update` run can offer R_RECOVER.

**Post-conditions:** all chosen actions applied; ready for verification.

---

## Step U6. Verify

**Pre-conditions:** U5 applied without halting.

**Procedure:**

1. Re-hash every file `/update` wrote in U5. Confirm the on-disk hash matches what was intended (defends against silent partial writes).
2. For every entry in `update_categories.files` with `parse_check: yaml`, parse the new file as YAML. On parse failure:
   a. Restore the file from `_update_backups/{ISO}/<path>`.
   b. Surface `E_WRITE`: `The new {path} did not parse cleanly. I have restored your previous version from the backup. This is a plugin bug; share the backup folder and the plugin version with Chris.`
   c. Leave `.update-in-progress.yaml` in place; the next run will offer recovery.

**Post-conditions:** all writes verified; safe to commit the new version pointer.

---

## Step U7. Report

**Pre-conditions:** U6 verified all writes.

**Procedure:**

1. Update `.setup-state.yaml`:
   - Set `plugin_version_hash` to the new hash.
   - Set `installed_plugin_version` to `plugin.version`.
   - Set `updated_at` to now.
   - Append a `last_update` block with `at`, `from_version`, `to_version`, `backup_dir`, and the per-action lists.
2. Delete `.update-in-progress.yaml`.
3. Print the summary:

   ```
   Done. v{from_version} to v{to_version}.

   Refreshed:
    - 00_Resources/operating-model.md
    - 00_Resources/communication-profile.md
    - System/cep-stages.yaml
    - CLAUDE.md (re-rendered with your identity)

   Added:
    - 00_Resources/positioning.md

   Untouched (yours):
    - MEMORY.md, team.yaml, pillars.yaml, account folders, person pages.

   Backup of prior versions:
    - {absolute_path}/_update_backups/{ISO}/

   What to try next:
    - Open 00_Resources/positioning.md to see what is new.
    - Run /cotm-deal-analysis against a live deal to use the refreshed CEP stages.
   ```

   Tailor the "what to try next" lines to the actual change set: pick one or two lines that map to the files that changed. If nothing notable, omit the section.

4. Return control to Cowork.

**Post-conditions:** workstation is on `plugin.version`; backup retained; state file consistent.

---

## Cross-cutting

### Substitution engine

`/update` reuses the substitution function defined in `skills/setup/SKILL.md` cross-cutting section. The token map is built from `captured.identity` and `captured.manager` already stored in `.setup-state.yaml`. Runtime tokens (`{fiscal_year_label}`, `{current_fiscal_quarter}`) are left in place; the same deny-list applies.

If `captured.identity` is somehow missing from the state file (corrupted setup), refuse to render templated files: mark them SKIP with the warning `Cannot re-render {path}: identity not captured in .setup-state.yaml. Run /setup with the Update one section option to refresh identity, then re-run /update.`

### Hashing

Use SHA256 of raw file bytes. No newline normalisation; this is a single-user workstation, the user's filesystem is the source of truth. Files written by `/update` itself use the platform's default line endings (the templates ship with LF and we preserve that).

### Path resolution

The plugin tree contains `templates/` for the post-setup user tree, plus a small number of paths that ship outside `templates/` (notably `Templates/` and `06_Functions/`, which the user's project gets at the same relative root). The manifest paths are workstation-relative. For each manifest entry:

1. Try `<plugin_root>/templates/<path>` first.
2. Fall back to `<plugin_root>/<path>` if step 1 misses.

Live paths are always `<project_root>/<path>`.

### Warm failure copy

| Condition | User-facing message |
|---|---|
| No `.setup-state.yaml` | `I can't find a Pendo workstation here yet. Try /setup if this is a new project, or run /update from the folder where your account workstations live.` |
| No `plugin.json` | `The plugin files look incomplete. Try reinstalling Pendo Revenue Leader from the Cowork plugins panel, then come back.` |
| `update_categories` missing from placeholder-map.yaml | `The plugin's update manifest looks malformed. Section 11 of placeholder-map.yaml is missing or unreadable. This is a plugin bug; share the version with Chris.` |
| Disk write failed at U4/U5 | `Couldn't write to {path}: {reason}. Nothing has been changed. I've kept the in-progress flag so you can re-run /update when it's resolved.` |
| YAML parse-check failed at U6 | `The new {path} didn't parse cleanly. I've restored your previous version from the backup. This is a plugin bug; share the backup folder.` |
| Crash recovered | `Looks like a previous /update was interrupted on {started_at}. I can put things back to how they were using {backup_dir}, or discard the partial run and try again. Which?` |

### Adversarial cases

- **Workstation is already on the latest version.** Detected at U0 by hash compare. Exit immediately with `Already on v{X}. Nothing to do.` Never reach U3.
- **Workstation has no `installed_plugin_version`** (legacy state file). Use `unknown` in the summary copy. The diff itself works fine because it compares plugin to live, not plugin to baseline.
- **User has edited a managed file** (e.g. dropped local notes into `operating-model.md`). Auto mode replaces and backs up. The U7 summary names which files were replaced; the backup directory contains their prior version.
- **User deletes a managed file** between setup and update. Treated as CREATE; the file comes back at the new version. Their deletion is not preserved (the manifest declares the plugin owns the file).
- **User has uncommitted edits** to a managed file open in an editor when `/update` runs. U5 re-hashes the live file immediately before overwrite (concurrent-edit guard) and refreshes the backup if the bytes moved.
- **Plugin version moved but no manifest files changed.** Detected at U2; jump straight to U7 to update the version pointer without prompting. Saves the user a click.
- **Two updates needed** (user installed at 0.3.0, plugin is at 0.5.0). Treated as one diff against the latest manifest. The summary names the from-version and to-version; release notes between them are concatenated.
- **`templates/<path>` and `<path>` both exist** in the plugin. The manifest's path resolves against `templates/` first (rule above). If a future version needs different behaviour, add an explicit `plugin_path:` field to that manifest entry.
- **Filesystem case sensitivity** (macOS HFS+ is case-insensitive, APFS depends). Path compare uses literal strings; do not normalise case.
- **User's project root is inside a network mount** that drops mid-write. Caught by U6 hash check; restored from backup; surfaced as E_WRITE. The in-progress flag persists for the next run.

### What `/update` never does

- Never touches files outside the manifest. The user's own notes, account workstations, person pages, inbox, tasks, goals, and archives are invisible to it.
- Never overwrites `MEMORY.md`, `System/team.yaml`, `System/pillars.yaml`, or `System/user-profile.yaml`.
- Never deletes a file from the workstation. Removals are deferred until the manifest grows a `removed:` block.
- Never modifies `.claude-plugin/`, `dist/`, or `placeholder-map.yaml` itself.
- Never proceeds past U6 if a system_schema fails its parse check.
- Never emits em dashes, emojis, ALL CAPS, or American spellings.
- Never silently re-runs after a crash; recovery is explicit and prompted.

---

## Verification

Manual smoke test against the author's own workstation (no fixtures).

1. Confirm the working workstation has a `.setup-state.yaml`. If `installed_plugin_version` is missing, add it manually to whatever the current state was created at (e.g. `0.4.1`).
2. Bump `.claude-plugin/plugin.json` `version` to `0.5.0`.
3. Hand-edit `templates/00_Resources/operating-model.md` to add an obvious marker comment near the top.
4. Run `/update` in Cowork.
5. Assert the U3 prompt reads in plain English, names the operating-model.md refresh, lists at least one new file (this skill adds nothing new for 0.5.0 except the manifest), and names the backup path.
6. Pick `Proceed`.
7. Assert the U7 report names every file changed and the absolute backup path.
8. Open `_update_backups/{ISO}/00_Resources/operating-model.md`. Confirm it contains the marker from step 3.
9. Open the live `00_Resources/operating-model.md`. Confirm the marker is gone (replaced).
10. Re-run `/update`. Must short-circuit at U0 with `Already on v0.5.0. Nothing to do.`
11. Run `/cotm-deal-analysis` against a real deal. Confirm it reads the enriched CEP stage definitions without complaining.

**Crash-recovery check:** during step 6, interrupt the run between U4 (backup written) and U7 (state updated). Re-run `/update`. Must detect `.update-in-progress.yaml` and offer `Restore from backup` / `Discard and retry` / `Cancel`.

**Dry-run check:** run `/update` after another plugin version bump, pick `Dry run`. Confirm no writes happen, no backup directory created, and the summary still lists what would change.
