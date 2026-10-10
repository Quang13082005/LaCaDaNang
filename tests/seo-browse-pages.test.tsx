import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { apiPlace } from "./discovery-fixtures";
vi.mock("@/lib/data/place-browse", () => ({ getBrowse: vi.fn(), listRelated: vi.fn() }));
vi.mock("@/lib/data/place-detail", () => ({ getPlace: vi.fn(), listPlaceIds: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: () => { throw Error("404"); }, permanentRedirect: (url: string) => { throw Error("308:" + url); } }));
import { getBrowse, listRelated } from "@/lib/data/place-browse";
import { getPlace } from "@/lib/data/place-detail";
import Hub, { generateMetadata } from "@/app/browse/[section]/page";
import Detail from "@/app/places/[id]/page";

const link = (id: number, over = {}) => ({ id, section: "EAT" as const, name: `Quán ${id}`, address: `${id} Bạch Đằng, Hải Châu`, areaName: "Hải Châu", ...over });
const props = (section: string, search: Record<string, string> = {}) => ({ params: Promise.resolve({ section }), searchParams: Promise.resolve(search) });
const data = (total: number, places = [link(1), link(2)]) => ({ total, pages: Math.max(1, Math.ceil(total / 100)), places });
const detailProps = { params: Promise.resolve({ id: "1501" }), searchParams: Promise.resolve({}) };
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv("SITE_URL", "https://lacadanang.quangdev.id.vn"); });

describe("directory hub route", () => {
  it("renders every listed place as a crawlable plain anchor to its canonical detail URL", async () => {
    vi.mocked(getBrowse).mockResolvedValue(data(2));
    const html = renderToStaticMarkup(await Hub(props("eat")));
    expect(html).toContain('href="/places/1"');
    expect(html).toContain('href="/places/2"');
    expect(html).toContain("Quán 1");
    expect(html).toContain("1 Bạch Đằng, Hải Châu");
    expect(html).toContain("<h1");
    expect(getBrowse).toHaveBeenCalledWith("EAT", "vi", 1);
  });
  it("keeps the locale on place links and does not duplicate an area already in the address", async () => {
    vi.mocked(getBrowse).mockResolvedValue(data(1, [link(5)]));
    const html = renderToStaticMarkup(await Hub(props("eat", { locale: "ko" })));
    expect(html).toContain('href="/places/5?locale=ko"');
    expect(html).not.toContain("Hải Châu · Hải Châu");
    expect(html).toContain('lang="ko"');
  });
  it("links all pages of a long listing so no page sits deep in the crawl", async () => {
    vi.mocked(getBrowse).mockResolvedValue(data(430));
    const html = renderToStaticMarkup(await Hub(props("go", { page: "2" })));
    for (const n of [1, 2, 3, 4, 5]) expect(html).toContain(`>${n}</a>`);
    expect(html).toContain('href="/browse/go"');
    expect(html).toContain('href="/browse/go?page=5"');
    expect(html).toContain('aria-current="page"');
  });
  it("offers all four section hubs, so CAFE venues are reachable without a Home UI entry", async () => {
    vi.mocked(getBrowse).mockResolvedValue(data(2));
    const html = renderToStaticMarkup(await Hub(props("eat")));
    for (const s of ["eat", "cafe", "go", "stay"]) expect(html).toContain(`href="/browse/${s}"`);
  });
  it("404s unknown slugs and empty or out-of-range listings, without querying for unknown slugs", async () => {
    await expect(Hub(props("bar"))).rejects.toThrow("404");
    await expect(Hub(props("constructor"))).rejects.toThrow("404");
    expect(getBrowse).not.toHaveBeenCalled();
    vi.mocked(getBrowse).mockResolvedValue(data(0, []));
    await expect(Hub(props("eat"))).rejects.toThrow("404");
    vi.mocked(getBrowse).mockResolvedValue(data(150));
    await expect(Hub(props("eat", { page: "3" }))).rejects.toThrow("404");
  });
  it.each([
    [{ page: "0" }, "/browse/eat"], [{ page: "1" }, "/browse/eat"], [{ page: "abc" }, "/browse/eat"],
    [{ locale: "vi" }, "/browse/eat"], [{ locale: "xx" }, "/browse/eat"], [{ utm_source: "x" }, "/browse/eat"],
    [{ locale: "en", page: "1" }, "/browse/eat?locale=en"], [{ locale: "ko", utm: "x", page: "2" }, "/browse/eat?locale=ko&page=2"],
  ])("redirects non-canonical query %j to %s", async (search, target) => {
    vi.mocked(getBrowse).mockResolvedValue(data(250));
    await expect(Hub(props("eat", search))).rejects.toThrow("308:" + target);
  });
  it("emits a self-referencing canonical, reciprocal hreflang and a truthful description", async () => {
    vi.mocked(getBrowse).mockResolvedValue(data(250));
    const meta = await generateMetadata(props("eat", { locale: "en", page: "2" }));
    expect(meta.alternates?.canonical).toBe("https://lacadanang.quangdev.id.vn/browse/eat?locale=en&page=2");
    expect(meta.alternates?.languages).toEqual({
      vi: "https://lacadanang.quangdev.id.vn/browse/eat?page=2",
      en: "https://lacadanang.quangdev.id.vn/browse/eat?locale=en&page=2",
      ko: "https://lacadanang.quangdev.id.vn/browse/eat?locale=ko&page=2",
    });
    expect(String(meta.title)).toContain("page 2");
    expect(String(meta.description)).toContain("250");
    expect(meta.robots).toBeUndefined();
  });
});

describe("related links on the place detail page", () => {
  it("renders same-area peers (including other sections) as anchors under the venue", async () => {
    vi.mocked(getPlace).mockResolvedValue(apiPlace(1501, "EAT"));
    vi.mocked(listRelated).mockResolvedValue([link(2), link(3, { section: "CAFE" })]);
    const html = renderToStaticMarkup(await Detail(detailProps));
    expect(listRelated).toHaveBeenCalledWith(expect.objectContaining({ id: 1501 }), "vi");
    expect(html).toContain("Địa điểm khác ở Phường kiểm thử");
    expect(html).toContain('href="/places/2"');
    expect(html).toContain('href="/places/3"');
  });
  it("omits the block when there are no peers", async () => {
    vi.mocked(getPlace).mockResolvedValue(apiPlace(1501, "EAT"));
    vi.mocked(listRelated).mockResolvedValue([]);
    const html = renderToStaticMarkup(await Detail(detailProps));
    expect(html).not.toContain("Địa điểm khác ở");
  });
  it("logs and still serves the venue when the supplementary query fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getPlace).mockResolvedValue(apiPlace(1501, "EAT"));
    vi.mocked(listRelated).mockRejectedValue(new Error("db down"));
    const html = renderToStaticMarkup(await Detail(detailProps));
    expect(html).toContain("API fixture 1501");
    expect(log).toHaveBeenCalledWith("place_related_links_failed", expect.objectContaining({ placeId: 1501 }));
    log.mockRestore();
  });
});
