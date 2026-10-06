> CURRENT_REFERENCE — 2026-10-06. Use docs/NOTIFICATIONS.md as the canonical milestone specification. This document provides baseline/details; newer vocabulary/scope wins on conflict. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# Notification design — proposal only

No Web Push, service worker, scheduler, provider, permission prompt or subscription is implemented. The app currently lacks stable deep-link state and verified live opening/event data; those are release gates, not details to invent.

## Consent and delivery rules

Never request permission on first load. After a user receives value (e.g. views a useful result and explicitly asks to save a reminder), offer a dismissible explanation. Example: “Bạn có muốn nhận lời nhắc cho lịch trình này không?” Only a subsequent explicit opt-in action may invoke browser permission. Browser permission alone is not product consent for all categories. “No thanks” is respected; don't re-prompt in the same session, and proposed cooldown is 30 days. Denied permission: do not invoke the prompt again; explain settings only if user asks.

Per-category consent and easy opt-out; global cap proposed **1 notification/day and 3/week**, with a stricter per-type cap below. Local quiet hours 21:00–09:00 by explicitly selected timezone; discard expired messages rather than delivering late. A user-specified reminder inside quiet hours requires explicit confirmation for that specific reminder. No duplicate delivery across worker retries. Withdrawn consent or deleted subscription cancels queued deliveries immediately.

Use opaque subscription identifiers only; encrypt and restrict access to delivery tokens when a provider is eventually approved. Do not log endpoints/auth keys, GPS history or notification content in analytics. Lock-screen copy should be generic by default, with no precise user location or sensitive itinerary detail. Delivery/open measurements must be honest: send accepted by push service is not proof seen/read.

## Evening suggestion
- Trigger: opted-in user-selected days around 18:00 in selected timezone, only when an approved useful suggestion exists; do not infer venue opening hours.
- Target: users who explicitly request evening ideas after a useful result.
- Template: “Muốn tìm ý tưởng cho buổi tối ở Đà Nẵng? Mở La Cà để chọn.”
- Deep link: existing `/` only. No fabricated result route; user chooses intent normally.
- Cap: at most 2/week and one/day, subject to global cap.
- Dedup key: subscription + category + local date; TTL 2h.
- Permission/privacy: category consent + browser grant, chosen timezone only, no raw GPS.
- Fallback: if permission unsupported/denied, show an in-app suggestion only on user visit; no email/SMS subscription substitute.

## Nearby suggestion (deferred until DB/geo)
- Trigger: an explicit foreground “find near me” request with a fresh acceptable fix produces usable results, and user asks to receive that result later. No passive movement trigger or background location watcher.
- Target: opted-in user who requested the specific nearby reminder.
- Template: “Gợi ý bạn đã lưu đang sẵn sàng. Mở La Cà để xem lại.” Avoid saying “near you now” after time has passed.
- Deep link: `/` until reproducible result-state links are implemented; do not ship this type until the saved result can be restored without storing a GPS URL.
- Cap: one/request and at most one/day; TTL 30min.
- Dedup: subscription + request/result reference + category, cancel if request superseded.
- Permission/privacy: per-reminder consent plus notification grant; geolocation separately consented. No ongoing location access or lat/lng in payload/logs.
- Fallback: keep result on-screen in the current session; never infer location if permission fails. If saved result is unavailable, explain and offer new discovery instead of substituting silently.

## Itinerary reminder
- Trigger: user chooses an explicit reminder time after viewing an itinerary. Sample itinerary has no clock time, so never derive reminder times from “Chặng N” or stop order.
- Target: user who requested that reminder, no unsolicited subscription.
- Template: “Đến giờ xem lại lịch trình bạn đã lưu.”
- Deep link: pending approved stable itinerary link; `/` is only a safe navigation fallback with an explanation. Do not enable delivery until restoration exists.
- Cap: one/reminder; at most 1/day; expires 30min after chosen time.
- Dedup: subscription + reminder ID; reschedule replaces/cancels old delivery, never adds a second job.
- Permission/privacy: explicit reminder consent + browser grant; payload contains an opaque reference, not full itinerary/GPS.
- Fallback: on-screen reminder confirmation only; if unsupported explain that no background reminder will arrive. Never show “scheduled” when scheduling failed.

## Event/context reminder (deferred)
- Trigger: user follows a verified event and requests reminder at a chosen time. Requires trusted event source, freshness/expiration and cancellation handling; none assumed today.
- Target: opted-in followers of that specific event.
- Template: “Bạn có một lời nhắc sự kiện đã lưu. Mở La Cà để kiểm tra thông tin mới nhất.”
- Deep link: future approved event destination; no new route in this task. Disable if unavailable.
- Cap: one/event; global daily cap applies; drop after event start.
- Dedup: subscription + event ID + reminder type/version; cancel queued reminder when event cancelled.
- Permission/privacy: event-specific consent; no inferred interests or precise whereabouts.
- Fallback: in-app saved event only after that feature exists; do not invent events to fill the schedule.

## Gentle re-engagement (optional, lowest priority)
- Trigger: at least 14 days since last consented useful visit, only if user expressly chose occasional ideas and a meaningful suggestion exists. Analytics consent is separate from notification consent; if inactivity cannot be established legitimately, skip.
- Target: opted-in inactive browsers; never purchased audiences or inferred profiles.
- Template: “Muốn khám phá Đà Nẵng thêm một chút? La Cà có thể giúp bạn chọn.”
- Deep link: `/`.
- Cap: 1 per 14 days, maximum 2 consecutive unopened messages then suppress until a new visit/re-opt-in; global cap applies.
- Dedup: subscription + campaign window; TTL 24h, respect quiet hours.
- Permission/privacy: category-specific consent, no GPS, no sensitive personalization; don't equate lack of click with exact unread status.
- Fallback: no delivery; never escalate to another channel or repeatedly prompt.

## Operational acceptance and pending work

UI must distinguish unsupported, default, denied, granted-without-category-consent, subscribed, scheduling failure and revoked. Future provider support is capability-detected; do not promise mobile background delivery on every browser. Localization uses frontend dictionaries; event/place descriptions must use verified DB translations. No routes/providers/accounts are added now.

Before implementation approve provider + consent UX + timezone/caps, then implement stable deep links and cancellation; test retry idempotency, DST/timezone change, stale content, offline/revocation, expired subscriptions, no permission on Home, duplicate prevention, late delivery and privacy-safe lock screen. No push can be enabled merely because this spec exists.
