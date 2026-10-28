# Daily work log

## Day 00 — foundation (2026-10-26, Asia/Tehran)

- Prepared the project-specific React/TypeScript workspace, responsive interface, light/dark theme, React Icons, PWA shell, README, AGENTS.md and 30-day backlog.
- Review: inspected the starter UI, tests, dependency graph, PWA output, Git ignore rules and local registry setup; corrected issues found by tests before recording a passing result.
- Dependencies: generated package-lock.json and installed packages after Nexus 404s. The user approved npmjs fallback. Local .npmrc remains ignored, preserves Nexus as default and maps only required scopes. No private registry config is tracked.
- Checks: npm test -- --reporter=dot passed (1/1), npm run typecheck passed, and npm run build passed; no standalone lint script is configured in this Vite project. The PWA build generated its service worker and manifest.
- GitHub: Day 00 foundation commit 194fef5 is pushed to both main and day-00-foundation: https://github.com/danyallya/json-workbench. Day 01 has not started.
- Schedule: Day 01 has not started. The next task is Day 01 in BACKLOG.md; wait for the user to trigger that day.

## Day 01 — document and parser contracts (2026-10-27, Asia/Tehran)

- Review: each file tab showed the same source; parser errors were an unstructured engine string; root summaries assumed objects and could fail for JSON `null`. Added separate session documents, a discriminated parser result, and summaries for object, array, and primitive roots. Changed the header from claiming saved state to identifying a local session.
- Implementation: defined recursive JSON value/document types, a normalized `INVALID_JSON` diagnostic with engine detail and optional position, and three synthetic in-memory sample documents. File switching now preserves each document's edits for the current session.
- Tests: `npm test -- --reporter=dot` passed (2 files, 5 tests); `npm run typecheck` passed; `npm run build` passed, including PWA asset generation. The first UI test run exposed missing cleanup between tests; explicit Testing Library cleanup was added and the suite passed.
- Documentation: README defines the document/parser contract and local-only session behavior; BACKLOG marks Day 01 done and records stable line/column parsing for Day 02.
- Git: implementation commit `4898a27` (`feat: define JSON document and parser contracts`) is pushed to `day-01/document-contracts` and fast-forwarded to `main`. This daily-log entry is included in the final synchronization of both branches. No `.npmrc`, environment files, credentials, or generated build output are tracked.
- Next: Day 02 — add syntax highlighting and stable line/column diagnostics.

## Review workflow maintenance — 2026-10-27

- The user requested careful sequential project execution, commit content/counts suited to each product and an independent branch/PR per repository with panel review and merge.
- Vanta review requires deterministic parser locations, preservation of per-document source and local-only payload handling; invalid and primitive JSON roots need explicit evidence. Added a standalone delivery policy and entry points in AGENTS, README and BACKLOG.
- Documentation-only maintenance on `docs/vanta-parser-review`; Markdown diff reviewed and `git diff --check` used. No application tests/build rerun for this process change. Next product work: Day 02 — syntax highlighting and stable line/column diagnostics.
- This is the pre-merge log state. The portfolio workspace DELIVERY-RECEIPTS.md records the actual PR URL, checked head, panel gates, merge SHA and sync afterward; reconcile it here in the next authorized update.

## Contribution guidance maintenance — 2026-10-27

- User request: integrate achievable GitHub profile goals naturally into future project work. Added Vanta contribution guidance around a minimal synthetic JSON parsing/diagnostic case with expected line and column and useful documentation examples. Preserved the daily backlog and all delivery gates.
- Previous delivery-policy PR #1 is merged in origin/main; this maintenance starts from that merged history. No badge, collaborator, star or accepted answer is claimed.
- Documentation-only scope on docs/vanta-parser-contributions; reviewed Markdown and git diff --check. App tests/build are not rerun because runtime behavior is unchanged.
- Publication is pre-merge here; the final PR/head/panel/check/merge/sync evidence goes in the workspace DELIVERY-RECEIPTS.md after completion. Next: Day 02 — syntax highlighting and stable line/column diagnostics. Wait for the user's day trigger.

## Day 02 — stable syntax locations — 2026-10-28

- Reconciled policy/contribution receipts (PRs #1/#2; main 9bc54c6). Reviewed prior parser/fixture changes: location depended on engine error wording. Added a deterministic local grammar scan with UTF-16 offset and one-based line/column, CR/LF handling and an explicit 256-level nesting limit.
- Added source token highlighting in the preview with React text spans, not HTML injection. Error announcements expose location and consistent grammar detail; source/session switching remains intact. Synthetic malformed examples and inert-markup rendering provide useful contribution evidence without real payloads.
- Final npm test -- --reporter=dot --maxWorkers=1 passed (3 files, 21 tests). npm run build passed including typecheck/PWA; git diff --check passed. No standalone lint script. Locally read all changed source/tests/docs; private config and generated output excluded.
- Work browser use is disabled: visual editor/theme/layout/keyboard checks, PR creation, exact-head panel Files changed/Checks/conversation review, merge and local main sync remain pending. Branch day-02/parser-locations-highlight is preserved/pushed; workspace receipt records final head. No CI, badge or independent approval claim.
- Browser access returned for the final review. At 390px the hidden structure pane made line/column diagnostics inaccessible, so Issue #5 was filed and the live status was moved outside that pane. The phone view now visibly reports line 5, column 3; desktop retains the detailed error card. Issue #3 about JavaScript number precision remains separate.
- After this correction, `npm test -- --reporter=dot` passed (3 files, 21 tests), `npm run build` passed including typecheck, Vite and PWA generation, and `git diff --check` passed. The updated PR head and GitHub panel review remain pending.
- Next: push the correction to PR #4, review the updated exact head/files/checks/conversation, then merge with a merge commit if available gates pass; synchronize local `main`. Close Issue #5 only after the fix reaches `main`.
- Next product work: Day 03 keyboard shortcuts for format/save/help, after resolving Day 02 delivery gates. Existing shortcut footer is presentation only until then.
