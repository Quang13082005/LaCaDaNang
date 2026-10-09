"use client";
import Script from "next/script";
import { measurementId, gaBootstrap } from "@/lib/analytics/ga4";
export function GoogleAnalytics() {
 const id=measurementId();
 if(!id||process.env.NODE_ENV!=="production")return null;
 const init=gaBootstrap(id);
 return <><Script id="ga4-init" strategy="afterInteractive">{init}</Script><Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive"/></>;
}
