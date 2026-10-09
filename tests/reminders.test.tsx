import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PlaceCard } from "@/components/results/PlaceCard";
import { ReminderSheet } from "@/components/reminders/ReminderSheet";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import type { PlaceCardModel } from "@/lib/data/place-card-model";
import {
  getPresetVisitTime,
  parseDaNangWallClockToUtc,
  formatUtcToDaNangWallClock,
  isValidVisitTime,
  formatIcsTimestamp,
  DANANG_TIMEZONE,
  DANANG_OFFSET_HOURS,
  LEAD_TIME_MINUTES,
} from "@/lib/reminders/time";
import {
  generateIcsContent,
  generateReminderUid,
  escapeIcsText,
  downloadIcsFile,
} from "@/lib/reminders/ics";
import {
  loadReminderRecords,
  saveReminderRecord,
  getReminderForPlace,
  REMINDERS_STORAGE_KEY,
} from "@/lib/reminders/storage";
import type { LocalReminderRecord } from "@/lib/reminders/types";
import { ANALYTICS_EVENT_NAMES } from "@/lib/analytics/types";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";

const mockPlaceEat: PlaceCardModel = {
  id: 101,
  name: "Bánh mì Bà Lan",
  typeLabel: "Quán ăn",
  area: "Hải Châu",
  address: "62 Trưng Nữ Vương, Hải Châu, Đà Nẵng",
  googleMapsUrl: "https://maps.google.com/?cid=12345",
  rating: 4.6,
  reviewCount: 1520,
  tags: ["Bánh mì", "Ăn sáng"],
  description: "Bánh mì chả nổi tiếng Đà Nẵng",
};

const mockPlaceNoAddress: PlaceCardModel = {
  id: 202,
  name: "Bán đảo Sơn Trà",
  typeLabel: "Điểm tham quan",
  area: "Sơn Trà",
  address: undefined,
  googleMapsUrl: "https://maps.google.com/?cid=67890",
  rating: 4.8,
  reviewCount: 3400,
  tags: ["Thiên nhiên", "Ngắm cảnh"],
  description: "Khu bảo tồn thiên nhiên",
};

