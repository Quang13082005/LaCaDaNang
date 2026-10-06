> CURRENT_REFERENCE — 2026-10-06. Use docs/I18N.md as the canonical milestone specification. This document provides baseline/details; newer vocabulary/scope wins on conflict. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# VI / EN / KO frontend localization architecture

Status (2026-10-05): standalone locale resolver and typed UI dictionaries implemented and unit-tested; runtime UI integration remains pending. No provider/package, route, page/component or DB translation table is changed. User confirmed DB is still in progress and only independent work may continue.

## Locale resolution

Supported UI locales: vi, en, ko; fallback **vi**. Normalize BCP-47 tags case-insensitively by primary language: vi-VN→vi, en-US/en-GB→en, ko-KR→ko. Unsupported entries are skipped while scanning browser language preferences; if none match, use vi.

Precedence: valid manual preference → navigator.languages (ordered) → navigator.language → vi. Manual preference always wins until user chooses an explicit “automatic” option. Ignore corrupt/unsupported stored values. Persist only the chosen language with versioned key `laca.ui-locale.v1` if localStorage is available; if blocked, retain in memory for the tab without breaking discovery. This setting is not an analytics identifier and must not be joined to GPS.

SSR/hydration: server and first client render both use vi unless an explicitly approved server locale mechanism is added later. Resolve browser/storage preference in an effect after hydration; don't read window or localStorage during server render. A short initial VI paint is an acknowledged tradeoff. Preserve selected intent/preference/results when language changes; do not re-query or regenerate solely because chrome text changed. A future server solution needs a separate review; do not add middleware, locale routes or cookies in this pass.

## Files and integration boundary

- Implemented `src/lib/i18n/locales.ts`: SupportedLocale, pure BCP-47 detection and manual/browser/fallback precedence. Does not read navigator, storage or window. Malformed tags return null; invalid manual values are ignored.
- Implemented `src/lib/i18n/messages.ts`: 27 typed UI keys with identical dictionaries for VI/EN/KO. Compiler checks missing/excess keys; no place IDs/names mixed in here. `translate(locale,key)` is a typed lookup, not a network translator.
- Implemented `tests/i18n.test.ts`: tag variants, invalid values, ordered preferences, manual override/clear, SSR-safe no-input fallback and dictionary parity.
- Pending `src/components/i18n/LocaleProvider.tsx`: small React context, above UI consumers; read/write manual preference after hydration with narrow storage-error handling.
- Pending `src/components/i18n/LanguageSwitcher.tsx`: visible VI | EN | KO, accessible full names Tiếng Việt / English / 한국어; ≥44px target with gaps, selected state conveyed beyond color. Place in a secondary area reachable without blocking required actions; do not displace the primary bottom action area.

Use `t('action.changeSelection')`, never translate by searching/replacing rendered Vietnamese strings. Keep stable intent/preference IDs in events/state/API. Never derive IDs from translated labels. Avoid concatenating grammatically incomplete fragments; use full templates with named parameters and controlled count variants. Use Intl.NumberFormat(locale) for display only; preserve raw numeric values for logic.

## UI copy starter set (proposed, Korean needs native review)

```json
{
  "vi": {
    "intent.eat": "Ăn gì?", "intent.go": "Đi đâu?",
    "intent.now": "Bây giờ làm gì?", "intent.stay": "Ở đâu?",
    "action.maps": "Xem trên Google Maps", "action.changeSelection": "Đổi lựa chọn",
    "itinerary.sample": "Lịch trình mẫu", "language.auto": "Theo thiết bị"
  },
  "en": {
    "intent.eat": "What to eat?", "intent.go": "Where to go?",
    "intent.now": "What to do now?", "intent.stay": "Where to stay?",
    "action.maps": "View on Google Maps", "action.changeSelection": "Change selection",
    "itinerary.sample": "Sample itinerary", "language.auto": "Device language"
  },
  "ko": {
    "intent.eat": "무엇을 먹을까요?", "intent.go": "어디로 갈까요?",
    "intent.now": "지금 무엇을 할까요?", "intent.stay": "어디서 묵을까요?",
    "action.maps": "Google 지도에서 보기", "action.changeSelection": "선택 변경",
    "itinerary.sample": "예시 일정", "language.auto": "기기 언어"
  }
}
```

These are UI labels only, not claims that itinerary is realtime. Before runtime wiring, inventory all UI: Hero description/alt, intent helper/status, preference prompt, reset, zero/one/two counts, skeleton/loading/error text, navigation accessible names, sample labels, language names, future notification/geo consent text. Do not translate only buttons and call the whole app localized.

## UI translation vs DB translation

UI dictionaries own action labels, prompts and static intent labels. DB integration owns actual place names, primary type labels, short descriptions and curated tag labels/translations. Preference UI may use dictionary keys for static questions; data-backed tag option labels must come from the agreed DB translation mapping. Do not generate fake English/Korean venue names or guess schema/table/column names.

After DB handoff: request/display an approved localized data field through the existing adapter contract. If unavailable, retain the source/official proper name and any source-language description with an appropriate lang annotation; never fabricate a translation or silently claim the whole card is translated. Display an agreed neutral fallback when a field is truly absent. Original IDs, coordinates and Maps URLs never change with locale. Agree fallback policy for data separately from UI locale fallback.

## Acceptance before runtime release

- vi-VN/en-US/en-GB/ko-KR, mixed navigator.languages, unknown tags, empty preferences.
- Manual EN overrides Korean device; reload retains EN; “automatic” restores ordered detection.
- SSR without window, denied storage, malformed stored locale, hydration without mismatch.
- Switching locale preserves selections, counts and URLs; no duplicate analytics result events.
- VI/EN/KO at 360/390/430/768/1280, long EN labels, Korean glyph/font fallback, 200% text zoom, no core clamp/ellipsis; ≥44px switch targets.
- DB field fallback doesn't invent venue data; native-speaker KO review pending.

Runtime integration is intentionally pending DB ownership confirmation, not a completed multilingual feature. The standalone library does not persist manual choices or switch document language by itself. Future provider must update html lang and preserve state; this is not claimed tested by pure unit tests. Korean copy still needs native review and all translated labels need responsive visual testing when connected.
