"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  measurementId,
  gaBootstrap,
  isGaProductionHostname,
  getGaConsent,
} from "@/lib/analytics/ga4";

export function GoogleAnalytics() {
  const [canLoad, setCanLoad] = useState(false);
  const id = measurementId();

  useEffect(() => {
    const update = () => {
      if (
        id &&
        typeof window !== "undefined" &&
        isGaProductionHostname(window.location?.hostname) &&
        getGaConsent() === "granted"
      ) {
        setCanLoad(true);
      } else {
        setCanLoad(false);
      }
    };

    update();

    window.addEventListener("laca_consent_change", update);
    return () => {
      window.removeEventListener("laca_consent_change", update);
    };
  }, [id]);

  if (!canLoad || !id) return null;

  const init = gaBootstrap(id);
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
    </>
  );
}
