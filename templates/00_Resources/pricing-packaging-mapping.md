# Pricing and packaging mapping

One table. Read left to right: each row is a single capability, named differently in each pricing era. The FY25 column is the current naming convention. Use it to normalise any customer's contract line items onto today's model.

## The mapping

| Capability | Legacy (pre-2022) | March 2022 | MAU-Only (late 2022) | FY25 (current) |
| --- | --- | --- | --- | --- |
| **Base / platform layer** | Bundled in Team / Pro / Enterprise package | Bundled in Team-New / Pro-New / Enterprise-New | Bundled in Growth / Premium / Pendo Platform | **Platform Module** (`PPP-PKG`) |
| **Product analytics** | Insights / Pendo Insights Package (`I-PKG`) / Pendo Analytics Package (`ANL-PKG`) | Insights - New (`AN-1`, `ALC-ANL`) | Bundled in Growth / Premium / Pendo Platform | **Analytics Module** (`AL-MD`) |
| **In-app guides (basic)** | n/a, no basic tier existed | n/a | n/a | **Guides Module** (`GS-MD`) |
| **In-app guides (full)** | Guidance / Pendo Guidance Package (`G-PKG`) / Pendo In-app Guides Package (`ALC-IN-APP-GD-PKG`) / bundled in Team / Pro / Enterprise | Guidance - New (`ALC-IN-APP-GD`) / Pendo Guidance - New Package | Bundled in Growth / Premium / Pendo Platform | **Guides Pro Module** (`GP-MD`) - all pre-FY25 guides map here, not Guides basic |
| **User feedback / ideas / roadmaps** | Feedback / Pendo Feedback Package (`FB-PKG`) / Pendo Feedback Portfolio (`FB-PFL-PKG`) | Feedback - New (`PC-FDB-0001-NEW`) / Pendo Feedback-New Package (`FBNEW-PKG`) | Feedback - New | **Listen Module** (`DS-MD`) - SKU prefix `DS-` is historical (Listen was previously called Discover) |
| **NPS / sentiment surveys** | NPS (flag, no separate SKU) | NPS (flag) | NPS (flag) | **Sentiment Module** (`NPS-MD`) - both flags stay on during transition |
| **Session replay** | n/a | n/a | n/a | **Session Replay Module** (`T-SR-MD`) + `MAU - {type} - Session Replay` |
| **Workflows / orchestration** | n/a | n/a | n/a | **Orchestrate Module** (`ORC-MD`) |
| **Guide experiments / A/B** | Guide Experiments (`GEX-1`) as add-on | Guide Experiments (`GEX-1`) | (bundled) | Included in **Guides Pro Module** |
| **Visitor counting** | Apps-key based (Team/Pro/Enterprise license tier) | Apps-key + MAU hybrid | MAU pool (subscription-level counting) | MAU pool per module, app-level counting. **B2B / B2C / B2E** Visitor Type |
| **SSO** | SAML (`M-SAML`) | SAML (`M-SAML`) | SAML (`M-SAML`) | **SAML** (`M-SAML`) - same |
| **API access** | API Access (`ALC-API`) | API Access (`ALC-API`) | API In/Out (`M-API`) | **API In/Out** (`M-API`) |
| **HubSpot integration** | Hubspot Integration (`IN-HBST`, 1-way) | Hubspot Integration | HubSpot 2-way (`IN-HBST-2WAY`) | **HubSpot 2-way Integration** (`IN-HBST-2WAY`) |
| **Salesforce integration** | Salesforce Integration (`IN-SFDC-0001`) | Same | Same | **Salesforce Integration** (`IN-SFDC-0001`) - same |
| **Drift / Intercom / Segment / Zendesk integrations** | Same SKU names (`IN-DFT`, `IN-ITCM`, `IN-SGMT`, `IN-ZND-0001`) | Same | Same | Same SKU names, now under Integrations family |
| **Data Sync / data warehouse** | Data Share Integration (`IN-DTS-0001`) | Data Share | Data Share / Pendo Data Share (`IN-DS`) | **Data Sync** (Cloud Storage Connect / Warehouse Direct) - replaces Data Share |
| **Webhooks** | Webhooks (`IN-WBHK`) | Webhooks | Webhooks (`ALC-WBHK`) | **Webhooks** (`ALC-WBHK`) - same |
| **Custom roles & permissions** | Custom Roles and Permissions (`CUSTROLESPERMS`) | Same | Same | Same SKU. Note: enabled in error on many subs that never paid; left on as load-bearing |
| **Digital Adoption (full DAP)** | Pendo Digital Adoption Package (`DAP-PKG`) / Adopt / Engage / Portfolio variants | DAP-NEW-PKG | Same | **Ultimate Bundle** with **B2E** Visitor Type + Pendo One UI Engineering Use (replaces Adopt UI / Engage UI as of PNDM FY24) |
| **Resource Center** | Bundled / line item | Bundled | Bundled | Controlled by **Guides product line + MaxPublicResourceCenters** flag (Limited=1 or Unlimited). Pre-FY25 grandfathering applies, do not remove |
| **Roadmaps** | Receptive Roadmaps / Roadmap (`RDMAP-1`) | Roadmap | Roadmap | Folded into **Listen Module** (Feedback roadmaps) |

