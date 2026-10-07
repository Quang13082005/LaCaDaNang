# Current state
CURRENT_AUTHORITY — 2026-10-07T11:53:30+07:00. Latest user scope: BUILD RECOVERY ONLY + selective local M3-A checkpoint after validation. Supersedes older milestone permissions in AGENTS and historical decisions. M3-A backend/build/live API verified; M3-B NOT_STARTED. STOP for review.

## Git
Branch phase-2a-deploy. Pre-checkpoint HEAD388309be8540a011cecf72ad3c128186473fd9c8. Selective checkpoint prepared; consult HANDOFF_CURRENT for resulting hash. Existing16 staged cleanup renames remain outside API checkpoint. Existing curatedAt modification preserved. No branch switch/push/merge/deploy. Working tree intentionally not clean.

## Neon and API
Neon neondb: six core tables,3079 rows from M1-D independent verification (historical, not re-imported/recounted today). This takeover independently SELECT-verified live EAT API IDs33,167,34. Read-only HTTP driver; no writes. Workbook SHA256874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3. Timestamp policy naive TIMESTAMP WITHOUT TIME ZONE unchanged. Neon branch display name production remains unconfirmed; no blocker for read-only smoke.
GET /api/discovery EAT only, up to3 results, vi/en/ko contract, provisional-v1 ordering. Other sections disabled. Credentials server-only; .env.local ignored, not staged. Source unchanged during recovery.

## Fresh validation
Lint PASS; typecheck PASS;115/115 tests PASS in isolated copy to confine curation writes. Build PASS48.261s, final repeat PASS34.068s. Local dev Ready3.3s; GET EAT/vi HTTP200,3 unique rows, independent Neon IDs match, no secret in response. Dev stopped. Details and root-cause evidence: [M3A_BUILD_RECOVERY](M3A_BUILD_RECOVERY.md).

## Runtime and boundaries
Home remains11-place demo; PlaceCard image dependency remains. No frontend wiring/redesign/GPS/nearby/runtime i18n/analytics/notifications/Cloudflare work. No production validation claim.

## Next
STOP. Review local checkpoint; obtain explicit M3-B authorization before EAT-only frontend integration. Preserve pre-existing staged cleanup and uncommitted schema/scripts/docs. Do not restart M3-A or re-import Neon.
