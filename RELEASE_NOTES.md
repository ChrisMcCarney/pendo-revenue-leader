# Release notes

## 0.4.0

Operating model enrichment landed across the templated reference set.

- `templates/00_Resources/operating-model.md` rewritten with nine sections sourced from the official Pendo CEP, COTM Day 1, and COTM Day 2 decks. Adds the FY27 CE role, hybrid AD, RS, sales leadership tiers; corrects CEP stages 5 and 6 to the post-sale value journey (Ready to purchase, Value realisation); adds MEDDPICC "know or assume" discipline and per-letter pressure tests; introduces the MEDDPICC-to-COTM bridge; new Champion and Economic Buyer sections; full COTM frame with eleven-element glossary, Mantra ritual, trap-setting, Pitch vs COTM, Tell / Show / Tell.
- `templates/00_Resources/positioning.md` added. 5-lead context layer thesis, earned-right narrative, five-verb model (Observe / Understand / Act / Prove / Optimise), CIO pitch, CPO pitch, expansion thesis. Split from operating-model so deal mechanics and product positioning stay distinct.
- `templates/System/cep-stages.yaml` rewritten with customer-state framing. Stage 5 = Ready to purchase, Stage 6 = Value realisation. Closed Won and Closed Lost reclassified as SFDC `StageName` outcomes rather than CEP stages.
- `templates/MEMORY.md` common-terms table fixes the MEDDPICC decode (was missing Paper Process, treated Compelling Event as a separate letter). Adds lifecycle acronyms (PBO, NC, RBO, BVA, JVP, MAP, IKT, CRE, WWNTBT) and role acronyms (SE, AE, EAD, RS, FLM, RVP).
- `skills/cotm-deal-analysis/SKILL.md` step 1a expanded to require both Salesforce Prod and Pendo MCP connectors. Without Pendo MCP the "Why Pendo & trap-setting" section is theoretical rather than account-specific; the skill now probes both, surfaces only the missing one(s), and tags the brief sections that were degraded.

## 0.1.0 (initial release)

The first shareable version of the Pendo Revenue Leader plugin, derived from a personal RVP operating system and templatised for any Pendo revenue leader.

Source: [github.com/ChrisMcCarney/pendo-revenue-leader](https://github.com/ChrisMcCarney/pendo-revenue-leader).

### What ships

**Skills (12):**

1. `/setup` - eight-step wizard that scaffolds a working project in 15 minutes.
2. `/daily-plan` - morning brief plus open punch list.
3. `/daily-review` - end-of-day reflection.
4. `/week-plan` - Monday morning planning.
5. `/week-review` - Friday retrospective.
6. `/meeting-prep` - pre-meeting brief.
7. `/process-meetings` - post-meeting capture into workstations, person pages, SFDC SE notes.
8. `/regenerate-pipeline` - rebuild the pipeline view from live Salesforce, with daily diffs.
9. `/avp-pipeline-review` - live Cowork artifact with weighted floor/forecast/upside math, MEDDPICC gap detection, risk flags, copyable per-team reports, and an educated-edge call. Reads team config from `System/team.yaml` (RVP mode) or `System/avp-teams.yaml` (AVP mode). Requires the user to drop their `assets/artifact-template.html` into the skill folder before first invocation; the skill prompts clearly when missing.
10. `/company-research` - HTML account research deck, Pendo-branded.
11. `/strategy-map-research` - HTML strategy map research deck, Pendo-branded.
12. `/pendo-design` - the Pendo FY27 Brand Design System. Bundles `BRAND.md`, `colors_and_type.css`, fonts (Sora, Inter variable TTFs), logos and icons, marketing and slides UI kits, and preview cards for every component. Single source of truth for all Pendo-branded output.

**Templates:** a complete scaffolded project tree at `templates/`, including the operating model, communication profile, CEP stage definitions, MEDDPICC framing, person and meeting templates, and a derived active-account workstation template. The Pendo brand system is no longer scaffolded into the user's project as a duplicate; it lives inside the `pendo-design` skill and is read from there by the skills that produce branded assets.

**Brand compliance:** every asset-producing skill (`/company-research`, `/strategy-map-research`, `/avp-pipeline-review`) is wired to read the `pendo-design` skill before generating output. Non-negotiable rules enforced: Pank `#FF4876` as accent only, Sora Bold for display, Inter for body, sentence case throughout, no emoji, radial gradients on edges only, rounded card corners.

**Change from earlier draft:** `pendo-brand-guidelines` and `pendo-slides` were consolidated into a single `pendo-design` skill. `.pptx` output is no longer produced; the Pendo FY27 design system is HTML-first, and the research skills now generate self-contained HTML decks.

**Configuration:** `placeholder-map.yaml` documents every token the `/setup` wizard captures, plus the runtime config-lookup pattern for skills that read team, pillars, or fiscal calendar at run time.

### Deferred to 0.2.0

- `consolidate-memory` skill: the source did not include this skill at any expected path. Recorded in `BLOCKERS.md` as B1. Will be authored in 0.2.0 as a structured pass that summarises and dedupes MEMORY.md entries.
- Marketplace submission automation: 0.1.0 produces a packaged `.plugin` archive and a publish-ready README; the actual marketplace publish remains manual.
- Voice auto-customisation from Slack history.
- Non-Salesforce CRM support.

### Constraints applied throughout

- Australian English spelling.
- No em dashes anywhere.
- No emojis in branded output.
- Sentence case headings.
- Salesforce is the source of truth for structured deal data; skills never read deal stage, close date, or ARR from `MEMORY.md`.
- Templates and skills never assume a region, city, timezone, or fiscal calendar. `/setup` always asks.

### Plugin distribution

- Source tree: `~/Developer/PendoOS_Plugin/`
- Packaged archive: `dist/pendo-revenue-leader-0.1.0.plugin`
- Manifest: `.claude-plugin/plugin.json`
- Marketplace stub: `.claude-plugin/marketplace.json`

### Acknowledgements

Derived from a personal RVP operating system. The bundled skills inherit conventions and the CEP stage model from Pendo's GTM playbook.
