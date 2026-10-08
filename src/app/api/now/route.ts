import { NextResponse, type NextRequest } from "next/server";
import { isDiscoveryLocale } from "@/lib/data/discovery-contract";
import { getNeonExecutor } from "@/lib/db/neon";
import { createPlaceRepository } from "@/lib/data/place-repository";
import { findNowItinerary } from "@/lib/now/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const locale = params.get("locale") ?? "vi";
  if (params.getAll("locale").length > 1 || [...params.keys()].some(key => key !== "locale") || !isDiscoveryLocale(locale)) {
    return NextResponse.json({ ok: false, error: { code: "INVALID_PARAMETER" } }, { status: 400 });
  }
  try {
    const data = await findNowItinerary(createPlaceRepository(getNeonExecutor()), locale);
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "DATABASE_UNAVAILABLE" } }, { status: 500 });
  }
}
