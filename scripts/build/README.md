# Secret-free local builds

`npm run build` and `npm run build:worker` create a fresh sibling workspace containing
only the application build inputs and a private copy of the installed dependencies.
No install/upgrade is performed. The original `.env*` files never move or change.
Their hashes are verified even when the build fails. A killed process leaves the
original files untouched, so no recovery rename or credential backup is needed.

The child process receives a small OS environment allowlist and the explicitly
reviewed public configuration in `public-env.json`. That file currently preserves
the existing public GA measurement ID. It must never contain a database URL or
secret. New non-sensitive dotenv names fail closed until explicitly supported;
they are not silently dropped. Do not put Production credentials in build variables.

OpenNext 1.20.7 `compile-env-files.js` serializes `.env*` files for production,
development and test. The isolated workspace contains none of these files. Its
Next build still gets public build-time values through the sanitized process
environment. `next-env.mjs` should therefore have empty mode objects. Runtime
database credentials must be supplied through the appropriate Worker secret
binding. `src/lib/db/neon.ts` and `src/lib/analytics/db.ts` are unchanged.

After a successful build, **all files** in `.next` and `.open-next` (including source
maps and generated server dependencies) are scanned before publication. Findings
contain only file paths and categories, never matching text. Missing/unreadable
artifacts or unsupported symlinks fail closed. The scanner recognizes authenticated
PostgreSQL URIs, literal secret configurations and private keys; it is not a universal
detector for arbitrary obfuscated secrets. Isolation is the primary control.

Previously generated outputs are preserved by rename under the isolated workspace's
`previous-artifacts/`; they are not copied or deleted. Those historical artifacts
may contain credentials and must remain private. Only the newly scanned root outputs
are candidates for a later separately approved release. No automatic cleanup occurs.
Do not run multiple builds concurrently in the same checkout.

Commands:

- `npm run test:build-safety`: synthetic-only safety tests; no real credentials.
- `npm run scan:artifacts`: fail-closed scan of the current generated artifacts.
- `npm run build:worker`: Next + OpenNext build and scan, **no deployment**.

The existing preview/deploy npm commands now build through this wrapper and scan
again before their existing deployment command. **Do not execute them until the
Owner authorizes that environment and its runtime bindings.** A direct `npx
opennextjs-cloudflare build/deploy` bypasses this repository's wrapper and must not
be used for releases. Runtime secret setup is a separate action; this wrapper never
calls `wrangler secret put`, Cloudflare APIs, Neon importers or activation SQL.

Production needs its existing analytics write capability as well as discovery/rental
SELECT access. Preview must use its own read-only credential and APP_ENV=preview;
never give it the Production credential. No database roles/grants are changed here.
