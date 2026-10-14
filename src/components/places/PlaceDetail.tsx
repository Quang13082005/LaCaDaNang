"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DiscoveryLocale, DiscoveryPlace } from "@/lib/data/discovery-contract";
import { placePath } from "@/lib/seo/site";
import { translate } from "@/lib/i18n/messages";
import { sendGaEvent } from "@/lib/analytics/ga4";
import type { PlaceLink } from "@/lib/data/place-browse";
import { BROWSE_COPY } from "@/lib/seo/browse";
import { PlaceLinkList } from "./PlaceLinkList";
export function PlaceDetail({ place, locale, related = [] }: {place: DiscoveryPlace; locale: DiscoveryLocale; related?: PlaceLink[]}) {
 const seen = useRef("");
 useEffect(()=>{const key=`${place.id}:${locale}`;if(seen.current!==key){seen.current=key;sendGaEvent("place_detail_viewed",{place_id:place.id,locale});}},[place.id,locale]);
 const number=new Intl.NumberFormat(locale);
 return <main lang={locale} className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 break-words [overflow-wrap:anywhere]">
  <Link href="/" className="inline-flex min-h-[44px] items-center text-sky-700">← La Cà Đà Nẵng</Link>
  <nav aria-label={translate(locale,"language.label")} className="flex flex-wrap gap-3">{(["vi","en","ko"] as const).map(l=><a key={l} href={placePath(place.id,l)} hrefLang={l} onClick={()=>sendGaEvent("language_changed",{locale:l,language_mode:"manual"})} aria-current={l===locale?"page":undefined} className="min-h-[44px] inline-flex items-center px-3 border rounded-lg">{{vi:"Tiếng Việt",en:"English",ko:"한국어"}[l]}</a>)}</nav>
  <h1 className="text-2xl sm:text-3xl font-bold">{place.name}</h1>
  {place.typeLabel && <p>{place.typeLabel}</p>}<p>{place.area.name}</p><p>{place.address}</p>
  {place.rating != null && <p>{translate(locale,"card.googleRating")}: {number.format(place.rating)}/5</p>}
  {place.reviewCount != null && <p>{number.format(place.reviewCount)} {translate(locale,"card.reviews")}</p>}
  {place.tags.length>0 && <ul className="flex flex-wrap gap-2">{place.tags.map(t=><li key={t.code} className="bg-sky-50 rounded-lg p-2">{t.label}</li>)}</ul>}
  {place.description && <p>{place.description}</p>}
  <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer" onClick={()=>sendGaEvent("place_detail_maps_clicked",{place_id:place.id,locale})} className="min-h-[44px] flex items-center justify-center rounded-xl p-3 bg-sky-600 text-white font-semibold">{translate(locale,"action.maps")}</a>
  {related.length>0 && <section aria-labelledby="related-places" className="space-y-1 pt-2">
   <h2 id="related-places" className="text-lg font-semibold">{BROWSE_COPY[locale].related(place.area.name)}</h2>
   <PlaceLinkList places={related} locale={locale}/>
  </section>}
 </main>;
}
