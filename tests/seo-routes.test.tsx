import { describe, expect, it, vi, beforeEach } from "vitest";
import { apiPlace } from "./discovery-fixtures";
vi.mock("@/lib/data/place-detail",()=>({getPlace:vi.fn(),listPlaceIds:vi.fn()}));
vi.mock("@/lib/data/place-browse",()=>({listRelated:vi.fn().mockResolvedValue([])}));
vi.mock("next/navigation",()=>({notFound:()=>{throw Error("404");},permanentRedirect:(url:string)=>{throw Error("308:"+url);}}));
import {getPlace,listPlaceIds} from "@/lib/data/place-detail";
import Page,{generateMetadata} from "@/app/places/[id]/page";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
beforeEach(()=>{vi.clearAllMocks();vi.stubEnv("SITE_URL", "https://lacadanang.quangdev.id.vn");});
const props=(id:string,locale?:string)=>({params:Promise.resolve({id}),searchParams:Promise.resolve(locale?{locale}:{})});
describe("SEO App Router contracts",()=>{
 it("emits 1500 canonical place entries plus Home and locale alternates",async()=>{vi.mocked(listPlaceIds).mockResolvedValue(Array.from({length:1500},(_,i)=>i<500?i+1:i+1001));const entries=await sitemap();expect(entries).toHaveLength(1501);expect(entries.every(e=>e.url.startsWith("https://lacadanang.quangdev.id.vn/"))).toBe(true);expect(entries.flatMap(e=>Object.values(e.alternates?.languages??{})).every(url=>String(url).startsWith("https://lacadanang.quangdev.id.vn/"))).toBe(true);expect(new Set(entries.map(e=>e.url)).size).toBe(1501);expect(entries.some(e=>/\/api\/|\/dev\//.test(e.url))).toBe(false);expect(entries[1].alternates?.languages?.ko).toContain("?locale=ko");expect(robots().sitemap).toContain("/sitemap.xml");});
 it.each(["EAT","CAFE","GO","STAY"] as const)("renders real %s through existing adapter contract",async section=>{vi.mocked(getPlace).mockResolvedValue(apiPlace(1501,section));expect(await Page(props("1501","ko"))).toBeTruthy();expect(getPlace).toHaveBeenCalledWith(1501,"ko");expect((await generateMetadata(props("1501","ko"))).alternates?.canonical).toContain("/places/1501?locale=ko");});
 it("nonexistent record is a 404, never a fake card",async()=>{vi.mocked(getPlace).mockResolvedValue(null);await expect(Page(props("999999"))).rejects.toThrow("404");});
 it("invalid ID does not query DB",async()=>{await expect(Page(props("abc"))).rejects.toThrow("404");expect(getPlace).not.toHaveBeenCalled();});
 it("unknown locale redirects to canonical Vietnamese",async()=>{await expect(Page(props("1","xx"))).rejects.toThrow("308:/places/1");});
});
