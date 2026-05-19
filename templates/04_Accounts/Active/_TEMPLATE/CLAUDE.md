# {account_name} CLAUDE.md

*Scopes Cowork's behaviour when this workstation is loaded. Inherits root `CLAUDE.md`.*

---

## Identity

This workstation is for **{account_name}**. It owns:

- {what this workstation owns, e.g. renewal scoping, commercial conversation}
- {e.g. customer-facing materials and meeting state}
- {e.g. champion engagement and stakeholder map}

It does not own:

- Structured deal data (lives in Salesforce, see `MEMORY.md` for the Opportunity ID).
- Rep coaching notes (lives in `05_People/Internal/{rep_name}.md`).

When routed here, this is primary context. Root `CLAUDE.md`, `MEMORY.md`, `00_Resources/`, and this workstation's own `MEMORY.md` are loaded. Everything else is read-on-demand.

---

## Resources

| Resource | Read when... |
| --- | --- |
| `Projects/{project_file}.md` | working on the named project |
| `Resources/{file}.md` | the relevant trigger |

---

## Notes

- Meeting notes: `Notes/{YYYY-MM-DD - Topic}.md`
- Active projects: `Projects/`
- Contacts: `People/` (workstation-scoped) or canonical pages in root `05_People/`
