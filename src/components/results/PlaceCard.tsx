import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackMapsClicked } from "@/lib/analytics/client";
import type { PlaceCardModel } from "@/lib/data/place-card-model";

export interface PlaceCardProps {
  place: PlaceCardModel;
  position?: 1 | 2 | 3;
  intent?: "NOW" | "EAT" | "GO" | "STAY";
  preference?: string;
  isNearby?: boolean;
  radiusKm?: 1 | 3 | 5;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  position = 1,
  intent,
  preference,
  isNearby,
  radiusKm,
}) => {
  const { t, formatNumber, locale, isManual } = useLocale();

  const handleMapsClick = () => {
    try {
      if (place.id && intent && preference) {
        trackMapsClicked(
          Number(place.id),
          (position || 1) as 1 | 2 | 3,
          intent,
          preference,
          locale,
          isManual ? "manual" : "auto",
          isNearby,
          radiusKm
        );
      }
    } catch {
      // Tracking failure must NEVER block Google Maps navigation
    }
  };

  return (
    <article className="w-full min-w-0 rounded-[16px] bg-white border border-slate-200/90 shadow-sm flex flex-col p-4 sm:p-5 gap-3 break-words [overflow-wrap:anywhere]">
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">{place.name}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {place.typeLabel && <p className="text-sm font-medium text-sky-700">{place.typeLabel}</p>}
          {place.distanceKm != null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {formatNumber(place.distanceKm, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km
            </span>
          )}
        </div>
        {place.area && <p className="flex items-start gap-1.5 text-sm text-slate-600"><MapPin aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5" /><span>{place.area}</span></p>}
        {place.address && <p className="text-sm leading-relaxed text-slate-600">{place.address}</p>}
        {(place.rating != null || place.reviewCount != null) && (
          <p className="text-sm text-slate-700 flex flex-wrap gap-x-2 gap-y-1">
            {place.rating != null && (
              <span>
                {t("card.googleRating")}: {formatNumber(place.rating, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}/5
              </span>
            )}
            {place.reviewCount != null && (
              <span>
                {formatNumber(place.reviewCount)} {t("card.reviews")}
              </span>
            )}
          </p>
        )}
        {Boolean(place.tags?.length) && (
          <ul aria-label={t("card.tagsAria")} className="flex flex-wrap gap-1.5">
            {place.tags?.map((tag, index) => (
              <li key={`${tag}-${index}`} className="max-w-full rounded-lg bg-sky-50 px-2 py-1 text-xs leading-relaxed text-sky-800">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {place.description && <p className="text-sm leading-relaxed text-slate-600">{place.description}</p>}
      </div>

      <div className="mt-auto flex flex-col gap-2 w-full pt-1">
        {place.googleMapsUrl && (
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMapsClick}
            className="w-full min-h-[44px] rounded-[12px] px-3 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold text-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 transition-colors"
          >
            <Navigation aria-hidden="true" className="w-4 h-4 shrink-0" /><span>{t("action.maps")}</span>
          </a>
        )}

      </div>

    </article>
  );
};
