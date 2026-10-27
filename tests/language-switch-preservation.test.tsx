import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RentalCatalog } from "@/components/rental/RentalCatalog";
import { LocaleProvider, useLocale } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import HomePage from "@/app/page";
import type { RentalVehicle } from "@/lib/rental/types";
import { clearActiveRentalsCache } from "@/lib/rental/client";

const sampleVehiclesVi: RentalVehicle[] = [
  {
    code: "XE001",
    brand: "Honda",
    model: "Vision",
    category: "scooter",
    engineCc: 109.1,
    color: "Trắng",
    dailyPriceVnd: 150000,
    depositVnd: 2000000,
    media: [],
  },
  {
    code: "XE002",
    brand: "Yamaha",
    model: "Sirius",
    category: "semi",
    engineCc: 110.3,
    color: "Đỏ",
    dailyPriceVnd: 100000,
    depositVnd: 1000000,
    media: [],
  },
];

const sampleVehiclesEn: RentalVehicle[] = [
  {
    code: "XE001",
    brand: "Honda",
    model: "Vision",
    category: "scooter",
    engineCc: 109.1,
    color: "White",
    dailyPriceVnd: 150000,
    depositVnd: 2000000,
    media: [],
  },
  {
    code: "XE002",
    brand: "Yamaha",
    model: "Sirius",
    category: "semi",
    engineCc: 110.3,
    color: "Red",
    dailyPriceVnd: 100000,
    depositVnd: 1000000,
    media: [],
  },
];

const sampleVehiclesKo: RentalVehicle[] = [
  {
    code: "XE001",
    brand: "Honda",
    model: "Vision",
    category: "scooter",
    engineCc: 109.1,
    color: "흰색",
    dailyPriceVnd: 150000,
    depositVnd: 2000000,
    media: [],
  },
  {
    code: "XE002",
    brand: "Yamaha",
    model: "Sirius",
    category: "semi",
    engineCc: 110.3,
    color: "빨강",
    dailyPriceVnd: 100000,
    depositVnd: 1000000,
    media: [],
  },
];

function TestRentalApp() {
  const { locale } = useLocale();
  const vehicles =
    locale === "en"
      ? sampleVehiclesEn
      : locale === "ko"
      ? sampleVehiclesKo
      : sampleVehiclesVi;
  return <RentalCatalog onClose={() => {}} vehicles={vehicles} />;
}

