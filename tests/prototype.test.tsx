import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "@/app/page";
import { getPlacesForSelection } from "@/data/demo-places";
import * as demoData from "@/data/demo-places";

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe("UX Hardening <= 3-Tap Flow & Truthful Recommendations", () => {
  it("completes ĂN GÌ? flow in exactly 2 taps with truthful 2 matches and no fallback padding", () => {
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

    // Results appear IMMEDIATELY after Tap 2 with context header
    expect(screen.getByText(/ĂN GÌ\? · Hẹn hò/i)).toBeInTheDocument();
    expect(screen.getByText("Có 2 gợi ý cho lựa chọn này.")).toBeInTheDocument();
    expect(screen.getByText("Bếp Cuốn Đà Nẵng")).toBeInTheDocument();
    expect(screen.getByText("Cà Phê Trình — Bơ Cà Phê")).toBeInTheDocument();

    // P0.1: No fallback padding! Exactly 2 places are shown, NOT 3
    expect(screen.queryByText("Mì Quảng Bà Mua")).not.toBeInTheDocument();

    // P0.3: No #1, #2 rank badges
    expect(screen.queryByText(/#1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/#2/i)).not.toBeInTheDocument();

    // P0.5: Verified Google Maps CTA label
    const verifiedCta = screen.getByRole("link", { name: /Xem trên Google Maps/i });
    expect(verifiedCta).toHaveAttribute(
      "href",
      "https://maps.google.com/?cid=15858543023798826021"
    );
  });

  it("completes BÂY GIỜ LÀM GÌ? flow with truthful 'Lịch trình mẫu' wording", () => {
    render(<HomePage />);

    // Tap 1: Select "BÂY GIỜ LÀM GÌ?"
    const nowCard = screen.getByText("BÂY GIỜ LÀM GÌ?");
    fireEvent.click(nowCard);

    // Preference chips expand
    expect(screen.getByText("Đi cùng người yêu")).toBeInTheDocument();
    expect(screen.getByText("Đi cùng bạn bè")).toBeInTheDocument();

    // Tap 2: Select "Đi cùng người yêu"
    const loverChip = screen.getByText("Đi cùng người yêu");
    fireEvent.click(loverChip);

    // Mini itinerary appears immediately after Tap 2
    expect(screen.getAllByText("Lịch trình mẫu").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/BÂY GIỜ LÀM GÌ\? · Đi cùng người yêu/i)
    ).toBeInTheDocument();

    // P0.4: No realtime false claims
    expect(screen.queryByText(/Gợi ý theo giờ/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/từ thời gian hiện tại/i)).not.toBeInTheDocument();

    // Order is stated once, without suggesting a clock time.
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("#3")).toBeInTheDocument();
    expect(screen.queryByText(/Chặng \d/)).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Mục đích khám phá" })).not.toBeInTheDocument();

    // Verified Maps CTA on Stop 1 (Bếp Cuốn)
    const stopCta = screen.getByRole("link", {
      name: /Xem trên Google Maps/i,
    });
    expect(stopCta).toHaveAttribute(
      "href",
      "https://maps.google.com/?cid=15858543023798826021"
    );
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

  it("allows resetting preferences via 'Đổi lựa chọn'", () => {
    render(<HomePage />);

    // Tap 1: Select "ĐI ĐÂU?"
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();

    // Tap 2: Select "Biển / ngắm cảnh"
    fireEvent.click(screen.getByText("Biển / ngắm cảnh"));
    expect(screen.getByText("Bãi Biển Mỹ Khê")).toBeInTheDocument();

    // Reset via "Đổi lựa chọn"
    const resetBtn = screen.getByRole("button", { name: /Đổi lựa chọn/i });
    fireEvent.click(resetBtn);

    // Results close, preference chips remain ready for another selection
    expect(screen.queryByText("Bãi Biển Mỹ Khê")).not.toBeInTheDocument();
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();
  });

  it("renders truthful 1 match message for STAY 'Gần trung tâm'", () => {
    render(<HomePage />);

    // Select Ở ĐÂU?
    fireEvent.click(screen.getByText("Ở ĐÂU?"));
    expect(screen.getByText("Gần trung tâm")).toBeInTheDocument();

    // Select "Gần trung tâm" (1 match: Haian Riverfront Hotel)
    fireEvent.click(screen.getByText("Gần trung tâm"));

    expect(screen.getByText(/Ở ĐÂU\? · Gần trung tâm/i)).toBeInTheDocument();
    expect(screen.getByText("Có 1 gợi ý cho lựa chọn này.")).toBeInTheDocument();
    expect(screen.getByText("Haian Riverfront Hotel")).toBeInTheDocument();

    // No unsupported fake price
    expect(screen.queryByText(/950.000/i)).not.toBeInTheDocument();
  });

  it("clears previous preference and results when switching intent directly", () => {
    render(<HomePage />);

    // Select EAT -> Hẹn hò
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    fireEvent.click(screen.getByText("Hẹn hò"));
    expect(screen.getByText("Bếp Cuốn Đà Nẵng")).toBeInTheDocument();

    // Restore selection UI, then switch to GO.
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));

    // Previous EAT results are cleared
    expect(screen.queryByText("Bếp Cuốn Đà Nẵng")).not.toBeInTheDocument();
    // New GO preferences are visible
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();
  });

  it("shows only the current decision and returns to Home when the active intent closes", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(screen.queryByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Hẹn hò"));
    expect(screen.queryByRole("region", { name: "Mục đích khám phá" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hẹn hò" })).not.toBeInTheDocument();
    expect(screen.queryByText("Phù hợp vì:")).not.toBeInTheDocument();
    expect(screen.queryByText("4.9")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    expect(screen.getByRole("button", { name: "Hẹn hò" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(screen.getByRole("heading", { name: "LA CÀ ĐÀ NẴNG" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hẹn hò" })).not.toBeInTheDocument();
  });

  it("keeps intent and preference context for zero results and restores the panel", () => {
    const selection = vi.spyOn(demoData, "getPlacesForSelection").mockReturnValue([]);
    try {
      render(<HomePage />);
      fireEvent.click(screen.getByText("ĂN GÌ?"));
      fireEvent.click(screen.getByText("Hẹn hò"));
      expect(screen.getByRole("heading", { name: "ĂN GÌ? · Hẹn hò" })).toBeInTheDocument();
      expect(screen.getByText("Chưa có gợi ý phù hợp tiêu chí này.")).toBeInTheDocument();
      expect(screen.queryAllByRole("article")).toHaveLength(0);
      expect(screen.queryByRole("region", { name: "Mục đích khám phá" })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
      expect(screen.getByRole("button", { name: "Hẹn hò" })).toBeInTheDocument();
      expect(screen.queryByRole("region", { name: "Kết quả gợi ý" })).not.toBeInTheDocument();
    } finally {
      selection.mockRestore();
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
