import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "@/app/page";

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe("Phase 1 Visual Prototype <= 3-Tap UX Flow", () => {
  it("completes ĂN GÌ? flow in exactly 2 taps to see 3 recommendation cards", () => {
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

    // Results appear IMMEDIATELY after Tap 2
    expect(screen.getByText(/Gợi ý theo "Hẹn hò"/i)).toBeInTheDocument();
    expect(screen.getByText("Bếp Cuốn Đà Nẵng")).toBeInTheDocument();
    expect(screen.getByText("Cà Phê Trình — Bơ Cà Phê")).toBeInTheDocument();

    // 3 recommendation cards have CTAs to navigate (Tap 3 optional)
    const ctas = screen.getAllByRole("link", { name: /Đi ngay trên Google Maps/i });
    expect(ctas.length).toBe(3);
  });

  it("completes BÂY GIỜ LÀM GÌ? flow in exactly 2 taps to see a mini itinerary", () => {
    render(<HomePage />);

    // Tap 1: Select "BÂY GIỜ LÀM GÌ?"
    const nowCard = screen.getByText("BÂY GIỜ LÀM GÌ?");
    fireEvent.click(nowCard);

    // Preference chips expand
    expect(screen.getByText("Người yêu")).toBeInTheDocument();
    expect(screen.getByText("Bạn bè")).toBeInTheDocument();

    // Tap 2: Select "Người yêu"
    const loverChip = screen.getByText("Người yêu");
    fireEvent.click(loverChip);

    // Mini itinerary appears immediately after Tap 2
    expect(screen.getAllByText("Lịch trình tức thì").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/Buổi tối hẹn hò lãng mạn/i)
    ).toBeInTheDocument();

    // Verify stops rendered in vertical timeline
    expect(screen.getByText("18:45")).toBeInTheDocument();
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("21:15")).toBeInTheDocument();

    // Per-stop "Đi ngay" CTAs
    const stopCtas = screen.getAllByRole("link", {
      name: /Đi ngay chặng này/i,
    });
    expect(stopCtas.length).toBe(3);
  });

  it("allows switching intent and resetting preferences", () => {
    render(<HomePage />);

    // Tap 1: Select "ĐI ĐÂU?"
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();

    // Tap 2: Select "Biển / ngắm cảnh"
    fireEvent.click(screen.getByText("Biển / ngắm cảnh"));
    expect(screen.getByText("Bãi Biển Mỹ Khê")).toBeInTheDocument();

    // Reset via "Đổi tiêu chí"
    const resetBtn = screen.getByRole("button", { name: /Đổi tiêu chí/i });
    fireEvent.click(resetBtn);

    // Results close, preference chips remain ready for another selection
    expect(screen.queryByText("Bãi Biển Mỹ Khê")).not.toBeInTheDocument();
    expect(screen.getByText("Biển / ngắm cảnh")).toBeInTheDocument();
  });
});
