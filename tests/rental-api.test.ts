import {describe,it,expect,vi} from "vitest";
import {NextRequest} from "next/server";
import {readRentals} from "@/lib/rental/repository";
import {assertReadOnlySql} from "@/lib/db/neon";
import {GET} from "@/app/api/rentals/route";
import {GET as detail} from "@/app/api/rentals/[id]/route";
const vehicle={publicId:"7b668258-ab16-4e3b-aef1-3fdbb6710457",brand:"Honda",model:"Vision",category:"scooter",engineCc:"109.100",registrationYear:2023,color:"Black",colorComplete:true,dailyPriceVnd:130000,depositVnd:2000000,media:[],id:99,vehicle_code:"PRIVATE",raw_daily_price:130};
describe("Rental public repository",()=>{
 it("uses only parameterized SELECT, active filters and a public projection",async()=>{
  const query=vi.fn().mockResolvedValueOnce([vehicle]).mockResolvedValueOnce([]);
  const result=await readRentals("en","scooter",vehicle.publicId,query);
  for(const [sql] of query.mock.calls)assertReadOnlySql(sql);
  expect(query.mock.calls[0][0]).toContain("v.active=true AND m.active=true");
  expect(query.mock.calls[1][0]).toContain("active=true");
  expect(query.mock.calls[0][1]).toEqual(["en","scooter",vehicle.publicId]);
  expect(result.vehicles[0].engineCc).toBe(109.1);
  expect(result.vehicles[0].dailyPriceVnd).toBe(130000);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE|raw_daily_price|vehicle_code|"id"/);
  expect(result.contact).toBeNull();
 });
 it("returns an empty catalog without fixture fallback",async()=>{
  expect(await readRentals("vi",null,null,vi.fn().mockResolvedValue([]))).toEqual({vehicles:[],contact:null});
 });
 it("rejects database failures rather than returning fixtures",async()=>{
  await expect(readRentals("vi",null,null,vi.fn().mockRejectedValue(new Error("Unavailable")))).rejects.toThrow();
 });
 it("drops invalid media and preserves valid HTTPS images",async()=>{
  const media=[{imageUrl:"https://example.com/real.jpg",altText:"Vehicle",isPrimary:true,sortOrder:0},{imageUrl:"javascript:bad",altText:"bad",isPrimary:false,sortOrder:1}];
  const data=await readRentals("ko",null,null,vi.fn().mockResolvedValueOnce([{...vehicle,media}]).mockResolvedValueOnce([]));
  expect(data.vehicles[0].media).toHaveLength(1);
 });
 it("supports ru and zh with controlled fallback in SQL query",async()=>{
  const queryRu=vi.fn().mockResolvedValueOnce([vehicle]).mockResolvedValueOnce([{phone:"+84905123456",zaloUrl:"https://zalo.me/0905123456",helmetsIncluded:true,policy:"Terms"}]);
  const resultRu=await readRentals("ru",null,null,queryRu);
  expect(queryRu.mock.calls[0][1]).toEqual(["ru",null,null]);
  expect(queryRu.mock.calls[0][0]).toContain("WHEN $1 IN ('en','ru','zh') THEN COALESCE(NULLIF(v.color_en,''),v.color_source)");
  expect(queryRu.mock.calls[1][1]).toEqual(["ru"]);
  expect(queryRu.mock.calls[1][0]).toContain("WHEN $1 IN ('en','ru','zh') THEN COALESCE(NULLIF(policy_en,''),policy_vi)");
  expect(resultRu.vehicles).toHaveLength(1);

  const queryZh=vi.fn().mockResolvedValueOnce([vehicle]).mockResolvedValueOnce([]);
  const resultZh=await readRentals("zh",null,null,queryZh);
  expect(queryZh.mock.calls[0][1]).toEqual(["zh",null,null]);
  expect(resultZh.vehicles).toHaveLength(1);
 });
});
describe("Rental input boundaries",()=>{
 it.each(["active=false","includeInactive=true","locale=de","category=car","locale=vi&locale=en"])("rejects %s before database access",async query=>{
  expect((await GET(new NextRequest(`http://localhost/api/rentals?${query}`))).status).toBe(400);
 });
 it.each(["locale=ru","locale=zh","locale=vi","locale=en","locale=ko"])("accepts %s without 400 rejection",async query=>{
  const res=await GET(new NextRequest(`http://localhost/api/rentals?${query}`));
  expect(res.status).not.toBe(400);
 });
 it("rejects internal IDs instead of treating them as public UUIDs",async()=>{
  const response=await detail(new NextRequest("http://localhost/api/rentals/1"),{params:Promise.resolve({id:"1"})});
  expect(response.status).toBe(400);
 });
});
