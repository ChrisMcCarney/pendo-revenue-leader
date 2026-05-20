# Salesforce Fields - Reference for the Brief

The brief reconciles transcript evidence against Salesforce, then writes the **SFDC housekeeping** section listing the fields that need updating after the next call. This reference tells you which fields to look for and how to map evidence to updates.

---

## Discovery vs lookup

**Do not hardcode field API names in the brief.** Different orgs have slightly different MEDDPICC field names. Always run `getObjectSchema` on `Opportunity` first to discover the actual field names in this org, then query for them.

```
getObjectSchema: Opportunity
```

Then scan the returned fields for the MEDDPICC patterns below.

---

## Core opportunity fields (always present)

| Field | Used in brief |
| --- | --- |
| `Name` | Display only |
| `StageName` | Header line (the "Stage 2" in the title bar) |
| `CloseDate` | "Why now?" timing context |
| `Net_ARR__c` | Header line ARR |
| `Amount` | TCV - mention only if relevant |
| `Owner.Name` | Header line "Owner: ..." |
| `Account.Name`, `Account.Industry` | Account context |
| `NextStep` | Sanity check against last activity |
| `Management_Notes__c` | Primary deal narrative - read for context |

---

## MEDDPICC custom fields (variable names per org)

Look for fields matching these patterns. The exact API names vary - the schema lookup tells you what this org actually uses.

| Concept | Common API name patterns |
| --- | --- |
| Metrics | `Metrics__c`, `MEDDPICC_Metrics__c`, `Customer_Metrics__c` |
| Economic Buyer | `Economic_Buyer__c`, `Economic_Buyer_Notes__c`, `EB_Notes__c` |
| Decision Criteria | `Decision_Criteria__c`, `Decision_Criteria_Notes__c` |
| Decision Process | `Decision_Process__c`, `Decision_Process_Actual__c` |
| Paper Process | `Paper_Process__c`, `Paper_Process_Notes__c` |
| Identified Pain | `Identified_Pain__c`, `Pain_Identified__c`, `Pain_Notes__c` |
| Champion | `Champion_Identified__c` (boolean), `Champion_Notes__c`, `Champion_Name__c` |
| Competition | `Competition__c`, `Competition_Notes__c`, `Competitors__c` |
| Before scenario | `Before_Scenarios__c`, `Current_State__c` |
| After scenario | `After_Scenarios__c`, `Future_State__c`, `Desired_State__c` |

If a field exists in the schema but the brief found no evidence of it being filled, that's not necessarily a problem - the housekeeping section just won't update it.

---

## What goes in housekeeping

The housekeeping section calls out fields where there's a **delta between what SFDC currently says and what the transcripts show.** Three patterns:

### Pattern 1: SFDC is empty, transcripts have evidence

Most common. The rep ran good discovery but hasn't written it up in SFDC yet.

Example (from Tyro):
> `Before_Scenarios__c` → populate from Peter's own words (82% drop-off, shit fight quote, analytics accessibility)

### Pattern 2: SFDC is wrong, transcripts contradict

Less common but high-value. The rep wrote SFDC ages ago and the deal moved on, or the rep guessed when the field was first created.

Example (from Tyro):
> `Champion_Identified__c` → Yes (currently wrong)
>
> *Why: Peter briefed CPO Steen without being asked on Mar 27, has described himself as advocate. Champion test: ✅ on questions 1, 2, 3.*

### Pattern 3: SFDC has partial info, transcripts have more

Common in long-running deals. The first entry was sparse; later calls added detail.

Example (hypothetical):
> `Metrics__c` → add 82% drop-off figure (currently only shows 20% churn rate)

---

## Format for the housekeeping section

```markdown
**SFDC housekeeping** - update these fields after the next call:

- `Field_API_Name__c` → {action - populate / correct / add to}
- `Field_API_Name__c` → {action}
...
```

Keep each bullet to one line. Field name on the left, action on the right. The rep should be able to do this in 5 minutes while the call is still fresh.

---

## When SFDC isn't available

If the SFDC connector is unreachable (connector down, user not authenticated, account not found):

1. Note it explicitly in the brief: `> SFDC not reconciled this session - housekeeping section reflects transcript evidence only.`
2. Skip the **SFDC housekeeping** section, OR include a placeholder list with `?` for the field API names and instruct the rep to verify field names when they update SFDC.
3. Don't fabricate field names. `Pain__c` is plausible but if the org uses `Identified_Pain__c`, the housekeeping bullet is useless.

---

## Cross-reference with workstation conventions

If the user's workstation has `00_Resources/salesforce-fields.md` in the project root, check it for project-specific field conventions and any custom field mappings. That file (when present) is the authoritative SFDC schema reference for the user's org.
