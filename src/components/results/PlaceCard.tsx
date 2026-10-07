import React from "react";
import { MapPin, Navigation } from "lucide-react";
import type { PlaceCardModel } from "@/lib/data/place-card-model";

export const PlaceCard: React.FC<{ place: PlaceCardModel }> = ({ place }) => (
  <article className="w-full min-w-0 rounded-[16px] bg-white border border-slate-200/90 shadow-sm flex flex-col p-4 sm:p-5 gap-3 break-words [overflow-wrap:anywhere]">
    <div className="space-y-2">
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">{place.name}</h3>
      {place.typeLabel && <p className="text-sm font-medium text-sky-700">{place.typeLabel}</p>}
      {place.area && <p className="flex items-start gap-1.5 text-sm text-slate-600"><MapPin aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5" /><span>{place.area}</span></p>}
      {place.address && <p className="text-sm leading-relaxed text-slate-600">{place.address}</p>}
      {(place.rating != null || place.reviewCount != null) && (
        <p className="text-sm text-slate-700 flex flex-wrap gap-x-2 gap-y-1">
          {place.rating != null && <span>Điểm Google: {place.rating.toLocaleString("vi-VN")}/5</span>}
          {place.reviewCount != null && <span>{place.reviewCount.toLocaleString("vi-VN")} đánh giá</span>}
        </p>
      )}
      {Boolean(place.tags?.length) && <ul aria-label="Đặc điểm địa điểm" className="flex flex-wrap gap-1.5">{place.tags?.map((tag, index) => <li key={`${tag}-${index}`} className="max-w-full rounded-lg bg-sky-50 px-2 py-1 text-xs leading-relaxed text-sky-800">{tag}</li>)}</ul>}
      {place.description && <p className="text-sm leading-relaxed text-slate-600">{place.description}</p>}
    </div>
    {place.googleMapsUrl && (
      <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-auto w-full min-h-[44px] rounded-[12px] px-3 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2">
        <Navigation aria-hidden="true" className="w-4 h-4 shrink-0" /><span>Xem trên Google Maps</span>
      </a>
    )}
  </article>
);
