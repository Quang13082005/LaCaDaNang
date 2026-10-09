"use client";
import { useEffect, useState } from "react";
import { NowResults } from "@/components/itinerary/NowResults";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
// Public venue coordinates from SELECT audit. Simulated browser GPS, real API/Neon results.
const points: Record<string, { latitude: number; longitude: number }> = {"1": {"latitude": 15.5896638, "longitude": 108.4707923}, "3": {"latitude": 16.0825316, "longitude": 108.2209614}, "5": {"latitude": 16.0738647, "longitude": 108.2461281}};
export function NowLocationPreview() {
 const [scenario, setScenario] = useState<string | null>(null);
 const [ready, setReady] = useState(false);
 useEffect(() => {
  if (!scenario) return;
  const descriptor = Object.getOwnPropertyDescriptor(navigator, "geolocation");
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
   getCurrentPosition: (ok: PositionCallback, fail: PositionErrorCallback) => {
    if (scenario === "denied") { fail({ code: 1 } as GeolocationPositionError); return; }
    if (scenario === "timeout") return;
    const point = points[scenario] ?? { latitude: 0, longitude: 0 };
    ok({ coords: { ...point, accuracy: scenario === "inaccurate" ? 1001 : 20 } } as GeolocationPosition);
   }
  }});
  setReady(true);
  return () => { if (descriptor) Object.defineProperty(navigator,"geolocation",descriptor); else Reflect.deleteProperty(navigator,"geolocation"); };
 }, [scenario]);
 return <main className="max-w-2xl mx-auto p-4 pb-48">
  <p>DEV — simulated GPS at public venues; real Neon API. Not owner location.</p>
  <LanguageSelector />
  {!scenario ? <div className="grid gap-2">{["1","3","5","empty","denied","inaccurate","timeout"].map(value=><button key={value} className="min-h-[44px] border p-3" onClick={()=>setScenario(value)}>Scenario {value}</button>)}</div> : <p>Scenario {scenario}</p>}
  {ready && scenario && <NowResults key={scenario} onResetPreference={()=>{setReady(false);setScenario(null);}} />}
 </main>;
}
