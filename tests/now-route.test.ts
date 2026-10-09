import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
const execute = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db/neon", () => ({ getNeonExecutor: () => execute }));
import { GET } from "@/app/api/now/route";
beforeEach(() => { execute.mockReset().mockResolvedValue([]); });
describe("NOW HTTP contract", () => {
  it.each(["locale=ja","locale=vi&locale=en","time=08:00","lat=16", "lat=91&lng=108", "lat=&lng=", "lat=1&lng=2&lat=3","intent=EAT"])("rejects unsupported query %s without DB access", async query => {
    const response = await GET(new NextRequest(`http://localhost/api/now?${query}`));
    expect(response.status).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });
  it.each(["vi","en","ko"])("returns truthful empty %s response and no-store", async locale => {
    const response = await GET(new NextRequest(`http://localhost/api/now?locale=${locale}`));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await response.json()).data).toMatchObject({locale,count:0,places:[],meta:{source:"neon-postgres",openingHoursVerified:false}});
  });
  it("accepts validated coordinates and returns nearby metadata without origin echo", async () => {
    const response = await GET(new NextRequest("http://localhost/api/now?locale=vi&lat=16&lng=108"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.meta).toMatchObject({ mode: "nearby", radiusKm: 5, policy: "location-v2" });
    expect(body.data).not.toHaveProperty("origin");
    expect(body.data).not.toHaveProperty("lat");
    expect(body.data).not.toHaveProperty("lng");
  });
  it("sanitizes DB failure", async () => {
    execute.mockRejectedValue(new Error("postgres://secret-password@host/db"));
    const response = await GET(new NextRequest("http://localhost/api/now"));
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toContain("DATABASE_UNAVAILABLE");
    expect(text).not.toMatch(/secret-password|postgres:/);
  });
});
