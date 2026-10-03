import React from "react";
import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import type { DemoPlace } from "@/data/demo-places";

interface PlaceCardProps {
  place: DemoPlace;
  rank?: number;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, rank }) => {
  return (
    <article className="group relative w-full rounded-[16px] bg-white border border-slate-200/90 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.09)] transition-all duration-200 flex flex-col justify-between">
      {/* Visual Image Banner with Fixed 16:10 Aspect Ratio */}
      <div>
        <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
          <Image
            src={place.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 420px"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            priority={rank === 1}
          />

          {/* Gradient Scrim for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Primary Type & Area Overlay */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
              {place.primaryType}
            </span>
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-slate-200 font-medium">
              <MapPin className="w-3 h-3 text-sky-400" />
              {place.area}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* 1. Place Name */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-sky-600 transition-colors">
            {place.name}
          </h3>

          {/* Hide demo ratings and reasons until they have verified sources. */}
        </div>
      </div>

      {/* 4. Action CTA Button (rendered only when verified Maps URL exists) */}
      {Boolean(place.googleMapsUrl) && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] rounded-[12px] bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(14,165,233,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Xem trên Google Maps</span>
          </a>
        </div>
      )}
    </article>
  );
};
