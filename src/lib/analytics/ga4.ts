import { ANALYTICS_EVENT_NAMES } from "./types";
import type { ClientAnalyticsPayload } from "./types";
type GaWindow = Window & {gtag?: (...args: unknown[])=>void; dataLayer?: unknown[]; __lacaGaQueue?: unknown[][]};
const DETAIL_EVENTS = ["place_detail_viewed", "place_detail_maps_clicked", "place_detail_opened"];
export function measurementId(value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID): string | null {
 return value && /^G-[A-Z0-9]+$/.test(value) ? value : null;
}
// Strict parameter allowlist: never forward arbitrary fields, URLs, session IDs, GPS or PII.
export function safeGaParams(payload: Record<string,unknown>): Record<string,string|number|boolean> {
 const out:Record<string,string|number|boolean>={};
 for(const key of ["locale","language_mode","intent","preference","failure_reason"]){const v=payload[key];if(typeof v==="string"&&/^[a-zA-Z0-9_]{1,40}$/.test(v))out[key]=v;}
 for(const key of ["place_id","position","result_count","meaningful_tap_count"]){const v=payload[key];if(typeof v==="number"&&Number.isSafeInteger(v)&&v>=0)out[key]=v;}
 if([1,3,5].includes(Number(payload.radius_km)))out.radius_km=Number(payload.radius_km);
 if(typeof payload.is_nearby==="boolean")out.is_nearby=payload.is_nearby;
 return out;
}
export function safePagePath(path: string): string {return /^\/places\/[1-9]\d*$/.test(path)?path:"/";}
export function sendGaEvent(name: string, payload: Record<string,unknown>): void {
 try {
  if(process.env.NODE_ENV!=="production"||!measurementId()||typeof window==="undefined")return;
  if(!(ANALYTICS_EVENT_NAMES as readonly string[]).includes(name)&&!DETAIL_EVENTS.includes(name))return;
  const w=window as GaWindow;
  const args:unknown[]=["event",name,{...safeGaParams(payload),page_location:window.location.origin+safePagePath(window.location.pathname),page_referrer:""}];
  if(w.gtag)w.gtag(...args);else {w.__lacaGaQueue=w.__lacaGaQueue||[];if(w.__lacaGaQueue.length<30)w.__lacaGaQueue.push(args);}
 } catch { /* Telemetry must never block navigation. */ }
}
export function mirrorFirstPartyToGa(payload: ClientAnalyticsPayload):void {sendGaEvent(payload.event_name,{...payload});}

export function gaBootstrap(id: string): string {
 if(!measurementId(id))return "";
 return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(id)},{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin,page_referrer:''});(window.__lacaGaQueue||[]).forEach(function(args){gtag.apply(null,args);});window.__lacaGaQueue=[];`;
}
