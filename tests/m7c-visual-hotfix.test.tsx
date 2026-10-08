import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import HomePage from "@/app/page";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";

function setMockNavigator(languages: string[], language: string) {
  Object.defineProperty(navigator, "languages", {
    value: languages,
    configurable: true,
  });
  Object.defineProperty(navigator, "language", {
    value: language,
    configurable: true,
  });
}

function restoreMockNavigator() {
  Object.defineProperty(navigator, "languages", {
    value: ["vi-VN", "vi"],
    configurable: true,
  });
  Object.defineProperty(navigator, "language", {
    value: "vi-VN",
    configurable: true,
  });
}

describe("M7-C Hotfix: Intent Visuals & Footer Language Placement", () => {
  beforeEach(() => {
    localStorage.clear();
    setMockNavigator(["vi-VN"], "vi-VN");
    document.documentElement.lang = "vi";
  });

  afterEach(() => {
    localStorage.clear();
    restoreMockNavigator();
    vi.restoreAllMocks();
  });

  it("Issue 1: intent visual boxes render inline vector icons with NO broken img or alt text leakage", () => {
    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    // Verify all 4 intents exist
    expect(screen.getByText("BÂY GIỜ LÀM GÌ?")).toBeInTheDocument();
    expect(screen.getByText("ĂN GÌ?")).toBeInTheDocument();
    expect(screen.getByText("ĐI ĐÂU?")).toBeInTheDocument();
    expect(screen.getByText("Ở ĐÂU?")).toBeInTheDocument();

    // Verify ZERO broken img elements or unoptimized next/image tags inside intent cards
    const allImages = screen.queryAllByRole("img");
    // Any remaining img roles must only be emoji spans with role="img", not <img> tags
    const htmlImgTags = document.querySelectorAll("main button img");
    expect(htmlImgTags.length).toBe(0);

    // Verify SVGs are used for vectors with aria-hidden
    const svgs = document.querySelectorAll("main button svg");
    expect(svgs.length).toBeGreaterThanOrEqual(4);
  });

  it("Issue 2: footer utility row contains brand on left and language button on right", () => {
    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    // Verify brand text is inside footer
    const brandInFooter = footer.querySelector("span");
    expect(brandInFooter?.textContent?.trim()).toBe("LA CÀ ĐÀ NẴNG");

    // Verify LanguageSelector is inside footer
    const langBtn = footer.querySelector("button");
    expect(langBtn).toBeInTheDocument();
    expect(langBtn?.textContent).toContain("Tiếng Việt");

    // Verify layout classes: justify-between, flex-wrap
    const flexContainer = footer.querySelector("div");
    expect(flexContainer?.className).toContain("justify-between");
    expect(flexContainer?.className).toContain("flex-wrap");

    // Verify NO floating middle language selector in main content
    const mainSection = screen.getByRole("main");
    const langBtnInMain = mainSection.querySelector("button[aria-haspopup='dialog']");
    expect(langBtnInMain).toBeNull();
  });

  it("Issue 2: language trigger displays concise native label for VI, EN, and KO", () => {
    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    // Initial VI
    const trigger = screen.getByRole("button", { name: /Ngôn ngữ: Tiếng Việt/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger.textContent).toContain("Tiếng Việt");
    expect(trigger.className).toContain("min-h-[44px]");

    // Switch to EN
    fireEvent.click(trigger);
    const enOption = screen.getByRole("radio", { name: /English/i });
    fireEvent.click(enOption);

    // Verify button label updates to English
    const enTrigger = screen.getByRole("button", { name: /Language: English/i });
    expect(enTrigger).toBeInTheDocument();
    expect(enTrigger.textContent).toContain("English");

    // Switch to KO
    fireEvent.click(enTrigger);
    const koOption = screen.getByRole("radio", { name: /한국어/i });
    fireEvent.click(koOption);

    // Verify button label updates to 한국어
    const koTrigger = screen.getByRole("button", { name: /언어: 한국어/i });
    expect(koTrigger).toBeInTheDocument();
    expect(koTrigger.textContent).toContain("한국어");
  });

  it("Touch target ergonomics: language trigger satisfies >=44px touch target", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    const btn = screen.getByRole("button", { name: /Ngôn ngữ/i });
    expect(btn.className).toContain("min-h-[44px]");
    expect(btn.className).toContain("min-w-[44px]");
  });
});
