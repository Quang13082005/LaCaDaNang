# UX_ONE_THUMB
CURRENT_REFERENCE — canonical M7 spec; NOT IMPLEMENTED as a runtime feature.

Current UI reorders selected intent and scrolls mandatory action high; one-thumb NOT PASS. Keep stable slots, lower reachable actions/reset, safe-area/keyboard clearance, async height/race/focus handling, >=44px targets. Preserve two-tap results, context/reset/0–3 outcomes. No core clipping/clamp/ellipsis. Verify screenshots at 360x800/390x844/430x932/768x900/1280x900 plus narrow widths required by user; physical one-hand review remains separate. No-image PlaceCard remains M6, not an accomplished M0 change.

## Rules migrated from the archived UX-hardening instruction
Still valid, now owned here (the archived file is history, not instruction):
- Results are only true matches: 0/1/2/3 allowed, never padded with unrelated places; no fake rank badge, price, distance or travel time.
- A preference/option is shown only if current data can support its claim; otherwise hide it rather than invent semantics.
- Maps CTA label `Xem trên Google Maps`, rendered only for a stored, valid URL; a hidden button beats a wrong destination.
- NOW is labelled `Lịch trình mẫu` until a time-aware engine exists; no current-time or opening-hours claim.
- `Đổi lựa chọn` returns to the active preference area (no jump to top); results show `<Intent> · <Preference>` context.
- Check widths continuously across 320-480px (not only presets) plus one iPhone-like and one Android-like landscape; chips wrap, no core ellipsis; Chromium viewports are not physical-device certification.

Detailed baseline/reference: [ONE_THUMB_UX_AUDIT.md](reference/ONE_THUMB_UX_AUDIT.md). This canonical file and current master supersede conflicting older scope/vocabulary. No implementation authorized during M0.
