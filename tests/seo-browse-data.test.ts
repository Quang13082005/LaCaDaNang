import { describe, expect, it, vi } from "vitest";
import { assertReadOnlySql } from "@/lib/db/neon";
import { BROWSE_COUNT_SQL, BROWSE_SQL, RELATED_SQL, countBrowse, listBrowse, listRelated } from "@/lib/data/place-browse";
import { BROWSE_PAGE_SIZE, RELATED_PER_GROUP, hubPath, parseBrowsePage, parseBrowseSlug } from "@/lib/seo/browse";

const row = (id: number, over: Record<string, unknown> = {}) => ({ id, section: "EAT", name: `Place ${id}`, address: `${id} Bạch Đằng`, area_name: "Hải Châu", ...over });

describe("directory SQL", () => {
  it.each([["browse", BROWSE_SQL], ["count", BROWSE_COUNT_SQL], ["related", RELATED_SQL]])("%s is accepted by the read-only guard", (_n, sql) => {
    expect(() => assertReadOnlySql(sql)).not.toThrow();
  });
  it.each([["browse", BROWSE_SQL], ["count", BROWSE_COUNT_SQL], ["related", RELATED_SQL]])("%s uses the same public predicate as sitemap and detail", (_n, sql) => {
    expect(sql).toContain("p.active = TRUE AND p.business_status = 'OPERATIONAL'");
  });
  it("never touches media or image columns", () => {
    for (const sql of [BROWSE_SQL, RELATED_SQL]) expect(sql).not.toMatch(/place_media|image|photo/i);
  });
  it("falls back from requested locale to vi to the source name, ignoring blank translations", () => {
    expect(BROWSE_SQL).toContain("COALESCE(NULLIF(btrim(req.display_name), ''), NULLIF(btrim(fb.display_name), ''), p.name)");
  });
});

describe("directory repository", () => {
  it("lists a page with limit and offset as parameters, never interpolated", async () => {
    const query = vi.fn().mockResolvedValue([row(7), row(9)]);
    const places = await listBrowse("EAT", "en", 3, query);
    expect(query).toHaveBeenCalledWith(BROWSE_SQL, ["EAT", "en", BROWSE_PAGE_SIZE, 2 * BROWSE_PAGE_SIZE]);
    expect(places.map(p => p.id)).toEqual([7, 9]);
  });
  it("drops malformed rows instead of fabricating links", async () => {
    const query = vi.fn().mockResolvedValue([row(1), row(0), row(2, { name: "  " }), row(3, { section: "BAR" }), row(4, { id: "abc" }), row(5)]);
    expect((await listBrowse("EAT", "vi", 1, query)).map(p => p.id)).toEqual([1, 5]);
  });
  it("counts and treats a missing total as zero", async () => {
    expect(await countBrowse("GO", vi.fn().mockResolvedValue([{ total: 412 }]))).toBe(412);
    expect(await countBrowse("GO", vi.fn().mockResolvedValue([]))).toBe(0);
  });
  it("loads related peers by area, own section and per-group size", async () => {
    const query = vi.fn().mockResolvedValue([row(2), row(3, { section: "CAFE" })]);
    const related = await listRelated({ id: 1, section: "EAT", area: { id: 42 } }, "ko", query);
    expect(query).toHaveBeenCalledWith(RELATED_SQL, [1, "ko", 42, "EAT", RELATED_PER_GROUP]);
    expect(related.map(p => p.section)).toEqual(["EAT", "CAFE"]);
  });
});

describe("directory URL helpers", () => {
  it("builds one canonical form per listing", () => {
    expect(hubPath("eat")).toBe("/browse/eat");
    expect(hubPath("eat", 1, "en")).toBe("/browse/eat?locale=en");
    expect(hubPath("stay", 3, "ko")).toBe("/browse/stay?locale=ko&page=3");
    expect(hubPath("go", 2)).toBe("/browse/go?page=2");
  });
  it("accepts only known slugs and plain positive pages", () => {
    expect(parseBrowseSlug("cafe")).toBe("cafe");
    for (const bad of ["EAT", "constructor", "__proto__", "", "eat/1"]) expect(parseBrowseSlug(bad)).toBeNull();
    expect(parseBrowsePage(undefined)).toBe(1);
    expect(parseBrowsePage("12")).toBe(12);
    for (const bad of ["0", "-1", "01", "1.5", "abc", "99999", ""]) expect(parseBrowsePage(bad)).toBeNull();
  });
});
