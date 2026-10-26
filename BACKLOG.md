# 30-day delivery plan
## Daily operating loop
Review the previous code and diff, check the backlog and debug open defects. Add or update tests for changed parsing/editor behavior, finish the day's ticket, run tests/typecheck/build, update README and backlog, and prepare tomorrow's scope. Record any unavailable checks with their cause; continue static review. Add new risks/tasks with priority.

## Foundation status
Day 00 editor shell, JSON parse state, format action, theme toggle and Radix tabs are scaffolded. Dependencies are not installed and build/test checks have not run. Nexus .npmrc is ignored and local.

## Daily tickets
| Day | Deliverable |
|---|---|
| 01 | Define document model and parser error format; cover valid and invalid JSON. |
| 02 | Add syntax highlighting and stable line/column diagnostics. |
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
