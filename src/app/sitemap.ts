import type { MetadataRoute } from "next";
import { listPlaceIds } from "@/lib/data/place-detail";
import { siteOrigin, placePath } from "@/lib/seo/site";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const origin=siteOrigin();const ids=await listPlaceIds();
 return [{url:origin+"/"}, ...ids.map(id=>({url:origin+placePath(id),alternates:{languages:Object.fromEntries(["vi","en","ko"].map(l=>[l,origin+placePath(id,l)]))}}))];
}
