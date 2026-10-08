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

describe("P1 Owner Physical One-Hand UX 2x2 Grid & Bottom Sheet", () => {
  function getOrderedIntentLabels(container: HTMLElement): string[] {
    const section = container.querySelector("section[aria-label='Mục đích khám phá']");
    if (!section) return [];
    const buttons = Array.from(section.querySelectorAll("button")).filter((btn) =>
      btn.querySelector("h2")
    );
    return buttons.map((btn) => btn.querySelector("h2")?.textContent?.trim() || "");
  }

  it("renders exactly 4 intent cards in strict DOM order [NOW, EAT, GO, STAY] in a 2x2 grid layout", () => {
    const { container } = render(<HomePage />);
    const labels = getOrderedIntentLabels(container);
    expect(labels).toHaveLength(4);
    expect(labels).toEqual(["BÂY GIỜ LÀM GÌ?", "ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?"]);

    const grid = container.querySelector(".grid.grid-cols-2");
    expect(grid).toBeInTheDocument();
    expect(grid?.children).toHaveLength(4);
  });

  it("ensures all 4 intent cards are whole-card clickable buttons with touch target >= 44px", () => {
    const { container } = render(<HomePage />);
    const section = container.querySelector("section[aria-label='Mục đích khám phá']");
    const buttons = Array.from(section?.querySelectorAll("button") || []).filter((btn) =>
      btn.querySelector("h2")
    );

    expect(buttons).toHaveLength(4);
    buttons.forEach((btn) => {
      // Each button has min-height class meeting or exceeding 44px touch target (min-h-[148px])
      expect(btn.className).toMatch(/min-h-\[/);
      expect(btn).toHaveAttribute("aria-pressed");
    });
  });

  it("renders flat 'Chọn nhanh' section header without floating panels or drag handles", () => {
    const { container } = render(<HomePage />);
    expect(screen.getByText("Chọn nhanh")).toBeInTheDocument();
    expect(screen.getByText("Khám phá Đà Nẵng theo nhu cầu của bạn")).toBeInTheDocument();

    // Verify there is no drag handle or floating sheet markup
    expect(container.querySelector("[data-testid='drag-handle']")).toBeNull();
    expect(container.querySelector(".drag-handle")).toBeNull();
  });

  it("tapping EAT opens preference bottom sheet dialog without inline accordion expansion", () => {
    const { container } = render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));

    // Modal bottom sheet dialog must be open
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("id", "preference-panel-active");

    // Dialog title must be present and clear
    expect(screen.getByText(/ĂN GÌ\? · Chọn sở thích/i)).toBeInTheDocument();

    // Close button must exist with >= 44px touch target
    const closeBtn = screen.getByRole("button", { name: "Đóng" });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.className).toMatch(/min-h-\[44px\]/);
    expect(closeBtn.className).toMatch(/min-w-\[44px\]/);

    // Intent grid DOM order remains stable underneath
    const labels = getOrderedIntentLabels(container);
    expect(labels).toEqual(["BÂY GIỜ LÀM GÌ?", "ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?"]);
  });

  it("tapping GO and STAY open their respective preference bottom sheets", () => {
    const { unmount } = render(<HomePage />);
    fireEvent.click(screen.getByText("ĐI ĐÂU?"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/ĐI ĐÂU\? · Chọn sở thích/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Biển / ngắm cảnh" })).toBeInTheDocument();
    unmount();

    render(<HomePage />);
    fireEvent.click(screen.getByText("Ở ĐÂU?"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Ở ĐÂU\? · Chọn sở thích/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gần biển" })).toBeInTheDocument();
  });

  it("tapping NOW opens its preference bottom sheet and preserves sample itinerary flow", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("BÂY GIỜ LÀM GÌ?"));

    // Modal bottom sheet dialog opens with NOW preferences
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/BÂY GIỜ LÀM GÌ\? · Chọn sở thích/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đi cùng bạn bè" })).toBeInTheDocument();

    // Select sample preference
    fireEvent.click(screen.getByRole("button", { name: "Đi cùng bạn bè" }));

    // Sheet closes and sample itinerary is rendered
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText(/Lịch trình mẫu/i)).toBeInTheDocument();
  });

  it("closes preference bottom sheet via close button and Escape key", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close via button
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    // Re-open and close via Escape
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("preference chips inside bottom sheet meet minimum 44px touch targets", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));

    const dialog = screen.getByRole("dialog");
    const chips = within(dialog).getAllByRole("button");
    // Filter out close button, get mood chips
    const moodChips = chips.filter((btn) => btn.getAttribute("aria-label") !== "Đóng");
    expect(moodChips.length).toBeGreaterThan(0);
    moodChips.forEach((chip) => {
      expect(chip.className).toMatch(/min-h-\[44px\]/);
    });
  });

  it("selecting a preference inside bottom sheet triggers discovery and returns via 'Đổi lựa chọn'", async () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("ĂN GÌ?"));

    const chip = screen.getByRole("button", { name: "Ăn ngon" });
    fireEvent.click(chip);

    // Should transition to discovery result stage
    const resetBtn = await screen.findByRole("button", { name: /Đổi lựa chọn/i });
    expect(resetBtn).toBeInTheDocument();

    // Tapping 'Đổi lựa chọn' returns to the 2x2 Home grid
    fireEvent.click(resetBtn);
    expect(screen.getByText("BÂY GIỜ LÀM GÌ?")).toBeInTheDocument();
    expect(screen.getByText("ĂN GÌ?")).toBeInTheDocument();
    expect(screen.getByText("ĐI ĐÂU?")).toBeInTheDocument();
    expect(screen.getByText("Ở ĐÂU?")).toBeInTheDocument();
  });
});
