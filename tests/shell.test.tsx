import React from "react";
import { render, screen } from "@testing-library/react";
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
