/**
 * Place adapter — converts raw repository rows into DiscoveryPlace.
 *
 * Nothing from `SqlRow` goes to the UI without passing through here.
 * Rules:
 *  - rating/reviewCount: only accepted if finite numeric; null if missing.
 *  - Translation: req (requested locale) > fb (vi fallback) > source name.
 *  - Tags: parsed from JSON aggregate; bad entries are silently dropped.
 *  - No `imageUrl`, no invented prices, no `reasons`, no subjective inference.
 *  - `translationFallback` = true when req translation was absent.
 */
import type { SqlRow } from "@/lib/db/neon";
import {
  DISCOVERY_FALLBACK_LOCALE,
  isTagDomain,
  type DiscoveryLocale,
  type DiscoveryPlace,
  type DiscoverySection,
  type TagDomain,
} from "@/lib/data/discovery-contract";

interface TagRaw {
  code?: unknown;
  domain?: unknown;
  display_name?: unknown;
  label_req?: unknown;
  label_fb?: unknown;
}

function safeString(v: unknown): string | null {
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  return null;
}

function safeFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function safeInt(v: unknown): number | null {
  const n = safeFiniteNumber(v);
  return n !== null && Number.isInteger(n) ? n : null;
}

function safeNonNegInt(v: unknown): number | null {
  const n = safeInt(v);
  return n !== null && n >= 0 ? n : null;
}

function parseTags(raw: unknown, locale: DiscoveryLocale) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is TagRaw => t !== null && typeof t === "object")
    .flatMap((t) => {
      const code = safeString(t.code);
      const displayName = safeString(t.display_name);
      const rawDomain = t.domain;
      if (!code || !displayName || !isTagDomain(rawDomain)) return [];
      // Prefer requested-locale label, fall back to display_name (which is vi).
      const label =
        (locale !== DISCOVERY_FALLBACK_LOCALE ? safeString(t.label_req) : null) ??
        safeString(t.label_fb) ??
        displayName;
      return [{ code, label, domain: rawDomain as TagDomain }];
    });
}

export function adaptRow(row: SqlRow, locale: DiscoveryLocale): DiscoveryPlace | null {
  const id = safeInt(row.id);
  if (id === null || id <= 0) return null;

  const googlePlaceId = safeString(row.google_place_id);
  if (!googlePlaceId) return null;

  const sourceSection = safeString(row.section) as DiscoverySection | null;
  if (!sourceSection) return null;

  const sourceName = safeString(row.name);
  if (!sourceName) return null;

  // Translation resolution: req > fb > source name
  const reqName = safeString(row.req_display_name);
  const fbName = safeString(row.fb_display_name);
  const name = reqName ?? fbName ?? sourceName;
  const translationFallback = !reqName;

  const reqTypeLabel = safeString(row.req_type_label);
  const fbTypeLabel = safeString(row.fb_type_label);
  const typeLabel = reqTypeLabel ?? fbTypeLabel ?? "";

  const address = safeString(row.address);
  if (!address) return null;

  const googleMapsUrl = safeString(row.google_maps_url);
  if (!googleMapsUrl || !/^https:\/\//i.test(googleMapsUrl)) return null;

  const lat = safeFiniteNumber(row.latitude);
  const lng = safeFiniteNumber(row.longitude);
  if (lat === null || lng === null) return null;

  const areaId = safeInt(row.area_id);
  const areaName = safeString(row.area_name) ?? "";
  const areaUnitType = safeString(row.area_unit_type) ?? "";
  if (areaId === null) return null;

  return {
    id,
    googlePlaceId,
    section: sourceSection,
    name,
    typeLabel,
    primaryType: safeString(row.primary_type) ?? "",
    address,
    area: { id: areaId, name: areaName, unitType: areaUnitType },
    location: { lat, lng },
    googleMapsUrl,
    rating: safeFiniteNumber(row.rating),
    reviewCount: safeNonNegInt(row.review_count),
    tags: parseTags(row.tags, locale),
    description: safeString(row.req_description) ?? safeString(row.fb_description),
    translationFallback,
    featured: Boolean(row.featured),
  };
}

export function adaptRows(rows: SqlRow[], locale: DiscoveryLocale): DiscoveryPlace[] {
  const seen = new Set<number>();
  const out: DiscoveryPlace[] = [];
  for (const row of rows) {
    const place = adaptRow(row, locale);
    if (!place) continue;
    if (seen.has(place.id)) continue; // duplicate guard (belt-and-suspenders)
    seen.add(place.id);
    out.push(place);
  }
  return out;
}
