import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { googleCalendarUrl } from "@/lib/reminders/google-calendar";
import { ReminderSheet } from "@/components/reminders/ReminderSheet";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { REMINDERS_STORAGE_KEY } from "@/lib/reminders/storage";
import { parseDaNangWallClockToUtc } from "@/lib/reminders/time";
const place = { id: 1, name: "Quán A & B / 한글", googleMapsUrl: "https://maps.google.com/?cid=123&x=a%20b", tags: [], rating: null, reviewCount: null };
beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("Calendar mobile delivery", () => {
  it("encodes exact visit instant, proper name, Maps and trusted address without tokens or user data", () => {
    const url = new URL(googleCalendarUrl({ placeName: place.name, googleMapsUrl: place.googleMapsUrl,
      address: "12 A & B, Đà Nẵng", locale: "vi", visitStartUtc: parseDaNangWallClockToUtc("2026-10-10T19:00")! }));
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("dates")).toBe("20261010T120000Z/20261010T120000Z");
    expect(url.searchParams.get("ctz")).toBe("Asia/Ho_Chi_Minh");
    expect(url.searchParams.get("text")).toContain(place.name);
    expect(url.searchParams.get("details")).toContain(place.googleMapsUrl);
    expect(url.searchParams.get("location")).toBe("12 A & B, Đà Nẵng");
    expect([...url.searchParams.keys()].sort()).toEqual(["action", "ctz", "dates", "details", "location", "text"]);
  });
  it("omits absent location and rejects missing Maps or invalid time", () => {
    const options = { placeName: place.name, googleMapsUrl: place.googleMapsUrl, locale: "en" as const, visitStartUtc: new Date("2026-10-10T12:00:00Z") };
    expect(new URL(googleCalendarUrl(options)).searchParams.has("location")).toBe(false);
    expect(() => googleCalendarUrl({ ...options, googleMapsUrl: "" })).toThrow();
    expect(() => googleCalendarUrl({ ...options, visitStartUtc: new Date("invalid") })).toThrow();
  });
  it.each([
    ["vi", "Mở Google Calendar", "Tải lịch nhắc (.ics)"],
    ["en", "Open Google Calendar", "Download reminder (.ics)"],
    ["ko", "Google Calendar 열기", "알림 파일 다운로드 (.ics)"],
  ])("two explicit actions in %s; draft action never records a saved calendar", (locale, google, ics) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<LocaleProvider><ReminderSheet place={place} isOpen onClose={() => {}} /></LocaleProvider>);
    const primary = screen.getByRole("button", { name: google });
    expect(primary).toHaveClass("min-h-[48px]");
    expect(screen.getByRole("button", { name: ics })).toHaveClass("min-h-[48px]");
    fireEvent.click(primary);
    expect(open).toHaveBeenCalledWith(expect.stringContaining("https://calendar.google.com/calendar/render?"), "_blank", "noopener,noreferrer");
    expect(localStorage.getItem(REMINDERS_STORAGE_KEY)).toBeNull();
  });
  it("invalid custom time disables both actions", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    render(<LocaleProvider><ReminderSheet place={place} isOpen onClose={() => {}} /></LocaleProvider>);
    fireEvent.click(screen.getByRole("button", { name: /Chọn ngày & giờ/ }));
    fireEvent.change(screen.getByLabelText(/Chọn ngày & giờ/), { target: { value: "2020-01-01T10:00" } });
    expect(screen.getByRole("button", { name: "Mở Google Calendar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tải lịch nhắc (.ics)" })).toBeDisabled();
  });
});
