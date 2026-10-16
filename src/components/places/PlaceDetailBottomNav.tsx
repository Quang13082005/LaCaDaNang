"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, House } from "lucide-react";
import type { DiscoveryLocale, DiscoveryPlace } from "@/lib/data/discovery-contract";
import { translate } from "@/lib/i18n/messages";
import {
  clearDiscoverySelection,
  clearNavSource,
  getCategoryFallback,
  resolveBackTarget,
  setPendingReturnRestore,
} from "@/lib/navigation/nav-state";

export interface PlaceDetailBottomNavProps {
  place: DiscoveryPlace;
  locale: DiscoveryLocale;
}

export function PlaceDetailBottomNav({ place, locale }: PlaceDetailBottomNavProps) {
  // Initial state matches server-rendered fallback exactly to avoid hydration mismatch
  const [backTarget, setBackTarget] = useState(() => getCategoryFallback(place, locale));

  useEffect(() => {
    setBackTarget(resolveBackTarget(place, locale));
  }, [place, locale]);

  const backLabel = backTarget.isFallback
    ? translate(locale, "action.viewCategory")
    : translate(locale, "action.back");

  const handleBackClick = () => {
    if (backTarget.href === "/" || backTarget.href.startsWith("/?")) {
      setPendingReturnRestore(true);
    }
  };

  const handleHomeClick = () => {
    clearDiscoverySelection();
    clearNavSource();
    setPendingReturnRestore(false);
  };

  return (
    <nav
      aria-label={translate(locale, "action.navAria")}
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 pt-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden"
    >
      <div className="w-full max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Nút Quay lại / Xem danh mục — ~60% chiều rộng, nổi bật vừa phải, màu xanh nhạt */}
        <Link
          href={backTarget.href}
          onClick={handleBackClick}
          aria-label={backLabel}
          className="flex-[3] min-w-0 min-h-[48px] rounded-xl px-4 py-3 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-800 border border-sky-200/80 font-semibold text-sm flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 transition-colors select-none shadow-sm"
        >
          <ArrowLeft aria-hidden="true" className="w-5 h-5 shrink-0 text-sky-700" />
          <span className="truncate">{backLabel}</span>
        </Link>

        {/* Nút Trang chủ — ~40% chiều rộng, nền trắng/trung tính, viền nhẹ */}
        <Link
          href="/"
          onClick={handleHomeClick}
          aria-label={translate(locale, "action.home")}
          className="flex-[2] min-w-0 min-h-[48px] rounded-xl px-3 py-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-sm flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 transition-colors select-none shadow-sm"
        >
          <House aria-hidden="true" className="w-5 h-5 shrink-0 text-slate-600" />
          <span className="truncate">{translate(locale, "action.home")}</span>
        </Link>
      </div>
    </nav>
  );
}
