import { cache } from "react";
import { getNeonExecutor, type SqlQuery } from "@/lib/db/neon";
import type { DiscoveryLocale, DiscoverySection } from "./discovery-contract";
import { BROWSE_PAGE_SIZE, RELATED_PER_GROUP } from "@/lib/seo/browse";

/** Link-only projection for crawlable directory pages. Raw rows never leave this module. */
export interface PlaceLink {
  id: number;
  section: DiscoverySection;
  name: string;
  address: string;
  areaName: string;
}

// Same public predicate as the sitemap (listPlaceIds) and the detail page (DETAIL_SQL).
const PUBLIC = "p.active = TRUE AND p.business_status = 'OPERATIONAL'";
// Same provisional deterministic order as the discovery repository; a stable listing order, not a recommendation.
const ORDER = "p.featured DESC, p.review_count DESC NULLS LAST, p.rating DESC NULLS LAST, p.id ASC";
const TRANSLATIONS = `LEFT JOIN place_translations req ON req.place_id = p.id AND req.locale = $2
  LEFT JOIN place_translations fb ON fb.place_id = p.id AND fb.locale = 'vi'`;
const COLUMNS = `p.id, p.section, p.address, au.official_name AS area_name,
  COALESCE(NULLIF(btrim(req.display_name), ''), NULLIF(btrim(fb.display_name), ''), p.name) AS name`;

/** $1 section  $2 locale  $3 limit  $4 offset */
export const BROWSE_SQL = `SELECT ${COLUMNS}
FROM places p
  JOIN administrative_units au ON au.id = p.administrative_unit_id
  ${TRANSLATIONS}
WHERE ${PUBLIC} AND p.section = $1
ORDER BY ${ORDER}
LIMIT $3 OFFSET $4`;

/** $1 section */
export const BROWSE_COUNT_SQL = `SELECT COUNT(*)::int AS total FROM places p WHERE ${PUBLIC} AND p.section = $1`;

/**
 * $1 place id  $2 locale  $3 area id  $4 own section  $5 rows per group.
 * Up to $5 peers of the same section, then up to $5 of other sections (so CAFE venues also receive inbound links).
 */
export const RELATED_SQL = `WITH peers AS (
  SELECT p.id, p.name, p.section, p.address, p.administrative_unit_id,
    ROW_NUMBER() OVER (PARTITION BY (p.section = $4) ORDER BY ${ORDER}) AS rn
  FROM places p
  WHERE ${PUBLIC} AND p.administrative_unit_id = $3 AND p.id <> $1
)
SELECT ${COLUMNS}
FROM peers p
  JOIN administrative_units au ON au.id = p.administrative_unit_id
  ${TRANSLATIONS}
WHERE p.rn <= $5
ORDER BY (p.section = $4) DESC, p.rn ASC`;

function toLink(row: Record<string, unknown>): PlaceLink | null {
  const id = Number(row.id);
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const section = row.section;
  if (!Number.isSafeInteger(id) || id <= 0 || !name) return null;
  if (section !== "EAT" && section !== "CAFE" && section !== "GO" && section !== "STAY") return null;
  return {
    id, section, name,
    address: typeof row.address === "string" ? row.address.trim() : "",
    areaName: typeof row.area_name === "string" ? row.area_name.trim() : "",
  };
}

export async function countBrowse(section: DiscoverySection, query: SqlQuery = getNeonExecutor()): Promise<number> {
  const rows = await query(BROWSE_COUNT_SQL, [section]);
  const total = Number(rows[0]?.total);
  return Number.isSafeInteger(total) && total >= 0 ? total : 0;
}

export async function listBrowse(section: DiscoverySection, locale: DiscoveryLocale, page: number, query: SqlQuery = getNeonExecutor()): Promise<PlaceLink[]> {
  const rows = await query(BROWSE_SQL, [section, locale, BROWSE_PAGE_SIZE, (page - 1) * BROWSE_PAGE_SIZE]);
  return rows.flatMap(row => toLink(row) ?? []);
}

/** Request-scoped deduplication between generateMetadata and the page, no stale global cache. */
export const getBrowse = cache(async (section: DiscoverySection, locale: DiscoveryLocale, page: number) => {
  const total = await countBrowse(section);
  const pages = Math.max(1, Math.ceil(total / BROWSE_PAGE_SIZE));
  return { total, pages, places: total === 0 || page > pages ? [] : await listBrowse(section, locale, page) };
});

export async function listRelated(place: { id: number; section: DiscoverySection; area: { id: number } }, locale: DiscoveryLocale, query: SqlQuery = getNeonExecutor()): Promise<PlaceLink[]> {
  const rows = await query(RELATED_SQL, [place.id, locale, place.area.id, place.section, RELATED_PER_GROUP]);
  return rows.flatMap(row => toLink(row) ?? []);
}
