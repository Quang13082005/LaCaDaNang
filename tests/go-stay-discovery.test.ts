import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/discovery/route";
import { resolvePreference } from "@/lib/data/preference-map";
import { DISCOVERY_SQL } from "@/lib/data/place-repository";

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));
vi.mock("@/lib/db/neon", async (original) => ({
  ...await original<typeof import("@/lib/db/neon")>(), getNeonExecutor: () => execute,
}));

const mappings = [
  ["GO", "chup_anh_dep", ["PHOTO"]],
  ["GO", "thien_nhien", ["NATURE"]],
  ["GO", "vui_choi", ["ENTERTAINMENT"]],
  ["GO", "bien_ngam_canh", ["BEACH", "SCENIC"]],
  ["STAY", "gan_bien", ["NEAR_BEACH"]],
  ["STAY", "yen_tinh", ["QUIET"]],
  ["STAY", "gan_trung_tam", ["CENTRAL"]],
  ["STAY", "cap_doi", ["DATE"]],
] as const;
const request = (intent: string, preference: string) => new NextRequest(`http://localhost/api/discovery?intent=${intent}&locale=vi&preference=${preference}`);
beforeEach(() => { execute.mockReset().mockResolvedValue([]); });

describe("GO/STAY route through real repository", () => {
  it.each(mappings)("%s / %s passes only approved tags as SQL parameters", async (section, preference, tags) => {
    expect(resolvePreference(section, preference)).toEqual({ ok: true, kind: "tags", tagCodes: tags });
    const response = await GET(request(section, preference));
    expect(response.status).toBe(200);
    expect(execute).toHaveBeenCalledWith(DISCOVERY_SQL, [section, "vi", tags, 3]);
    expect(await response.json()).toMatchObject({ ok: true, data: { intent: section, preference, count: 0, places: [], meta: { source: "neon-postgres" } } });
  });

  it("keeps multi-tag OR in an EXISTS filter, avoiding row multiplication before LIMIT", async () => {
    await GET(request("GO", "bien_ngam_canh"));
    const [sql, params] = execute.mock.calls[0];
    expect(sql).toMatch(/OR EXISTS\s*\(/);
    expect(sql).toContain("t.code = ANY($3::text[])");
    expect(sql).not.toContain("BEACH");
    expect(sql).not.toContain("SCENIC");
    expect(params[2]).toEqual(["BEACH", "SCENIC"]);
    expect(sql).toContain("p.active = TRUE");
    expect(sql).toContain("p.business_status = 'OPERATIONAL'");
    expect(sql).toContain("p.featured DESC, p.review_count DESC NULLS LAST, p.rating DESC NULLS LAST, p.id ASC");
  });

  it.each(["GO", "STAY"])("%s rejects unsupported/cross-section preferences before touching DB", async (section) => {
    for (const preference of ["family", "popular", "an_ngon", "constructor"]) {
      const response = await GET(request(section, preference));
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ ok: false, error: { code: "INVALID_PARAMETER", field: "preference" } });
    }
    expect(execute).not.toHaveBeenCalled();
  });

  it("keeps CAFE disabled even for general requests", async () => {
    const response = await GET(new NextRequest("http://localhost/api/discovery?intent=CAFE"));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: "INTENT_NOT_AVAILABLE" } });
    expect(execute).not.toHaveBeenCalled();
  });

  it.each([["an_ngon", null], ["dac_san", ["SPECIALTY"]], ["hen_ho", ["DATE"]]])("preserves EAT %s repository request", async (preference, tags) => {
    const response = await GET(request("EAT", preference as string));
    expect(response.status).toBe(200);
    expect(execute).toHaveBeenCalledWith(DISCOVERY_SQL, ["EAT", "vi", tags, 3]);
  });
});
