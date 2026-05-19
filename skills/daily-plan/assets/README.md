# Asset folder for daily-plan

The skill expects `artifact-template.html` to live in this folder. The template holds the JavaScript that renders the Daily command centre: a four-tab Cowork artifact (Day, Tasks, Inbox, Methodology) that queries Salesforce at view time for the drift chips on Tab 1 and bakes Slack, Gmail, calendar, and Tasks.md content in at build time.

If the template is missing, the skill surfaces a clear "template missing" message and aborts rather than fabricating one.

## Required template substitution tokens

The template must contain these placeholders for the skill to fill in at runtime:

- `{{SOQL_TOOL}}` - exact MCP tool name (e.g. `mcp__claude_ai_Salesforce_Prod__soqlQuery`). The Day tab's drift logic calls this at view time.
- `{{USER_NAME}}` - from `System/user-profile.yaml`.
- `{{USER_TITLE}}` - from `System/user-profile.yaml` `role`.
- `{{USER_TIMEZONE}}` - from `System/user-profile.yaml` `timezone`.
- `{{TODAY_ISO}}` - today's date in the user's timezone (YYYY-MM-DD).
- `{{TODAY_HUMAN}}` - today's date formatted long, e.g. `Tuesday, May 19, 2026`.
- `{{NARRATIVE_BRIEF}}` - the 3-5 sentence prose brief Claude has already produced for chat output. HTML-escaped.
- `{{CALENDAR_JS}}` - JS array literal of today's events. Each event: `{time, end, title, attendees, note, account_folder, opp_id, is_focus, is_no_book_over}`.
- `{{ACCOUNT_BASELINES_JS}}` - JS object literal keyed by `opp_id`, value `{stage, close_date, net_arr, risk}` snapshotted from the workstation `MEMORY.md` at build time. The Day tab's drift logic compares live SFDC against these.
- `{{TASKS_MD}}` - raw `02_Tasks/Tasks.md` content, base64-encoded or JSON-string-escaped so the parser can split lines safely.
- `{{INBOX_JS}}` - JS array of Slack and Gmail items needing attention. Each item: `{source, sender, snippet, permalink, captured_in_tasks, suggested_task}`.
- `{{PIPELINE_CHANGES_MD}}` - today's `08_Pipeline/changes/{date}.md` content as a JSON-string-escaped string, or empty string if no change log exists yet.
- `{{ACTIVE_ACCOUNTS_JS}}` - JS array of active account folder names from globbing `04_Accounts/Active/*/`.
- `{{PILLARS_JS}}` - JS array of pillar names from `System/pillars.yaml`. Used to render pillar pills in the Tasks tab.

## Template requirements

The template follows the plugin's editorial constraints, identical to `avp-pipeline-review`:

- Australian English.
- No em dashes.
- No emojis in tab labels, button text, or any visible string.
- Sentence case for headings.
- Salesforce is the source of truth for stage, close date, net ARR, and risk level on the Day tab. Workstation `MEMORY.md` values are baseline only; if SFDC disagrees the chip turns Pank.
- Inbox and Tasks tabs do not query MCP tools at view time. They show the build-time snapshot only.
- Methodology tab is fully static (no MCP dependency) so a viewer with Salesforce disconnected still sees how the dashboard works.

## Brand inheritance

The artifact must follow the Pendo FY27 brand defined by the `pendo-design` skill. The template inlines the brand tokens (`Pank #FF4876` accent only, Sora Bold for display, Inter for body, sentence case, no emoji, dark theme by default, rounded card corners) so it renders correctly inside the Cowork sandbox where external CSS may not load.

See `SKILL.md` in the parent folder for the full configuration reference, including the drift-query SOQL template and the Tasks.md parsing rules.
