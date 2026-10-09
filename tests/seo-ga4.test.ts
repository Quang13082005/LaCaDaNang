import { afterEach, describe, expect, it, vi } from "vitest";
import { parsePlaceId, placePath, siteOrigin } from "@/lib/seo/site";
import { placeMetadata, placeJsonLd, serializeJsonLd } from "@/lib/seo/place";
import { findPlace, listPlaceIds, DETAIL_SQL } from "@/lib/data/place-detail";
import { assertReadOnlySql } from "@/lib/db/neon";
import { apiPlace } from "./discovery-fixtures";
import { measurementId, safeGaParams, safePagePath, sendGaEvent, gaBootstrap, isGaProductionHostname, isGaOptedOut, isGaActive, GA_PRODUCTION_HOSTNAME, setGaOptOut, getGaConsent, setGaConsent, GA_CONSENT_STORAGE_KEY } from "@/lib/analytics/ga4";
import { ANALYTICS_EVENT_NAMES } from "@/lib/analytics/types";
import fs from "node:fs";
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();window.localStorage.clear();});
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
 it("drops raw GPS PII identifiers and query URLs",()=>{expect(safeGaParams({latitude:16,longitude:108,accuracy:20,email:"x@y",session_id:"id",page_location:"https://x/?lat=16",radius_km:3,intent:"GO",locale:"ko"})).toEqual({intent:"GO",locale:"ko",radius_km:3});expect(safePagePath("/api/now?lat=16")).toBe("/");expect(safePagePath("/places/1501?foo=bar")).toBe("/");expect(safePagePath("/places/1501")).toBe("/places/1501");});
 it.each(ANALYTICS_EVENT_NAMES)("mirrors %s without changing first-party contract",name=>{
  vi.stubEnv("NODE_ENV","production");
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  setGaConsent("granted");
  const gtag=vi.fn();
  vi.stubGlobal("window",{gtag,location:{origin:"https://lacadanang.quangdev.id.vn",hostname:"lacadanang.quangdev.id.vn",pathname:"/places/1"},localStorage:window.localStorage});
  sendGaEvent(name,{locale:"vi",latitude:16});
  expect(gtag).toHaveBeenCalledWith("event",name,{locale:"vi",page_location:"https://lacadanang.quangdev.id.vn/places/1",page_referrer:""});
  expect(ANALYTICS_EVENT_NAMES).toHaveLength(11);
 });
 it("strictly gates GA4 on production hostname and blocks localhost, preview, or foreign hostnames even when consent is granted",()=>{
  expect(GA_PRODUCTION_HOSTNAME).toBe("lacadanang.quangdev.id.vn");
  expect(isGaProductionHostname("lacadanang.quangdev.id.vn")).toBe(true);
  expect(isGaProductionHostname("LACADANANG.QUANGDEV.ID.VN")).toBe(true);
  expect(isGaProductionHostname("localhost")).toBe(false);
  expect(isGaProductionHostname("127.0.0.1")).toBe(false);
  expect(isGaProductionHostname("la-ca-da-nang.quangdev.workers.dev")).toBe(false);
  expect(isGaProductionHostname("preview.lacadanang.quangdev.id.vn")).toBe(false);
  expect(isGaProductionHostname("example.test")).toBe(false);
  expect(isGaProductionHostname("")).toBe(false);
  expect(isGaProductionHostname(undefined)).toBe(false);

  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  setGaConsent("granted");
  const gtag=vi.fn();
  vi.stubGlobal("window",{gtag,location:{origin:"https://la-ca-da-nang.quangdev.workers.dev",hostname:"la-ca-da-nang.quangdev.workers.dev",pathname:"/"},localStorage:window.localStorage});
  sendGaEvent("session_started",{locale:"vi"});
  expect(gtag).not.toHaveBeenCalled();
 });
 it("blocks GA4 by default when consent is not yet granted",()=>{
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  const gtag=vi.fn();
  vi.stubGlobal("window",{gtag,location:{origin:"https://lacadanang.quangdev.id.vn",hostname:"lacadanang.quangdev.id.vn",pathname:"/"},localStorage:window.localStorage});
  expect(getGaConsent()).toBeNull();
  expect(isGaActive("G-TEST123","lacadanang.quangdev.id.vn")).toBe(false);
  sendGaEvent("session_started",{locale:"vi"});
  expect(gtag).not.toHaveBeenCalled();
 });
 it("respects user opt-out/denied consent in localStorage",()=>{
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  const gtag=vi.fn();
  setGaConsent("denied");
  vi.stubGlobal("window",{gtag,location:{origin:"https://lacadanang.quangdev.id.vn",hostname:"lacadanang.quangdev.id.vn",pathname:"/"},localStorage:window.localStorage});
  expect(isGaOptedOut()).toBe(true);
  expect(getGaConsent()).toBe("denied");
  expect(isGaActive("G-TEST123","lacadanang.quangdev.id.vn")).toBe(false);
  sendGaEvent("session_started",{locale:"vi"});
  expect(gtag).not.toHaveBeenCalled();
 });
 it("isGaActive requires valid ID, granted consent, and production hostname",()=>{
  expect(isGaActive(null,"lacadanang.quangdev.id.vn")).toBe(false);
  expect(isGaActive("invalid-id","lacadanang.quangdev.id.vn")).toBe(false);
  // Default: null consent -> false
  expect(isGaActive("G-REAL123","lacadanang.quangdev.id.vn")).toBe(false);

  setGaConsent("granted");
  expect(isGaActive("G-REAL123","localhost")).toBe(false);
  expect(isGaActive("G-REAL123","la-ca-da-nang.quangdev.workers.dev")).toBe(false);
  expect(isGaActive("G-REAL123","lacadanang.quangdev.id.vn")).toBe(true);
 });
 it("bootstrap enables initial pageview and declares consent default with advertising disabled",()=>{
  const code=gaBootstrap("G-TEST123");
  expect(code).toContain("send_page_view:true");
  expect(code).toContain("consent','default");
  expect(code).toContain("analytics_storage':'granted");
  expect(code).toContain("ad_storage':'denied");
  expect(code).toContain("allow_google_signals:false");
  expect(code).not.toContain("location.href");
  expect(gaBootstrap("bad")).toBe("");
 });
 it("first-party analytics never dispatches manual page_view events to prevent duplication with Enhanced Measurement",()=>{
  expect((ANALYTICS_EVENT_NAMES as readonly string[]).includes("page_view")).toBe(false);
 });
 it("setGaConsent and setGaOptOut toggle consent status and ga-disable on window",()=>{
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  setGaOptOut(true,"G-TEST123");
  expect((window as any)["ga-disable-G-TEST123"]).toBe(true);
  expect(isGaOptedOut()).toBe(true);
  expect(getGaConsent()).toBe("denied");
  expect(isGaActive("G-TEST123","lacadanang.quangdev.id.vn")).toBe(false);

  setGaOptOut(false,"G-TEST123");
  expect((window as any)["ga-disable-G-TEST123"]).toBeUndefined();
  expect(isGaOptedOut()).toBe(false);
  expect(getGaConsent()).toBe("granted");
  expect(isGaActive("G-TEST123","lacadanang.quangdev.id.vn")).toBe(true);
 });
 it("updates gtag consent in same session when gtag is already loaded and handles bi-directional switching",()=>{
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  const gtag = vi.fn();
  (window as any).gtag = gtag;

  // Granted -> Denied
  setGaConsent("denied","G-TEST123");
  expect(gtag).toHaveBeenCalledWith("consent","update",{analytics_storage:"denied"});
  expect((window as any)["ga-disable-G-TEST123"]).toBe(true);
  expect(isGaActive("G-TEST123","lacadanang.quangdev.id.vn")).toBe(false);

  // Denied -> Granted
  gtag.mockClear();
  setGaConsent("granted","G-TEST123");
  expect(gtag).toHaveBeenCalledWith("consent","update",{analytics_storage:"granted"});
  expect((window as any)["ga-disable-G-TEST123"]).toBeUndefined();
  expect(isGaActive("G-TEST123","lacadanang.quangdev.id.vn")).toBe(true);
 });
 it("GoogleAnalytics component renders null on non-production domains, invalid ID, or without granted consent",async()=>{
  const React = (await import("react")).default;
  const { render } = await import("@testing-library/react");
  const { GoogleAnalytics } = await import("@/components/analytics/GoogleAnalytics");

  const setLocation = (urlStr: string) => {
    const u = new URL(urlStr);
    Object.defineProperty(window, "location", {
      value: {
        hostname: u.hostname,
        origin: u.origin,
        pathname: u.pathname,
        search: u.search,
        href: u.href,
      },
      writable: true,
      configurable: true,
    });
  };

  // Case 1: localhost (even with granted consent)
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  setGaConsent("granted");
  setLocation("http://localhost:3000/");
  const { container: c1 } = render(React.createElement(GoogleAnalytics));
  expect(c1.innerHTML).toBe("");

  // Case 2: preview domain (even with granted consent)
  setLocation("https://la-ca-da-nang.quangdev.workers.dev/");
  const { container: c2 } = render(React.createElement(GoogleAnalytics));
  expect(c2.innerHTML).toBe("");

  // Case 3: missing measurement ID
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","");
  setLocation("https://lacadanang.quangdev.id.vn/");
  const { container: c3 } = render(React.createElement(GoogleAnalytics));
  expect(c3.innerHTML).toBe("");

  // Case 4: default undecided (no consent, null) on production
  window.localStorage.clear();
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID","G-TEST123");
  setLocation("https://lacadanang.quangdev.id.vn/");
  const { container: c4 } = render(React.createElement(GoogleAnalytics));
  expect(c4.innerHTML).toBe("");

  // Case 5: denied consent on production
  setGaConsent("denied");
  const { container: c5 } = render(React.createElement(GoogleAnalytics));
  expect(c5.innerHTML).toBe("");

  // Case 6: granted consent on production hostname (renders scripts without error)
  setGaConsent("granted");
  const { container: c6 } = render(React.createElement(GoogleAnalytics));
  expect(c6).toBeDefined();
 });
 it("AnalyticsConsentBanner renders when consent is undecided and handles Accept/Decline/Modal",async()=>{
  const React = (await import("react")).default;
  const { render, screen, fireEvent } = await import("@testing-library/react");
  const { AnalyticsConsentBanner } = await import("@/components/analytics/AnalyticsConsentBanner");

  window.localStorage.clear();
  const { unmount } = render(React.createElement(AnalyticsConsentBanner));

  // Banner should be visible initially
  expect(screen.getByRole("region", { name: /Quyền riêng tư/i })).toBeInTheDocument();
  const acceptBtn = screen.getByRole("button", { name: "Đồng ý" });
  const declineBtn = screen.getByRole("button", { name: "Từ chối" });
  expect(acceptBtn).toBeInTheDocument();
  expect(declineBtn).toBeInTheDocument();

  // Test Decline
  fireEvent.click(declineBtn);
  expect(getGaConsent()).toBe("denied");
  expect(screen.queryByRole("region", { name: /Quyền riêng tư/i })).toBeNull();
  unmount();

  // Test Accept
  window.localStorage.clear();
  const { unmount: unmount2 } = render(React.createElement(AnalyticsConsentBanner));
  const acceptBtn2 = screen.getByRole("button", { name: "Đồng ý" });
  fireEvent.click(acceptBtn2);
  expect(getGaConsent()).toBe("granted");
  expect(screen.queryByRole("region", { name: /Quyền riêng tư/i })).toBeNull();
  unmount2();

  // Test open settings modal via event
  const { unmount: unmount3 } = render(React.createElement(AnalyticsConsentBanner));
  const { act } = await import("@testing-library/react");
  act(() => {
    window.dispatchEvent(new Event("laca_open_consent_settings"));
  });
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText(/Cài đặt phân tích & Quyền riêng tư/i)).toBeInTheDocument();
  // Close modal via Escape key
  act(() => {
    fireEvent.keyDown(window, { key: "Escape" });
  });
  expect(screen.queryByRole("dialog")).toBeNull();
  unmount3();
 });
});
