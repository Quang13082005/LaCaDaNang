import { translate } from "@/lib/i18n/messages";
import type { SupportedLocale } from "@/lib/i18n/locales";
import { formatIcsTimestamp } from "./time";

/**
 * Escapes characters for RFC 5545 text fields:
 * - Backslash (\) -> \\
 * - Semicolon (;) -> \;
 * - Comma (,) -> \,
 * - Newline (\n, \r\n) -> literal \n
 */
export function escapeIcsText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\n|\r/g, "\\n");
}

/**
 * Generates a stable, unique UID for calendar events using UUID v4.
 * Suffix @laca-danang provides a neutral, collision-resistant project identifier.
 */
export function generateReminderUid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${crypto.randomUUID()}@laca-danang`;
  }
  // Deterministic fallback if crypto.randomUUID is unavailable in test environment
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return `${uuid}@laca-danang`;
}

export interface IcsEventOptions {
  uid: string;
  placeId: number;
  placeName: string;
  address?: string | null;
  googleMapsUrl: string;
  visitStartUtc: Date;
  visitEndUtc?: Date;
  nowUtc?: Date;
  locale: SupportedLocale;
}

/**
 * Generates an RFC 5545-compliant .ics file string with CRLF line endings,
 * UTC timestamps, and a 30-minute VALARM notification.
 */
export function generateIcsContent(options: IcsEventOptions): string {
  const {
    uid,
    placeName,
    address,
    googleMapsUrl,
    visitStartUtc,
    visitEndUtc = new Date(visitStartUtc.getTime() + 60 * 60 * 1000), // Default 1 hour duration
    nowUtc = new Date(),
    locale,
  } = options;

  const dtstamp = formatIcsTimestamp(nowUtc);
  const dtstart = formatIcsTimestamp(visitStartUtc);
  const dtend = formatIcsTimestamp(visitEndUtc);

  const summaryText = translate(locale, "reminder.icsSummary", { name: placeName });

  const descParts: string[] = [
    translate(locale, "reminder.icsDescPrefix", { name: placeName }),
  ];
  const trimmedAddress = address?.trim();
  if (trimmedAddress) {
    descParts.push(translate(locale, "reminder.icsAddress", { address: trimmedAddress }));
  }
  descParts.push(translate(locale, "reminder.icsMaps", { mapsUrl: googleMapsUrl }));
  const descriptionText = descParts.join("\n");

  const alarmText = translate(locale, "reminder.icsAlarmDesc", { name: placeName });

  const escapedSummary = escapeIcsText(summaryText);
  const escapedDescription = escapeIcsText(descriptionText);
  const escapedAlarm = escapeIcsText(alarmText);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//La Ca Da Nang//Calendar Reminder//${locale.toUpperCase()}`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapedSummary}`,
    `DESCRIPTION:${escapedDescription}`,
  ];

  // Only emit LOCATION if address is present and non-empty. Never fabricate address.
  if (trimmedAddress) {
    lines.push(`LOCATION:${escapeIcsText(trimmedAddress)}`);
  }

  // Exactly 30-minute VALARM advance notice
  lines.push(
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-PT30M",
    `DESCRIPTION:${escapedAlarm}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  );

  // Strict CRLF line terminators
  return lines.join("\r\n");
}

/**
 * Triggers user-initiated calendar file download/open in the browser.
 * Generates a UTF-8 Blob with MIME type text/calendar;charset=utf-8.
 * Revokes the object URL after use to prevent memory leaks.
 */
export function downloadIcsFile(filename: string, content: string): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  try {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after brief delay
    setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // no-op
      }
    }, 1000);

    return true;
  } catch {
    return false;
  }
}
