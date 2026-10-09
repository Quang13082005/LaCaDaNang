import { afterEach, describe, expect, it, vi } from "vitest";
import { siteOrigin, PRODUCTION_ORIGIN } from "@/lib/seo/site";
import { placeMetadata, placeJsonLd } from "@/lib/seo/place";
import { listPlaceIds, DETAIL_SQL } from "@/lib/data/place-detail";
import { apiPlace } from "./discovery-fixtures";
import robots from "@/app/robots";

afterEach(() => vi.unstubAllEnvs());
describe("public production SEO origin", () => {
  it("uses Production even for a Preview build without SITE_URL", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("APP_ENV", "preview");
    expect(siteOrigin()).toBe("https://lacadanang.quangdev.id.vn");
    expect(robots().sitemap).toBe(PRODUCTION_ORIGIN + "/sitemap.xml");
    expect(robots().rules).toEqual({userAgent:"*",allow:"/",disallow:["/api/","/dev/"]});
  });
  it.each(["https://la-ca-da-nang-preview.quang24101977.workers.dev", "https://localhost", "https://127.0.0.1", "https://[::1]"])("rejects non-public canonical configuration %s", value => {
    expect(() => siteOrigin(value)).toThrow();
  });
  it.each(["vi", "en", "ko"] as const)("keeps %s metadata and hreflang on Production", locale => {
    vi.stubEnv("SITE_URL", "");
    const place = apiPlace(1501, "CAFE");
    const meta = placeMetadata(place, locale);
    expect(meta.alternates?.canonical).toBe(PRODUCTION_ORIGIN + "/places/1501" + (locale === "vi" ? "" : "?locale=" + locale));
    for (const url of Object.values(meta.alternates?.languages ?? {})) expect(url).toMatch(/^https:\/\/lacadanang\.quangdev\.id\.vn\/places\/1501/);
    expect(meta.openGraph?.url).toBe(meta.alternates?.canonical);
    expect(meta.robots).toBeUndefined();
    const ld = placeJsonLd(place);
    expect(ld.url).toBe(PRODUCTION_ORIGIN + "/places/1501");
    expect(ld.hasMap).toBe(place.googleMapsUrl);
    expect(ld).not.toHaveProperty("image");
    expect(ld).not.toHaveProperty("openingHours");
  });
  it("uses the same public predicate for sitemap and missing/inactive detail eligibility", async () => {
    const query = vi.fn().mockResolvedValue([{id:1},{id:2500}]);
    expect(await listPlaceIds(query)).toEqual([1,2500]);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain("active = TRUE AND business_status = 'OPERATIONAL'");
    expect(DETAIL_SQL).toContain("p.active = TRUE");
    expect(DETAIL_SQL).toContain("p.business_status = 'OPERATIONAL'");
  });
  it("distinguishes same-name branches using their actual address", () => {
    const place = apiPlace(1501, "CAFE");
    const other = {...place, id:1502, address:"25 Pham Hong Thai"};
    expect(placeMetadata(place,"vi").title).not.toBe(placeMetadata(other,"vi").title);
    expect(placeMetadata(other,"vi").title).toContain(other.address);
  });
});
