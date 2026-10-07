> CURRENT_REFERENCE — 2026-10-06. Use docs/ANALYTICS.md as the canonical milestone specification. This document provides baseline/details; newer vocabulary/scope wins on conflict. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# Analytics specification — proposed, not installed

Scope: provider-neutral event contract. No SDK, provider, network collector, cookie or tracking code is enabled by this document. Provider, consent UX, retention and access controls need approval before implementation. This does not change any DB API contract.

## Identity, privacy and common envelope

Required on every emitted event: `schema_version: 1`, `event_id` (random UUID; retry with the same ID), `event_name`, `occurred_at` (UTC), `session_id` (random session token), `flow_id` (new on initial discovery and reset), `locale` (`vi|en|ko`), `environment` (`production|preview|test`), `app_version`. Properties below are additional required/optional fields.

Optional common fields: `anonymous_id` (consented first-party random identifier), `viewport_bucket` (`mobile|tablet|desktop`), allowlisted `campaign_id`, `location_permission` (`unknown|granted|denied|unavailable`), `radius_bucket` (`<1km|1-3km|>3km`). Never derive identity from fingerprinting. Do not create a durable ID until approved consent policy allows it. With no persistent ID, report unique sessions, not unique people. Even with an ID, report distinct consenting browsers as an estimate, not a claim of exact humans; cross-device use, deletion and shared devices affect counts. Exclude preview/test and tagged internal traffic from growth metrics.

Proposed retention: event-level 30 days, aggregated counts 90 days, delete/rotate identifiers on withdrawal; provider configuration must enforce this. Do not replay queued events collected before consent. Stop collection immediately on withdrawal; cap offline queue and discard after 24h. A failed analytics call must never delay or fail a discovery action.

Forbidden for every event: raw GPS/lat/lng (including history), full location permission objects, IP storage/enrichment, precise geohashes, addresses, device fingerprint, email, phone, account secrets, raw UA, free text, complete referrer/query string, Maps URLs containing coordinates, notification payload/subscription endpoints. Use opaque public place IDs rather than names, free-form descriptions or sensitive profile data. Disable auto-capture/session replay by default. Do not hash coordinates and call them anonymous.

Examples below show event-specific properties; production payloads must include the common envelope. All IDs are illustrative, not new DB field requirements.

## Events

### home_view
- Purpose: count eligible discovery entries and returning consenting browsers.
- Trigger: Home actually becomes visible after hydration; once per Home view ID. Rerenders, language switch and tab focus do not re-emit. Returning from result to Home starts a new Home view.
- Required: `home_view_id`, `entry_source` (`direct|campaign|return|notification`). Optional: allowlisted `campaign_id`.
- Example: `{"home_view_id":"hv-1","entry_source":"direct"}`.
- Funnel: entry denominator. Retention/growth: yes, returning browser cohorts. UX: entry-to-selection conversion.

### intent_selected
- Purpose: intent popularity and first decision.
- Trigger: successful user activation of a different intent, once per interaction ID. Closing the active intent is not a new selection.
- Required: `interaction_id`, `intent_id`, `tap_index` (discovery decision activation count), `selection_source` (`home|switch`). Optional: `previous_intent_id`.
- Example: `{"interaction_id":"i-1","intent_id":"EAT","tap_index":1,"selection_source":"home"}`.
- Funnel: first decision. Growth/retention: aggregate interest only. UX: intent switching/drop-off.

### preference_selected
- Purpose: preference popularity and requested results.
- Trigger: accepted preference activation; repeated taps while the same request is pending do not duplicate. Generate a new request ID on actual new selection/retry.
- Required: `interaction_id`, `intent_id`, `preference_id`, `request_id`, `tap_index`. Optional: `selection_source` (`initial|reset`).
- Example: `{"interaction_id":"i-2","intent_id":"EAT","preference_id":"date","request_id":"r-1","tap_index":2}`.
- Funnel: second decision. Growth/retention: aggregate preference demand. UX: taps-to-result and request drop-off.

### result_viewed
- Purpose: measure rendered outcomes, including truthful empty results.
- Trigger: result header and at least the start of its content are visible (≥50% of header for 500ms, proposed). Once per result set ID; not on render, resize, scroll back or locale change. Includes itinerary with `result_kind=itinerary`.
- Required: `request_id`, `result_set_id`, `intent_id`, `preference_id`, `result_kind` (`places|itinerary`), `result_count` (integer ≥0; stop count for itinerary), `outcome` (`empty|success`), `tap_count_to_result`, `directions_available_count` (integer ≥0), `share_available` (boolean). Optional: `latency_bucket_ms`, `radius_bucket`, `fallback_used` (boolean).
- Example: `{"request_id":"r-1","result_set_id":"rs-1","intent_id":"EAT","preference_id":"date","result_kind":"places","result_count":2,"outcome":"success","tap_count_to_result":2,"directions_available_count":1,"share_available":false}`.
- Funnel: completed request; useful-result numerator only if count >0. Growth/retention: activated browsers. UX: latency, fallback/empty rate, tap counts. A failed request must not emit a fake empty result.

