import type { DiscoveryLocale } from "@/lib/data/discovery-contract";
import type { PlaceLink } from "@/lib/data/place-browse";
import { placePath } from "@/lib/seo/site";

// Plain anchors on purpose: next/link would prefetch every visible dynamic page of a long directory.
// Full name and address are rendered without clamping so same-name branches stay distinguishable.
export function PlaceLinkList({ places, locale }: { places: PlaceLink[]; locale: DiscoveryLocale }) {
  return <ul className="divide-y divide-slate-200">{places.map(p => {
    const where = [p.address, p.areaName && !p.address.includes(p.areaName) ? p.areaName : ""].filter(Boolean).join(" · ");
    return <li key={p.id}>
      <a href={placePath(p.id, locale)} className="block min-h-[44px] py-2.5">
        <span className="block font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4">{p.name}</span>
        {where && <span className="block text-sm text-slate-600">{where}</span>}
      </a>
    </li>;
  })}</ul>;
}
