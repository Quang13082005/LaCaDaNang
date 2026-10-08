import type { SupportedLocale } from "@/lib/i18n/locales";

export interface LocalReminderRecord {
  reminder_id: string;
  place_id: number;
  place_name: string;
  scheduled_visit_at_utc: string; // ISO 8601 UTC string (e.g. 2026-10-08T15:00:00.000Z)
  lead_time_minutes: 30;
  locale: SupportedLocale;
  created_at_utc: string; // ISO 8601 UTC string
  calendar_exported_at_utc: string; // ISO 8601 UTC string
}

export type ReminderPreset = "1h" | "2h" | "4h" | "custom";
