# Asset folder for avp-pipeline-review

The skill expects `artifact-template.html` to live in this folder. The template holds the JavaScript that queries Salesforce via the bundled MCP tool name and renders the live dashboard (tabs, weighted math, MEDDPICC chips, risk flags, copyable plain-text reports, AVP rollup).

This folder ships empty in 0.1.x. Drop your working template here before invoking the skill, or the skill will surface a clear "template missing" message and abort.

## Required template substitution tokens

The template must contain these placeholders for the skill to fill in at runtime:

- `{{SOQL_TOOL}}` - exact MCP tool name (e.g. `mcp__claude_ai_Salesforce_Prod__soqlQuery`).
- `{{USER_NAME}}` - from `System/user-profile.yaml`.
- `{{USER_TITLE}}` - from `System/user-profile.yaml` `role`.
- `{{QUARTER_LABEL}}` - computed at runtime, e.g. `Q2 FY27`.
- `{{QUARTER_START}}` - ISO date of fiscal-quarter start.
- `{{QUARTER_END}}` - ISO date of fiscal-quarter end.
- `{{TEAMS_JS}}` - JS array literal of `{ name, manager, reps, like_clauses }` objects.
- `{{UPSIDE_THRESHOLD_TEAM1}}` - integer Net ARR floor for TEAM1's upside slice (resolved by SKILL.md Step 2b).
- `{{UPSIDE_THRESHOLD_TEAM2}}` - integer for TEAM2's floor, or `0` in RVP single-team mode.
- `{{METHODOLOGY_UPSIDE_FLOOR}}` - human-readable sentence for the methodology tab describing the upside floor (RVP uses the single value; AVP describes the default + per-team overrides).

## Template requirements

The template should follow the plugin's editorial constraints:

- Australian English.
- No em dashes.
- No emojis in tab labels, button text, or any visible string.
- Sentence case for headings.
- Salesforce as source of truth for stage, ARR, and close date.

See `SKILL.md` in the parent folder for the full configuration reference, including the SOQL query template, weighted-math formula, risk-flag conditions, and MEDDPICC field mapping.
