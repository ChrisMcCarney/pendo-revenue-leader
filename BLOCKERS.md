# Build blockers

## B1 — consolidate-memory skill not found

The brief lists `consolidate-memory` as skill #13, source `~/.claude/skills/consolidate-memory/`. That path does not exist. Searched `~/.claude/skills/`, `~/Developer/PendoOS/`, `~/Developer/PendoOS/00_Resources/skill-packages/`. No skill by that name exists locally.

**Proposed resolutions:**
1. Ship 0.1.0 with 12 skills, drop `consolidate-memory` from the manifest, note as deferred to 0.2.0.
2. Stub a placeholder `consolidate-memory` skill that summarises and dedupes MEMORY.md entries (the implied function). Author from scratch in Phase 4.

**Decision taken for this autonomous run:** option 1. The plugin ships with 12 skills. `consolidate-memory` is recorded as a 0.2.0 follow-up in `RELEASE_NOTES.md`.

---
