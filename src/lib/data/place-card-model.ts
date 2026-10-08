import type { DemoPlace } from "@/data/demo-places";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";

/** Presentation only: no image dependency or raw database fields. */
export interface PlaceCardModel {
  id: string | number;
  name: string;
  typeLabel: string;
  area: string;
  address?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  tags?: string[];
  description?: string | null;
  googleMapsUrl: string;
  distanceKm?: number | null;
}

export function discoveryToCard(place: DiscoveryPlace): PlaceCardModel {
  return {
    id: place.id, name: place.name, typeLabel: place.typeLabel,
    area: place.area.name, address: place.address,
    rating: place.rating, reviewCount: place.reviewCount,
    tags: place.tags.map((tag) => tag.label), description: place.description,
    googleMapsUrl: place.googleMapsUrl,
    distanceKm: place.distanceKm ?? null,
  };
}

/** Existing GO/STAY demo only; unverified ratings/reasons stay hidden. */
export function demoToCard(place: DemoPlace): PlaceCardModel {
  return { id: place.id, name: place.name, typeLabel: place.primaryType,
    area: place.area, googleMapsUrl: place.googleMapsUrl };
}
