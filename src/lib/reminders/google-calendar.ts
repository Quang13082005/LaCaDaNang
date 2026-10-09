import { translate } from "@/lib/i18n/messages";
import type { IcsEventOptions } from "./ics";
import { formatIcsTimestamp, DANANG_TIMEZONE } from "./time";

/** A prefilled draft only: no account access, save or notification guarantee. */
export function googleCalendarUrl(options: Pick<IcsEventOptions, "placeName" | "address" | "googleMapsUrl" | "visitStartUtc" | "locale">): string {
  const { placeName, address, googleMapsUrl, visitStartUtc, locale } = options;
  if (!Number.isFinite(visitStartUtc.getTime()) || !googleMapsUrl) throw new Error("Invalid calendar input");
  const instant = formatIcsTimestamp(visitStartUtc);
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", translate(locale, "reminder.icsSummary", { name: placeName }));
  // Equal endpoints avoid inventing a visit duration. User reviews the draft before saving.
  url.searchParams.set("dates", `${instant}/${instant}`);
  url.searchParams.set("ctz", DANANG_TIMEZONE);
  url.searchParams.set("details", [translate(locale, "reminder.icsDescPrefix", { name: placeName }), googleMapsUrl].join("\n"));
  if (address?.trim()) url.searchParams.set("location", address.trim());
  return url.toString();
}
