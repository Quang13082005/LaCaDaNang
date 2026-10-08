import React from "react";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Hero } from "@/components/home/Hero";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { translate } from "@/lib/i18n/messages";

afterEach(() => localStorage.clear());
describe("Owner Dragon Bridge hero", () => {
  it.each(["vi", "en", "ko"] as const)("uses a local asset and one translated overlay in %s", (locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    render(<LocaleProvider><Hero /></LocaleProvider>);
    const image = screen.getByRole("img");
    expect(image.getAttribute("src")).toContain("da-nang-dragon-bridge.webp");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(translate(locale, "hero.description"))).toBeInTheDocument();
    const asset = readFileSync("public/images/hero/da-nang-dragon-bridge.webp");
    expect(asset.subarray(0, 4).toString()).toBe("RIFF");
    expect(asset.subarray(8, 12).toString()).toBe("WEBP");
    expect(asset.length).toBeLessThan(250000);
  });
});
