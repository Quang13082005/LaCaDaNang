# Current state
CURRENT M4-B OVERRIDE — 2026-10-07: M4-B GO & STAY Neon discovery completed and verified; selective local commit authorized. STOP before M5. Earlier milestone scope/status below is historical where superseded.
CURRENT_AUTHORITY — 2026-10-07. M4-B connects GO and STAY to live Neon discovery; DiscoveryResults generalized; STAY chips updated (Trung tâm, Hẹn hò); EAT regression preserved; CAFE disabled. Supersedes earlier M4-A audit-only status.

## Git
Branch phase-2a-deploy; parent38c237a2c3976f60452227f28a01f6270f6fbdb4. M3-B local checkpoint completed: e39c7de65fc413f6561e0069642ba58f6bb95f0e, message feat: connect EAT frontend to Neon discovery; exact13 paths verified.16 pre-existing staged renames and unrelated modified/untracked work retained. No push/merge/deploy or branch switch.

## EAT runtime
Home EAT -> existing preference -> GET /api/discovery -> Neon -> model -> ResultList/no-image PlaceCard. No EAT demo fallback. States idle/loading/success/empty/error, retry and15s timeout; selection reset/unmount abort and late-response guard.0–3 results, no padding. Only verified an_ngon/general,dac_san/SPECIALTY,hen_ho/DATE.
Cards render actual API name/typeLabel/area/address/tags, nullable rating/reviews/description, exact Maps href. No venue images/place_media dependency. Static hero/intent artwork remains. GO/STAY data still demo; NOW unchanged. No other section DB integration or runtime scope expansion.

## Validation
Fresh lint/typecheck PASS;133/133 tests PASS in isolated copy; build PASS23.773s. Live browser all3 EAT preferences passed (counts3/3/2), names/Maps match API, independently matched Neon SELECT. No DB writes or secret exposure;19 client files scanned. Responsive DOM320–1280 and representative visual screenshots; no text-clamp PASS shortcut. See M3B_VERIFICATION.md for precise coverage and limits.

## DB and boundaries
Neon neondb six tables3079rows verified previously; not re-imported/recounted this turn. Workbook SHA256874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3 unchanged. M3-A backend/package/schema unchanged. No full one-thumb/i18n/GPS/analytics/notifications/deploy. Dev stopped.

## Exact next
STOP for checkpoint review. Only after explicit M4 authorization: verify Git and inspect CAFE/GO/STAY real tag/preference coverage before proposing mappings or enabling sections. Preserve existing dirty/staged work.

## Checkpoint-only takeover — 2026-10-07T12:31:11+07:00
Real M3-B commit: `e39c7de65fc413f6561e0069642ba58f6bb95f0e`. Verified exact13 allowlisted paths;16 pre-existing staged renames unchanged. Source/tests match validated isolated copy (41 files excluding the deliberately regenerated curated copy), so no tests/build rerun and no fresh runtime PASS claim. Existing validation evidence retained:133/133 tests, lint/typecheck/build and documented live/responsive checks. No source edits, DB operations, push/merge/deploy or M4 work. Final Git intentionally retains16 staged renames,11 inherited unstaged modifications plus4 post-commit authority updates, and7 unrelated untracked files. STOP before M4; await explicit authorization.

## M4-A read-only audit completed
Report: [M4A_REAL_MAPPING_AUDIT](M4A_REAL_MAPPING_AUDIT.md). HEAD e39c7de65fc413f6561e0069642ba58f6bb95f0e unchanged. SELECT-only live audit: CAFE145/GO94/STAY127 active+OPERATIONAL; unique linked active tags2/20/16. All36 catalog tags with vi/en/ko labels, per-section counts/percentages, actual samples per linked tag, UI inventory, SQL mapping counts and semantics/ranking caveats documented. Five DIRECT candidates SAFE by count: GO PHOTO16,NATURE26,ENTERTAINMENT8; STAY NEAR_BEACH19,QUIET8. Ambiguous: GO BEACH/SCENIC (3/19/OR20); STAY CENTRAL16 and DATE10 need label/meaning decision. No current CAFE UI/chips; GENERAL145 is availability only, not a new preference. CAFE mood tags absent; BUDGET absent globally. Target anomaly: CAFE ID138 has primary_type=bar; extra EAT conflicts4,56,108,259,416 documented without edits. featured allfalse; rating/reviews null2/145,5/94,1/127. No application/DB/config/package edits, no commit/push/deploy/tests/build. Evidence/scripts/query outputs under sibling M4A_EVIDENCE_2026-10-07. Previous handoff bytes backed up there.16 staged renames and all unrelated hashes unchanged.15 existing modified tracked paths remain;7 old untracked files preserved plus1 new report. STOP: review report, resolve ambiguous mappings/CAFE UI and type conflict before explicit M4-B instruction. Do not implement M4-B automatically.

## M4-B GO & STAY Neon Discovery Integration Completed — 2026-10-07
Report: [M4B_VERIFICATION](M4B_VERIFICATION.md).
- GO mappings connected to Neon tags: `chup_anh_dep` -> `PHOTO`, `thien_nhien` -> `NATURE`, `vui_choi` -> `ENTERTAINMENT`, `bien_ngam_canh` -> `BEACH | SCENIC` (20 eligible places).
- STAY mappings connected to Neon tags: `gan_bien` -> `NEAR_BEACH`, `yen_tinh` -> `QUIET`, `gan_trung_tam` -> `CENTRAL` ("Trung tâm"), `cap_doi` -> `DATE` ("Hẹn hò").
- Discovery component generalized from `EatDiscoveryResults.tsx` to `DiscoveryResults.tsx` for EAT, GO, STAY with full lifecycle, 15s timeout, stale request protection, no demo fallback.
- EAT regression preserved; CAFE remains disabled (400 INTENT_NOT_AVAILABLE).
- Validation: lint PASS, typecheck PASS, 169/169 tests PASS (including 21 new GO/STAY frontend tests), build PASS (6.9s).
- Live smoke with Neon: 8 GO/STAY + 3 EAT flows HTTP 200 matching independent SQL; 0 secret leaks; 400 for CAFE/invalid.
- Responsive & visual: viewports 320–1280 inspected; long names wrap cleanly without clipping; >=44px CTAs; 0 venue images.
- Unrelated 16 staged renames, modified tracked, and untracked files preserved.
- Local selective checkpoint authorized: `feat: connect GO and STAY to Neon discovery`. STOP before M5.

