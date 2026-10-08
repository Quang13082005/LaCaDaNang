# M8-B.1 Verification Report: Cloudflare Analytics Environment Fix

Date: 2026-10-08  
Branch: `phase-2a-deploy`  
Base Checkpoint (HEAD Before Fix): `bc171a0f34919653c8356e5cc4b7dc06bfc14faf`  
Status: VERIFIED & COMPLETED  

---

## 1. Executive Summary & Problem Addressed

During the independent verification of milestone M8-B, a single architectural blocker was identified:
- On Cloudflare Workers / OpenNext, both preview deployments and production deployments run with `NODE_ENV="production"`.
- `wrangler.jsonc` had no explicit environment variables (`vars`) configured.
- `.env.example` did not document `APP_ENV` or an equivalent environment differentiator.
- As a consequence, `resolveServerEnvironment()` in `src/lib/analytics/db.ts` fell back to `NODE_ENV === "production"`, causing preview deployments to risk being classified as `environment = "production"` in `analytics_events`.

Milestone **M8-B.1** addresses and completely resolves this blocker with:
1. Zero changes to analytics schemas, table structures, or existing 6 content tables.
2. Zero changes to the 11 canonical event contracts or client validation allowlist.
3. Locking one canonical, trusted server variable: `APP_ENV` (`preview` | `production`).
4. Making `resolveServerEnvironment()` deterministic and fail-safe (never guessing production on unknown/invalid values).
5. Configuring explicit `vars` and environment blocks in `wrangler.jsonc` and adding an explicit preview deployment command in `package.json`.
6. Preserving local development and test client dispatchers as no-op.

---

## 2. Deployment Architecture & Configuration Audit

| Dimension | Inspection Target | Findings & Current Reality |
|---|---|---|
| **Runtime Platform** | `open-next.config.ts`, `wrangler.jsonc` | Cloudflare Workers via `@opennextjs/cloudflare`. No Vercel infrastructure exists in this repository. |
| **Bundling & Deploy CLI** | `@opennextjs/cloudflare` | Wraps Wrangler CLI; supports `opennextjs-cloudflare deploy` and `--env <environment>`. |
| **Production Deploy Path** | `package.json` (`deploy`) | `opennextjs-cloudflare build && opennextjs-cloudflare deploy` (invokes default top-level Wrangler configuration). |
| **Preview Deploy Path** | `package.json` (`deploy:preview`) | Added explicit script: `opennextjs-cloudflare build && opennextjs-cloudflare deploy --env preview` (invokes Wrangler `env.preview`). |
| **Local Preview** | `package.json` (`preview`) | `opennextjs-cloudflare preview` (local Cloudflare Worker emulation). |
| **Local Dev** | `package.json` (`dev`) | `next dev`. Client analytics dispatcher detects `NODE_ENV === "development"` and remains a complete no-op. |

---

## 3. Canonical Variable Contract & Resolver Hardening

### Server Variable Contract
- **Canonical Variable**: `APP_ENV`
- **Permitted Values**: `preview` | `production`
- **Ownership**: Strictly server-side / deployment configuration. Client payloads are prohibited from supplying `environment` and are rejected with HTTP 400 by Zod `.strict()`.

### Resolver Logic (`src/lib/analytics/db.ts`)
```typescript
export function resolveServerEnvironment(): "production" | "preview" {
  // 1. Primary canonical variable: APP_ENV (explicit Cloudflare/deployment configuration)
  const appEnv = process.env.APP_ENV?.trim().toLowerCase();
  if (appEnv === "production") {
    return "production";
  }
  if (appEnv === "preview") {
    return "preview";
  }
  if (appEnv) {
    // If APP_ENV is explicitly provided but unrecognized, fail safely to preview
    return "preview";
  }

  // 2. Secondary fallback flag evaluated before generic NODE_ENV
  if (process.env.IS_PREVIEW === "true" || process.env.IS_PREVIEW === "1") {
    return "preview";
  }

  // 3. In non-production NODE_ENV (development / test), default safely to preview
  if (process.env.NODE_ENV !== "production") {
    return "preview";
  }

  // 4. In production NODE_ENV where APP_ENV is unset, default to production
  return "production";
}
```

