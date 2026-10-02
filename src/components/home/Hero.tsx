import React from "react";
import Image from "next/image";

export const Hero: React.FC = () => {
  return (
    <header className="relative w-full rounded-[18px] overflow-hidden shadow-[0_4px_20px_rgba(2,132,199,0.12)] border border-sky-100/80 mb-5 bg-slate-900">
      {/* Scenic Da Nang Vector Banner Background */}
      <div className="relative w-full h-[140px] sm:h-[170px] md:h-[190px]">
        <Image
          src="/images/demo/danang-hero.svg"
          alt="Toàn cảnh thành phố và biển Đà Nẵng"
          fill
          priority
          className="object-cover object-center brightness-[0.92]"
        />

        {/* Dual Cinematic Gradient Scrim for Guaranteed Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Content Container */}
        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-left">
          {/* Brand Name */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            LA CÀ ĐÀ NẴNG
          </h1>

          {/* Tagline: Clean, truthful, no line-clamp ellipsis truncation */}
          <p className="text-xs sm:text-sm font-medium text-sky-100 mt-1 max-w-md drop-shadow-sm leading-relaxed">
            Tìm chỗ ăn, chơi và nghỉ ở Đà Nẵng.
          </p>
        </div>
      </div>
    </header>
  );
};
