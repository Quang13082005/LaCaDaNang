# NEARBY_DISCOVERY
CURRENT_REFERENCE — canonical M5 spec; NOT IMPLEMENTED as a runtime feature.

Haversine/filter/sort helpers +18 tests exist, unconnected. Foreground permission only for nearby use; handle denied/unavailable/timeout/stale/inaccurate fixes. Start ~1km, disclose 1->3->5km expansion, preserve filters, no padding. Server validates and filters all eligible candidates before Top3, returns approximate straight-line distance, never ETA. Geofence must match approved new administrative coverage, not old 15km seed rule. Precise GPS not persisted by default or sent to analytics.

Detailed baseline/reference: [NEARBY_ENGINE_PREPARATION.md](reference/NEARBY_ENGINE_PREPARATION.md). This canonical file and current master supersede conflicting older scope/vocabulary. No implementation authorized during M0.
