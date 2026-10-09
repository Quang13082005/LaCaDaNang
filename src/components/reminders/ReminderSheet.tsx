"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { PlaceCardModel } from "@/lib/data/place-card-model";
import {
  getPresetVisitTime,
  parseDaNangWallClockToUtc,
  formatUtcToDaNangWallClock,
  isValidVisitTime,
} from "@/lib/reminders/time";
import {
  generateReminderUid,
  generateIcsContent,
  downloadIcsFile,
} from "@/lib/reminders/ics";
import { googleCalendarUrl } from "@/lib/reminders/google-calendar";
import { saveReminderRecord } from "@/lib/reminders/storage";
import type { LocalReminderRecord, ReminderPreset } from "@/lib/reminders/types";

export interface ReminderSheetProps {
  place: PlaceCardModel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReminderSheet: React.FC<ReminderSheetProps> = ({
  place,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, locale } = useLocale();
  const [selectedPreset, setSelectedPreset] = useState<ReminderPreset>("1h");
  const [customDateTime, setCustomDateTime] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize custom datetime string when opened
  useEffect(() => {
    if (isOpen) {
      const defaultDate = getPresetVisitTime("1h");
      setCustomDateTime(formatUtcToDaNangWallClock(defaultDate));
      setSelectedPreset("1h");
      setValidationError(null);
      setStatusMessage(null);
      setIsExporting(false);
    }
  }, [isOpen]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Validate custom time when preset or value changes
  useEffect(() => {
    if (selectedPreset === "custom") {
      const parsedUtc = parseDaNangWallClockToUtc(customDateTime);
      if (!parsedUtc || !isValidVisitTime(parsedUtc)) {
        setValidationError(t("reminder.minTimeWarning"));
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [selectedPreset, customDateTime, t]);

  if (!isOpen) return null;

  const handleGoogleCalendar = () => {
    const visitStartUtc = selectedPreset === "custom"
      ? parseDaNangWallClockToUtc(customDateTime) : getPresetVisitTime(selectedPreset);
    if (!visitStartUtc || !isValidVisitTime(visitStartUtc)) {
      setValidationError(t("reminder.minTimeWarning"));
      return;
    }
    try {
      const url = googleCalendarUrl({ placeName: place.name, address: place.address,
        googleMapsUrl: place.googleMapsUrl, visitStartUtc, locale });
      window.open(url, "_blank", "noopener,noreferrer");
      // No export record: opening a draft proves neither saving nor delivery.
    } catch {
      setStatusMessage({ type: "error", text: t("reminder.exportError") });
    }
  };

  const handleExport = () => {
    try {
      setIsExporting(true);
      setStatusMessage(null);

      let visitStartUtc: Date;
      if (selectedPreset === "custom") {
        const parsed = parseDaNangWallClockToUtc(customDateTime);
        if (!parsed || !isValidVisitTime(parsed)) {
          setValidationError(t("reminder.minTimeWarning"));
          setIsExporting(false);
          return;
        }
        visitStartUtc = parsed;
      } else {
        visitStartUtc = getPresetVisitTime(selectedPreset);
      }

      const now = new Date();
      const uid = generateReminderUid();
      const placeId = Number(place.id) || 0;
      const mapsUrl = place.googleMapsUrl;
      if (!mapsUrl) throw new Error("Missing Maps URL");

      // Generate RFC 5545 calendar string
      const icsString = generateIcsContent({
        uid,
        placeId,
        placeName: place.name,
        address: place.address,
        googleMapsUrl: mapsUrl,
        visitStartUtc,
        nowUtc: now,
        locale,
      });

      // Trigger calendar download/import intent
      const filename = `la-ca-reminder-${placeId}.ics`;
      const downloadSuccess = downloadIcsFile(filename, icsString);

      if (!downloadSuccess) {
        setStatusMessage({
          type: "error",
          text: t("reminder.exportError"),
        });
        setIsExporting(false);
        return;
      }

      // Save local export record only on actual user-initiated export
      const record: LocalReminderRecord = {
        reminder_id: uid,
        place_id: placeId,
        place_name: place.name,
        scheduled_visit_at_utc: visitStartUtc.toISOString(),
        lead_time_minutes: 30,
        locale,
        created_at_utc: now.toISOString(),
        calendar_exported_at_utc: now.toISOString(),
      };
      saveReminderRecord(record);

      setStatusMessage({
        type: "success",
        text: t("reminder.exportSuccess"),
      });
      onSuccess?.();

      // Automatically close after friendly confirmation
      setTimeout(() => {
        onClose();
      }, 2400);
    } catch {
      setStatusMessage({
        type: "error",
        text: t("reminder.exportError"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const isExportDisabled = !place.googleMapsUrl || isExporting || (selectedPreset === "custom" && validationError !== null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Accessible Bottom Sheet Panel: lower thumb zone */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-sheet-title"
        aria-describedby="reminder-sheet-desc"
        className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto mx-auto bg-white rounded-t-[24px] p-5 sm:p-6 shadow-2xl border-t border-slate-100 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600 shrink-0" aria-hidden="true" />
            <h3 id="reminder-sheet-title" className="font-bold text-slate-900 text-base sm:text-lg">
              {t("reminder.title")}
            </h3>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("reminder.close")}
            className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Place info & Prompt */}
        <div className="mb-4">
          <p id="reminder-sheet-desc" className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-sky-700 mb-1">
            {t("reminder.prompt")}
          </p>
          <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {place.name}
          </h4>
        </div>

        {/* Status message (Success / Error toast) */}
        {statusMessage && (
          <div
            role="status"
            className={`mb-4 p-3 rounded-[12px] flex items-start gap-2.5 text-xs sm:text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Quick Presets Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3" role="radiogroup" aria-label={t("reminder.prompt")}>
          <button
            type="button"
            role="radio"
            aria-checked={selectedPreset === "1h"}
            onClick={() => setSelectedPreset("1h")}
            className={`min-h-[44px] px-3 py-2.5 rounded-[12px] text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${
              selectedPreset === "1h"
                ? "bg-sky-50 text-sky-800 border-sky-400 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {t("reminder.preset1h")}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedPreset === "2h"}
            onClick={() => setSelectedPreset("2h")}
            className={`min-h-[44px] px-3 py-2.5 rounded-[12px] text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${
              selectedPreset === "2h"
                ? "bg-sky-50 text-sky-800 border-sky-400 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {t("reminder.preset2h")}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedPreset === "4h"}
            onClick={() => setSelectedPreset("4h")}
            className={`min-h-[44px] px-3 py-2.5 rounded-[12px] text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${
              selectedPreset === "4h"
                ? "bg-sky-50 text-sky-800 border-sky-400 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {t("reminder.preset4h")}
          </button>
        </div>

        {/* Custom Date & Time Picker */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setSelectedPreset("custom")}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[12px] text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-between mb-2 ${
              selectedPreset === "custom"
                ? "bg-sky-50 text-sky-800 border-sky-400"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{t("reminder.customTime")}</span>
            </div>
            {selectedPreset === "custom" && (
              <span className="text-xs text-sky-600 font-medium">✓</span>
            )}
          </button>

          {selectedPreset === "custom" && (
            <div className="mt-2 space-y-2">
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                min={formatUtcToDaNangWallClock(new Date(Date.now() + 31 * 60 * 1000))}
                className="w-full min-h-[44px] px-3 py-2 rounded-[12px] border border-slate-300 text-slate-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={t("reminder.customTime")}
              />
              {validationError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timezone & Advance lead time notice */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-5 bg-slate-50 p-2.5 rounded-[10px] border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{t("reminder.timezoneNotice")}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={isExportDisabled}
            onClick={handleGoogleCalendar}
            className={`w-full min-h-[48px] rounded-[14px] px-4 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isExportDisabled
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{t("reminder.openGoogle")}</span>
          </button>
          <p className="text-xs leading-relaxed text-slate-600">{t("reminder.googleNotice")}</p>
          <button type="button" disabled={isExportDisabled} onClick={handleExport}
            className="w-full min-h-[48px] rounded-[14px] px-4 py-3 font-semibold text-sm border border-sky-200 text-sky-800 bg-sky-50 disabled:opacity-50">
            {t("reminder.downloadIcs")}
          </button>
          <p className="text-xs leading-relaxed text-slate-600">{t("reminder.icsNotice")}</p>
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] rounded-[14px] px-4 py-2.5 font-medium text-xs sm:text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {t("reminder.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
