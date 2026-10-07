/**
 * M3-A unit tests: discovery contract, adapter, preference map, repository helpers.
 *
 * These tests are fully offline — no network, no DATABASE_URL needed.
 * Integration (real Neon) is out of scope for unit test suite.
 */
import { describe, it, expect } from "vitest";
import {
  parseDiscoveryQuery,
  isDiscoverySection,
  isDiscoveryLocale,
  DISCOVERY_MAX_RESULTS,
  DISCOVERY_SECTIONS,
  DISCOVERY_LOCALES,
} from "@/lib/data/discovery-contract";
import { adaptRow, adaptRows } from "@/lib/data/place-adapter";
import { resolvePreference } from "@/lib/data/preference-map";
import { clampLimit } from "@/lib/data/place-repository";
import { assertReadOnlySql, readDatabaseUrl, DatabaseConfigError, DatabaseQueryError } from "@/lib/db/neon";

// ---------------------------------------------------------------------------
// parseDiscoveryQuery
// ---------------------------------------------------------------------------
describe("parseDiscoveryQuery", () => {
  const p = (init: Record<string, string>) => new URLSearchParams(init);

  it("requires intent", () => {
    const r = parseDiscoveryQuery(p({}));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("intent");
  });

  it("rejects unknown intent", () => {
    const r = parseDiscoveryQuery(p({ intent: "SLEEP" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("intent");
  });

  it("accepts EAT with default locale", () => {
    const r = parseDiscoveryQuery(p({ intent: "EAT" }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.query.intent).toBe("EAT");
      expect(r.query.locale).toBe("vi");
      expect(r.query.preference).toBeNull();
    }
  });

  it("accepts all valid sections", () => {
    for (const s of DISCOVERY_SECTIONS) {
      const r = parseDiscoveryQuery(p({ intent: s }));
      expect(r.ok).toBe(true);
    }
  });

  it("accepts all valid locales", () => {
    for (const l of DISCOVERY_LOCALES) {
      const r = parseDiscoveryQuery(p({ intent: "EAT", locale: l }));
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.query.locale).toBe(l);
    }
  });

  it("rejects unknown locale", () => {
    const r = parseDiscoveryQuery(p({ intent: "EAT", locale: "ja" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("locale");
  });

  it("rejects duplicated parameter", () => {
    const params = new URLSearchParams("intent=EAT&intent=CAFE");
    const r = parseDiscoveryQuery(params);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("intent");
  });

  it("accepts valid preference", () => {
    const r = parseDiscoveryQuery(p({ intent: "EAT", preference: "an_ngon" }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.query.preference).toBe("an_ngon");
  });

  it("rejects malformed preference (uppercase)", () => {
    const r = parseDiscoveryQuery(p({ intent: "EAT", preference: "AN_NGON" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("preference");
  });

  it("rejects preference longer than 32 chars", () => {
    const r = parseDiscoveryQuery(p({ intent: "EAT", preference: "a" + "x".repeat(32) }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("preference");
  });
});

// ---------------------------------------------------------------------------
// isDiscoverySection / isDiscoveryLocale
// ---------------------------------------------------------------------------
describe("isDiscoverySection", () => {
  it("EAT is valid", () => expect(isDiscoverySection("EAT")).toBe(true));
  it("empty string is invalid", () => expect(isDiscoverySection("")).toBe(false));
  it("number is invalid", () => expect(isDiscoverySection(1)).toBe(false));
});

describe("isDiscoveryLocale", () => {
  it("vi is valid", () => expect(isDiscoveryLocale("vi")).toBe(true));
  it("ko is valid", () => expect(isDiscoveryLocale("ko")).toBe(true));
  it("ja is invalid", () => expect(isDiscoveryLocale("ja")).toBe(false));
});

// ---------------------------------------------------------------------------
// resolvePreference
// ---------------------------------------------------------------------------
describe("resolvePreference", () => {
  it("null preference = general with no tag codes", () => {
    const r = resolvePreference("EAT", null);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("general");
      expect(r.tagCodes).toBeNull();
    }
  });

  it("an_ngon = general (no tag filter)", () => {
    const r = resolvePreference("EAT", "an_ngon");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kind).toBe("general");
  });

  it("dac_san = tags with SPECIALTY", () => {
    const r = resolvePreference("EAT", "dac_san");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("tags");
      expect(r.tagCodes).toContain("SPECIALTY");
    }
  });

  it("hen_ho = tags with DATE", () => {
    const r = resolvePreference("EAT", "hen_ho");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.tagCodes).toContain("DATE");
  });

  it("unknown preference returns ok:false", () => {
    const r = resolvePreference("EAT", "non_existent");
    expect(r.ok).toBe(false);
  });

  it("prototype pollution guard: __proto__", () => {
    const r = resolvePreference("EAT", "__proto__");
    expect(r.ok).toBe(false);
  });

  it("constructor not resolved", () => {
    const r = resolvePreference("EAT", "constructor");
    expect(r.ok).toBe(false);
  });

  it("CAFE section has no mappings — unknown preference returns ok:false", () => {
    const r = resolvePreference("CAFE", "some_pref");
    expect(r.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// clampLimit
// ---------------------------------------------------------------------------
describe("clampLimit", () => {
  it("clamps to DISCOVERY_MAX_RESULTS for large values", () => {
    expect(clampLimit(9999)).toBe(DISCOVERY_MAX_RESULTS);
  });
  it("clamps min to 1", () => {
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(-5)).toBe(1);
  });
  it("returns DISCOVERY_MAX_RESULTS for NaN", () => {
    expect(clampLimit(NaN)).toBe(DISCOVERY_MAX_RESULTS);
  });
  it("accepts valid value", () => {
    expect(clampLimit(2)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// assertReadOnlySql
// ---------------------------------------------------------------------------
describe("assertReadOnlySql", () => {
  it("allows SELECT", () => {
    expect(() => assertReadOnlySql("SELECT 1")).not.toThrow();
  });
  it("allows WITH...SELECT", () => {
    expect(() => assertReadOnlySql("WITH c AS (SELECT 1) SELECT * FROM c")).not.toThrow();
  });
  it("blocks INSERT", () => {
    expect(() => assertReadOnlySql("INSERT INTO t VALUES (1)")).toThrow(DatabaseQueryError);
  });
  it("blocks multiple statements", () => {
    expect(() => assertReadOnlySql("SELECT 1; DROP TABLE places")).toThrow(DatabaseQueryError);
  });
  it("blocks UPDATE", () => {
    expect(() => assertReadOnlySql("UPDATE places SET name='x'")).toThrow(DatabaseQueryError);
  });
});

// ---------------------------------------------------------------------------
// readDatabaseUrl
// ---------------------------------------------------------------------------
describe("readDatabaseUrl", () => {
  it("throws DatabaseConfigError when DATABASE_URL is missing", () => {
    expect(() => readDatabaseUrl({})).toThrow(DatabaseConfigError);
  });
  it("throws when URL is not a postgres URL", () => {
    expect(() => readDatabaseUrl({ DATABASE_URL: "mysql://host/db" })).toThrow(DatabaseConfigError);
  });
  it("accepts postgres:// URL", () => {
    expect(readDatabaseUrl({ DATABASE_URL: "postgresql://user:pass@host/db" })).toMatch(/^postgresql:/);
  });
});

// ---------------------------------------------------------------------------
// adaptRow (offline)
// ---------------------------------------------------------------------------
function makeSqlRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 1,
    google_place_id: "ChIJtest1",
    section: "EAT",
    name: "Test Place",
    primary_type: "restaurant",
    address: "123 Main St, Da Nang",
    administrative_unit_id: 1,
    latitude: 16.05,
    longitude: 108.2,
    google_maps_url: "https://maps.google.com/?q=test",
    rating: 4.5,
    review_count: 100,
    area_id: 10,
    area_name: "Quận Hải Châu",
    area_unit_type: "district",
    req_display_name: "Test Place VI",
    req_type_label: "Nhà hàng",
    req_description: null,
    fb_display_name: "Test Place FB",
    fb_type_label: "Restaurant FB",
    fb_description: null,
    tags: [],
    ...overrides,
  };
}

describe("adaptRow", () => {
  it("returns a valid DiscoveryPlace for a complete row", () => {
    const place = adaptRow(makeSqlRow(), "vi");
    expect(place).not.toBeNull();
    expect(place?.id).toBe(1);
    expect(place?.name).toBe("Test Place VI");
    expect(place?.translationFallback).toBe(false);
  });

  it("sets translationFallback=true when req translation is missing", () => {
    const place = adaptRow(makeSqlRow({ req_display_name: null }), "en");
    expect(place?.translationFallback).toBe(true);
    // Falls back to fb_display_name
    expect(place?.name).toBe("Test Place FB");
  });

  it("falls back to source name when both req and fb are null", () => {
    const place = adaptRow(makeSqlRow({ req_display_name: null, fb_display_name: null }), "en");
    expect(place?.name).toBe("Test Place");
    expect(place?.translationFallback).toBe(true);
  });

  it("returns null for invalid google_maps_url", () => {
    const place = adaptRow(makeSqlRow({ google_maps_url: "http://maps.google.com" }), "vi");
    expect(place).toBeNull();
  });

  it("returns null for missing id", () => {
    const place = adaptRow(makeSqlRow({ id: null }), "vi");
    expect(place).toBeNull();
  });

  it("returns null for invalid lat/lng", () => {
    const place = adaptRow(makeSqlRow({ latitude: null }), "vi");
    expect(place).toBeNull();
  });

  it("rating null when missing", () => {
    const place = adaptRow(makeSqlRow({ rating: null }), "vi");
    expect(place?.rating).toBeNull();
  });

  it("reviewCount null when missing", () => {
    const place = adaptRow(makeSqlRow({ review_count: null }), "vi");
    expect(place?.reviewCount).toBeNull();
  });

  it("parses tags correctly", () => {
    const tags = [
      { code: "SPECIALTY", domain: "EAT", display_name: "Đặc sản", label_req: "Specialty", label_fb: "Đặc sản" },
    ];
    const place = adaptRow(makeSqlRow({ tags }), "en");
    expect(place?.tags).toHaveLength(1);
    expect(place?.tags[0].code).toBe("SPECIALTY");
    expect(place?.tags[0].label).toBe("Specialty"); // en label_req
  });

  it("drops tags with invalid domain", () => {
    const tags = [{ code: "X", domain: "INVALID_DOMAIN", display_name: "X" }];
    const place = adaptRow(makeSqlRow({ tags }), "vi");
    expect(place?.tags).toHaveLength(0);
  });
});

describe("adaptRows", () => {
  it("deduplicates by id", () => {
    const row = makeSqlRow();
    const result = adaptRows([row, row], "vi");
    expect(result).toHaveLength(1);
  });

  it("skips null adaptRow results", () => {
    const bad = makeSqlRow({ id: null });
    const result = adaptRows([bad], "vi");
    expect(result).toHaveLength(0);
  });
});
