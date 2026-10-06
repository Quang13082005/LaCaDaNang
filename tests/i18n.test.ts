import { describe, expect, it } from "vitest";
import { localeFromLanguageTag, resolveLocale, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { translate, UI_MESSAGES } from "@/lib/i18n/messages";

describe("standalone UI locale resolution", () => {
  it.each([
    ["vi-VN", "vi"], ["en-US", "en"], ["en-GB", "en"],
    ["ko-KR", "ko"], [" EN-us ", "en"], ["ko", "ko"],
    ["en-US-u-ca-gregory", "en"],
  ])("maps %s to %s", (tag, expected) => {
    expect(localeFromLanguageTag(tag)).toBe(expected);
  });
  it.each(["", "de-DE", "en_US", "en-", "not a locale", null, 42, {}])("ignores malformed/unsupported input %j", tag => {
    expect(localeFromLanguageTag(tag)).toBeNull();
  });
  it("uses manual preference before device language", () => {
    expect(resolveLocale({ manual: "en", languages: ["ko-KR"], language: "vi-VN" })).toBe("en");
  });
  it("honors ordered preferences and ignores unsupported languages", () => {
    expect(resolveLocale({ languages: ["fr-FR", "ko-KR", "en-US"] })).toBe("ko");
  });
  it("ignores corrupt manual values and uses browser fallback", () => {
    expect(resolveLocale({ manual: "EN", languages: ["de-DE"], language: "en-GB" })).toBe("en");
    expect(resolveLocale({ manual: { locale: "ko" }, language: "vi-VN" })).toBe("vi");
  });
  it("returns to automatic mode when manual preference is cleared", () => {
    expect(resolveLocale({ manual: null, languages: ["ko-KR"] })).toBe("ko");
  });
  it("defaults to Vietnamese without browser inputs", () => {
    expect(resolveLocale()).toBe("vi");
    expect(resolveLocale({ languages: ["fr-FR"], language: "ja-JP" })).toBe("vi");
  });
});

describe("typed UI copy", () => {
  it("has complete nonempty dictionaries in all supported locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(UI_MESSAGES[locale]).sort()).toEqual(Object.keys(UI_MESSAGES.vi).sort());
      expect(Object.values(UI_MESSAGES[locale]).every(text => text.trim().length > 0)).toBe(true);
    }
  });
  it("retains sample meaning and truthful zero/one/two states", () => {
    expect(translate("en", "itinerary.sample")).toBe("Sample itinerary");
    expect(translate("vi", "results.zero")).toContain("Chưa có");
    expect(translate("en", "results.one")).toContain("1 suggestion");
    expect(translate("ko", "results.two")).toContain("2곳");
  });
});