### place_opened
- Purpose: measure explicit interest in a place detail view.
- Trigger: user opens an actual detail view and it becomes visible; not when a card appears, not on Maps click. **Dormant until a detail view exists.** Do not add one to emit this event.
- Required: `interaction_id`, `result_set_id`, `place_id`, `intent_id`, `position` (1-based). Optional: `preference_id`, `surface` (`card|itinerary`).
- Example: `{"interaction_id":"i-3","result_set_id":"rs-1","place_id":"public-place-1","intent_id":"EAT","position":1}`.
- Funnel: optional step, never required for completion. Growth/retention: engagement. UX: card-to-detail CTR.

### directions_clicked
- Purpose: external navigation intent.
- Trigger: activation of an enabled stored Maps link. Enqueue best-effort without blocking new-tab navigation. Do not treat click as arrival or successful Google Maps navigation.
- Required: `interaction_id`, `result_set_id`, `place_id`, `intent_id`, `surface` (`card|itinerary`), `position`. Optional: `preference_id`.
- Example: `{"interaction_id":"i-4","result_set_id":"rs-1","place_id":"public-place-1","intent_id":"EAT","surface":"card","position":1}`.
- Funnel: downstream conversion. Growth/retention: high-intent engagement. UX: directions CTR. No full URL or user coordinates.

### itinerary_generated
- Purpose: separate itinerary computation from viewing.
- Trigger: a valid itinerary object is produced for a request, once per itinerary/result ID. Do not emit for a failed generation or duplicate React effect. Sample mode remains labelled.
- Required: `request_id`, `result_set_id`, `preference_id`, `stop_count`, `generation_mode` (`sample|curated`). Optional: `fallback_used`.
- Example: `{"request_id":"r-2","result_set_id":"rs-2","preference_id":"couple","stop_count":3,"generation_mode":"sample"}`.
- Funnel: diagnostic step before `result_viewed` for NOW, not counted as a second completed flow. Growth/retention: itinerary adoption. UX: generation-to-view drop-off.

### share_clicked
- Purpose: sharing intent, distinct from a successful share.
- Trigger: user activates a real share control, once per activation. **Dormant until share exists.** No automatic event from copying arbitrary text.
- Required: `interaction_id`, `result_set_id`, `result_kind`, `share_method` (`native|copy_link`). Optional: `intent_id`.
- Example: `{"interaction_id":"i-5","result_set_id":"rs-2","result_kind":"itinerary","share_method":"native"}`.
- Funnel: optional growth conversion. Growth/retention: share-click rate. UX: discoverability of share. Add a separately approved `share_completed` later for resolved native-share/copy actions; `share_clicked` cannot measure delivery or recipient.

## Metrics and counting

- Discovery funnel: distinct flow IDs with home_view → intent_selected → preference_selected → result_viewed. Keep same flow on intent switches before result; reset starts a new attempt linked by session. Report both entry funnels and reset-attempt funnels so reset-only attempts do not corrupt Home denominators.
- Completion rate: flows with result_viewed / flows with intent_selected; also report Home-to-result separately. Useful completion excludes empty results. Zero results remain observable, not dropped.
- Taps-to-result: count deliberate discovery activations including intent switches; exclude scroll, automatic events and optional locale switch. Record keyboard activation equivalently and call metric “decision activations” in accessibility reporting. Do not infer taps by counting analytics events.
- Drop-off: last reached stage per flow after 30 minutes inactivity; pending/offline events make this an estimate. Existing taxonomy does not diagnose API errors; a future sanitized `result_failed` event requires separate approval.
- Directions CTR: distinct result sets with directions_clicked / distinct visible result sets containing at least one eligible Maps CTA. Use `directions_available_count` from result_viewed (0 allowed); never divide by all result sets indiscriminately.
- Share rate: result sets with share_clicked / viewed result sets where sharing was available. Use the required `share_available` boolean on result_viewed. Until share exists show N/A, not zero failure.
- Popularity: intent/preference distinct selecting flows, not raw repeated click counts. Segment by UI locale without translating stable IDs.
- Retention: consenting anonymous browser cohorts with home_view/result_viewed on day 1/7; report consent coverage and denominator. No tracking across sites/devices. “100 real users” still needs a recruitment/validation method; analytics IDs alone cannot prove this.

## Implementation gate and QA

Provider integration must enforce every required property in schema v1, including eligibility denominators. Keep a single typed allowlist/sanitizer at the tracking boundary; reject unknown properties. Deduplicate on event_id server-side, result_set_id/event_name for visibility events. No data/DB module modification is part of this spec.

QA: React strict-mode rerenders, locale change, reset, double taps, empty result, rejected geolocation, offline retry, no consent/withdrawal, script blockers, no Maps URL, sample itinerary, dormant share/detail. Inspect payloads for privacy exclusions and confirm discovery still works with collector disabled. Provider choice and installation remain pending user review.
