export type RentalCategory = "scooter" | "semi" | "manual";
export interface VehicleMedia { id: string; imageUrl: string; isPrimary: boolean; sortOrder: number; altText: string }
export interface RentalVehicle {
 code: string; brand: string; model: string; category: RentalCategory; engineCc: number;
 registrationYear: number; color: string; rawDailyPrice?: number; rawAssetDeposit?: string; dailyPriceVnd?: number; depositVnd?: number;
 media?: VehicleMedia[];
}

