# Vanta JSON Workbench

Vanta is a private browser workspace for engineers who inspect API responses, environment configuration and feature payloads. It keeps the editing surface focused and makes syntax validity, structure and file context visible while a payload is being reviewed.

## Product scope
The starter provides a local JSON editor, formatting and parse feedback, a structure preview, workspace tabs and a privacy-oriented shell. Radix UI Tabs supplies keyboard-aware tab behavior; the rest of the dark, high-contrast interface is composed from project-owned styles and React Icons.

The editor currently holds one sample document in memory. It does not upload payloads. The roadmap adds schema validation, compare mode, large-file support, saved local workspaces, CSV/JSON conversions, export, accessibility review and the PWA shell.

## Run locally
Use Node.js 20 or newer. The local Nexus .npmrc is ignored by Git.

    npm install
    npm run dev

Before release, run npm test, npm run typecheck and npm run build. The workspace is designed for keyboard use and small screens; preserve editor labels and clear parse errors as features grow.

## Privacy
Never send payload content to telemetry or a server without an explicit product decision and a clear user notice. Avoid including real secrets or customer data in fixtures, screenshots or source control. The interface currently uses synthetic sample content only.
