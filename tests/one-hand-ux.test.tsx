import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HomePage from "@/app/page";
import { BottomActionBar } from "@/components/results/BottomActionBar";
import { ResultList } from "@/components/results/ResultList";
import { apiPlace, apiResponse } from "./discovery-fixtures";
import { discoveryToCard } from "@/lib/data/place-card-model";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(apiResponse(2)));
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
  window.scrollTo = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("M6-B Intent Position Stability & In-Place Accordion", () => {
  function getOrderedIntentLabels(container: HTMLElement): string[] {
    const section = container.querySelector("section[aria-label='Mục đích khám phá']");
    if (!section) return [];
    // Only IntentCards have h2 headings; MoodChips do not
    const buttons = Array.from(section.querySelectorAll("button")).filter((btn) =>
      btn.querySelector("h2")
    );
    return buttons.map((btn) => btn.querySelector("h2")?.textContent?.trim() || "");
  }

  it("renders 4 intents in initial order without selection", () => {
    const { container } = render(<HomePage />);
    const labels = getOrderedIntentLabels(container);
    expect(labels).toEqual(["BÂY GIỜ LÀM GÌ?", "ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?"]);
  });

  it("maintains stable DOM order when selecting EAT and opens accordion directly below EAT", () => {
    const { container } = render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));

    // DOM order must remain identical: NOW, EAT, GO, STAY
    const labels = getOrderedIntentLabels(container);
    expect(labels).toEqual(["BÂY GIỜ LÀM GÌ?", "ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?"]);

    // EAT card is marked selected
    const eatBtn = screen.getByRole("button", { name: /ĂN GÌ\?/i });
    expect(eatBtn).toHaveAttribute("aria-pressed", "true");

    // Preference panel is open with EAT chips
    expect(screen.getByRole("button", { name: "Ăn ngon" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đặc sản" })).toBeInTheDocument();

    // Verify preference panel is directly adjacent to EAT card wrapper
    const panel = container.querySelector("#preference-panel-active");
    expect(panel).toBeInTheDocument();
  });

  it("maintains stable DOM order when selecting GO and opens accordion directly below GO", () => {
    const { container } = render(<HomePage />);
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));

    // DOM order must remain identical: NOW, EAT, GO, STAY
    const labels = getOrderedIntentLabels(container);
    expect(labels).toEqual(["BÂY GIỜ LÀM GÌ?", "ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?"]);

    // GO card is marked selected
    const goBtn = screen.getByRole("button", { name: /ĐI ĐÂU\?/i });
    expect(goBtn).toHaveAttribute("aria-pressed", "true");

    // Preference panel is open with GO chips
    expect(screen.getByRole("button", { name: "Biển / ngắm cảnh" })).toBeInTheDocument();
  });

  it("maintains stable DOM order when selecting STAY without moving STAY to slot 1 (P0 fix)", () => {
    const { container } = render(<HomePage />);
    fireEvent.click(screen.getByText("Ở ĐÂU?"));

    // P0 Bug Regression Check: STAY MUST NOT jump to slot 1!
    // DOM order MUST stay: NOW, EAT, GO, STAY
    const labels = getOrderedIntentLabels(container);
    expect(labels).toEqual(["BÂY GIỜ LÀM GÌ?", "ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?"]);

    // STAY card is marked selected at position 4
    const stayBtn = screen.getByRole("button", { name: /Ở ĐÂU\?/i });
    expect(stayBtn).toHaveAttribute("aria-pressed", "true");

    // Preference panel opens in-place for STAY
    expect(screen.getByRole("button", { name: "Gần biển" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yên tĩnh" })).toBeInTheDocument();
  });

  it("keeps Hero stably mounted during intent selection state", () => {
    render(<HomePage />);
    // Hero heading exists before selection
    expect(screen.getByRole("heading", { level: 1, name: /LA CÀ ĐÀ NẴNG/i })).toBeInTheDocument();

    // Tap STAY
    fireEvent.click(screen.getByText("Ở ĐÂU?"));

    // Hero heading MUST stay mounted (Hero stability requirement)
    expect(screen.getByRole("heading", { level: 1, name: /LA CÀ ĐÀ NẴNG/i })).toBeInTheDocument();
  });
});

describe("M6-B Mobile BottomActionBar & State-Aware Actions", () => {
  it("renders citywide state: Primary = 'Gần tôi', Secondary = 'Đổi lựa chọn'", () => {
    const onToggleNearby = vi.fn();
    const onResetPreference = vi.fn();

    render(
      <BottomActionBar
        status="success"
        nearbyStatus="idle"
        onToggleNearby={onToggleNearby}
        onResetPreference={onResetPreference}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: /Gần tôi/ });
    const secondaryBtn = screen.getByRole("button", { name: /Đổi lựa chọn/ });

    expect(primaryBtn).toBeInTheDocument();
    expect(secondaryBtn).toBeInTheDocument();

    fireEvent.click(primaryBtn);
    expect(onToggleNearby).toHaveBeenCalledTimes(1);

    fireEvent.click(secondaryBtn);
    expect(onResetPreference).toHaveBeenCalledTimes(1);
  });

  it("renders requesting state: Primary = 'Đang định vị…' (disabled)", () => {
    render(
      <BottomActionBar
        status="success"
        nearbyStatus="requesting"
        onResetPreference={vi.fn()}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: /Đang định vị…/ });
    expect(primaryBtn).toBeDisabled();
  });

  it("renders nearby active state: Primary = 'Toàn Đà Nẵng', Secondary = 'Đổi lựa chọn'", () => {
    const onResetNearby = vi.fn();
    const onResetPreference = vi.fn();

    render(
      <BottomActionBar
        status="success"
        nearbyStatus="granted"
        onResetNearby={onResetNearby}
        onResetPreference={onResetPreference}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: /Toàn Đà Nẵng/ });
    const secondaryBtn = screen.getByRole("button", { name: /Đổi lựa chọn/ });

    expect(primaryBtn).toBeInTheDocument();
    expect(secondaryBtn).toBeInTheDocument();

    fireEvent.click(primaryBtn);
    expect(onResetNearby).toHaveBeenCalledTimes(1);
  });

  it("renders GPS denied state: Primary = 'Thử lại', Secondary = 'Đổi lựa chọn'", () => {
    const onRetryNearby = vi.fn();
    const onResetPreference = vi.fn();

    render(
      <BottomActionBar
        status="success"
        nearbyStatus="denied"
        onRetryNearby={onRetryNearby}
        onResetPreference={onResetPreference}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: "Thử lại" });
    const secondaryBtn = screen.getByRole("button", { name: "Đổi lựa chọn" });

    expect(primaryBtn).toBeInTheDocument();
    expect(secondaryBtn).toBeInTheDocument();

    fireEvent.click(primaryBtn);
    expect(onRetryNearby).toHaveBeenCalledTimes(1);
  });

  it("renders GPS timeout state: Primary = 'Thử lại'", () => {
    const onRetryNearby = vi.fn();

    render(
      <BottomActionBar
        status="success"
        nearbyStatus="timeout"
        onRetryNearby={onRetryNearby}
        onResetPreference={vi.fn()}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: "Thử lại" });
    fireEvent.click(primaryBtn);
    expect(onRetryNearby).toHaveBeenCalledTimes(1);
  });

  it("renders GPS inaccurate state: Primary = 'Thử lại'", () => {
    const onRetryNearby = vi.fn();

    render(
      <BottomActionBar
        status="success"
        nearbyStatus="inaccurate"
        onRetryNearby={onRetryNearby}
        onResetPreference={vi.fn()}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: "Thử lại" });
    fireEvent.click(primaryBtn);
    expect(onRetryNearby).toHaveBeenCalledTimes(1);
  });

  it("renders nearby empty state: Primary = 'Xem toàn Đà Nẵng', Secondary = 'Đổi lựa chọn'", () => {
    const onResetNearby = vi.fn();
    const onResetPreference = vi.fn();

    render(
      <BottomActionBar
        status="empty"
        nearbyStatus="granted"
        onResetNearby={onResetNearby}
        onResetPreference={onResetPreference}
      />
    );

    const primaryBtn = screen.getByRole("button", { name: /Xem toàn Đà Nẵng/ });
    const secondaryBtn = screen.getByRole("button", { name: /Đổi lựa chọn/ });

    expect(primaryBtn).toBeInTheDocument();
    expect(secondaryBtn).toBeInTheDocument();

    fireEvent.click(primaryBtn);
    expect(onResetNearby).toHaveBeenCalledTimes(1);
  });

  it("ensures ResultList has zero duplicated top navigation buttons on mobile", () => {
    const places = [discoveryToCard(apiPlace(1))];
    const { container } = render(
      <ResultList
        places={places}
        status="success"
        intentLabel="ĂN GÌ?"
        preferenceLabel="Ăn ngon"
        onResetPreference={vi.fn()}
        onToggleNearby={vi.fn()}
        nearbyStatus="idle"
      />
    );

    // The header region must NOT contain buttons
    const header = container.querySelector(".border-b");
    expect(header).toBeInTheDocument();
    const headerButtons = header?.querySelectorAll("button") || [];
    expect(headerButtons.length).toBe(0);

    // Exactly 1 'Gần tôi' and 1 'Đổi lựa chọn' button exists in the entire component (in BottomActionBar)
    expect(screen.getAllByRole("button", { name: /Gần tôi/ })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Đổi lựa chọn/ })).toHaveLength(1);
  });
});
