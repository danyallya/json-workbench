# Project working rules
- Build Vanta for engineers examining structured payloads. Maintain a precise, low-distraction dark editor identity with a distinct green signal color.
- Begin each session by reading this file, BACKLOG.md, Git status and prior diffs. Review the prior implementation and debug open defects before today's ticket.
- Every day includes code review, relevant tests, today's implementation, documentation/backlog updates, debugging and final regression review. Run tests, typecheck and build once dependencies are installed.
- Preserve local-only privacy expectations. Never transmit editor contents or add real secrets to fixtures.
- Keep the editor responsive, keyboard operable and labeled; expose parse failures in text and preserve light/dark themes.
- Use React, TypeScript, Vite, Radix UI Tabs and React Icons. Avoid unsafe HTML rendering for user-provided JSON.
- Update BACKLOG.md each day with completion, newly found work, and a precise next-day scope.
- Keep .npmrc ignored and local. Do not commit tokens, payload exports, .env files or build output. Do not force-push or rewrite history.
- Restrict changes to this repository. Use descriptive branches and meaningful commits after checks pass.
