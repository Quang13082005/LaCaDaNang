import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";

describe("Phase 0 Base Shell", () => {
  it("renders the brand title and foundation badge", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "La Cà Đà Nẵng"
    );
    expect(screen.getByText(/Phase 0 · Foundation Shell/i)).toBeInTheDocument();
  });

  it("renders the design tokens verification card", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Kiểm tra Design Tokens/i })
    ).toBeInTheDocument();
    expect(screen.getByText("#0EA5E9")).toBeInTheDocument();
    expect(screen.getByText("#F97316")).toBeInTheDocument();
    expect(screen.getByText(/Be Vietnam Pro/i)).toBeInTheDocument();
  });
});
