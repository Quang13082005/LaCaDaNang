import { ANALYTICS_EVENT_NAMES } from "./types";
import type { ClientAnalyticsPayload } from "./types";

export const GA_PRODUCTION_HOSTNAME = "lacadanang.quangdev.id.vn";

type GaWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  __lacaGaQueue?: unknown[][];
};

const DETAIL_EVENTS = [
  "place_detail_viewed",
  "place_detail_maps_clicked",
  "place_detail_opened",
];

export function measurementId(
  value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
): string | null {
  return value && /^G-[A-Z0-9]+$/.test(value) ? value : null;
}

export function isGaProductionHostname(hostname?: string): boolean {
  if (!hostname) {
    if (typeof window !== "undefined" && window.location) {
      hostname = window.location.hostname;
      if (!hostname && window.location.origin) {
        try {
          hostname = new URL(window.location.origin).hostname;
        } catch {
          // ignore
        }
      }
    } else {
      return false;
    }
  }
  return typeof hostname === "string" && hostname.trim().toLowerCase() === GA_PRODUCTION_HOSTNAME;
}

export const GA_CONSENT_STORAGE_KEY = "laca_analytics_consent";
export type GaConsentStatus = "granted" | "denied" | null;

export function getGaConsent(): GaConsentStatus {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage?.getItem(GA_CONSENT_STORAGE_KEY);
    if (val === "granted" || val === "denied") return val;
    if (window.localStorage?.getItem("laca_analytics_opt_out") === "true") return "denied";
    return null;
  } catch {
    return null;
  }
}

export function setGaConsent(status: "granted" | "denied", id = measurementId()): void {
  if (typeof window === "undefined") return;
  const validId = id ? measurementId(id) : null;
  try {
    window.localStorage?.setItem(GA_CONSENT_STORAGE_KEY, status);
    if (status === "granted") {
      window.localStorage?.removeItem("laca_analytics_opt_out");
      if (validId) {
        delete (window as unknown as Record<string, unknown>)[`ga-disable-${validId}`];
      }
      const w = window as unknown as GaWindow;
      if (typeof w.gtag === "function") {
        w.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    } else {
      window.localStorage?.setItem("laca_analytics_opt_out", "true");
      if (validId) {
        (window as unknown as Record<string, unknown>)[`ga-disable-${validId}`] = true;
      }
      const w = window as unknown as GaWindow;
      if (typeof w.gtag === "function") {
        w.gtag("consent", "update", {
          analytics_storage: "denied",
        });
      }
    }
    window.dispatchEvent(new CustomEvent("laca_consent_change", { detail: status }));
  } catch {
    /* ignore storage errors */
  }
}

export function isGaOptedOut(): boolean {
  return getGaConsent() === "denied";
}

export function setGaOptOut(optOut: boolean, id = measurementId()): void {
  setGaConsent(optOut ? "denied" : "granted", id);
}

export function isGaActive(
  id = measurementId(),
  hostname?: string
): boolean {
  const validId = id ? measurementId(id) : null;
  if (!validId) return false;
  // Default: strictly disabled unless explicit granted consent
  if (getGaConsent() !== "granted") {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>)[`ga-disable-${validId}`] = true;
    }
    return false;
  }
  return isGaProductionHostname(hostname);
}

// Strict parameter allowlist: never forward arbitrary fields, URLs, session IDs, GPS coordinates or PII.
export function safeGaParams(
  payload: Record<string, unknown>
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const key of [
    "locale",
    "language_mode",
    "intent",
    "preference",
    "failure_reason",
  ]) {
    const v = payload[key];
    if (typeof v === "string" && /^[a-zA-Z0-9_]{1,40}$/.test(v)) out[key] = v;
  }
  for (const key of [
    "place_id",
    "position",
    "result_count",
    "meaningful_tap_count",
  ]) {
    const v = payload[key];
    if (typeof v === "number" && Number.isSafeInteger(v) && v >= 0)
      out[key] = v;
  }
  if ([1, 3, 5].includes(Number(payload.radius_km)))
    out.radius_km = Number(payload.radius_km);
  if (typeof payload.is_nearby === "boolean") out.is_nearby = payload.is_nearby;
  return out;
}

export function safePagePath(path: string): string {
  return /^\/places\/[1-9]\d*$/.test(path) ? path : "/";
}

export function sendGaEvent(
  name: string,
  payload: Record<string, unknown>
): void {
  try {
    if (!isGaActive()) return;
    if (
      !(ANALYTICS_EVENT_NAMES as readonly string[]).includes(name) &&
      !DETAIL_EVENTS.includes(name)
    )
      return;
    const w = window as GaWindow;
    const args: unknown[] = [
      "event",
      name,
      {
        ...safeGaParams(payload),
        page_location:
          window.location.origin + safePagePath(window.location.pathname),
        page_referrer: "",
      },
    ];
    if (w.gtag) {
      w.gtag(...args);
    } else {
      w.__lacaGaQueue = w.__lacaGaQueue || [];
      if (w.__lacaGaQueue.length < 30) w.__lacaGaQueue.push(args);
    }
  } catch {
    /* Telemetry must never block navigation. */
  }
}

export function mirrorFirstPartyToGa(payload: ClientAnalyticsPayload): void {
  sendGaEvent(payload.event_name, { ...payload });
}

export function gaBootstrap(id: string): string {
  if (!measurementId(id)) return "";
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{'analytics_storage':'granted','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});gtag('js',new Date());gtag('config',${JSON.stringify(
    id
  )},{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+(/^\\/places\\/[1-9]\\d*$/.test(location.pathname)?location.pathname:'/'),page_referrer:''});(window.__lacaGaQueue||[]).forEach(function(args){gtag.apply(null,args);});window.__lacaGaQueue=[];`;
}