## Bundle level (FY25 only)

When a customer is on FY25, you'll often see a Bundle SKU rather than individual module SKUs. These are the FY25 bundles and what they include:

| FY25 bundle | Modules included | SKU |
| --- | --- | --- |
| Base Bundle | Platform + Guides Pro + Analytics | `B-BD` |
| Core Bundle | Base + Listen | `CR-BD` |
| Pulse Bundle | Listen-led bundle | `LSN-BD` |
| Ultimate Bundle | Everything (Platform + Guides Pro + Analytics + Listen + Orchestrate + Sentiment + Session Replay) | `ULT-BD` |

## Pricing eras

`Subscription__c.Pricing Model` field carries one of four values. The capability table above translates between them.

| Pricing Model value | Era nickname | Sold from |
| --- | --- | --- |
| Legacy | Pre-2022 | Founding through early 2022, apps-key based |
| MAU Only | March 2022 + late-2022 MAU-Only | March 2022 through Feb 2024 |
| FY25 | Current | March 2023 onward, mandatory from May 2023 |
| Free | Pendo Free | Self-serve |

Highest-confidence FY25 signal: `Platform Module` (`PPP-PKG`) anywhere on the contract.

## How to use this

For any customer, run:

```sql
SELECT SBQQ__Product__r.Family, SBQQ__Product__r.Name,
       SBQQ__Product__r.ProductCode, SBQQ__Quantity__c,
       SBQQ__StartDate__c, SBQQ__EndDate__c
FROM SBQQ__Subscription__c
WHERE SBQQ__Account__c = '<AccountId>'
  AND SBQQ__TerminatedDate__c = null
  AND SBQQ__EndDate__c >= TODAY
ORDER BY SBQQ__StartDate__c DESC
```

Each row is a SKU. Look it up in the legacy column of the capability table, read across to the FY25 column. That's what the customer is entitled to in today's language.

**Watch-out:** CPQ amendments append new rows rather than updating existing ones. Filter to the latest `SBQQ__StartDate__c` per product to get the live state.

## Key quirks (only the load-bearing ones)

- All Legacy customers have **Analytics** enabled in Pendo, regardless of contract. Loses it on first FY25 renewal.
- All pre-FY25 guides entitlements map to **Guides Pro**, not Guides basic. Check Brian Walsh's [Guides usage sheet](https://docs.google.com/spreadsheets/d/1kkXYBPLgTkNYp4oRkUVi1MW1U2TYePHnuK6Gyt-yDKI/edit?gid=1126412223#gid=1126412223) before renewal.
- Pro and Enterprise packages include 1 and 3 integrations respectively, often not recorded in SFDC.
- `Subscription__c.Entitlement_API_Response__c` and the module booleans on that record are unreliable. Trust the CPQ SBQQ line items.
- Legacy MAU counting was subscription-level (1 user across 3 apps = 1 MAU). FY25 default is app-level. Some customers have custom contract terms preserving the legacy method (Roller, JPMC).

---

*Maintained by Chris. Source material: Confluence pages PROD/2753396766, PROD/3302588561, EP/3406266369, SalesSystems/4541415442; live SFDC Product2 catalog as at 21 May 2026.*