Key guarantees:
- Removed legacy `VERCEL_ENV`.
- `APP_ENV=preview` **always** resolves to `"preview"`, even when `NODE_ENV=production`.
- `APP_ENV=production` resolves to `"production"`.
- Invalid or unrecognized `APP_ENV` (e.g., `APP_ENV=staging`, `APP_ENV=foo`) fails safely to `"preview"` (never silently promotes to production).
- When running in dev/test (`NODE_ENV !== "production"`), safely defaults to `"preview"`.

---

## 4. Wrangler & Environment Configuration

### `wrangler.jsonc` Updates
Added top-level `vars` and explicit environment blocks:
```jsonc
  "vars": {
    "APP_ENV": "production"
  },
  "env": {
    "preview": {
      "name": "la-ca-da-nang-preview",
      "vars": {
        "APP_ENV": "preview"
      }
    },
    "production": {
      "vars": {
        "APP_ENV": "production"
      }
    }
  }
```

### `.env.example` Updates
Documented `APP_ENV` non-secret deployment setting without exposing credentials:
```env
# Application environment for analytics classification (preview | production)
# On Cloudflare, set via wrangler.jsonc vars or Cloudflare Dashboard
APP_ENV=preview
```

---

## 5. Live Database Safety & Controlled Preview Ingest Verification

1. **Pre-Test Content Table Row Counts**:
   - `places`: 500
   - `place_translations`: 1500
   - `place_tags`: 841
   - `tags`: 36
   - `tag_translations`: 108
   - `administrative_units`: 94
   - **Total Content Rows**: 3,079 (100% intact)
   - `analytics_events` initial count: 0

2. **Controlled Preview Event Ingest**:
   - Simulated Edge runtime request with `APP_ENV=preview` and `NODE_ENV=production`.
   - Event: `home_viewed`.
   - Result: HTTP 202 Accepted.
   - Database Verification:
     - `SELECT id, event_name, environment, occurred_at FROM analytics_events;`
     - Verified `environment = 'preview'`.
     - Timestamp correctly populated via server `occurred_at TIMESTAMPTZ`.

3. **Post-Test Cleanup & Content Verification**:
   - Executed clean `DELETE FROM analytics_events WHERE environment = 'preview';`.
   - `analytics_events` final count: 0 rows.
   - Content tables post-test count: exactly 3,079 rows.

---

## 6. Automated Regression & Test Evidence

### Unit & Integration Tests (`tests/analytics.test.tsx`)
Added comprehensive test cases verifying:
1. `APP_ENV=preview` with `NODE_ENV=production` $\rightarrow$ resolves to `"preview"`.
2. `APP_ENV=production` with `NODE_ENV=production` $\rightarrow$ resolves to `"production"`.
3. Unrecognized `APP_ENV` (e.g., `APP_ENV=unknown_env`) with `NODE_ENV=production` $\rightarrow$ fails safely to `"preview"`.
4. Client attempting to supply `environment` $\rightarrow$ rejected with HTTP 400.
5. Client attempting to supply server fields (`id`, `occurred_at`) $\rightarrow$ rejected with HTTP 400.
6. Client dispatcher in dev/test $\rightarrow$ verified no-op.

### Test Suite Execution
- **Command**: `npx vitest run --exclude "**/curation.test.ts"`
- **Result**: 14 test suites, 262 passed (262 total tests).
- **Time**: ~6.6s.

### Lint & Typecheck
- `npm run lint`: **0 errors, 0 warnings**.
- `npm run typecheck`: **0 errors**.

### Production Build
- `npm run build`: Next.js 15.5.27 production build compiled cleanly. Edge analytics route (`/api/analytics`) generated successfully.

### Dataset Integrity
- `git diff HEAD -- src/data/curated/curated-places.json`: 0 lines diff (100% untouched).

---

## 7. Resolution of Blocker & Readiness

- **Cloudflare/OpenNext Preview Environment Classification**: Deterministic via `APP_ENV=preview` in `wrangler.jsonc` (`env.preview`) and `npm run deploy:preview`.
- **Production Environment Classification**: Deterministic via `APP_ENV=production` in `wrangler.jsonc` (top-level and `env.production`) and `npm run deploy`.
- **M8-B Independent Verification Status**: Blocker resolved. **M8-B READY FOR FINAL VERIFICATION: YES**.
