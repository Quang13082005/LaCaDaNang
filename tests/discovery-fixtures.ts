import type { DiscoveryPlace } from "@/lib/data/discovery-contract";

export function apiPlace(id: number): DiscoveryPlace {
  return {
    id, googlePlaceId: `fixture-${id}`, section: "EAT", name: `API fixture ${id}`,
    typeLabel: "Quán ăn", primaryType: "restaurant", address: `Địa chỉ kiểm thử ${id}`,
    area: { id: 1, name: "Phường kiểm thử", unitType: "ward" },
    location: { lat: 16.06, lng: 108.2 }, googleMapsUrl: `https://maps.google.com/?cid=${900 + id}`,
    rating: null, reviewCount: null, tags: [{ code: "SPECIALTY", label: "Đặc sản", domain: "EAT" }],
    description: null, translationFallback: false,
  };
}

export function apiResponse(count = 2, preference = "hen_ho") {
  return { ok: true, json: async () => ({ ok: true, data: {
    intent: "EAT", locale: "vi", preference, preferenceMapping: "tags", count,
    places: Array.from({ length: count }, (_, i) => apiPlace(i + 1)),
    meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
  } }) } as Response;
}
