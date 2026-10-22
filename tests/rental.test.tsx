import React from "react";
import { describe,it,expect,vi } from "vitest";
import { render,screen,fireEvent } from "@testing-library/react";
import { RentalCatalog } from "@/components/rental/RentalCatalog";
import previewVehicles from "@/lib/rental/vehicles.preview.json";
import { VehicleImage } from "@/components/rental/VehicleImage";
import { RentalSuggestion } from "@/components/rental/RentalSuggestion";
import { rentalCopy, formatVehicleColor } from "@/lib/rental/messages";
describe("rental review",()=>{
 it("preserves 21 physical vehicles, 8 models, category counts and decimal capacity",()=>{
  expect(previewVehicles).toHaveLength(21);expect(new Set(previewVehicles.map(v=>v.code)).size).toBe(21);
  expect(new Set(previewVehicles.map(v=>v.brand+v.model)).size).toBe(8);
  expect(['scooter','semi','manual'].map(c=>previewVehicles.filter(v=>v.category===c).length)).toEqual([10,10,1]);
  expect(previewVehicles.find(v=>v.code==='XE005')?.engineCc).toBe(124.8);
  expect(previewVehicles.filter(v=>v.model==='Vision').map(v=>v.rawDailyPrice)).toEqual([130,150,150]);
  expect(previewVehicles.every(v=>Object.keys(v).every(k=>!/[Pp]late|license/.test(k)))).toBe(true);
 });
 it("filters physical vehicles using truthful computed counts",()=>{
  render(<RentalCatalog onClose={vi.fn()} vehicles={previewVehicles as any}/>);fireEvent.click(screen.getByRole('button',{name:'Xe côn (1)'}));
  expect(screen.getByText('Yamaha Exciter')).toBeInTheDocument();expect(screen.queryByText('Honda Vision')).not.toBeInTheDocument();
 });
 it("shows approved daily price, approved deposit/contact and no fabricated image or exposed vehicle code",()=>{
  render(<RentalCatalog onClose={vi.fn()} vehicles={previewVehicles as any}/>);fireEvent.click(screen.getAllByText('Honda Vision')[0]);
  expect(screen.getByText('Hình ảnh xe đang được cập nhật')).toBeInTheDocument();
  expect(screen.getByText('130.000 VND')).toBeInTheDocument();
  expect(screen.getByText('2.000.000 VND')).toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Gọi điện'})).toHaveAttribute('href','tel:0931981789');
  expect(screen.getByRole('link',{name:'Liên hệ Zalo'})).toHaveAttribute('href','https://zalo.me/0931981789');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.queryByText(/XE001/)).not.toBeInTheDocument();
 });
 it("restores focus to the remounted card and restores catalog scroll without leaking vehicle code",()=>{
  render(<RentalCatalog onClose={vi.fn()} vehicles={previewVehicles as any}/>);
  const scroll=screen.getByTestId('rental-scroll');scroll.scrollTop=260;
  fireEvent.click(screen.getAllByText('Honda Vision')[0]);
  expect(screen.getByRole('heading',{level:1})).toHaveFocus();
  fireEvent.click(screen.getByRole('button',{name:'Quay lại'}));
  expect(screen.getByRole('button',{name:/Honda Vision.*2012/})).toHaveFocus();
  expect(scroll.scrollTop).toBe(260);
 });
 it("never guesses truncated source colour and localizes all colors",()=>{
  render(<RentalCatalog onClose={vi.fn()} vehicles={[previewVehicles[10] as any]}/>);fireEvent.click(screen.getByText('Yamaha Sirius'));
  expect(screen.getByText('Màu xe chưa đầy đủ')).toBeInTheDocument();
  expect(formatVehicleColor("Đỏ-Nâu", "vi")).toBe("Đỏ-Nâu");
  expect(formatVehicleColor("Đỏ-Nâu", "en")).toBe("Red-Brown");
  expect(formatVehicleColor("Đỏ-Nâu", "ko")).toBe("빨강-갈색");
  expect(formatVehicleColor("Đỏ-Nâu", "ru")).toBe("Красно-коричневый");
  expect(formatVehicleColor("Đỏ-Nâu", "zh")).toBe("红-棕");
  expect(formatVehicleColor("Red-Brown", "ru")).toBe("Красно-коричневый");
  expect(formatVehicleColor("Red-Brown", "zh")).toBe("红-棕");
  expect(formatVehicleColor("Xám-…", "vi")).toBe("Màu xe chưa đầy đủ");
  expect(formatVehicleColor("Xám-…", "en")).toBe("Colour details incomplete");
  expect(formatVehicleColor("Xám-…", "ko")).toBe("색상 정보 미완성");
  expect(formatVehicleColor("Xám-…", "ru")).toBe("Цвет уточняется");
  expect(formatVehicleColor("Xám-…", "zh")).toBe("颜色信息未完善");
 });
 it("retains reserved dimensions and falls back on failed real media",()=>{
  const media={id:'owner-photo',imageUrl:'https://example.invalid/approved.jpg',isPrimary:true,sortOrder:0,altText:'Owner photo'};
  const {container}=render(<VehicleImage media={media} label="Updating"/>);
  expect(container.firstChild).toHaveClass('aspect-[4/3]');fireEvent.error(screen.getByRole('img'));
  expect(screen.getByText('Updating')).toBeInTheDocument();expect(container.firstChild).toHaveClass('aspect-[4/3]');
 });
 it("supports ordered media for the selected physical vehicle",()=>{
  const vehicle={...previewVehicles[0],media:[{id:'second',imageUrl:'https://example.invalid/second.jpg',isPrimary:false,sortOrder:1,altText:'Second'},{id:'main',imageUrl:'https://example.invalid/main.jpg',isPrimary:true,sortOrder:0,altText:'Main'}]};
  render(<RentalCatalog onClose={vi.fn()} vehicles={[vehicle as any]}/>);fireEvent.click(screen.getByText('Honda Vision'));
  expect(screen.getByRole('img')).toHaveAttribute('src','https://example.invalid/main.jpg');fireEvent.click(screen.getByRole('button',{name:'Xem ảnh 2'}));
  expect(screen.getByRole('img')).toHaveAttribute('src','https://example.invalid/second.jpg');
 });
 it("never activates fixture promotion outside development",()=>{render(<RentalSuggestion/>);expect(screen.queryByRole('button')).not.toBeInTheDocument();});
 it("provides matching copy keys for all current locales",()=>{for(const l of ['en','ko'] as const)expect(Object.keys(rentalCopy(l)).sort()).toEqual(Object.keys(rentalCopy('vi')).sort());});
});
