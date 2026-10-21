import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";
import DesignSystemPage from "@/app/dev/design-system/page";

describe("Phase 1 Home & Design System Shell", () => {
  it("renders the real Home branding and 4 primary intents", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /LA CÀ ĐÀ NẴNG/i })
    ).toBeInTheDocument();
    expect(screen.getByText("ĂN GÌ?")).toBeInTheDocument();
    expect(screen.getByText("ĐI ĐÂU?")).toBeInTheDocument();
    expect(screen.getByText("BÂY GIỜ LÀM GÌ?")).toBeInTheDocument();
    expect(screen.getByText("Ở ĐÂU?")).toBeInTheDocument();

    // Footer directory links
    const eatLink = screen.getByRole("link", { name: "Ăn uống" });
    const cafeLink = screen.getByRole("link", { name: "Cà phê" });
    const goLink = screen.getByRole("link", { name: "Vui chơi" });
    const stayLink = screen.getByRole("link", { name: "Lưu trú" });
    expect(eatLink).toHaveAttribute("href", "/browse/eat");
    expect(cafeLink).toHaveAttribute("href", "/browse/cafe");
    expect(goLink).toHaveAttribute("href", "/browse/go");
    expect(stayLink).toHaveAttribute("href", "/browse/stay");

    // WebSite JSON-LD for Google Brand Recognition
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    expect(jsonLdScript).not.toBeNull();
    const parsed = JSON.parse(jsonLdScript?.textContent || "{}");
    expect(parsed["@type"]).toBe("WebSite");
    expect(parsed.name).toBe("La Cà Đà Nẵng");
    expect(parsed.alternateName).toContain("LaCaDaNang");
  });

  it("renders Home SEO intro on initial state and hides it when intent is selected", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Khám phá địa điểm Đà Nẵng cùng La Cà/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /Cách khám phá địa điểm nhanh chóng/i })
    ).toBeInTheDocument();

    // Selecting an intent hides HomeIntro so discovery flow is unobstructed
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    expect(
      screen.queryByRole("heading", { level: 2, name: /Khám phá địa điểm Đà Nẵng cùng La Cà/i })
    ).not.toBeInTheDocument();
  });

  it("renders the design system reference page", () => {
    render(<DesignSystemPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Locked Design Tokens/i })
    ).toBeInTheDocument();
    expect(screen.getByText("#0EA5E9")).toBeInTheDocument();
    expect(screen.getByText("#F97316")).toBeInTheDocument();
  });
});
