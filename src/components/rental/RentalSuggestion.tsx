"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Motorbike, ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { rentalCopy } from "@/lib/rental/messages";
import type { RentalData } from "@/lib/rental/repository";
import { fetchActiveRentals, getCachedRentals } from "@/lib/rental/client";

const Catalog = dynamic(() => import("./RentalCatalog").then((m) => m.RentalCatalog));

export interface RentalSuggestionProps {
  hero?: boolean;
  now?: boolean;
  /** Optional override for testing Scenario B (simulated active catalog) without production writes */
  simulatedRentals?: RentalData | null;
}

export function RentalSuggestion({
  hero = false,
  simulatedRentals,
}: RentalSuggestionProps) {
  const { locale, formatNumber } = useLocale();
  const t = rentalCopy(locale);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  const [rentalData, setRentalData] = useState<RentalData | null>(() => {
    if (simulatedRentals !== undefined) return simulatedRentals;
    return getCachedRentals(locale);
  });
  const [loaded, setLoaded] = useState(() => {
    if (simulatedRentals !== undefined) return true;
    return getCachedRentals(locale) !== null;
  });

  useEffect(() => {
    if (simulatedRentals !== undefined) {
      setRentalData(simulatedRentals);
      setLoaded(true);
      return;
    }
    let isCurrent = true;
    fetchActiveRentals(locale)
      .then((data) => {
        if (isCurrent) {
          setRentalData(data);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setRentalData({ vehicles: [], contact: null });
          setLoaded(true);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [locale, simulatedRentals]);

  useEffect(() => {
    if (!open) return;
    const d = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    if (typeof d?.showModal === "function") {
      d.showModal();
    }
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => {
      window.removeEventListener("popstate", close);
      if (typeof d?.close === "function") {
        d.close();
      }
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [open]);

  // Dark Launch & Empty Safety: Never show promotion leading to an empty catalog
  if (!loaded || !rentalData || !rentalData.vehicles || rentalData.vehicles.length === 0) {
    return null;
  }

  // Calculate dynamic starting price strictly from verified active vehicles
  const minPrice = Math.min(...rentalData.vehicles.map((v) => v.dailyPriceVnd));
  const dynamicStartingPrice =
    locale === "vi"
      ? `Từ ${formatNumber(minPrice)}đ/ngày`
      : locale === "en"
      ? `From ${formatNumber(minPrice)} VND/day`
      : `1일 ${formatNumber(minPrice)} VND부터`;

  const handleOpen = () => {
    window.history.pushState(
      { ...window.history.state },
      "",
      `${window.location.pathname}${window.location.search}#rentals`
    );
    setOpen(true);
  };

  const close = () => {
    if (window.location.hash === "#rentals") {
      window.history.back();
    } else {
      setOpen(false);
    }
  };

  const catalogVehicles = rentalData.vehicles.map((v) => ({
    code: v.publicId,
    brand: v.brand,
    model: v.model,
    category: v.category,
    engineCc: v.engineCc,
    registrationYear: v.registrationYear,
    color: v.color,
    dailyPriceVnd: v.dailyPriceVnd,
    depositVnd: v.depositVnd,
    media: v.media.map((m) => ({ ...m, id: m.imageUrl })),
  }));

  if (hero) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          className="mt-2 text-xs text-white bg-sky-950/60 hover:bg-sky-950/80 rounded-xl px-3 py-2 min-h-[44px] inline-flex items-center gap-2 max-w-[19rem] text-left transition-colors border border-white/15"
        >
          <Motorbike aria-hidden="true" size={18} className="shrink-0 text-amber-300" />
          <span>{t.hero}</span>
        </button>
        {open && (
          <dialog
            ref={dialog}
            onCancel={(e) => {
              e.preventDefault();
              close();
            }}
            className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none p-0 border-0 z-50"
            aria-label={t.title}
          >
            <Catalog
              onClose={close}
              vehicles={catalogVehicles}
              contact={rentalData.contact}
            />
          </dialog>
        )}
      </>
    );
  }

  return (
    <>
      <aside
        aria-label={t.title}
        className="w-full rounded-2xl border border-amber-200/90 bg-white shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 flex flex-col gap-3"
      >
        {/* Row 1: Context Badge + Dynamic Starting Price */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/70">
            <Motorbike aria-hidden="true" size={15} className="shrink-0 text-amber-700" />
            <span>{t.suggestionBadge}</span>
          </span>
          <span className="inline-flex items-center text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/70">
            {dynamicStartingPrice}
          </span>
        </div>

        {/* Row 2: Headline + Benefit description */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
            {t.suggestionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.suggestionDescription}
          </p>
        </div>

        {/* Row 3: Primary CTA Button */}
        <div className="pt-1 flex items-center justify-start">
          <button
            type="button"
            onClick={handleOpen}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <span>{t.suggestionCta}</span>
            <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
          </button>
        </div>
      </aside>

      {open && (
        <dialog
          ref={dialog}
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none p-0 border-0 z-50"
          aria-label={t.title}
        >
          <Catalog
            onClose={close}
            vehicles={catalogVehicles}
            contact={rentalData.contact}
          />
        </dialog>
      )}
    </>
  );
}
