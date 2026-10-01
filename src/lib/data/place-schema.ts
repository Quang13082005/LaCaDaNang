import { z } from "zod";

export const CURATED_TAGS = [
  "DATE",
  "QUIET",
  "GROUP",
  "FAMILY",
  "PHOTO",
  "BEACH",
  "NIGHT",
  "CHEAP",
  "LOCAL_FOOD",
  "NATURE",
  "SCENIC",
  "SOLO",
  "LIVELY",
  "CAFE",
  "SEAFOOD",
  "SPECIALTY",
  "CENTRAL",
  "NEAR_BEACH",
  "POPULAR",
] as const;

export const TIME_TAGS = [
  "MORNING",
  "AFTERNOON",
  "EVENING",
  "LATE_NIGHT",
] as const;

export const CuratedTagSchema = z.enum(CURATED_TAGS);
export type CuratedTag = z.infer<typeof CuratedTagSchema>;

export const TimeTagSchema = z.enum(TIME_TAGS);
export type TimeTag = z.infer<typeof TimeTagSchema>;

export const CurationStatusSchema = z.enum([
  "AUTO_VERIFIED",
  "MANUAL_VERIFIED",
  "NEEDS_REVIEW",
]);
export type CurationStatus = z.infer<typeof CurationStatusSchema>;

export const SectionSchema = z.enum(["EAT", "GO", "STAY"]);
export type Section = z.infer<typeof SectionSchema>;

export const PlaceSchema = z.object({
  id: z.string().min(1, "Place ID cannot be empty"),
  name: z.string().min(2, "Place name must be at least 2 characters"),
  section: SectionSchema,
  primaryType: z.string().min(1, "Primary type is required"),
  address: z.string().min(5, "Address must be descriptive"),
  shortAddress: z.string().nullable().optional(),
  lat: z.number().min(15.5).max(16.5, "Latitude must be within Da Nang region"),
  lng: z.number().min(107.5).max(108.5, "Longitude must be within Da Nang region"),
  googleMapsUrl: z.string().url("Google Maps URL must be a valid URL"),
  rating: z.number().min(1).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  photoCount: z.number().min(0).optional(),
  imageUrl: z.string().nullable().optional(),
  priceLevel: z.string().nullable().optional(),
  curatedTags: z.array(CuratedTagSchema),
  manualReviewTags: z.array(CuratedTagSchema).optional(),
  curationStatus: CurationStatusSchema.default("AUTO_VERIFIED"),
  reasons: z.array(z.string().min(3)).min(1).max(4, "Must have 1 to 4 reasons"),
  timeTags: z.array(TimeTagSchema),
  typicalDurationMinutes: z.number().nullable().optional(),
  bestTimeOfDay: z.array(TimeTagSchema),
  featured: z.boolean(),
  distanceFromCenter: z.number().min(0).max(35, "Distance from center in km"),
  iconicException: z.boolean().optional(),
});

export type Place = z.infer<typeof PlaceSchema>;

export const CuratedSeedSchema = z.object({
  _meta: z.object({
    dataset: z.string(),
    version: z.string(),
    curatedAt: z.string(),
    totalPlaces: z.number(),
    counts: z.object({
      EAT: z.number(),
      GO: z.number(),
      STAY: z.number(),
    }),
    rulesApplied: z.array(z.string()),
    notes: z.string(),
  }),
  places: z.array(PlaceSchema),
});

export type CuratedSeed = z.infer<typeof CuratedSeedSchema>;
