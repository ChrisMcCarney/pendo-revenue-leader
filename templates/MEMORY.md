# MEMORY.md

*Hot cache. Top 30 people, common terms, active projects, current preferences. Target around 80 lines.*

*Last updated: {YYYY-MM-DD}*

---

## Me

{user_name}. {user_role} at {company_name}. {user_city}. Reports to {manager_name}. Owns the {user_region} sales number, team performance, forecast, and strategic accounts across the region.

---

## People (top ~30)

### Internal

<!--
The /setup wizard populates this table from System/team.yaml during Step 4.
Replace the example row below with your direct reports, region peers, and
key cross-functional partners. Keep the table under ~15 rows so MEMORY.md
stays a hot cache rather than a directory.
-->

| Who | Role |
| --- | --- |
| **{direct_report_1_first_name}** | {direct_report_1_name}, {direct_report_1_role} - direct report (Slack: {direct_report_1_slack}) |

Full internal list: `05_People/Internal/`. Canonical profiles are `05_People/` themselves.

### External (active deal contacts)

| Who | Company | Role |
| --- | --- | --- |
| **{Nickname}** | {Company} | {Role} |

Full external list: `05_People/External/`. Canonical profiles are `05_People/` themselves.

---

## Team pipeline (top deals by rep)

*Primary deal visibility layer. Full pipeline view: `08_Pipeline/Deal_Pipeline.md`.*

### {Rep Name} - {Territory} | Quota: ${X}

| Account | Stage | Close | Net ARR | Forecast |
| --- | --- | --- | --- | --- |
| **{Account A}** | {CEP} | {YYYY-MM-DD} | {$Xk} | {Commit} |
| **{Account B}** | {CEP} | {YYYY-MM-DD} | {$Xk} | {Best Case} |
| **{Account C}** | {CEP} | {YYYY-MM-DD} | {$Xk} | {Pipeline} |

Rep coaching page: `05_People/Internal/{Rep}.md`

### {Rep Name} - {Territory} | Quota: ${X}

| Account | Stage | Close | Net ARR | Forecast |
| --- | --- | --- | --- | --- |
| **{Account A}** | {CEP} | {YYYY-MM-DD} | {$Xk} | {Commit} |

Rep coaching page: `05_People/Internal/{Rep}.md`

## Account workstations ({user_first_name} personally engaged)

*Full workstations only for deals {user_first_name} touches weekly. Target: 6 or fewer.*

| Account | Stage | Rep | Notes |
| --- | --- | --- | --- |
| **{example_account}** | {CEP stage} | {Rep} | {one-liner} |

Deep state: `04_Accounts/Active/{Account}/MEMORY.md`.

---

## Active projects

| Project | What |
| --- | --- |
| **{Project Name}** | {one-liner} |

Cross-account projects: `04_Projects/`. Account-bound projects: `04_Accounts/Active/{Account}/Projects/`.

---

## Current quarter / week

- **Q-goal anchors:** see `03_Goals/Quarter_Goals.md`.
- **This week's priorities:** see `03_Goals/Week_Priorities.md`.

---

## Common terms (top ~30)

| Term | Meaning |
| --- | --- |
| **CE** | Customer Engineer |
| **AD** | Account Director |
| **CSM** | Customer Success Manager |
| **CEP** | Customer Engagement Process, stages 0-6 |
| **MEDDPICC** | Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion, Competition, Compelling event |
| **CoM** | Command of the Message |
| **Pank Pillars** | Pendo's company values |
| **Pendo OS** | This workspace |
| {your pillar 1 acronym} | {pillar_1_name} |
| {your pillar 2 acronym} | {pillar_2_name} |
| {your pillar 3 acronym} | {pillar_3_name} |
| {add your own as you go} | |

Full glossary: `memory/glossary.md`.

---

## Preferences

- **Tone:** professional casual
- **Format:** bullet points for lists of 2+ items, prose for explanations
- **Recommendations:** one strong rec, not three options, unless asked for alternatives
- **Comms:** async-first
- **Email replies:** match the formality of the original
- **Voice:** read `00_Resources/voice-principles.md` before drafting anything sendable
- **Em dashes:** NEVER. Not ever. Not in docs, Slack, email, notes, or any output. Use a plain hyphen or rewrite the sentence.
- **Forecast Notes deal values:** Always use Net ARR (SFDC field: `Net_ARR__c`), not Amount/TCV.
- **SE_Risk_Level__c is a CE metric.** Do not query, surface, or weight it in any sales leader pipeline view, deal summary, or forecast context. Use `ForecastCategoryName` (Commit / Best Case / Pipeline / Omitted) as the deal health signal.
- **Forecast Notes deal narrative source priority:** (1) Management_Notes__c (primary, use most recent entry); (2) NextStep (additional context only); (3) SFDC Task/Activity log (fallback only when both above are blank). Never use Granola or other sources.
- **Pendo fiscal quarters:** Pendo's fiscal year starts in {fiscal_year_start_month_name} (month {fiscal_year_start_month}). Skills compute the current fiscal quarter and year at runtime. Pendo defaults to February; adjust `System/user-profile.yaml` if your region's fiscal calendar differs.
- **Spelling:** Australian English

---

## Strategic anchors

- **Pendo GTM operating model.** CE owns technical motion, AD owns commercial motion, sales leadership owns team and number, CS owns post-sale. Read `00_Resources/operating-model.md` for deal-depth conversations.
- **Pillars:** {pillar_1_name}, {pillar_2_name}, {pillar_3_name}. Config: `System/pillars.yaml`.
- **Communication profile:** {Insights / CliftonStrengths / DISC / Working Genius, fill in if you've done one.} Cheat sheet in `CLAUDE.md`, full profile in `00_Resources/communication-profile.md`.