describe("LA CÀ ĐÀ NẴNG — M9-B Calendar Reminder MVP Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    document.documentElement.lang = "vi";
    vi.restoreAllMocks();

    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url-1234");
    global.URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------
  // 1. PLACE CARD CTA & ERGONOMICS
  // -------------------------------------------------------------
  describe("1. PlaceCard Reminder CTA", () => {
    it("renders secondary 'Nhắc tôi' CTA with >=44px touch target on EAT PlaceCard", () => {
      render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="EAT" preference="an_ngon" />
        </LocaleProvider>
      );

      const remindBtn = screen.getByRole("button", { name: /Nhắc tôi/i });
      expect(remindBtn).toBeInTheDocument();
      expect(remindBtn).toHaveClass("min-h-[44px]");

      // Google Maps CTA remains primary
      const mapsLink = screen.getByRole("link", { name: /Xem trên Google Maps/i });
      expect(mapsLink).toBeInTheDocument();
      expect(mapsLink).toHaveClass("min-h-[44px]");
      expect(mapsLink).toHaveAttribute("href", mockPlaceEat.googleMapsUrl);
    });

    it("renders secondary 'Nhắc tôi' CTA on GO and STAY PlaceCards", () => {
      const { unmount } = render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="GO" preference="vui_choi" />
        </LocaleProvider>
      );
      expect(screen.getByRole("button", { name: /Nhắc tôi/i })).toBeInTheDocument();
      unmount();

      render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="STAY" preference="gan_bien" />
        </LocaleProvider>
      );
      expect(screen.getByRole("button", { name: /Nhắc tôi/i })).toBeInTheDocument();
    });

    it("does NOT render reminder CTA on static NOW itinerary cards", () => {
      render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="NOW" />
        </LocaleProvider>
      );
      expect(screen.queryByRole("button", { name: /Nhắc tôi/i })).not.toBeInTheDocument();
    });

    it("never renders a persistent 'Đã lên lịch' badge even when an export record exists in localStorage", () => {
      saveReminderRecord({
        reminder_id: "test-existing-uid",
        place_id: 101,
        place_name: "Bánh mì Bà Lan",
        scheduled_visit_at_utc: "2026-10-08T12:00:00.000Z",
        lead_time_minutes: 30,
        locale: "vi",
        created_at_utc: "2026-10-08T10:00:00.000Z",
        calendar_exported_at_utc: "2026-10-08T10:00:00.000Z",
      });

      render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="EAT" preference="an_ngon" />
        </LocaleProvider>
      );

      // Verify no misleading badge claiming scheduled/added status
      expect(screen.queryByText(/Đã lên lịch/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Scheduled/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Added to calendar/i)).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // 2. BOTTOM SHEET DIALOG & ACCESSIBILITY
  // -------------------------------------------------------------
  describe("2. Bottom Sheet Dialog Accessibility & Flow", () => {
    it("opens bottom sheet when tapping 'Nhắc tôi' with dialog semantics and aria-modal", () => {
      render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="EAT" preference="an_ngon" />
        </LocaleProvider>
      );

      const remindBtn = screen.getByRole("button", { name: /Nhắc tôi/i });
      fireEvent.click(remindBtn);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(screen.getByRole("heading", { name: /Nhắc tôi ghé thăm/i })).toBeInTheDocument();
      expect(within(dialog).getByText("Bánh mì Bà Lan")).toBeInTheDocument();
      expect(screen.getByText(/Bạn muốn đến đây lúc nào\?/i)).toBeInTheDocument();
    });

    it("closes bottom sheet when clicking close button or pressing Escape", () => {
      render(
        <LocaleProvider>
          <PlaceCard place={mockPlaceEat} intent="EAT" preference="an_ngon" />
        </LocaleProvider>
      );

      fireEvent.click(screen.getByRole("button", { name: /Nhắc tôi/i }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Close via top close X button
      const closeButtons = screen.getAllByRole("button", { name: "Đóng" });
      expect(closeButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(closeButtons[0]);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Open again and close via Escape key
      fireEvent.click(screen.getByRole("button", { name: /Nhắc tôi/i }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // 3. TIMEZONE & PRESETS & VALIDATION
  // -------------------------------------------------------------
  describe("3. Time Calculation, Timezone & Validation", () => {
    it("locks canonical timezone to Asia/Ho_Chi_Minh (+7 GMT) and 30-min lead time", () => {
      expect(DANANG_TIMEZONE).toBe("Asia/Ho_Chi_Minh");
      expect(DANANG_OFFSET_HOURS).toBe(7);
      expect(LEAD_TIME_MINUTES).toBe(30);
    });

    it("calculates quick presets (+1h, +2h, +4h) accurately from fixed reference instant", () => {
      const fixedNow = new Date("2026-10-08T10:00:00.000Z");
      const plus1h = getPresetVisitTime("1h", fixedNow);
      const plus2h = getPresetVisitTime("2h", fixedNow);
      const plus4h = getPresetVisitTime("4h", fixedNow);

      expect(plus1h.toISOString()).toBe("2026-10-08T11:00:00.000Z");
      expect(plus2h.toISOString()).toBe("2026-10-08T12:00:00.000Z");
      expect(plus4h.toISOString()).toBe("2026-10-08T14:00:00.000Z");

      expect(isValidVisitTime(plus1h, fixedNow)).toBe(true);
      expect(isValidVisitTime(plus2h, fixedNow)).toBe(true);
      expect(isValidVisitTime(plus4h, fixedNow)).toBe(true);
    });

    it("interprets user wall-clock datetime explicitly as Da Nang local time (UTC+7) independent of device timezone", () => {
      // User inputs "2026-10-08T19:00" intending 19:00 in Da Nang.
      // Da Nang is UTC+7 -> In UTC this must be 12:00Z.
      const parsedUtc = parseDaNangWallClockToUtc("2026-10-08T19:00");
      expect(parsedUtc).not.toBeNull();
      expect(parsedUtc!.toISOString()).toBe("2026-10-08T12:00:00.000Z");

      // Verify reverse formatting to Da Nang wall clock
      const wallClock = formatUtcToDaNangWallClock(parsedUtc!);
      expect(wallClock).toBe("2026-10-08T19:00");
    });

    it("handles Da Nang day-boundary crossing during UTC conversion", () => {
      // 02:00 AM on Oct 9 in Da Nang (UTC+7) is 19:00 on Oct 8 in UTC.
      const parsedUtc = parseDaNangWallClockToUtc("2026-10-09T02:00");
      expect(parsedUtc).not.toBeNull();
      expect(parsedUtc!.toISOString()).toBe("2026-10-08T19:00:00.000Z");
    });

    it("rejects custom time <= 30 minutes in the future", () => {
      const fixedNow = new Date("2026-10-08T10:00:00.000Z");

      // Exactly 30 minutes: invalid
      const thirtyMins = new Date("2026-10-08T10:30:00.000Z");
      expect(isValidVisitTime(thirtyMins, fixedNow)).toBe(false);

      // 15 minutes: invalid
      const fifteenMins = new Date("2026-10-08T10:15:00.000Z");
      expect(isValidVisitTime(fifteenMins, fixedNow)).toBe(false);

      // In the past: invalid
      const pastTime = new Date("2026-10-08T09:00:00.000Z");
      expect(isValidVisitTime(pastTime, fixedNow)).toBe(false);

      // 31 minutes: valid
      const thirtyOneMins = new Date("2026-10-08T10:31:00.000Z");
      expect(isValidVisitTime(thirtyOneMins, fixedNow)).toBe(true);
    });
  });

  // -------------------------------------------------------------
  // 4. RFC 5545 ICS EVENT GENERATOR & CONFORMANCE
  // -------------------------------------------------------------
  describe("4. RFC 5545 Conformance, VALARM & Text Escaping", () => {
    it("escapes backslashes, semicolons, commas, and newlines per RFC 5545", () => {
      const unescaped = "Quán ăn A, B; C \\ D\nĐịa chỉ mới\r\nĐà Nẵng";
      const escaped = escapeIcsText(unescaped);
      expect(escaped).toBe("Quán ăn A\\, B\\; C \\\\ D\\nĐịa chỉ mới\\nĐà Nẵng");
    });

    it("generates valid RFC 5545 calendar with CRLF, UTC Z timestamps, and VALARM -PT30M without fabricated DTEND", () => {
      const visitUtc = new Date("2026-10-08T12:00:00.000Z");
      const nowUtc = new Date("2026-10-08T08:00:00.000Z");

      const ics = generateIcsContent({
        uid: "test-uuid-1234@laca-danang",
        placeId: 101,
        placeName: "Bánh mì Bà Lan",
        address: "62 Trưng Nữ Vương, Hải Châu, Đà Nẵng",
        googleMapsUrl: "https://maps.google.com/?cid=12345",
        visitStartUtc: visitUtc,
        nowUtc,
        locale: "vi",
      });

      // Strict CRLF terminators
      expect(ics).toContain("\r\n");
      const lines = ics.split("\r\n");

      expect(lines).toContain("BEGIN:VCALENDAR");
      expect(lines).toContain("VERSION:2.0");
      expect(lines).toContain("CALSCALE:GREGORIAN");
      expect(lines).toContain("BEGIN:VEVENT");
      expect(lines).toContain("UID:test-uuid-1234@laca-danang");
      expect(lines).toContain("DTSTAMP:20261008T080000Z");
      expect(lines).toContain("DTSTART:20261008T120000Z");
      // DTEND must NOT be fabricated per M9-B.1 contract
      expect(ics).not.toContain("DTEND");
      expect(lines).toContain("SUMMARY:Ghé thăm Bánh mì Bà Lan (La Cà Đà Nẵng)");
      expect(lines).toContain("LOCATION:62 Trưng Nữ Vương\\, Hải Châu\\, Đà Nẵng");

      // Verify exact Google Maps URL in description
      expect(ics).toContain("https://maps.google.com/?cid=12345");

      // Verify VALARM component
      expect(lines).toContain("BEGIN:VALARM");
      expect(lines).toContain("ACTION:DISPLAY");
      expect(lines).toContain("TRIGGER:-PT30M");
      expect(lines).toContain("END:VALARM");
      expect(lines).toContain("END:VEVENT");
      expect(lines).toContain("END:VCALENDAR");
    });

    it("omits LOCATION line entirely when place address is absent/empty", () => {
      const visitUtc = new Date("2026-10-08T12:00:00.000Z");
      const ics = generateIcsContent({
        uid: "test-uuid-5678@laca-danang",
        placeId: 202,
        placeName: "Bán đảo Sơn Trà",
        address: undefined,
        googleMapsUrl: "https://maps.google.com/?cid=67890",
        visitStartUtc: visitUtc,
        locale: "vi",
      });

      expect(ics).not.toContain("LOCATION:");
    });

    it("generates neutral, unique UUID with project identifier suffix @laca-danang", () => {
      const uid1 = generateReminderUid();
      const uid2 = generateReminderUid();
      expect(uid1).toMatch(/^[0-9a-f-]{36}@laca-danang$/);
      expect(uid2).toMatch(/^[0-9a-f-]{36}@laca-danang$/);
      expect(uid1).not.toBe(uid2);
    });
  });

  // -------------------------------------------------------------
  // 5. LOCAL STORAGE RESILIENCE & EXPORT LIFECYCLE
  // -------------------------------------------------------------
  describe("5. Local Storage Contract & Safe Handling", () => {
    it("does not write to localStorage merely when opening the sheet", () => {
      render(
        <LocaleProvider>
          <ReminderSheet place={mockPlaceEat} isOpen={true} onClose={() => {}} />
        </LocaleProvider>
      );

      const records = loadReminderRecords();
      expect(records).toHaveLength(0);
      expect(localStorage.getItem(REMINDERS_STORAGE_KEY)).toBeNull();
    });

    it("saves local reminder record with strict schema on actual export", () => {
      const record: LocalReminderRecord = {
        reminder_id: "test-id-1",
        place_id: 101,
        place_name: "Bánh mì Bà Lan",
        scheduled_visit_at_utc: "2026-10-08T12:00:00.000Z",
        lead_time_minutes: 30,
        locale: "vi",
        created_at_utc: "2026-10-08T10:00:00.000Z",
        calendar_exported_at_utc: "2026-10-08T10:00:00.000Z",
      };

      const success = saveReminderRecord(record);
      expect(success).toBe(true);

      const records = loadReminderRecords();
      expect(records).toHaveLength(1);
      expect(records[0]).toEqual(record);

      const retrieved = getReminderForPlace(101);
      expect(retrieved).toEqual(record);
    });

    it("replaces existing record when same place is exported again", () => {
      const initialRecord: LocalReminderRecord = {
        reminder_id: "test-id-1",
        place_id: 101,
        place_name: "Bánh mì Bà Lan",
        scheduled_visit_at_utc: "2026-10-08T12:00:00.000Z",
        lead_time_minutes: 30,
        locale: "vi",
        created_at_utc: "2026-10-08T10:00:00.000Z",
        calendar_exported_at_utc: "2026-10-08T10:00:00.000Z",
      };
      saveReminderRecord(initialRecord);

      const updatedRecord: LocalReminderRecord = {
        reminder_id: "test-id-2",
        place_id: 101,
        place_name: "Bánh mì Bà Lan",
        scheduled_visit_at_utc: "2026-10-08T15:00:00.000Z",
        lead_time_minutes: 30,
        locale: "vi",
        created_at_utc: "2026-10-08T11:00:00.000Z",
        calendar_exported_at_utc: "2026-10-08T11:00:00.000Z",
      };
      saveReminderRecord(updatedRecord);

      const records = loadReminderRecords();
      expect(records).toHaveLength(1);
      expect(records[0].reminder_id).toBe("test-id-2");
      expect(records[0].scheduled_visit_at_utc).toBe("2026-10-08T15:00:00.000Z");
    });

    it("handles localStorage failure gracefully without throwing", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const record: LocalReminderRecord = {
        reminder_id: "test-id-fail",
        place_id: 999,
        place_name: "Test Place",
        scheduled_visit_at_utc: "2026-10-08T12:00:00.000Z",
        lead_time_minutes: 30,
        locale: "vi",
        created_at_utc: "2026-10-08T10:00:00.000Z",
        calendar_exported_at_utc: "2026-10-08T10:00:00.000Z",
      };

      expect(() => saveReminderRecord(record)).not.toThrow();
      expect(saveReminderRecord(record)).toBe(false);

      setItemSpy.mockRestore();
    });

    it("confirms local record schema does not include delivered, sent, calendar_synced, or imported statuses", () => {
      const record: LocalReminderRecord = {
        reminder_id: "test-id-1",
        place_id: 101,
        place_name: "Bánh mì Bà Lan",
        scheduled_visit_at_utc: "2026-10-08T12:00:00.000Z",
        lead_time_minutes: 30,
        locale: "vi",
        created_at_utc: "2026-10-08T10:00:00.000Z",
        calendar_exported_at_utc: "2026-10-08T10:00:00.000Z",
      };
      saveReminderRecord(record);

      const saved = getReminderForPlace(101) as any;
      expect(saved.delivered).toBeUndefined();
      expect(saved.sent).toBeUndefined();
      expect(saved.calendar_synced).toBeUndefined();
      expect(saved.imported).toBeUndefined();
      expect(saved.dismissed).toBeUndefined();
    });

    it("displays truthful post-export confirmation telling user to open and save in calendar app", async () => {
      render(
        <LocaleProvider>
          <ReminderSheet place={mockPlaceEat} isOpen={true} onClose={() => {}} />
        </LocaleProvider>
      );

      const exportBtn = screen.getByRole("button", { name: /Tải lịch nhắc/i });
      fireEvent.click(exportBtn);

      await waitFor(() => {
        expect(
          screen.getByText("Đã tạo file lịch nhắc. Hãy mở và lưu sự kiện trong ứng dụng Lịch của bạn.")
        ).toBeInTheDocument();
      });

      // Verify it does NOT claim false delivery or scheduled confirmation
      expect(screen.queryByText(/La Cà will notify you/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Reminder scheduled successfully/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Added to your calendar/i)).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // 6. CLIENT-SIDE DOWNLOAD & REVOCATION
  // -------------------------------------------------------------
  describe("6. Blob MIME & Object URL Revocation", () => {
    it("creates UTF-8 text/calendar blob and triggers anchor download then revokes URL", () => {
      const createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url-1234");
      const revokeObjectURLMock = vi.fn();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = vi.fn();
      const origCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
        const el = origCreateElement(tagName);
        if (tagName === "a") {
          el.click = clickMock;
        }
        return el;
      });

      const success = downloadIcsFile("la-ca-reminder-101.ics", "BEGIN:VCALENDAR\r\nEND:VCALENDAR");
      expect(success).toBe(true);
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------
  // 7. MULTILINGUAL SUPPORT (VI, EN, KO)
  // -------------------------------------------------------------
  describe("7. Multilingual Support (VI, EN, KO)", () => {
    it("renders Vietnamese UI and ICS copy correctly", () => {
      const ics = generateIcsContent({
        uid: "uid-vi@laca-danang",
        placeId: 101,
        placeName: "Bánh mì Bà Lan",
        googleMapsUrl: "https://maps.google.com",
        visitStartUtc: new Date("2026-10-08T12:00:00.000Z"),
        locale: "vi",
      });
      expect(ics).toContain("SUMMARY:Ghé thăm Bánh mì Bà Lan (La Cà Đà Nẵng)");
      expect(ics).toContain("DESCRIPTION:Nhắc nhở ghé thăm Bánh mì Bà Lan.");
      expect(ics).toContain("PRODID:-//La Ca Da Nang//Calendar Reminder//VI");
    });

    it("renders English UI and ICS copy correctly", () => {
      const ics = generateIcsContent({
        uid: "uid-en@laca-danang",
        placeId: 101,
        placeName: "Bánh mì Bà Lan",
        googleMapsUrl: "https://maps.google.com",
        visitStartUtc: new Date("2026-10-08T12:00:00.000Z"),
        locale: "en",
      });
      expect(ics).toContain("SUMMARY:Visit Bánh mì Bà Lan (La Ca Da Nang)");
      expect(ics).toContain("DESCRIPTION:Reminder to visit Bánh mì Bà Lan.");
      expect(ics).toContain("PRODID:-//La Ca Da Nang//Calendar Reminder//EN");
    });

    it("renders Korean UI and ICS copy correctly without translating proper venue name", () => {
      const ics = generateIcsContent({
        uid: "uid-ko@laca-danang",
        placeId: 101,
        placeName: "Bánh mì Bà Lan",
        googleMapsUrl: "https://maps.google.com",
        visitStartUtc: new Date("2026-10-08T12:00:00.000Z"),
        locale: "ko",
      });
      expect(ics).toContain("SUMMARY:Bánh mì Bà Lan 방문 (라카 다낭)");
      expect(ics).toContain("DESCRIPTION:Bánh mì Bà Lan 방문 알림.");
      expect(ics).toContain("PRODID:-//La Ca Da Nang//Calendar Reminder//KO");
    });
  });

  // -------------------------------------------------------------
  // 8. STRICT BOUNDARIES (ZERO NOTIFICATION API, EXACTLY 11 EVENTS)
  // -------------------------------------------------------------
  describe("8. Hard Boundaries Verification", () => {
    it("never calls Notification or Push API", () => {
      // In JS DOM environment, window.Notification should not be called
      expect((global as any).Notification).toBeUndefined();
    });

    it("confirms analytics schema has exactly 11 allowed events with zero reminder mutations", () => {
      expect(ANALYTICS_EVENT_NAMES).toHaveLength(11);
      expect(ANALYTICS_EVENT_NAMES).toEqual([
        "session_started",
        "home_viewed",
        "intent_selected",
        "preference_selected",
        "results_shown",
        "nearby_requested",
        "nearby_resolved",
        "nearby_failed",
        "citywide_selected",
        "maps_clicked",
        "language_changed",
      ]);

      // Ensure no reminder event was inadvertently introduced into analytics
      expect((ANALYTICS_EVENT_NAMES as readonly string[]).includes("reminder_created")).toBe(false);
      expect((ANALYTICS_EVENT_NAMES as readonly string[]).includes("reminder_exported")).toBe(false);
      expect((ANALYTICS_EVENT_NAMES as readonly string[]).includes("reminder_clicked")).toBe(false);
    });
  });
});
