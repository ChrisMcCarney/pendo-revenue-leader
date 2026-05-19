# {Workstation_Name} Memory

*Per-workstation hot cache. Loaded whenever the conversation routes here.*

*Last updated: YYYY-MM-DD. Last SFDC sync: YYYY-MM-DD.*

---

## Source of truth

*For account workstations only. Skip this section for function workstations.*

Structured deal data lives in **Salesforce**. Pull live before any deal-stage decision.

- **Opportunity ID:** `{006...}`
- **Account ID:** `{001...}`
- **Snapshot at last sync:** Stage {0-6} | Close YYYY-MM-DD | ${amount} | AE: {name} | SE: {name} | SE Risk: {Green / Yellow / Red}
- **SFDC notes fields used:** `SE_Notes__c`, `SE_Deal_Risk_Notes__c`, `Champion_Notes__c`, `Competition_Notes__c`, `Economic_Buyer_Notes__c`, `Value_Notes__c`, `General_Opp_Notes__c`. When making a material update, write to both this file and the SFDC field.

---

## Snapshot (narrative)

One paragraph. What's the state right now? Who's the champion? What's the next milestone? Biggest risk? For function workstations, "what's the current cadence, what's in flight."

---

## Contacts

| Who | Role | Relationship |
| --- | --- | --- |
| {Name} | {Role} | {Champion / EB / Influencer / Detractor} |

---

## Risk read

- **Stale:** {last meaningful customer touch}
- **Gaps:** {biggest open MEDDPICC gaps, narrative form, structured fields live in SFDC}
- **Competitive:** {who else is in the deal}
- **Champion strength:** {single-thread? two named champions? actively selling?}

---

## Key Decisions

*Append-only. Date-prefix every entry.*

- **YYYY-MM-DD:** {decision and reasoning}

---

## Open Questions

- {Question 1}
