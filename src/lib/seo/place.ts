import type { Metadata } from "next";
import type { DiscoveryPlace, DiscoveryLocale } from "@/lib/data/discovery-contract";
import { placePath, siteOrigin } from "./site";
export function placeMetadata(place: DiscoveryPlace, locale: DiscoveryLocale): Metadata {
 const url = siteOrigin() + placePath(place.id, locale);
 const description = [place.name, place.typeLabel, place.address, place.description].filter(Boolean).join(" — ");
 // Real address distinguishes branches/venues sharing a name without inventing SEO copy.
 return { title: `${[place.name, place.address].filter(Boolean).join(" — ")} | La Cà Đà Nẵng`, description,
  alternates: { canonical: url, languages: Object.fromEntries(["vi","en","ko"].map(l=>[l,siteOrigin()+placePath(place.id,l)])) },
  openGraph: { title: place.name, description, url, type: "website", locale: {vi:"vi_VN",en:"en_US",ko:"ko_KR"}[locale] } };
}
export function placeJsonLd(place: DiscoveryPlace) {
 // Place is deliberately conservative; a section alone cannot prove Hotel/Restaurant type.
 return { "@context": "https://schema.org", "@type": "Place", "@id": siteOrigin()+placePath(place.id),
  name: place.name, address: place.address, url: siteOrigin()+placePath(place.id), hasMap: place.googleMapsUrl,
  geo: { "@type":"GeoCoordinates", latitude:place.location.lat, longitude:place.location.lng },
  ...(place.description ? {description:place.description} : {}) };
}
export function serializeJsonLd(value: unknown): string { return JSON.stringify(value).replace(/</g, "\\u003c"); }
