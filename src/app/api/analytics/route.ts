import { NextResponse, type NextRequest } from "next/server";
import { validateClientAnalyticsPayload } from "@/lib/analytics/validator";
import { insertAnalyticsEvent, resolveServerEnvironment } from "@/lib/analytics/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2048; // 2 KB body limit

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Check Content-Length if present
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Payload exceeds 2 KB limit" },
        { status: 413 }
      );
    }

    // 2. Read body text safely and verify byte length
    const rawText = await request.text();
    if (new TextEncoder().encode(rawText).length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Payload exceeds 2 KB limit" },
        { status: 413 }
      );
    }

    // 3. Parse JSON safely
    let json: unknown;
    try {
      json = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Malformed JSON payload" },
        { status: 400 }
      );
    }

    // 4. Validate telemetry payload with strict event schema
    const validation = validateClientAnalyticsPayload(json);
    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    // 5. Derive trusted environment server-side
    const environment = resolveServerEnvironment();

    // 6. Persist event into Neon PostgreSQL via parameterized SQL
    await insertAnalyticsEvent(validation.data, environment);

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    // Never expose database internals or stack traces
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