describe("Language switch preservation across Catalog, Detail, and Intents", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    clearActiveRentalsCache();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    clearActiveRentalsCache();
    vi.restoreAllMocks();
  });

  it("Danh sách xe → đổi VI sang EN → vẫn ở danh sách xe", () => {
    render(
      <LocaleProvider>
        <TestRentalApp />
      </LocaleProvider>
    );

    // Initial state: VI catalog list
    expect(screen.getByRole("heading", { name: "Thuê xe máy Đà Nẵng" })).toBeInTheDocument();
    expect(screen.getByText("Honda Vision")).toBeInTheDocument();
    expect(screen.getByText("Yamaha Sirius")).toBeInTheDocument();

    // Open language selector in header
    const langBtn = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(langBtn);

    // Select English
    const enOption = screen.getByRole("radio", { name: "English" });
    fireEvent.click(enOption);

    // Verifies: Still in catalog list, title translated, vehicles present
    expect(screen.getByRole("heading", { name: "Motorbike rental in Da Nang" })).toBeInTheDocument();
    expect(screen.getByText("Honda Vision")).toBeInTheDocument();
    expect(screen.getByText("Yamaha Sirius")).toBeInTheDocument();
  });

  it("Danh sách xe → đổi EN sang KO → vẫn ở danh sách xe", () => {
    render(
      <LocaleProvider>
        <TestRentalApp />
      </LocaleProvider>
    );

    // Switch to EN first
    fireEvent.click(screen.getByRole("button", { name: /Ngôn ngữ/i }));
    fireEvent.click(screen.getByRole("radio", { name: "English" }));

    // Now switch from EN to KO
    const langBtn = screen.getByRole("button", { name: /Language/i });
    fireEvent.click(langBtn);
    const koOption = screen.getByRole("radio", { name: "한국어" });
    fireEvent.click(koOption);

    // Verifies: Still in catalog list in Korean
    expect(screen.getByRole("heading", { name: "다낭 오토바이 대여" })).toBeInTheDocument();
    expect(screen.getByText("Honda Vision")).toBeInTheDocument();
    expect(screen.getByText("Yamaha Sirius")).toBeInTheDocument();
  });

  it("Chi tiết xe A → đổi ngôn ngữ → vẫn là chi tiết xe A, không nhảy sang xe khác", () => {
    render(
      <LocaleProvider>
        <TestRentalApp />
      </LocaleProvider>
    );

    // Click on Honda Vision (XE001) to enter detail
    fireEvent.click(screen.getByText("Honda Vision"));

    // Verify detail is open for Honda Vision in VI
    expect(screen.getByRole("heading", { name: "Honda Vision", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("150.000 VND")).toBeInTheDocument();
    expect(screen.getByText("Trắng")).toBeInTheDocument();
    expect(screen.queryByText("Yamaha Sirius")).not.toBeInTheDocument();

    // Switch language to English
    const langBtn = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(langBtn);
    fireEvent.click(screen.getByRole("radio", { name: "English" }));

    // Verifies: Still in detail for XE001 (Honda Vision), translated to English, did NOT jump to Sirius or list
    expect(screen.getByRole("heading", { name: "Honda Vision", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("White")).toBeInTheDocument();
    expect(screen.queryByText("Yamaha Sirius")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();

    // Switch language to Korean
    const langBtnEn = screen.getByRole("button", { name: /Language/i });
    fireEvent.click(langBtnEn);
    fireEvent.click(screen.getByRole("radio", { name: "한국어" }));

    // Verifies: Still in detail for XE001 (Honda Vision), translated to Korean
    expect(screen.getByRole("heading", { name: "Honda Vision", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("흰색")).toBeInTheDocument();
    expect(screen.queryByText("Yamaha Sirius")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "뒤로" })).toBeInTheDocument();
  });

  it("Đang lọc danh sách xe → đổi ngôn ngữ → bộ lọc vẫn được giữ", () => {
    render(
      <LocaleProvider>
        <TestRentalApp />
      </LocaleProvider>
    );

    // Click filter 'Xe ga (1)'
    fireEvent.click(screen.getByRole("button", { name: /Xe ga \(1\)/i }));

    // Verify only scooter is shown
    expect(screen.getByText("Honda Vision")).toBeInTheDocument();
    expect(screen.queryByText("Yamaha Sirius")).not.toBeInTheDocument();

    // Switch to English
    const langBtn = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(langBtn);
    fireEvent.click(screen.getByRole("radio", { name: "English" }));

    // Verifies: Scooter filter remains active, only scooter is shown
    expect(screen.getByText("Honda Vision")).toBeInTheDocument();
    expect(screen.queryByText("Yamaha Sirius")).not.toBeInTheDocument();
    const activeFilter = screen.getByRole("button", { name: /Scooter \(1\)/i });
    expect(activeFilter).toHaveAttribute("aria-pressed", "true");
  });

  it("Đang ở EAT, GO, NOW và WHERE → đổi ngôn ngữ → vẫn ở đúng intent", () => {
    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    // Tap EAT intent card
    const eatBtn = screen.getByRole("button", { name: /ĂN GÌ\?/i });
    fireEvent.click(eatBtn);

    // Verify preference sheet for EAT is open (VI)
    expect(screen.getByText("Bạn muốn tìm chỗ thế nào?")).toBeInTheDocument();

    // Switch language to English via footer
    const footerLangBtn = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(footerLangBtn);
    fireEvent.click(screen.getByRole("radio", { name: "English" }));

    // Verify intent is STILL EAT, now in English ("What kind of place are you looking for?")
    expect(screen.getByText("What kind of place are you looking for?")).toBeInTheDocument();

    // Switch to Korean
    const footerLangBtnEn = screen.getByRole("button", { name: /Language/i });
    fireEvent.click(footerLangBtnEn);
    fireEvent.click(screen.getByRole("radio", { name: "한국어" }));

    // Verify intent is STILL EAT, now in Korean
    expect(screen.getByText("어떤 곳을 찾으시나요?")).toBeInTheDocument();

    // Switch to Russian
    const footerLangBtnKo = screen.getByRole("button", { name: /언어/i });
    fireEvent.click(footerLangBtnKo);
    fireEvent.click(screen.getByRole("radio", { name: "Русский" }));

    // Verify intent is STILL EAT, now in Russian
    expect(screen.getByText("Какое место вы ищете?")).toBeInTheDocument();

    // Switch to Simplified Chinese
    const footerLangBtnRu = screen.getByRole("button", { name: /Язык/i });
    fireEvent.click(footerLangBtnRu);
    fireEvent.click(screen.getByRole("radio", { name: "简体中文" }));

    // Verify intent is STILL EAT, now in Chinese
    expect(screen.getByText("您想找什么样的地方？")).toBeInTheDocument();
  });
});
