import { notFound, permanentRedirect } from "next/navigation";
import { getPlace } from "@/lib/data/place-detail";
import { parsePlaceId, placePath } from "@/lib/seo/site";
import { placeMetadata, placeJsonLd, serializeJsonLd } from "@/lib/seo/place";
import { PlaceDetail } from "@/components/places/PlaceDetail";
import type { DiscoveryLocale } from "@/lib/data/discovery-contract";
export const dynamic = "force-dynamic";
type Props = {params: Promise<{id:string}>; searchParams: Promise<Record<string,string|string[]|undefined>>};
async function resolve(props: Props) {
 const {id:raw}=await props.params; const id=parsePlaceId(raw);if(!id)notFound();
 const search=await props.searchParams; const locale:DiscoveryLocale=search.locale==="en"?"en":search.locale==="ko"?"ko":"vi";
 if (Object.keys(search).some(k=>k!=="locale") || search.locale && search.locale!=="en" && search.locale!=="ko") permanentRedirect(placePath(id,locale));
 const place=await getPlace(id,locale);if(!place)notFound();return {place,locale};
}
export async function generateMetadata(props:Props) {const {place,locale}=await resolve(props);return placeMetadata(place,locale);}
export default async function Page(props:Props) {const {place,locale}=await resolve(props);return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(placeJsonLd(place))}}/><PlaceDetail place={place} locale={locale}/></>;}
