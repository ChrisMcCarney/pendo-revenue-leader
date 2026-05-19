# Salesforce field reference

*Loaded on trigger from root `CLAUDE.md` when working in any deal context. Behaviour rules live in root; this file is the structured detail.*

*Pendo uses Salesforce as the source of truth for all opportunity data. CEs, ADs, and leaders all read and write the same fields. Field ownership varies by role; the table below flags the common writers.*

---

## Always-pull-live fields

Workstation `MEMORY.md` does not duplicate these. Pull from SFDC via `soqlQuery` before any deal-stage decision.

- `StageName` (CEP stage)
- `CloseDate`
- `Net_ARR__c` - **Net ARR. The primary deal value metric for sales leaders. Always use this, not Amount.**
- `Current_ARR__c` - **ATV for renewals** (labelled "Available to Renew" in SFDC). Use when asked about renewal value or "largest renewals".
- `Amount` - TCV (total contract value). Do not surface this as deal value; use only if the user explicitly asks for TCV.
- `Owner.Name` (AE)
- `Sales_Engineer_User__r.Name` (SE)
- `SE_Risk_Level__c` (Green / Yellow / Red)
- `IsClosed`
- `IsWon`

---

## Deal-narrative fields (write to these)

| Field | Purpose | Typical writer |
| --- | --- | --- |
| `SE_Notes__c` | Running log of SE/CE engagement. Dated, append-only. Source of truth for technical deal narrative. | CE/SE |
| `SE_Deal_Risk_Notes__c` | Specific risk callouts (executive volatility, champion weakness, etc.) | CE/SE |
| `SE_Risk_Level__c` | Green / Yellow / Red. Set explicitly. | CE/SE |
| `Champion_Notes__c` | Champion identity, strength, internal advocacy | Shared |
| `Competition_Notes__c` | Named competitors, positioning | Shared |
| `Economic_Buyer_Notes__c` | EB identity, validation | AD |
| `Value_Notes__c` | Customer-validated metrics and value framing | Shared |
| `General_Opp_Notes__c` | Anything that doesn't fit above | Shared |

If you're in a non-CE role (AD, sales leader, CSM), you may not write to every field. Focus on the ones your role owns. Read-access to all is normal.

---

## Conventions

- **Note format:** `DD/M - note text` (matches existing SFDC convention). Append-only, never rewrite.
- **Material updates:** write to both the workstation `MEMORY.md` (narrative) and the SFDC field (structured truth). Never one without the other.
- **Workstation archive:** preserve the SFDC Opportunity ID in the archive note so it remains findable.
- **Conflict resolution:** SFDC wins for structured fields. Update workstation `MEMORY.md` to match. If the discrepancy is interesting (stale close date, mis-assigned SE), log it in the workstation's Key Decisions log.

---

## Adapting to your role

If your team uses different SFDC fields, edit this file to match. Typical role variations:

- **AD / sales leader:** add fields for forecast category, commit/upside, stakeholder map.
- **CSM:** add adoption fields, renewal date, health score.
- **BDR / SDR:** swap `Opportunity` workflows for `Lead` and `Contact` workflows.

The structure above stays; the field names change.
