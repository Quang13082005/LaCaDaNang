import { describe,it,expect,vi } from "vitest";
import { findNowItinerary,hasValidNowMapsUrl } from "@/lib/now/service";
import { createPlaceRepository } from "@/lib/data/place-repository";
const raw=(id:number,section:string,tags:string[]=[])=>({id,section,name:`Real ${id}`,google_place_id:`g-${id}`,address:"Da Nang",latitude:16,longitude:108,google_maps_url:`https://maps.google.com/?cid=${id}`,area_id:1,area_name:"Area",rating:null,review_count:100-id,primary_type:"place",tags:tags.map(code=>({code,domain:section,display_name:code}))});
const at=(time:string)=>new Date(`2026-10-09T${time}:00+07:00`);
const rows=[raw(1,"CAFE"),raw(2,"CAFE"),raw(3,"CAFE"),raw(4,"EAT",["NIGHT"]),raw(5,"EAT"),raw(6,"EAT"),raw(7,"GO",["NATURE","SCENIC","PHOTO","ENTERTAINMENT","NIGHT"]),raw(8,"GO",["BAR","NIGHT"]),raw(9,"GO",["PHOTO","SCENIC"])];
function repository(catalog=rows) { const execute=vi.fn(async (_sql:string,params:readonly unknown[])=>catalog.filter(p=>p.section===params[0])); return {execute,repo:createPlaceRepository(execute)}; }
describe("NOW v1.1 complete real candidate pools",()=>{
 it.each([['08:00',['CAFE','EAT','GO']],['12:00',['EAT','CAFE','GO']],['15:30',['GO','CAFE','EAT']],['19:00',['EAT','GO','CAFE']],['23:00',['EAT','CAFE','GO']]])('%s has three distinct real stops',async(time,sections)=>{
  const {repo,execute}=repository();const d=await findNowItinerary(repo,"vi",at(time as string));
  expect(d.count).toBe(3);expect(new Set(d.places.map(p=>p.id)).size).toBe(3);expect(d.places.map(p=>p.section)).toEqual(sections);
  expect(d.meta).toMatchObject({policy:"time-slot-v1.1",openingHoursVerified:false});expect(d.meta.shortfallReason).toBeUndefined();
  expect(execute.mock.calls.slice(0,3).map(c=>c[1])).toEqual([["EAT","vi",null],["CAFE","vi",null],["GO","vi",null]]);
  expect(execute.mock.calls[0][0]).toContain("p.active = TRUE");expect(execute.mock.calls[0][0]).toContain("OPERATIONAL");
  expect(await findNowItinerary(repo,"vi",at(time as string))).toEqual(d);
 });
 it('uses a verified BAR candidate before nature/amusement at night',async()=>{const {repo}=repository();const d=await findNowItinerary(repo,"ko",at('23:00'));expect(d.places.find(p=>p.section==='GO')?.id).toBe(8);});
 it('varies the top valid window across slots without randomness',async()=>{const {repo}=repository();const ids=[];for(const time of ['08:00','12:00','15:30'])ids.push((await findNowItinerary(repo,'vi',at(time))).places.find(p=>p.section==='CAFE')?.id);expect(new Set(ids).size).toBe(3);});
 it('skips invalid top Maps rows, then searches beyond the first three rows',async()=>{
  const catalog=[...Array.from({length:4},(_,i)=>({...raw(i+20,'CAFE'),google_maps_url:'https://evil.test/maps'})),raw(31,'CAFE'),raw(32,'CAFE'),raw(33,'CAFE')];
  const {repo}=repository(catalog);const d=await findNowItinerary(repo,'en',at('08:00'));expect(d.count).toBe(3);expect(d.places.map(p=>p.id).sort()).toEqual([31,32,33]);expect(d.places.every(p=>p.rating===null)).toBe(true);
 });
 it.each([0,1,2])('returns %i when complete eligible catalog is exhausted',async count=>{const {repo}=repository(rows.slice(0,count));const d=await findNowItinerary(repo,'vi',at('12:00'));expect(d.count).toBe(count);expect(d.meta.shortfallReason).toBe('eligible-catalog-exhausted');});
 it('deduplicates and preserves exact URLs',async()=>{const {repo}=repository([raw(1,'CAFE'),raw(1,'CAFE'),raw(2,'EAT')]);const d=await findNowItinerary(repo,'vi',at('12:00'));expect(d.count).toBe(2);expect(d.places[0].googleMapsUrl).toBe('https://maps.google.com/?cid=2');});
 it('propagates DB error without demo fallback',async()=>{const repo=createPlaceRepository(vi.fn().mockRejectedValue(new Error('offline')));await expect(findNowItinerary(repo,'vi')).rejects.toThrow('offline');});
 it.each(['', 'javascript:alert(1)','https://google.com.evil.test/maps','https://user:pass@maps.google.com/'])('rejects non Maps destination %s',value=>expect(hasValidNowMapsUrl(value)).toBe(false));
});
