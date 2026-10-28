# Vanta JSON Workbench

Vanta is a private browser workspace for engineers who inspect API responses, environment configuration and feature payloads. It keeps the editing surface focused and makes syntax validity, structure and file context visible while a payload is being reviewed.

## Product scope
The starter provides a local JSON editor, formatting and parse feedback, a structure preview, workspace tabs and a privacy-oriented shell. Radix UI Tabs supplies keyboard-aware tab behavior; the rest of the dark, high-contrast interface is composed from project-owned styles and React Icons.

The editor currently holds one sample document in memory. It does not upload payloads. The roadmap adds schema validation, compare mode, large-file support, saved local workspaces, CSV/JSON conversions, export, accessibility review and the PWA shell.

## Run locally
Use Node.js 20 or newer. The project-local `.npmrc` is ignored by Git because registry configuration is machine-specific. Use `npm ci`; npmjs is an approved fallback if a configured mirror is missing a dependency.

    npm ci
    npm run dev

Before release, run npm test, npm run typecheck and npm run build. The workspace is designed for keyboard use and small screens; preserve editor labels and clear parse errors as features grow.

## Privacy
Never send payload content to telemetry or a server without an explicit product decision and a clear user notice. Avoid including real secrets or customer data in fixtures, screenshots or source control. The interface currently uses synthetic sample content only.

### Document and parser contract
`src/domain/jsonDocument.ts` defines a session document (`id`, `name`, and source text), recursive JSON value types, and a discriminated parse result. Invalid input returns `code: INVALID_JSON`, a consistent user-facing message, the engine detail, and an optional character position. The editor keeps each sample document's source separate while you switch files; changes remain in memory and reset on reload. Root summaries handle objects, arrays, and primitive JSON values.

## Delivery and review

Vanta review requires deterministic parser locations, preservation of per-document source and local-only payload handling; invalid and primitive JSON roots need explicit evidence. Follow [DELIVERY-POLICY.md](DELIVERY-POLICY.md) from Day 02 for sequential execution, scope-driven commits and this repository's separate branch/PR with GitHub panel review and merge.

## Contributions and examples

See [CONTRIBUTING.md](CONTRIBUTING.md) for reproducible reports, genuine collaboration and product examples such as a local-processing walkthrough and malformed-input examples. Contributions follow the product backlog and reviewed PR workflow.

## Stable diagnostics and highlighting

A local JSON grammar scanner reports the first invalid offset (zero-based) and line/column (one-based UTF-16 code units). LF, CRLF and CR line endings are handled consistently without relying on browser-specific error text. The editor rejects nesting deeper than 256 levels with a location; larger-payload worker support remains future work. The structure pane highlights source keys, strings, numbers and literals using escaped React text, never HTML injection. Input and per-file session state remain unchanged; no payload is uploaded. Synthetic diagnostic example: a two-line object with a missing value reports the closing brace at line 2, column 7. Browser visual/keyboard review remains pending while access is disabled.
