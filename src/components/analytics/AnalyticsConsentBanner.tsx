"use client";

import { useEffect, useState, useContext, useCallback } from "react";
import { LocaleContext } from "@/components/i18n/LocaleProvider";
import {
  getGaConsent,
  setGaConsent,
  type GaConsentStatus,
} from "@/lib/analytics/ga4";

export function AnalyticsConsentBanner() {
  const localeCtx = useContext(LocaleContext);
  const locale = localeCtx?.locale || "vi";

  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<GaConsentStatus>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsent(getGaConsent());

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<GaConsentStatus>;
      setConsent(customEvent.detail ?? getGaConsent());
    };

    const handleOpenModal = () => {
      setShowModal(true);
    };

    window.addEventListener("laca_consent_change", handleConsentChange);
    window.addEventListener("laca_open_consent_settings", handleOpenModal);

    return () => {
      window.removeEventListener("laca_consent_change", handleConsentChange);
      window.removeEventListener("laca_open_consent_settings", handleOpenModal);
    };
  }, []);

  const handleAccept = useCallback(() => {
    setGaConsent("granted");
    setConsent("granted");
  }, []);

  const handleDecline = useCallback(() => {
    setGaConsent("denied");
    setConsent("denied");
  }, []);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  if (!mounted) return null;

  const t = {
    vi: {
      bannerTitle: "Quyền riêng tư & Phân tích",
      bannerDesc:
        "La Cà Đà Nẵng sử dụng phân tích ẩn danh để tối ưu gợi ý địa điểm. Tuyệt đối không thu thập GPS chính xác hay thông tin cá nhân.",
      accept: "Đồng ý",
      decline: "Từ chối",
      settingsTitle: "Cài đặt phân tích & Quyền riêng tư",
      settingsDesc:
        "Chúng tôi chỉ sử dụng dữ liệu ẩn danh (loại thiết bị, lựa chọn khám phá) để cải thiện chất lượng gợi ý. Toàn bộ tọa độ GPS chính xác và thông tin cá nhân đều bị loại bỏ hoàn toàn.",
      statusLabel: "Trạng thái hiện tại:",
      statusGranted: "Đã bật phân tích (Đồng ý)",
      statusDenied: "Đã tắt phân tích (Từ chối)",
      enableAction: "Bật phân tích",
      disableAction: "Tắt phân tích",
      closeAction: "Đóng",
    },
    en: {
      bannerTitle: "Privacy & Analytics",
      bannerDesc:
        "La Cà Đà Nẵng uses anonymous analytics to optimize venue recommendations. We never collect precise GPS or personal info.",
      accept: "Accept",
      decline: "Decline",
      settingsTitle: "Privacy & Analytics Settings",
      settingsDesc:
        "We only use anonymous data (device type, discovery preferences) to improve recommendations. Precise GPS coordinates and personal identifiers are strictly stripped.",
      statusLabel: "Current status:",
      statusGranted: "Analytics Enabled (Accepted)",
      statusDenied: "Analytics Disabled (Declined)",
      enableAction: "Enable Analytics",
      disableAction: "Disable Analytics",
      closeAction: "Close",
    },
    ko: {
      bannerTitle: "개인정보 및 분석 안내",
      bannerDesc:
        "La Cà Đà Nẵng은 장소 추천 개선을 위해 익명 분석을 사용합니다. 정밀 GPS 좌표나 개인정보는 절대 수집하지 않습니다.",
      accept: "동의",
      decline: "거부",
      settingsTitle: "개인정보 및 분석 설정",
      settingsDesc:
        "장소 추천 품질 향상을 위해 익명 데이터(기기 종류, 탐색 선택)만 사용합니다. 정밀 GPS 좌표와 개인 식별 정보는 완전히 제외됩니다.",
      statusLabel: "현재 상태:",
      statusGranted: "분석 활성화됨 (동의)",
      statusDenied: "분석 비활성화됨 (거부)",
      enableAction: "분석 활성화",
      disableAction: "분석 비활성화",
      closeAction: "닫기",
    },
  }[locale];

  return (
    <>
      {/* 1. Mobile-First Bottom Consent Banner (only when consent is undecided) */}
      {consent === null && (
        <aside
          role="region"
          aria-label={t.bannerTitle}
          className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/90 text-slate-900 transition-all duration-200"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                {t.bannerTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.bannerDesc}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 min-h-[44px] py-2.5 px-3 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors text-center inline-flex items-center justify-center cursor-pointer shadow-sm"
              >
                {t.accept}
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 min-h-[44px] py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium rounded-xl text-xs sm:text-sm transition-colors text-center inline-flex items-center justify-center cursor-pointer"
              >
                {t.decline}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Privacy & Analytics Settings Modal (Accessible dialog to change preferences later) */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="analytics-settings-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2
                id="analytics-settings-title"
                className="text-base font-bold text-slate-900"
              >
                {t.settingsTitle}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-slate-600 rounded-lg inline-flex items-center justify-center"
                aria-label={t.closeAction}
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.settingsDesc}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="font-semibold text-slate-700">
                {t.statusLabel}
              </span>
              <p
                className={
                  consent === "granted"
                    ? "font-medium text-emerald-600"
                    : "font-medium text-slate-600"
                }
              >
                {consent === "granted" ? t.statusGranted : t.statusDenied}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {consent !== "granted" ? (
                <button
                  type="button"
                  onClick={() => {
                    handleAccept();
                    setShowModal(false);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-sm transition-colors text-center inline-flex items-center justify-center shadow-sm cursor-pointer"
                >
                  {t.enableAction}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleDecline();
                    setShowModal(false);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-sm transition-colors text-center inline-flex items-center justify-center cursor-pointer"
                >
                  {t.disableAction}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full min-h-[44px] py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors text-center inline-flex items-center justify-center cursor-pointer"
              >
                {t.closeAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
