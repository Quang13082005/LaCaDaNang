# NOTIFICATIONS
CURRENT_REFERENCE — canonical M10 spec; NOT IMPLEMENTED as a runtime feature.

No permission UI, service worker, scheduling or delivery implemented. First scope: explicit “Nhắc tôi trước khi đi” after user value, e.g. 30-minute default only when meaningful. Never prompt on Home or show scheduled when delivery is unavailable. Provider-independent reminder contract, denied fallback and reproducible destination required. Browser/background constraints must be reported; broad five-use-case legacy plan is reference/deferred, not current implementation scope.

Detailed baseline/reference: [NOTIFICATION_SPEC.md](NOTIFICATION_SPEC.md). This canonical file and current master supersede conflicting older scope/vocabulary. No implementation authorized during M0.
