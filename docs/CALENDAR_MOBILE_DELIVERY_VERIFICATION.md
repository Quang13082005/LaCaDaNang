# Calendar mobile delivery repair


## Interrupted-session resume — Calendar checkpoint, 2026-10-09
Actual resume HEAD 96e3792458c7fe07a29ffa14a2a6b92320120766, branch phase-2a-deploy, CLEAN index/tree. No partial Calendar edits found. Existing source commits452b18b NOW3 and96e3792 GO+cafe retained. Intermediate gate completed before Calendar edits: lint/typecheck PASS,20files360tests PASS excluding curation, Next/OpenNext PASS, worker.js exists; evidence intermediate-*.log in MASTER_CONTINUATION_2026-10-09.
Calendar implementation focused PASS: two explicit localized actions; Google draft via standard template URL, exact UTC visit instant + Asia/Ho_Chi_Minh, exact Maps, address only when present. Equal dates endpoints introduce no invented duration; user must review Google draft time/duration/notifications. No OAuth/account/token access or saved/delivered claim. Google path writes no local export record. Original ICS generator unchanged;30-minute VALARM and noDTEND retained. Removed generic fake Maps fallback in sheet. Scrollable90dvh sheet,48px actions. Focused2files33tests PASS; typecheck PASS. Browser/final gates pending. Physical Calendar NOT VERIFIED.
NEXT: implement explicit Nearby zero-result recovery, then browser/full final regression. No DB mutation/push/deploy. Do not redo NOW/GO+cafe/Hero or alter geo algorithm.

Reference: https://developers.google.com/workspace/calendar/api/concepts/inviting-attendees-to-events — template link opens a prefilled event for the user to save; it does not guarantee notification configuration. Physical app delivery remains unverified.


## Final release verification — 2026-10-09
Final source regression: lint/typecheck,23 files392 non-curation tests,Next/OpenNext PASS. Preview deployed;28 GET API cases independently SELECT verified. See FINAL_RELEASE_CANDIDATE_VERIFICATION.md for logs, browser screenshot scope and limitations. Live client JavaScript/analytics ingestion deliberately NOT RUN per owner read-only instruction. Physical Calendar/import/notification/GPS/one-hand acceptance NOT VERIFIED; historical pending items above are superseded only within this explicit scope. STOP for owner checklist; no production.
