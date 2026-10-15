import type { DiscoveryLocale } from "@/lib/data/discovery-contract";
import type { PlaceLink } from "@/lib/data/place-browse";
import { placePath } from "@/lib/seo/site";
import { saveNavSource } from "@/lib/navigation/nav-state";

// Plain anchors on purpose: next/link would prefetch every visible dynamic page of a long directory.
// Full name and address are rendered without clamping so same-name branches stay distinguishable.
export function PlaceLinkList({
  places,
  locale,
  currentPath,
  navType = "place",
}: {
  places: PlaceLink[];
  locale: DiscoveryLocale;
  currentPath?: string;
  navType?: "place" | "browse";
}) {
  return (
    <ul className="divide-y divide-slate-200">
      {places.map((p) => {
        const where = [
          p.address,
          p.areaName && !p.address.includes(p.areaName) ? p.areaName : "",
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <li key={p.id}>
            <a
              href={placePath(p.id, locale)}
              onClick={() => {
                if (currentPath) {
                  saveNavSource(currentPath, navType);
                }
              }}
              className="block min-h-[44px] py-2.5"
            >
              <span className="block font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4">
                {p.name}
              </span>
              {where && <span className="block text-sm text-slate-600">{where}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
