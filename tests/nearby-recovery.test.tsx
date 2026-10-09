import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DiscoveryResults } from "@/components/results/DiscoveryResults";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { apiPlace } from "./discovery-fixtures";
beforeEach(() => {
 localStorage.clear(); localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
 Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: vi.fn((ok) => ok({ coords: { latitude: 16.06, longitude: 108.2, accuracy: 20 } })) } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
describe("Explicit nearby recovery", () => {
 it.each([
  ["EAT", "hen_ho", "EAT"], ["GO", "chup_anh_dep", "GO"],
  ["STAY", "yen_tinh", "STAY"], ["GO", "cafe", "CAFE"],
 ] as const)("%s/%s broadens only on tap and retains category %s", async (intent, preference, section) => {
  const requests: URL[] = [];
  let nearbyCalls = 0;
  vi.stubGlobal("fetch", vi.fn(async (input: string) => {
   const url = new URL(input, "http://localhost"); requests.push(url);
   const nearby = url.searchParams.has("lat");
   if (nearby) nearbyCalls++;
   const broader = nearby && (url.searchParams.get("preference") === null || nearbyCalls === 2);
   const places = !nearby || broader ? [apiPlace(1, section)] : [];
   return { ok: true, json: async () => ({ ok: true, data: { intent, locale: "vi", preference: url.searchParams.get("preference"), places, count: places.length, meta: { source: "neon-postgres", ...(nearby ? { nearby: true, radiusKm: 5 } : {}) } } }) };
  }));
  render(<LocaleProvider><DiscoveryResults intent={intent} preference={preference} preferenceLabel="Original filter" onResetPreference={() => {}} /></LocaleProvider>);
  await screen.findByText("API fixture 1");
  requests.length = 0;
  expect(navigator.geolocation.getCurrentPosition).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Gần tôi" }));
  await screen.findByText("Chưa có địa điểm phù hợp với tiêu chí này trong 5 km.");
  expect(requests).toHaveLength(1);
  expect(requests[0].searchParams.get("preference")).toBe(preference);
  const general = screen.getByRole("button", { name: "Xem tất cả gần tôi" });
  expect(general).toHaveClass("min-h-[44px]");
  fireEvent.click(general);
  await screen.findByText("API fixture 1");
  expect(requests).toHaveLength(2);
  expect(requests[1].searchParams.get("preference")).toBe(section === "CAFE" ? "cafe" : null);
  expect(requests[1].searchParams.get("lat")).toBe("16.06");
  expect(requests[1].searchParams.get("intent")).toBe(intent);
  expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
  if (section !== "CAFE") expect(screen.getByText("Tất cả địa điểm")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Toàn Đà Nẵng/ }));
  await waitFor(() => expect(requests).toHaveLength(3));
  expect(requests[2].searchParams.has("lat")).toBe(false);
  expect(requests[2].searchParams.get("preference")).toBe(preference);
 });
});
