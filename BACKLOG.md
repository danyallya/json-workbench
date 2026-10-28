# 30-day delivery plan
## Daily operating loop
Review the previous code and diff, check the backlog and debug open defects. Add or update tests for changed parsing/editor behavior, finish the day's ticket, run tests/typecheck/build, update README and backlog, and prepare tomorrow's scope. Record any unavailable checks with their cause; continue static review. Add new risks/tasks with priority.

## Foundation status
Day 00 editor shell, JSON parse state, format action, theme toggle and Radix tabs are ready. Dependencies and lockfile are installed; smoke test (1/1), typecheck and production build passed. This Vite template has no standalone lint script. Nexus .npmrc is ignored and local.

## Daily tickets
### Day 00 verification
Nexus returned 404 for packages used by this project. Following the user's approval, dependencies were installed with npmjs fallback; the ignored local .npmrc keeps Nexus as default and contains only required scope overrides. Day 01 has not started.

| Day | Deliverable |
|---|---|
| 01 | **Done** — define the session document and recursive JSON value model, normalize parser errors, and cover valid/invalid documents. |
| 02 | Implemented, delivery blocked — safe highlighted source and deterministic line/column diagnostics; browser/PR panel gates pending. |
| 03 | Add keyboard shortcuts for format, save and accessible help. |
| 04 | Add local file open/save with size limits and safe error handling. |
| 05 | Add schema attachment and JSON Schema validation feedback. |
| 06 | Add schema fixture library and required-field navigation. |
| 07 | Review editor keyboard flow, parser tests and error recovery. |
| 08 | Implement compare view with added, removed and changed paths. |
| 09 | Add deep path search and tree expand/collapse. |
| 10 | Add JSONPath selection and copy selected value. |
| 11 | Add request/response pair workspace with redaction preview. |
| 12 | Add local workspace history with opt-in persistence. |
| 13 | Add configurable redaction for token-like keys before export. |
| 14 | Review data retention/privacy behavior and add regression tests. |
| 15 | Add CSV and XLSX conversion for tabular arrays. |
| 16 | Add PDF summary export for document structure and validation. |
| 17 | Add large-payload worker parsing with progress and cancellation. |
| 18 | Add JSON diff summary and stable sorting preferences. |
| 19 | Improve phone layout for editor, tabs and diagnostics. |
| 20 | Audit high contrast, theme readability, keyboard focus and motion. |
| 21 | Run assistive technology review and resolve priority findings. |
| 22 | Add installable PWA and document offline/local-only behavior. |
| 23 | Add accessible command palette and recent documents. |
| 24 | Add import/export of versioned workspace settings. |
| 25 | Add safe recovery for malformed saved files and browser storage quota. |
| 26 | Add extension points for API samples without transmitting data. |
| 27 | Review dependency/security posture and document threat assumptions. |
| 28 | Run regression pass for parsing, comparison and all exports. |
| 29 | Complete user guide, keyboard reference, privacy and release docs. |
| 30 | Release-candidate review, all checks, known limitations and release notes. |

Mark each day Done, In progress or Blocked. Keep tomorrow prepared and record any new findings.

- Day 01: Done. File tabs now maintain separate in-memory documents, parser results have a discriminated error contract, and root summaries support all JSON value types; next is Day 02, syntax highlighting and stable line/column diagnostics.
- Review carry-over for Day 02: the parser preserves browser engine detail and only extracts an optional position; provide deterministic diagnostics with stable line and column values.

## Process change effective Day 02 — 2026-10-27

Apply [DELIVERY-POLICY.md](DELIVERY-POLICY.md) to every remaining ticket: finish Vanta before the next repository, use meaningful scope-driven commits and deliver through its own reviewed PR. A blocked external gate needs a concrete record and next action. This adds delivery gates without moving Day 02–30 product work or changing completed history.

## Contribution integration — 2026-10-27

Effective Day 02: apply [CONTRIBUTING.md](CONTRIBUTING.md) inside existing tickets. At already scheduled weekly reviews, assess real feedback such as a minimal synthetic JSON parsing/diagnostic case with expected line and column; at documentation/setup tickets, improve a local-processing walkthrough and malformed-input examples. Day 30 records actual contribution evidence and outstanding external dependencies. No day is renumbered and no quota or badge is a completion criterion. Next scope remains: Day 02 — syntax highlighting and stable line/column diagnostics.
