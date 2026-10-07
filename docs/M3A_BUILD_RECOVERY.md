# M3-A build recovery evidence
Verified 2026-10-07T11:53:30+07:00. Scope: BUILD RECOVERY ONLY; source implementation inherited, not restarted. No M3-B, push, merge or deploy.

## Takeover and preservation
Read AGENTS, CURRENT_STATE, DECISIONS, HANDOFF_CURRENT and AGENT_TASK_QUEUE before edits. Actual branch phase-2a-deploy, initial HEAD 388309be8540a011cecf72ad3c128186473fd9c8. Initial Git: 16 staged archive/reference renames; 17 unstaged modified tracked files, including package.json/lockfile Neon dependency and pre-existing curatedAt timestamp change. Old handoff omitted those package/data changes and claimed build not required; latest user request supersedes it. Its 17:55 timestamp is later than this machine's observation; not used to infer order.
Untracked files and edited document inputs copied and hash-verified under sibling M3A_BUILD_RECOVERY_2026-10-07/before; manifest retained. No clean/reset/branch switch. Existing curated JSON modification preserved, not committed as API work.
Seven M3-A source/test files present. route.ts contains GET pipeline with edge runtime, force-dynamic and revalidate=0. No route.ts.bak or source temporary rename found. There is no previous committed route hash to compare; current intact route validated through compilation, offline tests and live HTTP. No tracked source deletion in diff.

## Process and build evidence
Initial process inspection: no repository Next build/dev processes; only unrelated Codex Node processes, left running. Only our stalled build PID12664 and our dev server PID23004 were terminated after command-line/parent verification; dev parent exited. No blanket Node termination.
Commands in repo: npm.cmd run build, using normal terminal (no Start-Process npx).
1. Baseline in sandbox: exit1 after30.630s. EACCES connecting to64.233.188.95:443, then next/font failed fetching Be Vietnam Pro from Google Fonts in src/app/layout.tsx. Concrete network restriction, not Neon evidence.
2. Same source outside sandbox: stalled before Creating an optimized production build; stopped after96.855s, exit-1. No compile worker observed. Old .next cache still contained generated outputs.
3. Preserved .next by rename, moved generated files outside repo (no deletion of source or user work). Same source/build outside sandbox, fresh .next: exit0 after48.261s, compile21.8s.
4. After dev smoke, lint, typecheck, full isolated tests: normal repeat build exit0 after34.068s, compile2.8s. Dynamic /api/discovery emitted. No dependency/config/route/font changes or reinstall.

## Root-cause evidence and limits
Two separate environment failures were observed: sandbox font network EACCES, and cache cleanup filesystem EPERM across execution identities. On preserved old generated server/app/page.js, read-only ACL inspection plus a direct Node unlink probe returned EPERM (file copied separately before probe; original remained because unlink failed). The installed next/dist/lib/recursive-delete.js retries EPERM via unlinkPath(p,isDir,t++); the recursive argument receives the old counter, so persistent EPERM can retry indefinitely. This explains the observed pre-compile stall and fresh-cache recovery. No stack trace from the old agent exists; do not claim every historical hang had the same cause. No evidence implicates Neon, Edge, Unicode paths, .env.local or memory exhaustion. Do not patch node_modules or upgrade dependencies as a workaround. If execution identity changes again, preserve/refresh only verified generated .next and use appropriate font network access.

## Dev and live API smoke
npm.cmd run dev -- --hostname 127.0.0.1 --port 3103 -> Ready3.3s. GET /api/discovery?intent=EAT&locale=vi -> HTTP200, ok=true, section EAT, count3, ids[33,167,34], no duplicates, Cache-Control:no-store. Independent parameterized SELECT through Neon driver produced identical ordered IDs. API implementation reviewed: parameterized SELECT CTE, no DB writes. Smoke used only GET and SELECT. Credential/URL/password checks against response passed; raw credentials and driver errors never logged. This is actual live Neon smoke, not merely trusting meta.source.
Dev stopped afterward. No production/Cloudflare smoke or deployment claimed.

## Validation
- npm.cmd run lint: exit0, no ESLint warnings/errors (Next lint deprecation notice only).
- npm.cmd run typecheck: exit0.
- npm.cmd test in sibling test-copy: exit0;6 suites,115/115 tests, including48 discovery. Exact source/tests/config copied; shared existing node_modules junction; no env copied. Curation writes confined to copy. Original source/data hashes unchanged.
- npm.cmd run build: final exit0,34.068s. Edge static-generation warning informational; API is dynamic.
- git diff --check: verified before changes; recheck before/after commit.
No UI changes; no new responsive screenshots claimed.

## Checkpoint selection
Exact14 paths: seven M3-A source/tests; package.json and package-lock.json (existing Neon1.2.0 addition); CURRENT_STATE, DECISIONS, HANDOFF_CURRENT, AGENT_TASK_QUEUE; this report. Use explicit add and commit --only path list to leave16 unrelated staged renames intact. Exclude .env.local, schema/import scripts/reports, unrelated documentation changes, curated data, generated caches and machine logs. Commit message: feat: add Neon-backed discovery API. Final hash recorded in handoff after successful commit, not self-referenced inside its own commit.

## Evidence location
D:/Dự án tìm địa điểm ăn chơi/M3A_BUILD_RECOVERY_2026-10-07
Logs: build-baseline.log/result, build-network.log/result, build-fresh-cache.log/result, build-final.log/result, dev.log, lint.log, typecheck.log, tests.log; smoke.json and reproducible smoke.cjs; before-manifest.json; git-before.txt; next-cache-before and generated-page-probe-copy.js. A preliminary smoke script syntax error occurred before any request; corrected and successful report retained.

## Exact next step
STOP for review. No M3-B authorization in this request. After explicit authorization, re-read handoff and Git, reconcile staged cleanup/uncommitted DB preparation, then scope EAT-only frontend wiring and truthful no-image compatibility. Do not import DB again or start CAFE/GO/STAY/GPS/i18n/analytics/notifications/deploy.
