# {account_name} Memory

*Per-workstation hot cache. Loaded whenever the conversation routes here.*

*Last updated: {YYYY-MM-DD}. Last SFDC sync: {YYYY-MM-DD}.*

---

## Source of truth

Structured deal data lives in **Salesforce**. Pull live before any deal-stage decision.

- **Opportunity ID:** `{opportunity_id}`
- **Account ID:** `{account_id}`
- **Snapshot at last sync:** Stage {stage_name} | Close {close_date} | ${net_arr} Net ARR | AE: {owner_name}
- **Industry / size:** {account_industry} | {account_number_of_employees} employees | Annual revenue {account_annual_revenue}

---

## Snapshot (narrative)

One paragraph. What's the state right now? Who's the champion? What's the next milestone? Biggest risk?

---

## Contacts

| Who | Role | Relationship |
| --- | --- | --- |
| {contact_name} | {contact_role} | {Champion / EB / Influencer / Detractor} |

---

## Risk read

- **Stale:** {last meaningful customer touch}
- **Gaps:** {biggest open MEDDPICC gaps, narrative form; structured fields live in SFDC}
- **Competitive:** {who else is in the deal}
- **Champion strength:** {single-thread? two named champions? actively selling?}

---

## Key Decisions

*Append-only. Date-prefix every entry.*

- **{YYYY-MM-DD}:** {decision and reasoning}

---

## Open Questions

- {Question 1}
- {Question 2}
