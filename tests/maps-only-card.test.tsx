import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { trackMapsClicked } from "@/lib/analytics/client";
vi.mock("@/lib/analytics/client", () => ({ trackMapsClicked: vi.fn() }));
afterEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });
describe("Maps-only place actions after Calendar removal", () => {
  for (const locale of ["vi", "en", "ko"] as const) {
    it.each(["NOW", "EAT", "GO", "STAY"] as const)(`${locale} %s keeps exact Maps and removes reminder controls`, (intent) => {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      const url = "https://maps.google.com/?cid=15858543023798826021";
      render(<LocaleProvider><PlaceCard place={{ id: 33, name: "Verified place", typeLabel: "", area: "", googleMapsUrl: url, rating: null, reviewCount: null }} intent={intent} preference="general" /></LocaleProvider>);
      const link = screen.getAllByRole("link").find(link => link.getAttribute("href") === url)!;
      expect(screen.getByRole("link", {name:"Verified place"})).toHaveAttribute("href", `/places/33${locale === "vi" ? "" : `?locale=${locale}`}`);
      expect(link).toHaveAttribute("href", url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(screen.queryAllByRole("button")).toHaveLength(0);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/Calendar|\.ics|Nhắc tôi|Remind me|알림 받기/i);
      fireEvent.click(link);
      expect(trackMapsClicked).toHaveBeenCalledWith(33, 1, intent, "general", locale, "manual", undefined, undefined);
    });
  }
});
