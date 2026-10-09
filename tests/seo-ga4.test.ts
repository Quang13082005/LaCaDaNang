import { afterEach, describe, expect, it, vi } from "vitest";
import { parsePlaceId, placePath, siteOrigin } from "@/lib/seo/site";
import { placeMetadata, placeJsonLd, serializeJsonLd } from "@/lib/seo/place";
import { findPlace, listPlaceIds, DETAIL_SQL } from "@/lib/data/place-detail";
import { assertReadOnlySql } from "@/lib/db/neon";
import { apiPlace } from "./discovery-fixtures";
import { measurementId, safeGaParams, safePagePath, sendGaEvent, gaBootstrap } from "@/lib/analytics/ga4";
import { ANALYTICS_EVENT_NAMES } from "@/lib/analytics/types";
import fs from "node:fs";
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
describe("stable real-place SEO",()=>{
 it.each(["0","01","-1","1a","2147483648"])("rejects noncanonical ID %s",value=>expect(parsePlaceId(value)).toBeNull());
 it("preserves generated IDs and names do not affect route",()=>{expect(parsePlaceId("2500")).toBe(2500);expect(placePath(1501)).toBe("/places/1501");expect(placePath(1501,"ko")).toBe("/places/1501?locale=ko");});
 it("returns null for missing record and uses one parameterized SELECT",async()=>{const q=vi.fn().mockResolvedValue([]);expect(await findPlace(9999,"en",q)).toBeNull();expect(q).toHaveBeenCalledWith(DETAIL_SQL,[9999,"en",null,1]);expect(()=>assertReadOnlySql(DETAIL_SQL)).not.toThrow();expect(DETAIL_SQL).toContain("p.id = $1");});
 it("adapts requested-locale absence to Vietnamese without invention",async()=>{const q=vi.fn().mockResolvedValue([{id:1501,google_place_id:"real-id",name:"Source",section:"CAFE",address:"Address",google_maps_url:"https://maps.google.com/?cid=1",latitude:16,longitude:108,area_id:1,fb_display_name:"Vietnamese name",rating:null,review_count:null}]);const p=await findPlace(1501,"ko",q);expect(p?.name).toBe("Vietnamese name");expect(p?.translationFallback).toBe(true);expect(p?.description).toBeNull();});
 it("lists all 1500 IDs in one lightweight query without duplicates",async()=>{const ids=Array.from({length:1500},(_,i)=>i<500?i+1:i+1001);const q=vi.fn().mockResolvedValue(ids.map(id=>({id})));const result=await listPlaceIds(q);expect(result).toEqual(ids);expect(new Set(result).size).toBe(1500);expect(q).toHaveBeenCalledTimes(1);expect(q.mock.calls[0][0]).not.toContain("JOIN");});
 it("has unique metadata and locale canonical, with safe truthful JSON-LD",()=>{vi.stubEnv("SITE_URL","https://example.test");const p=apiPlace(1501,"GO");const m=placeMetadata(p,"ko");expect(m.title).toContain(p.name);expect(m.alternates?.canonical).toBe("https://example.test/places/1501?locale=ko");expect(placeMetadata(apiPlace(1502),"vi").title).not.toEqual(m.title);const ld=placeJsonLd(p);expect(ld["@type"]).toBe("Place");expect(ld.hasMap).toBe(p.googleMapsUrl);expect(ld).not.toHaveProperty("openingHours");expect(ld).not.toHaveProperty("image");expect(serializeJsonLd({name:"</script>"})).not.toContain("<");expect(JSON.parse(serializeJsonLd({name:"</script>"})).name).toBe("</script>");});
 it("rejects invalid origin configuration",()=>{expect(()=>siteOrigin("http://localhost:3000")).toThrow();expect(()=>siteOrigin("https://example.test/x")).toThrow();});
 it("forward migration leaves historical SQL and existing sequence alone",()=>{const sql=fs.readFileSync("docs/schema/002_places_id_sequence.sql","utf8");expect(sql).toContain("pg_get_serial_sequence");expect(sql).toContain("COALESCE(MAX(id), 0) + 1");expect(sql).not.toMatch(/setval|TRUNCATE|DELETE FROM|UPDATE places/i);expect(sql).toContain("OWNED BY public.places.id");});
});
describe("optional privacy-safe GA4",()=>{
 it("absent or malformed ID is disabled",()=>{expect(measurementId("")).toBeNull();expect(measurementId("not-id")).toBeNull();expect(measurementId("G-TEST123")).toBe("G-TEST123");});
 it("drops raw GPS PII identifiers and query URLs",()=>{expect(safeGaParams({latitude:16,longitude:108,accuracy:20,email:"x@y",session_id:"id",page_location:"https://x/?lat=16",radius_km:3,intent:"GO",locale:"ko"})).toEqual({intent:"GO",locale:"ko",radius_km:3});expect(safePagePath("/api/now?lat=16")).toBe("/");});
 it.each(ANALYTICS_EVENT_NAMES)("mirrors %s without changing first-party contract",name=>{vi.stubEnv("NODE_ENV","production");vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");const gtag=vi.fn();vi.stubGlobal("window",{gtag,location:{origin:"https://example.test",pathname:"/places/1"}});sendGaEvent(name,{locale:"vi",latitude:16});expect(gtag).toHaveBeenCalledWith("event",name,{locale:"vi",page_location:"https://example.test/places/1",page_referrer:""});expect(ANALYTICS_EVENT_NAMES).toHaveLength(11);});
 it("tracking failure cannot block actions",()=>{vi.stubEnv("NODE_ENV","production");vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");vi.stubGlobal("window",{gtag:()=>{throw Error("blocked");},location:{origin:"https://x",pathname:"/"}});expect(()=>sendGaEvent("maps_clicked",{})).not.toThrow();});
 it("bootstrap disables auto pageview and advertising signals",()=>{const code=gaBootstrap("G-TEST123");expect(code).toContain("send_page_view:false");expect(code).toContain("allow_google_signals:false");expect(code).not.toContain("location.href");expect(gaBootstrap("bad")).toBe("");});
});
