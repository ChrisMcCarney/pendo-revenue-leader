#!/usr/bin/env bash
# SessionStart hook for the Pendo Revenue Leader plugin.
#
# Emits additionalContext telling Claude to run /update if and only if the
# plugin's current plugin.json hash differs from the workstation's last-recorded
# plugin_version_hash in .setup-state.yaml. Otherwise exits silently.
#
# Any failure (missing files, malformed YAML, unreadable hash) falls through
# to a silent exit so a broken hook never blocks a session start.

set -uo pipefail

# Walk up from CWD looking for .setup-state.yaml (project root marker).
dir="$(pwd)"
state_file=""
for _ in 1 2 3 4 5; do
  if [[ -f "$dir/.setup-state.yaml" ]]; then
    state_file="$dir/.setup-state.yaml"
    break
  fi
  parent="$(dirname "$dir")"
  [[ "$parent" == "$dir" ]] && break
  dir="$parent"
done

# No state file in this tree -> not a Pendo workstation, exit silently.
[[ -z "$state_file" ]] && exit 0

# Plugin path is the script's own directory parent.
plugin_root="$(cd "$(dirname "$0")/.." && pwd 2>/dev/null)" || exit 0
plugin_json="$plugin_root/.claude-plugin/plugin.json"
[[ -f "$plugin_json" ]] || exit 0

# Hash plugin.json. Prefer shasum (macOS default); fall back to sha1sum (linux).
if command -v shasum >/dev/null 2>&1; then
  current_hash="$(shasum -a 1 "$plugin_json" 2>/dev/null | awk '{print $1}')"
elif command -v sha1sum >/dev/null 2>&1; then
  current_hash="$(sha1sum "$plugin_json" 2>/dev/null | awk '{print $1}')"
else
  exit 0
fi
[[ -z "$current_hash" ]] && exit 0

# Pull stored hash from the state file.
stored_hash="$(grep -E '^plugin_version_hash:' "$state_file" 2>/dev/null | head -1 \
  | sed -E 's/^plugin_version_hash:[[:space:]]*"?([^"#[:space:]]+)"?.*/\1/')"

# Pull both versions for the user-facing message.
stored_version="$(grep -E '^installed_plugin_version:' "$state_file" 2>/dev/null | head -1 \
  | sed -E 's/^installed_plugin_version:[[:space:]]*"?([^"#[:space:]]+)"?.*/\1/')"
current_version="$(grep -E '"version"' "$plugin_json" 2>/dev/null | head -1 \
  | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')"

# Match -> silent.
[[ "$current_hash" == "$stored_hash" ]] && exit 0

# Mismatch -> emit additionalContext for Claude.
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "The Pendo Revenue Leader plugin has been updated since this workstation was last synced (was v${stored_version:-unknown}, now v${current_version:-unknown}). Invoke the /update skill before responding to the user so the workstation's reference docs and system schemas catch up. /update is non-destructive: it backs up any file it replaces and never touches user-owned content (MEMORY.md, team.yaml, pillars.yaml, account workstations, person pages, CLAUDE_USER.md, voice-principles.md, Backlog.md)."
  }
}
EOF
