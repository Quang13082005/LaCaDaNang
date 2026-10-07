/**
 * Mapping from UI preference ids to DATABASE tag codes.
 *
 * Only mappings with direct evidence in the imported `tags` / `tag_translations` rows are
 * allowed to filter. Everything else is explicitly "general" (no tag filter) or unmapped.
 * Never infer QUIET/DATE/FAMILY/etc. from venue types, names or ratings.
 *
 * Evidence (live Neon read-only query, 2026-10-07; EAT places per tag):
 *   SPECIALTY  vi "Đặc sản"  / en "Specialty"  -> 10 EAT places  (UI `dac_san`, label "Đặc sản")
 *   DATE       vi "Hẹn hò"   / en "Date"       ->  2 EAT places  (UI `hen_ho`, label "Hẹn hò")
 *   no tag exists for "ăn ngon" (subjective) -> UI `an_ngon` is the general EAT list.
 * LOCAL_FOOD ("Đồ ăn địa phương", 10 EAT places) is a CANDIDATE for `dac_san` but is not an
 * exact label match, so it is intentionally NOT mapped until the owner approves it.
 */
import type { DiscoverySection, PreferenceMappingKind } from "@/lib/data/discovery-contract";

export type PreferenceMapping =
  | { kind: "general"; note: string }
  | { kind: "tags"; tagCodes: readonly string[]; note: string };

const EAT_PREFERENCES: Readonly<Record<string, PreferenceMapping>> = {
  an_ngon: {
    kind: "general",
    note: "No database tag expresses 'tasty'; returns the general EAT list in provisional order. Not a quality claim.",
  },
  dac_san: {
    kind: "tags",
    tagCodes: ["SPECIALTY"],
    note: "Exact label match: tags.SPECIALTY = 'Đặc sản'.",
  },
  hen_ho: {
    kind: "tags",
    tagCodes: ["DATE"],
    note: "Exact label match: tags.DATE = 'Hẹn hò'. Only venues the workbook tagged DATE qualify.",
  },
};

const PREFERENCES_BY_SECTION: Readonly<Partial<Record<DiscoverySection, Readonly<Record<string, PreferenceMapping>>>>> = {
  EAT: EAT_PREFERENCES,
  // CAFE / GO / STAY: mapping NOT verified in M3-A — intentionally absent (see HANDOFF).
};

export function listPreferenceIds(section: DiscoverySection): string[] {
  return Object.keys(PREFERENCES_BY_SECTION[section] ?? {});
}

export type ResolvedPreference =
  | { ok: true; kind: PreferenceMappingKind; tagCodes: readonly string[] | null }
  | { ok: false };

/** Resolves a (section, preference) pair. `null` preference = no preference = general list. */
export function resolvePreference(section: DiscoverySection, preference: string | null): ResolvedPreference {
  if (preference === null) return { ok: true, kind: "general", tagCodes: null };
  const table = PREFERENCES_BY_SECTION[section];
  // Own-property check: "constructor", "__proto__" etc. must never resolve.
  if (!table || !Object.prototype.hasOwnProperty.call(table, preference)) return { ok: false };
  const mapping = table[preference];
  return mapping.kind === "tags"
    ? { ok: true, kind: "tags", tagCodes: mapping.tagCodes }
    : { ok: true, kind: "general", tagCodes: null };
}
