import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RemoteRentalCatalog } from "@/components/rental/RemoteRentalCatalog";
import { GET as getRentals } from "@/app/api/rentals/route";
import { GET as getRentalDetail } from "@/app/api/rentals/[id]/route";
import { NextRequest } from "next/server";
import * as rentalRepo from "@/lib/rental/repository";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Remote rental catalog lifecycle", () => {
  it("shows loading then truthful empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ vehicles: [], contact: null }),
      })
    );
    render(<RemoteRentalCatalog onClose={vi.fn()} />);
    expect(screen.getByRole("status")).toHaveTextContent("Đang tải");
    await screen.findByText("Chưa có xe được công khai.");
    expect(screen.queryByText("Honda Vision")).not.toBeInTheDocument();
  });

  it("shows error and retries without demo fallback", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ vehicles: [], contact: null }),
      });
    vi.stubGlobal("fetch", fetchMock);
    render(<RemoteRentalCatalog onClose={vi.fn()} />);
    await screen.findByRole("alert");
    expect(screen.queryByText("Honda Vision")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Thử lại"));
    await screen.findByText("Chưa có xe được công khai.");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("renders exact API price/deposit and hides inactive contact", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          vehicles: [
            {
              publicId: "c2a9a7a6-7788-466d-b87d-d419b4b005dc",
              brand: "Honda",
              model: "Vision",
              category: "scooter",
              engineCc: 109.1,
              registrationYear: 2023,
              color: "Đen",
              dailyPriceVnd: 147500,
              depositVnd: 2100000,
              media: [],
            },
          ],
          contact: null,
        }),
      })
    );
    render(<RemoteRentalCatalog onClose={vi.fn()} />);
    fireEvent.click(await screen.findByText("Honda Vision"));
    expect(screen.getByText("147.500 VND")).toBeInTheDocument();
    expect(screen.getByText("2.100.000 VND")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Gọi điện" })).not.toBeInTheDocument();
  });

  it("renders contact actions when contact is active", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          vehicles: [
            {
              publicId: "c2a9a7a6-7788-466d-b87d-d419b4b005dc",
              brand: "Honda",
              model: "Vision",
              category: "scooter",
              engineCc: 109.1,
              registrationYear: 2023,
              color: "Đen",
              dailyPriceVnd: 150000,
              depositVnd: 2000000,
              media: [],
            },
          ],
          contact: {
            phone: "+84905123456",
            zaloUrl: "https://zalo.me/0905123456",
            policy: "Miễn cọc khi có 2 CCCD",
            helmetsIncluded: true,
          },
        }),
      })
    );
    render(<RemoteRentalCatalog onClose={vi.fn()} />);
    fireEvent.click(await screen.findByText("Honda Vision"));
    expect(screen.getByRole("link", { name: "Gọi điện" })).toHaveAttribute("href", "tel:+84905123456");
    expect(screen.getByRole("link", { name: "Liên hệ Zalo" })).toHaveAttribute("href", "https://zalo.me/0905123456");
  });
});

describe("Public Rental API security and boundaries", () => {
  it("rejects invalid query parameters with 400", async () => {
    const req = new NextRequest("http://localhost/api/rentals?unknown_param=123");
    const res = await getRentals(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("INVALID_QUERY");
  });

  it("rejects invalid locale with 400", async () => {
    const req = new NextRequest("http://localhost/api/rentals?locale=fr");
    const res = await getRentals(req);
    expect(res.status).toBe(400);
  });

  it("accepts valid ru and zh locales with 200", async () => {
    vi.spyOn(rentalRepo, "readRentals").mockResolvedValue({ vehicles: [], contact: null });
    const reqRu = new NextRequest("http://localhost/api/rentals?locale=ru");
    const resRu = await getRentals(reqRu);
    expect(resRu.status).toBe(200);

    const reqZh = new NextRequest("http://localhost/api/rentals?locale=zh");
    const resZh = await getRentals(reqZh);
    expect(resZh.status).toBe(200);
  });

  it("detail route rejects invalid UUID with 400", async () => {
    const req = new NextRequest("http://localhost/api/rentals/not-a-uuid");
    const res = await getRentalDetail(req, { params: Promise.resolve({ id: "not-a-uuid" }) });
    expect(res.status).toBe(400);
  });

  it("detail route returns 404 when vehicle is inactive / not found", async () => {
    vi.spyOn(rentalRepo, "readRentals").mockResolvedValue({ vehicles: [], contact: null });
    const req = new NextRequest("http://localhost/api/rentals/c2a9a7a6-7788-466d-b87d-d419b4b005dc");
    const res = await getRentalDetail(req, {
      params: Promise.resolve({ id: "c2a9a7a6-7788-466d-b87d-d419b4b005dc" }),
    });
    expect(res.status).toBe(404);
  });

  it("public API returns clean public DTO without vehicle_code or internal IDs", async () => {
    vi.spyOn(rentalRepo, "readRentals").mockResolvedValue({
      vehicles: [
        {
          publicId: "c2a9a7a6-7788-466d-b87d-d419b4b005dc",
          brand: "Honda",
          model: "Vision",
          category: "scooter",
          engineCc: 109.1,
          registrationYear: 2023,
          color: "Đen",
          colorComplete: true,
          dailyPriceVnd: 150000,
          depositVnd: 2000000,
          media: [],
        },
      ],
      contact: null,
    });
    const req = new NextRequest("http://localhost/api/rentals?locale=vi");
    const res = await getRentals(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.vehicles).toHaveLength(1);
    const v = json.vehicles[0];
    expect(v.publicId).toBe("c2a9a7a6-7788-466d-b87d-d419b4b005dc");
    expect(v).not.toHaveProperty("vehicle_code");
    expect(v).not.toHaveProperty("id");
    expect(v).not.toHaveProperty("created_at");
  });
});
