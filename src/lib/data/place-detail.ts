import { cache } from "react";
import { getNeonExecutor, type SqlQuery } from "@/lib/db/neon";
import { DISCOVERY_SQL } from "./place-repository";
import { adaptRow } from "./place-adapter";
import type { DiscoveryLocale } from "./discovery-contract";
// Reuse the proven projection/translation adapter. Only candidate selection differs.
export const DETAIL_SQL = DISCOVERY_SQL.replace("AND p.section = $1", "AND p.id = $1");
export async function findPlace(id: number, locale: DiscoveryLocale, query: SqlQuery = getNeonExecutor()) {
  const rows = await query(DETAIL_SQL, [id, locale, null, 1]);
  return rows[0] ? adaptRow(rows[0], locale) : null;
}
// Request-scoped deduplication between generateMetadata and the page, no stale global cache.
export const getPlace = cache(findPlace);
export async function listPlaceIds(query: SqlQuery = getNeonExecutor()): Promise<number[]> {
  const rows = await query("SELECT id FROM places WHERE active = TRUE AND business_status = 'OPERATIONAL' ORDER BY id", []);
  return rows.map(row => Number(row.id));
}
