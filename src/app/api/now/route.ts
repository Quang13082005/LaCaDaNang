import { NextResponse, type NextRequest } from "next/server";
import { parseDiscoveryQuery } from "@/lib/data/discovery-contract";
import { getNeonExecutor } from "@/lib/db/neon";
import { createPlaceRepository } from "@/lib/data/place-repository";
import { findNowItinerary } from "@/lib/now/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if ([...params.keys()].some(key => !["locale", "lat", "lng"].includes(key)) ||
      ["lat", "lng"].some(key => params.has(key) && !params.get(key)?.trim())) {
    return NextResponse.json({ ok: false, error: { code: "INVALID_PARAMETER" } }, { status: 400 });
  }
  const sharedParams = new URLSearchParams(params);
  sharedParams.set("intent", "GO");
  const parsed = parseDiscoveryQuery(sharedParams);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: { code: "INVALID_PARAMETER" } }, { status: 400 });
  const { locale, location } = parsed.query;
  try {
    const data = await findNowItinerary(createPlaceRepository(getNeonExecutor()), locale, new Date(), location ? { latitude: location.lat, longitude: location.lng } : undefined);
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "DATABASE_UNAVAILABLE" } }, { status: 500 });
  }
}
