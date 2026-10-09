import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { getNowSlot, NOW_TIME_ZONE, type NowData } from "@/lib/now/contract";
import { NowResults } from "@/components/itinerary/NowResults";
import { LocaleProvider, useLocale } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { translate } from "@/lib/i18n/messages";
import { apiPlace } from "./discovery-fixtures";

const instant = (time: string) => new Date(`2026-10-09T${time}:00+07:00`);
const data = (count = 2, locale: NowData["locale"] = "vi"): NowData => ({ locale, slot: "EVENING", timeZone: NOW_TIME_ZONE, evaluatedAt: instant("19:00").toISOString(), count,
  places: Array.from({ length: count }, (_, i) => apiPlace(i + 1)), meta: { source: "neon-postgres", policy: "time-slot-v1.1", openingHoursVerified: false } });
const response = (d = data()) => ({ ok: true, json: async () => ({ ok: true, data: d }) }) as Response;
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); localStorage.clear(); });

describe("Da Nang clock and real repository policy", () => {
  it.each([['05:59','NIGHT'],['06:00','MORNING'],['10:59','MORNING'],['11:00','MIDDAY'],['13:59','MIDDAY'],['14:00','AFTERNOON'],['17:29','AFTERNOON'],['17:30','EVENING'],['21:59','EVENING'],['22:00','NIGHT'],['00:00','NIGHT']])("%s -> %s", (time, slot) => expect(getNowSlot(instant(time))).toBe(slot));

});

describe("NOW lifecycle and truthful UI", () => {
  it("ends an aborted 15-second request with a retryable error", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url, options) => new Promise((_resolve,reject) => options.signal.addEventListener("abort", () => reject(new Error("aborted"))))));
    render(<NowResults onResetPreference={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    await act(async () => { await vi.advanceTimersByTimeAsync(15000); });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thử lại" })).toBeInTheDocument();
  });
  it("does not overwrite a new locale with an older response", async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY,"vi");
    let resolveOld!: (v: Response) => void;
    vi.stubGlobal("fetch",vi.fn().mockReturnValueOnce(new Promise<Response>(r => { resolveOld=r; })).mockResolvedValue(response(data(0,"en"))));
    function Switch() { const { setLocale }=useLocale(); return <button onClick={() => setLocale("en")}>switch</button>; }
    render(<LocaleProvider><Switch /><NowResults onResetPreference={vi.fn()} /></LocaleProvider>);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    fireEvent.click(screen.getByText("switch"));
    await screen.findByText(translate("en","now.EVENING"));
    await act(async () => { resolveOld(response(data(2,"vi"))); });
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText(translate("en","now.EVENING"))).toBeInTheDocument();
  });
  it.each([0,1,2,3])("renders %i real API stops with no padding or images", async count => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(data(count))));
    render(<NowResults onResetPreference={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Đang tìm địa điểm…");
    expect(await screen.findByRole("heading", { name: "Gợi ý cho buổi tối" })).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(count);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(count);
    if (count) expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "https://maps.google.com/?cid=901");
    expect(screen.queryByText(/Điểm Google/)).not.toBeInTheDocument();
    expect(screen.getByText(/Chưa xác minh giờ mở cửa/)).toBeInTheDocument();
  });
  it("shows an error with no demo fallback, then retries", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(response()));
    render(<NowResults onResetPreference={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(await screen.findByText("API fixture 1")).toBeInTheDocument();
  });
  it.each(["vi","en","ko"] as const)("localizes NOW chrome and request in %s", async locale => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(data(2,locale))));
    render(<LocaleProvider><NowResults onResetPreference={vi.fn()} /></LocaleProvider>);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    expect(await screen.findByText(translate(locale,"now.EVENING"))).toBeInTheDocument();
    expect(screen.getByText(translate(locale,"now.hours"))).toBeInTheDocument();
    expect(fetch).toHaveBeenLastCalledWith(`/api/now?locale=${locale}`,expect.objectContaining({cache:"no-store"}));
  });
  it("aborts on unmount and ignores a late response", async () => {
    let resolve!: (v: Response) => void;
    const fetchMock = vi.fn().mockReturnValueOnce(new Promise<Response>(r => { resolve = r; })).mockResolvedValue(response(data(0)));
    vi.stubGlobal("fetch",fetchMock);
    const first = render(<NowResults onResetPreference={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    first.unmount();
    expect(signal.aborted).toBe(true);
    render(<NowResults onResetPreference={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Xem gợi ý toàn Đà Nẵng|Show citywide suggestions|다낭 전체 추천 보기/ }));
    await screen.findByText("Chưa có gợi ý cho lựa chọn này.");
    await act(async () => { resolve(response()); });
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
