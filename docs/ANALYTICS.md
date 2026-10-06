# ANALYTICS
CURRENT_REFERENCE — canonical M9 spec; NOT IMPLEMENTED as a runtime feature.

No provider/SDK/events installed. New master vocabulary supersedes legacy eight-event names: app_open, locale_resolved, locale_changed, location_permission_prompted, location_permission_granted, location_permission_denied, intent_selected, preference_selected, discovery_requested, discovery_succeeded, discovery_empty, discovery_failed, place_maps_opened, selection_reset, now_started, itinerary_viewed, notification_opt_in_shown, notification_permission_granted, notification_permission_denied, notification_scheduled. Use typed abstraction with no-op test provider; choose real provider only after deployment/consent review. Deduplicate actual interactions, preserve stable IDs, distinguish empty/error/success, no precise GPS or secrets. Legacy retention/caps are proposals, not approved provider configuration.

Detailed baseline/reference: [ANALYTICS_SPEC.md](ANALYTICS_SPEC.md). This canonical file and current master supersede conflicting older scope/vocabulary. No implementation authorized during M0.
