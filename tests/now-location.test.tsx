import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { findNowItinerary } from "@/lib/now/service";
import { createPlaceRepository } from "@/lib/data/place-repository";
import { NowResults } from "@/components/itinerary/NowResults";
import { apiPlace } from "./discovery-fixtures";
const row=(id:number,section:string,km:number,tags:string[]=[])=>({id,section,name:`Place ${id}`,google_place_id:`id${id}`,address:"Public fixture",latitude:16+km/111.2,longitude:108,google_maps_url:`https://maps.google.com/?cid=${id}`,area_id:1,area_name:"Area",rating:null,review_count:10,primary_type:"place",tags:tags.map(code=>({code,domain:section,display_name:code}))});
const at=(time="08:00")=>new Date(`2026-10-09T${time}:00+07:00`);
const origin={latitude:16,longitude:108};
function repo(rows: ReturnType<typeof row>[]) { return createPlaceRepository(vi.fn(async (_sql:string,params:readonly unknown[])=>rows.filter(p=>p.section===params[0]))); }
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.useRealTimers();localStorage.clear();});
describe("NOW nearby composition using shared geometry",()=>{
 it.each([0.5,2,4])("selects radius for diverse stops at %s km",async km=>{
  const d=await findNowItinerary(repo([row(1,"CAFE",.1),row(2,"EAT",km),row(3,"GO",km)]),"vi",at(),origin);
  expect(d.meta.radiusKm).toBe(km<1?1:km<3?3:5);expect(d.count).toBe(3);expect(d.meta.compositionDiverse).toBe(true);
  expect(d.places.map(p=>p.section)).toEqual(["CAFE","EAT","GO"]);
  expect(d.places.every(p=>p.distanceKm!<=d.meta.radiusKm!)).toBe(true);
 });
 it("does not stop at three cafes in 1km when diverse composition exists in3km",async()=>{
  const d=await findNowItinerary(repo([row(1,"CAFE",.1),row(2,"CAFE",.2),row(3,"CAFE",.3),row(4,"EAT",2),row(5,"GO",2)]),"vi",at(),origin);
  expect(d.meta.radiusKm).toBe(3);expect(new Set(d.places.map(p=>p.section)).size).toBe(3);
 });
 it.each([0,1,2])("returns truthful %s nearby stops, never distant padding",async count=>{
  const d=await findNowItinerary(repo([...Array.from({length:count},(_,i)=>row(i+1,"CAFE",.2)),row(99,"EAT",9)]),"vi",at(),origin);
  expect(d.count).toBe(count);expect(d.meta.mode).toBe("nearby");expect(d.meta.radiusKm).toBe(5);expect(d.meta.shortfallReason).toBe("radius-candidates-exhausted");
 });
 it.each(["08:00","12:00","15:30","19:00","23:00"])("keeps slot %s deterministic, unique, exact Maps",async time=>{
  const r=repo([row(1,"CAFE",.2),row(2,"EAT",.3,["NIGHT"]),row(3,"GO",.4,["BAR","NATURE","PHOTO","SCENIC","ENTERTAINMENT"]),row(4,"GO",.5,["BAR"])]);
  const d=await findNowItinerary(r,"en",at(time),origin);expect(d.count).toBe(3);expect(new Set(d.places.map(p=>p.id)).size).toBe(3);
  expect(d.places.every(p=>p.googleMapsUrl===`https://maps.google.com/?cid=${p.id}`)).toBe(true);
  expect(await findNowItinerary(r,"en",at(time),origin)).toEqual(d);
  if(time==="23:00")expect(d.places.find(p=>p.section==="GO")?.id).toBe(4);
 });
 it("ranks distance before reviews within suitable leg, skips invalid Maps",async()=>{
  const d=await findNowItinerary(repo([{...row(1,"CAFE",.1),google_maps_url:""},{...row(2,"CAFE",.7),review_count:99999},row(3,"CAFE",.2),row(4,"EAT",.3),row(5,"GO",.4)]),"vi",at(),origin);
  expect(d.places[0].id).toBe(3);
 });
});
function gps(impl: (ok: PositionCallback, fail: PositionErrorCallback)=>void){const fn=vi.fn(impl);Object.defineProperty(navigator,"geolocation",{configurable:true,value:{getCurrentPosition:fn}});return fn;}
describe("NOW opt-in location lifecycle",()=>{
 it("does not request GPS or data on mount; explicit permission reuses coords on retry",async()=>{
  const geo=gps(ok=>ok({coords:{latitude:16,longitude:108,accuracy:20}} as GeolocationPosition));
  const fetcher=vi.fn().mockRejectedValueOnce(Error("offline")).mockResolvedValue({ok:true,json:async()=>({ok:true,data:{locale:"vi",slot:"MORNING",timeZone:"Asia/Ho_Chi_Minh",count:1,places:[{...apiPlace(1),distanceKm:.2}],meta:{mode:"nearby",radiusKm:5,source:"neon-postgres",openingHoursVerified:false}}})});vi.stubGlobal("fetch",fetcher);
  render(<NowResults onResetPreference={()=>{}}/>);expect(geo).not.toHaveBeenCalled();expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Cho phép vị trí"}));await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button",{name:"Thử lại"}));await screen.findByText("API fixture 1");
  expect(geo).toHaveBeenCalledTimes(1);expect(fetcher).toHaveBeenLastCalledWith('/api/now?locale=vi&lat=16&lng=108',expect.anything());
  expect(screen.getByText(/Chưa đủ địa điểm/)).toBeInTheDocument();expect(localStorage.length).toBe(0);
 });
 it.each(["denied","inaccurate","unavailable"])("%s never silently calls citywide",async reason=>{
  gps((ok,fail)=>reason==="inaccurate"?ok({coords:{latitude:16,longitude:108,accuracy:1001}} as GeolocationPosition):fail({code:reason==="denied"?1:2} as GeolocationPositionError));
  vi.stubGlobal("fetch",vi.fn().mockRejectedValue(Error()));render(<NowResults onResetPreference={()=>{}}/>);
  fireEvent.click(screen.getByRole("button",{name:"Cho phép vị trí"}));expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByRole("button",{name:"Thử lại"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Xem gợi ý toàn Đà Nẵng"}));await screen.findByRole("alert");
  expect(fetch).toHaveBeenCalledWith('/api/now?locale=vi',expect.anything());
 });
 it("times out and cancels late GPS after explicit citywide choice",async()=>{
  vi.useFakeTimers();let success!:PositionCallback;gps(ok=>{success=ok;});vi.stubGlobal("fetch",vi.fn().mockRejectedValue(Error()));
  render(<NowResults onResetPreference={()=>{}}/>);fireEvent.click(screen.getByRole("button",{name:"Cho phép vị trí"}));
  await act(async()=>{await vi.advanceTimersByTimeAsync(8000);});expect(fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Xem gợi ý toàn Đà Nẵng"}));await act(async()=>{success({coords:{latitude:16,longitude:108,accuracy:20}} as GeolocationPosition);});
  expect(fetch).toHaveBeenCalledTimes(1);expect(fetch).toHaveBeenCalledWith('/api/now?locale=vi',expect.anything());
 });
});
