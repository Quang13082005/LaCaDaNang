import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import * as demo from "@/data/demo-places";
import { apiResponse } from "./discovery-fixtures";

const cases = [
  ["GO", "ĐI ĐÂU?", "Chụp ảnh đẹp", "chup_anh_dep"],
  ["GO", "ĐI ĐÂU?", "Thiên nhiên", "thien_nhien"],
  ["GO", "ĐI ĐÂU?", "Vui chơi", "vui_choi"],
  ["GO", "ĐI ĐÂU?", "Biển / ngắm cảnh", "bien_ngam_canh"],
  ["STAY", "Ở ĐÂU?", "Gần biển", "gan_bien"],
  ["STAY", "Ở ĐÂU?", "Yên tĩnh", "yen_tinh"],
  ["STAY", "Ở ĐÂU?", "Trung tâm", "gan_trung_tam"],
  ["STAY", "Ở ĐÂU?", "Hẹn hò", "cap_doi"],
] as const;
function select(intentLabel: string, label: string) {
  fireEvent.click(screen.getByText(intentLabel));
  fireEvent.click(screen.getByRole("button", { name: label }));
}
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("GO/STAY real frontend", () => {
  it.each(cases)("%s / %s / %s keeps the preference ID and exact Maps URL", async (section, intentLabel, label, preference) => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(3, preference, section));
    const lookup = vi.spyOn(demo, "getPlacesForSelection");
    render(<HomePage />); select(intentLabel, label);
    await screen.findByText("API fixture 1");
    expect(fetch).toHaveBeenCalledWith(`/api/discovery?intent=${section}&locale=vi&preference=${preference}`, expect.objectContaining({ cache: "no-store", signal: expect.any(AbortSignal) }));
    expect(screen.getByRole("heading", { name: `${intentLabel} · ${label}` })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    screen.getAllByRole("article").forEach((card, index) => {
      expect(within(card).getByRole("link")).toHaveAttribute("href", `https://maps.google.com/?cid=${901 + index}`);
      expect(card.querySelector("img,picture")).toBeNull();
      expect(card).not.toHaveTextContent("Điểm Google");
      expect(card).not.toHaveTextContent("đánh giá");
    });
    expect(lookup).not.toHaveBeenCalled();
  });

  describe.each([cases[0], cases[4]])("%s lifecycle", (section, intentLabel, label, preference) => {
    it.each([0, 1, 2, 3])("renders exactly %i results, with empty distinct from error", async (count) => {
      vi.mocked(fetch).mockResolvedValue(apiResponse(count, preference, section));
      const lookup = vi.spyOn(demo, "getPlacesForSelection");
      render(<HomePage />); select(intentLabel, label);
      await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
      expect(screen.queryAllByRole("article")).toHaveLength(count);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      if (!count) expect(screen.getByText("Chưa có gợi ý phù hợp tiêu chí này.")).toBeInTheDocument();
      expect(lookup).not.toHaveBeenCalled();
    });
    it("waits for selection, then loading → error → retry → success, no demo fallback", async () => {
      let rejectRequest!: (reason: Error) => void;
      vi.mocked(fetch).mockReturnValueOnce(new Promise((_resolve, reject) => { rejectRequest = reject; })).mockResolvedValue(apiResponse(1, preference, section));
      const lookup = vi.spyOn(demo, "getPlacesForSelection");
      render(<HomePage />);
      fireEvent.click(screen.getByText(intentLabel));
      expect(fetch).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(screen.getByRole("status")).toHaveTextContent("Đang tìm địa điểm");
      expect(screen.queryAllByRole("article")).toHaveLength(0);
      await act(async () => rejectRequest(new Error("secret driver details")));
      expect(screen.getByRole("alert")).toHaveTextContent("Chưa tải được địa điểm");
      expect(screen.queryByText("Chưa có gợi ý phù hợp tiêu chí này.")).not.toBeInTheDocument();
      expect(screen.queryByText(/secret driver/)).not.toBeInTheDocument();
      expect(screen.queryAllByRole("article")).toHaveLength(0);
      expect(lookup).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
      await screen.findByText("API fixture 1");
    });
  });

  it("ignores a late GO response after switching to STAY and aborts the old request", async () => {
    let resolveOld!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; })).mockResolvedValueOnce(apiResponse(1, "cap_doi", "STAY"));
    render(<HomePage />); select("ĐI ĐÂU?", "Biển / ngắm cảnh");
    const signal = vi.mocked(fetch).mock.calls[0][1]?.signal;
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    select("Ở ĐÂU?", "Hẹn hò");
    expect(signal?.aborted).toBe(true);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    await screen.findByText("API fixture 1");
    await act(async () => resolveOld(apiResponse(3, "bien_ngam_canh", "GO")));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Ở ĐÂU? · Hẹn hò" })).toBeInTheDocument();
  });

  it.each(["duplicate", "wrong-section"])("rejects %s responses without rendering cards", async (kind) => {
    const response = apiResponse(2, "bien_ngam_canh", "GO");
    const body = await response.json();
    if (kind === "duplicate") body.data.places[1] = body.data.places[0];
    else body.data.places[0].section = "STAY";
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => body } as Response);
    render(<HomePage />); select("ĐI ĐÂU?", "Biển / ngắm cảnh");
    await screen.findByRole("alert");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
