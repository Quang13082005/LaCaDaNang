import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { PlaceCard } from "@/components/results/PlaceCard";
import { discoveryToCard } from "@/lib/data/place-card-model";
import * as demo from "@/data/demo-places";
import { apiPlace, apiResponse } from "./discovery-fixtures";

function select(label = "Hẹn hò") {
  fireEvent.click(screen.getByText("ĂN GÌ?"));
  fireEvent.click(screen.getByRole("button", { name: label }));
}
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("EAT real-data frontend", () => {
  it("stays idle until preference, then shows loading with no cards or false empty state", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));
    render(<HomePage />);
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Hẹn hò" }));
    expect(screen.getByRole("status")).toHaveTextContent("Đang tìm địa điểm");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByText("Chưa có gợi ý phù hợp tiêu chí này.")).not.toBeInTheDocument();
  });

  it.each([0, 1, 2, 3])("renders exactly %i API places without padding", async (count) => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(count));
    const demoLookup = vi.spyOn(demo, "getPlacesForSelection");
    render(<HomePage />); select();
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
    expect(screen.queryAllByRole("article")).toHaveLength(count);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(demoLookup).not.toHaveBeenCalled();
    if (!count) expect(screen.getByText("Chưa có gợi ý phù hợp tiêu chí này.")).toBeInTheDocument();
    else expect(screen.getByText(`Có ${count} gợi ý cho lựa chọn này.`)).toBeInTheDocument();
  });

  it.each([["Ăn ngon", "an_ngon"], ["Đặc sản", "dac_san"], ["Hẹn hò", "hen_ho"]])("requests verified preference %s", async (label, preference) => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(1, preference));
    render(<HomePage />); select(label);
    await screen.findByText("API fixture 1");
    expect(fetch).toHaveBeenCalledWith(`/api/discovery?intent=EAT&locale=vi&preference=${preference}`, expect.objectContaining({ signal: expect.any(AbortSignal), cache: "no-store" }));
  });

  it.each(["http", "network", "invalid-json"])("shows %s error without demo fallback, permits retry", async (kind) => {
    const mock = vi.mocked(fetch);
    if (kind === "network") mock.mockRejectedValueOnce(new Error("private driver detail"));
    else if (kind === "invalid-json") mock.mockResolvedValueOnce({ ok: true, json: async () => { throw new Error("bad json"); } } as unknown as Response);
    else mock.mockResolvedValueOnce({ ok: false } as Response);
    mock.mockResolvedValue(apiResponse(1));
    const demoLookup = vi.spyOn(demo, "getPlacesForSelection");
    render(<HomePage />); select();
    expect(await screen.findByRole("alert")).toHaveTextContent("Chưa tải được địa điểm");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByText("Chưa có gợi ý phù hợp tiêu chí này.")).not.toBeInTheDocument();
    expect(screen.queryByText(/private driver detail/)).not.toBeInTheDocument();
    expect(demoLookup).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    await screen.findByText("API fixture 1");
  });

  it("aborts old selection and ignores late responses even if transport ignores abort", async () => {
    let resolveOld!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; })).mockResolvedValueOnce(apiResponse(1, "dac_san"));
    render(<HomePage />); select();
    const oldSignal = vi.mocked(fetch).mock.calls[0][1]?.signal;
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    expect(oldSignal?.aborted).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Đặc sản" }));
    await screen.findByText("API fixture 1");
    await act(async () => resolveOld(apiResponse(3)));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "ĂN GÌ? · Đặc sản" })).toBeInTheDocument();
  });

  it("ends a stalled request with a retryable error after the timeout", async () => {
    vi.useFakeTimers();
    try {
      vi.mocked(fetch).mockImplementation((_url, options) => new Promise((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
      }));
      render(<HomePage />); select();
      await act(async () => { vi.advanceTimersByTime(15000); });
      expect(screen.getByRole("alert")).toHaveTextContent("Chưa tải được địa điểm");
      expect(screen.getByRole("button", { name: "Thử lại" })).toBeInTheDocument();
      expect(screen.queryAllByRole("article")).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("clears successful cards immediately before a new request and on intent change", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(apiResponse(2)).mockReturnValueOnce(new Promise(() => {}));
    render(<HomePage />); select(); await screen.findByText("API fixture 1");
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    fireEvent.click(screen.getByRole("button", { name: "Ăn ngon" }));
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));
    expect(screen.queryByRole("region", { name: "Kết quả gợi ý" })).not.toBeInTheDocument();
  });
});

describe("No-image PlaceCard", () => {
  it("renders real text and exact Maps URL without image or invented optional text", () => {
    const place = discoveryToCard(apiPlace(1));
    const { container } = render(<PlaceCard place={place} />);
    const card = screen.getByRole("article");
    expect(within(card).getByRole("heading")).toHaveTextContent(place.name);
    expect(within(card).getByRole("link", { name: /Google Maps/ })).toHaveAttribute("href", place.googleMapsUrl);
    expect(container.querySelector("img,picture,svg image")).toBeNull();
    expect(card).not.toHaveTextContent("Điểm Google");
    expect(card).not.toHaveTextContent("đánh giá");
    expect(card).not.toHaveTextContent("Phù hợp vì");
  });
  it.each([[null, 12], [4.5, null], [0, 0]])("preserves independent nullable rating %s / reviews %s", (rating, reviewCount) => {
    render(<PlaceCard place={{ ...discoveryToCard(apiPlace(1)), rating, reviewCount }} />);
    expect(Boolean(screen.queryByText(/Điểm Google/))).toBe(rating !== null);
    expect(Boolean(screen.queryByText(/đánh giá/))).toBe(reviewCount !== null);
  });
});
