import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HomePage from "@/app/page";
import { getPlacesForSelection } from "@/data/demo-places";
import { apiResponse } from "./discovery-fixtures";

beforeEach(() => vi.stubGlobal("fetch", vi.fn().mockResolvedValue(apiResponse())));
afterEach(() => vi.unstubAllGlobals());

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe("UX Hardening <= 3-Tap Flow & Truthful Recommendations", () => {
  it("completes ĂN GÌ? flow in exactly 2 taps with truthful 2 matches and no fallback padding", async () => {
    render(<HomePage />);

    // Initial state: no results visible
    expect(screen.queryByText(/Đề xuất chọn lọc/i)).not.toBeInTheDocument();

    // Tap 1: Select "ĂN GÌ?"
    const eatCard = screen.getByText("ĂN GÌ?");
    fireEvent.click(eatCard);

    // Preference chips expand on the same page
    expect(screen.getByText("Hẹn hò")).toBeInTheDocument();
    expect(screen.getByText("Đặc sản")).toBeInTheDocument();

    // Tap 2: Select "Hẹn hò"
    const dateChip = screen.getByText("Hẹn hò");
    fireEvent.click(dateChip);

    // Context appears after Tap 2; cards arrive asynchronously from API
    expect(screen.getByText(/ĂN GÌ\? · Hẹn hò/i)).toBeInTheDocument();
    expect(await screen.findByText("Có 2 gợi ý cho lựa chọn này.")).toBeInTheDocument();
    expect(await screen.findByText("API fixture 1")).toBeInTheDocument();
    expect(screen.getByText("API fixture 2")).toBeInTheDocument();

    // P0.1: No fallback padding! Exactly 2 places are shown, NOT 3
    expect(screen.queryByText("Mì Quảng Bà Mua")).not.toBeInTheDocument();

    // P0.3: No #1, #2 rank badges
    expect(screen.queryByText(/#1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/#2/i)).not.toBeInTheDocument();

    // P0.5: Verified Google Maps CTA label
    const verifiedCta = screen.getAllByRole("link", { name: /Xem trên Google Maps/i })[0];
    expect(verifiedCta).toHaveAttribute(
      "href",
      "https://maps.google.com/?cid=901"
    );
  });

  it("starts real NOW in one tap and returns Home without a demo preference", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    render(<HomePage />);
    fireEvent.click(screen.getByText("BÂY GIỜ LÀM GÌ?"));
    expect(fetch).toHaveBeenCalledWith("/api/now?locale=vi", expect.objectContaining({ cache: "no-store" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent("Chưa tải được địa điểm.");
    expect(screen.queryByText("Lịch trình mẫu")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    expect(screen.getByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles 0, 1, 2, and 3+ match counts truthfully in getPlacesForSelection", () => {
    // 0 matches
    const zeroMatch = getPlacesForSelection("EAT", "non_existent_tag");
    expect(zeroMatch.length).toBe(0);

    // 1 match
    const oneMatch = getPlacesForSelection("STAY", "gan_trung_tam");
    expect(oneMatch.length).toBe(1);
    expect(oneMatch[0].name).toBe("Haian Riverfront Hotel");

    // 2 matches
    const twoMatches = getPlacesForSelection("EAT", "dac_san");
    expect(twoMatches.length).toBe(2);

    // 3+ matches (capped at 3)
    const threeMatches = getPlacesForSelection("EAT", "an_ngon");
    expect(threeMatches.length).toBe(3);
  });

  it("allows resetting preferences via 'Đổi lựa chọn'", async () => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(3, "bien_ngam_canh", "GO"));
    render(<HomePage />);

    // Tap 1: Select "ĐI ĐÂU?"
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();

    // Tap 2: Select "Biển / ngắm cảnh"
    fireEvent.click(screen.getByText("Biển / ngắm cảnh"));
    expect(await screen.findByText("API fixture 1")).toBeInTheDocument();

    // Reset via "Đổi lựa chọn"
    const resetBtn = screen.getByRole("button", { name: /Đổi lựa chọn/i });
    fireEvent.click(resetBtn);

    // Results close, preference chips remain ready for another selection
    expect(screen.queryByText("API fixture 1")).not.toBeInTheDocument();
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();
  });

  it("renders truthful 1 API match for STAY 'Trung tâm' with the original ID", async () => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(1, "gan_trung_tam", "STAY"));
    render(<HomePage />);

    // Select Ở ĐÂU?
    fireEvent.click(screen.getByText("Ở ĐÂU?"));
    expect(screen.getByText("Trung tâm")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Trung tâm"));

    expect(screen.getByText(/Ở ĐÂU\? · Trung tâm/i)).toBeInTheDocument();
    expect(await screen.findByText("Có 1 gợi ý cho lựa chọn này.")).toBeInTheDocument();
    expect(screen.getByText("API fixture 1")).toBeInTheDocument();

    // No unsupported fake price
    expect(screen.queryByText(/950.000/i)).not.toBeInTheDocument();
  });

  it("clears previous preference and results when switching intent directly", async () => {
    render(<HomePage />);

    // Select EAT -> Hẹn hò
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    fireEvent.click(screen.getByText("Hẹn hò"));
    expect(await screen.findByText("API fixture 1")).toBeInTheDocument();

    // Restore selection UI, then switch to GO.
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));

    // Previous EAT results are cleared
    expect(screen.queryByText("API fixture 1")).not.toBeInTheDocument();
    // New GO preferences are visible
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();
  });

  it("shows only the current decision and returns to Home when the active intent closes", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    // M6-B Hero stability: Hero stays mounted during intent selection to prevent layout shift
    expect(screen.getByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hẹn hò"));
    expect(screen.queryByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Mục đích khám phá" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hẹn hò" })).not.toBeInTheDocument();
    expect(screen.queryByText("Phù hợp vì:")).not.toBeInTheDocument();
    expect(screen.queryByText("4.9")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    expect(screen.getByRole("button", { name: "Hẹn hò" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(screen.getByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hẹn hò" })).not.toBeInTheDocument();
  });

  it("keeps intent and preference context for zero results and restores the panel", async () => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(0));
    try {
      render(<HomePage />);
      fireEvent.click(screen.getByText("ĂN GÌ?"));
      fireEvent.click(screen.getByText("Hẹn hò"));
      expect(screen.getByRole("heading", { name: "ĂN GÌ? · Hẹn hò" })).toBeInTheDocument();
      expect(await screen.findByText("Chưa có gợi ý phù hợp tiêu chí này.")).toBeInTheDocument();
      expect(screen.queryAllByRole("article")).toHaveLength(0);
      expect(screen.queryByRole("region", { name: "Mục đích khám phá" })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
      expect(screen.getByRole("button", { name: "Hẹn hò" })).toBeInTheDocument();
      expect(screen.queryByRole("region", { name: "Kết quả gợi ý" })).not.toBeInTheDocument();
    } finally {
      vi.mocked(fetch).mockReset();
    }
  });

  it.each([true, false])("respects reduced motion (%s) on selection, results and reset", (reduced) => {
    const media = vi.spyOn(window, "matchMedia").mockReturnValue({ matches: reduced } as MediaQueryList);
    try {
      render(<HomePage />);
      fireEvent.click(screen.getByText("ĂN GÌ?"));
      fireEvent.click(screen.getByText("Hẹn hò"));
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: reduced ? "auto" : "smooth" });
      fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: reduced ? "auto" : "smooth" });
    } finally {
      media.mockRestore();
    }
  });
});
