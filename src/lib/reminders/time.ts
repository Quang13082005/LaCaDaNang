export const DANANG_TIMEZONE = "Asia/Ho_Chi_Minh";
export const DANANG_OFFSET_HOURS = 7;
export const LEAD_TIME_MINUTES = 30;

/**
 * Calculates a future UTC Date for quick presets (+1h, +2h, +4h).
 */
export function getPresetVisitTime(preset: "1h" | "2h" | "4h", now: Date = new Date()): Date {
  const hoursMap: Record<"1h" | "2h" | "4h", number> = {
    "1h": 1,
    "2h": 2,
    "4h": 4,
  };
  return new Date(now.getTime() + hoursMap[preset] * 60 * 60 * 1000);
}

/**
 * Parses a wall-clock string (YYYY-MM-DDTHH:mm) entered by the user,
 * explicitly interpreting it as Da Nang local time (Asia/Ho_Chi_Minh, UTC+07:00).
 *
 * This ensures that tourists whose devices are set to other timezones (e.g. UTC+09:00 Korea,
 * UTC+00:00 London) are unambiguously setting a Da Nang local visit schedule.
 */
export function parseDaNangWallClockToUtc(wallClockStr: string): Date | null {
  if (!wallClockStr || typeof wallClockStr !== "string") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(wallClockStr.trim());
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const second = match[6] ? parseInt(match[6], 10) : 0;

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hour) ||
    isNaN(minute) ||
    isNaN(second) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  // Da Nang is UTC+7. UTC hour is (hour - 7).
  // Date.UTC handles negative hours and month/day wrapping deterministically.
  const utcMillis = Date.UTC(year, month - 1, day, hour - DANANG_OFFSET_HOURS, minute, second);
  const date = new Date(utcMillis);

  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a UTC Date into a Da Nang wall-clock string (YYYY-MM-DDTHH:mm)
 * suitable for native `<input type="datetime-local" />`.
 */
export function formatUtcToDaNangWallClock(utcDate: Date): string {
  const danangEpoch = utcDate.getTime() + DANANG_OFFSET_HOURS * 60 * 60 * 1000;
  const d = new Date(danangEpoch);

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hour = String(d.getUTCHours()).padStart(2, "0");
  const minute = String(d.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Validates that the scheduled visit time is strictly more than 30 minutes in the future.
 * scheduled_visit_at > now + 30 minutes.
 */
export function isValidVisitTime(visitUtc: Date, now: Date = new Date()): boolean {
  if (!visitUtc || isNaN(visitUtc.getTime()) || !now || isNaN(now.getTime())) {
    return false;
  }
  const minAllowedMillis = now.getTime() + LEAD_TIME_MINUTES * 60 * 1000;
  return visitUtc.getTime() > minAllowedMillis;
}

/**
 * Formats a UTC Date into RFC 5545 timestamp format: YYYYMMDDTHHmmssZ
 */
export function formatIcsTimestamp(utcDate: Date): string {
  const year = utcDate.getUTCFullYear();
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utcDate.getUTCDate()).padStart(2, "0");
  const hour = String(utcDate.getUTCHours()).padStart(2, "0");
  const minute = String(utcDate.getUTCMinutes()).padStart(2, "0");
  const second = String(utcDate.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hour}${minute}${second}Z`;
}
