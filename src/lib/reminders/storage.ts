import type { LocalReminderRecord } from "./types";

export const REMINDERS_STORAGE_KEY = "laca.reminders.v1";

/**
 * Safely loads all local reminder export records from localStorage.
 * Returns an empty array if localStorage is unavailable, disabled, or corrupted.
 */
export function loadReminderRecords(): LocalReminderRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is LocalReminderRecord =>
        typeof item === "object" &&
        item !== null &&
        typeof item.reminder_id === "string" &&
        typeof item.place_id === "number" &&
        typeof item.place_name === "string" &&
        typeof item.scheduled_visit_at_utc === "string" &&
        item.lead_time_minutes === 30 &&
        (item.locale === "vi" || item.locale === "en" || item.locale === "ko") &&
        typeof item.created_at_utc === "string" &&
        typeof item.calendar_exported_at_utc === "string"
    );
  } catch {
    return [];
  }
}

/**
 * Saves or updates a reminder record in localStorage.
 * If a reminder for the same place_id already exists, it is replaced with the new export record.
 */
export function saveReminderRecord(record: LocalReminderRecord): boolean {
  if (typeof window === "undefined") return false;

  try {
    const records = loadReminderRecords();
    const updated = records.filter((r) => r.place_id !== record.place_id);
    updated.push(record);

    window.localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the existing reminder export record for a specific place_id, if any.
 */
export function getReminderForPlace(placeId: number): LocalReminderRecord | null {
  const records = loadReminderRecords();
  return records.find((r) => r.place_id === placeId) ?? null;
}
