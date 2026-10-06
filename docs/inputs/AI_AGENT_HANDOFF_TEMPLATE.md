# LA CÀ ĐÀ NẴNG — AI AGENT HANDOFF TEMPLATE

> Update this file BEFORE an agent stops, runs low on context/credit, hits a blocker, or completes a milestone.

## 1. Session identity
- Timestamp:
- Agent/model:
- Repo:
- Branch:
- HEAD:
- Current milestone:
- Current objective:

## 2. Git state
```text
git status --short:
<paste>

git diff --stat:
<paste>

Latest commits:
<paste>
```

- Untracked files:
- Staged files:
- Uncommitted source changes:
- Local checkpoint commit:
- Safe to switch branch? YES/NO + why:

## 3. Source of truth
- `AGENTS.md` version/state:
- `docs/CURRENT_STATE.md`:
- `docs/DECISIONS.md`:
- Data workbook/version/hash:
- DB schema/migration version:
- API contract version:

## 4. Completed this session
- [ ] ...

For each completed item:
- files changed:
- behavior:
- validation evidence:

## 5. In progress
- Exact task:
- Exact file/function:
- Last successful step:
- Current partial state:
- What remains:

## 6. Decisions made
| Decision | Why | Evidence/source | Reversible? |
|---|---|---|---|
| | | | |

## 7. Commands executed
```text
<command>
RESULT: PASS/FAIL
NOTE:
```

## 8. Validation
- lint:
- typecheck:
- unit tests:
- integration tests:
- build:
- responsive/manual:
- DB row-count/FK checks:
- API smoke:
- Cloudflare preview smoke:

## 9. Database state
- Provider:
- Project/environment:
- Migration(s):
- Tables touched:
- Rows imported/changed:
- Pending migrations:
- Rollback:
- Env variable NAMES used (NO VALUES):
- Known DB blockers:

## 10. Runtime/API state
- Endpoint(s):
- Request contract:
- Response contract:
- Error states:
- Zero-result behavior:
- Auth/security assumptions:

## 11. UX state
- Stable button positions:
- One-thumb mobile:
- No-image PlaceCard:
- Loading/error:
- 360:
- 390:
- 430:
- 768:
- 1280:

## 12. Geo/recommendation state
- Browser geolocation:
- Permission states:
- Radius:
- Nearby query:
- Ranking:
- Preference mapping:
- Max results:
- Known edge cases:

## 13. i18n state
- VI:
- EN:
- KO:
- Auto locale:
- Manual override:
- Persistence:
- html lang:
- DB translation fallback:
- Native KO review pending:

## 14. Analytics state
- Provider:
- Contract:
- Events implemented:
- Privacy review:
- Known gaps:

## 15. Notifications state
- Permission UX:
- Reminder use case:
- Delivery:
- Deep link:
- Known gaps:

## 16. DO NOT REDO
- ...
- ...

## 17. DO NOT TOUCH YET
- ...
- ...

## 18. Blockers
1.
2.

## 19. Exact next step
The next agent must start here:

**File/command:**
`...`

**Action:**
...

**Expected success condition:**
...

## 20. Recovery / rollback
If the next step fails:
1.
2.

## 21. New-agent startup checklist
- [ ] Read AGENTS.md
- [ ] Read CURRENT_STATE.md
- [ ] Read DECISIONS.md
- [ ] Read HANDOFF_CURRENT.md
- [ ] Read AGENT_TASK_QUEUE.md
- [ ] Run git status/diff/log
- [ ] Verify handoff against source
- [ ] Continue exact next step
- [ ] Do not restart from Phase 0
