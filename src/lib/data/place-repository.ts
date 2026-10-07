/**
 * Place repository — the only module that knows the table layout.
 *
 * One parameterised statement, no string interpolation of caller input:
 *   $1 section  $2 requested locale  $3 tag codes (text[] or NULL)  $4 limit
 *
 * Duplicate prevention: the ranked CTE selects from `places` only (one row per place), applies
 * ORDER BY + LIMIT there (i.e. top-N AFTER filtering/ranking), and only then attaches the 1:1
 * and N:1 joins (administrative_units by FK, place_translations by PK (place_id, locale)).
 * Tags are aggregated with a correlated subquery, so they can never multiply place rows.
 *
 * Ordering (PROVISIONAL, deterministic, documented limitation — not a verified recommendation
 * rule): featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC.
 * No randomness; NULL rating/review_count are "unknown" and sort last, never as 0.
 */
import type { SqlQuery, SqlRow } from "@/lib/db/neon";
import {
  DISCOVERY_MAX_RESULTS,
  type DiscoveryLocale,
  type DiscoverySection,
} from "@/lib/data/discovery-contract";

// Static ordering clauses (no caller input). `p.` inside the CTE, `r.` in the final SELECT.
const ORDER_IN_CTE = "p.featured DESC, p.review_count DESC NULLS LAST, p.rating DESC NULLS LAST, p.id ASC";
const ORDER_FINAL = "r.featured DESC, r.review_count DESC NULLS LAST, r.rating DESC NULLS LAST, r.id ASC";

export const DISCOVERY_SQL = `
WITH ranked AS (
  SELECT p.id, p.google_place_id, p.name, p.section, p.primary_type, p.address,
         p.administrative_unit_id, p.latitude, p.longitude, p.google_maps_url,
         p.rating, p.review_count, p.featured
  FROM places p
  WHERE p.active = TRUE
    AND p.business_status = 'OPERATIONAL'
    AND p.section = $1
    AND ($3::text[] IS NULL OR EXISTS (
          SELECT 1
          FROM place_tags ft
          JOIN tags t ON t.id = ft.tag_id
          WHERE ft.place_id = p.id AND t.active = TRUE AND t.code = ANY($3::text[])
        ))
  ORDER BY ${ORDER_IN_CTE}
  LIMIT $4
)
SELECT r.id, r.google_place_id, r.name, r.section, r.primary_type, r.address,
       r.latitude, r.longitude, r.google_maps_url, r.rating, r.review_count,
       au.id AS area_id, au.official_name AS area_name, au.unit_type AS area_unit_type,
       req.display_name AS req_display_name,
       req.primary_type_label AS req_type_label,
       req.short_description AS req_description,
       fb.display_name AS fb_display_name,
       fb.primary_type_label AS fb_type_label,
       fb.short_description AS fb_description,
       COALESCE((
         SELECT json_agg(
                  json_build_object(
                    'code', t.code,
                    'domain', t.domain,
                    'display_name', t.display_name,
                    'label_req', (SELECT tt.label FROM tag_translations tt WHERE tt.tag_id = t.id AND tt.locale = $2),
                    'label_fb',  (SELECT tt.label FROM tag_translations tt WHERE tt.tag_id = t.id AND tt.locale = 'vi')
                  )
                  ORDER BY t.code
                )
         FROM place_tags pt
         JOIN tags t ON t.id = pt.tag_id
         WHERE pt.place_id = r.id AND t.active = TRUE
       ), '[]'::json) AS tags
FROM ranked r
JOIN administrative_units au ON au.id = r.administrative_unit_id
LEFT JOIN place_translations req ON req.place_id = r.id AND req.locale = $2
LEFT JOIN place_translations fb  ON fb.place_id  = r.id AND fb.locale  = 'vi'
ORDER BY ${ORDER_FINAL}
`;

export interface DiscoveryRepositoryQuery {
  section: DiscoverySection;
  locale: DiscoveryLocale;
  /** null = no tag filter. Empty array would match nothing and is rejected. */
  tagCodes: readonly string[] | null;
  limit: number;
}

export interface PlaceRepository {
  /** Returns RAW rows (not UI-safe). Always pass them through the adapter. */
  findDiscoveryRows(query: DiscoveryRepositoryQuery): Promise<SqlRow[]>;
}

export function clampLimit(limit: number): number {
  if (!Number.isFinite(limit)) return DISCOVERY_MAX_RESULTS;
  return Math.min(Math.max(Math.trunc(limit), 1), DISCOVERY_MAX_RESULTS);
}

export function createPlaceRepository(execute: SqlQuery): PlaceRepository {
  return {
    async findDiscoveryRows({ section, locale, tagCodes, limit }) {
      if (tagCodes !== null && tagCodes.length === 0) {
        throw new Error("tagCodes must be null or non-empty");
      }
      return execute(DISCOVERY_SQL, [section, locale, tagCodes === null ? null : [...tagCodes], clampLimit(limit)]);
    },
  };
}
