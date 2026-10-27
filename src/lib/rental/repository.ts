import { getNeonExecutor, type SqlQuery } from "@/lib/db/neon";
import { z } from "zod";
import type { SupportedLocale } from "@/lib/i18n/locales";

export const rentalUuid = z.string().uuid();
export const rentalCategory = z.enum(["scooter", "semi", "manual"]);
const mediaSchema = z.object({imageUrl:z.string().url().refine(s=>s.startsWith("https://")),altText:z.string(),isPrimary:z.boolean(),sortOrder:z.number().int().nonnegative()});
const vehicleSchema = z.object({
 publicId:rentalUuid,brand:z.string(),model:z.string(),category:rentalCategory,
 engineCc:z.coerce.number().positive(),
 color:z.string(),colorComplete:z.boolean(),dailyPriceVnd:z.number().int().positive(),
 depositVnd:z.number().int().nonnegative(),media:z.array(mediaSchema),
});
const contactSchema=z.object({phone:z.string().regex(/^\+[1-9][0-9]{7,14}$/),zaloUrl:z.string().regex(/^https:\/\/zalo\.me\/[0-9]+$/),policy:z.string(),helmetsIncluded:z.boolean()});
export type PublicRentalVehicle=z.infer<typeof vehicleSchema>;
export type RentalContact=z.infer<typeof contactSchema>;
export interface RentalData {vehicles:PublicRentalVehicle[];contact:RentalContact|null}

/** Public projection only. Strictly active=true records, no inactive bypass and no internal/raw fields. */
export async function readRentals(locale:SupportedLocale,category:string|null=null,id:string|null=null,query:SqlQuery=getNeonExecutor()):Promise<RentalData>{
 const rows=await query(`SELECT v.public_id AS "publicId",m.brand,m.model_name AS model,m.category,
 v.engine_cc AS "engineCc",
 CASE WHEN $1='ko' THEN COALESCE(NULLIF(v.color_ko,''),v.color_en,v.color_source)
 WHEN $1 IN ('en','ru','zh') THEN COALESCE(NULLIF(v.color_en,''),v.color_source)
 ELSE v.color_source END AS color,
 v.color_complete AS "colorComplete",v.daily_price_vnd AS "dailyPriceVnd",v.one_cccd_deposit_vnd AS "depositVnd",
 COALESCE((SELECT json_agg(json_build_object('imageUrl',x.image_url,'altText',x.alt_text,'isPrimary',x.is_primary,'sortOrder',x.sort_order)
 ORDER BY x.is_primary DESC,x.sort_order,x.id) FROM public.rental_vehicle_media x WHERE x.vehicle_id=v.id),'[]'::json) AS media
 FROM public.rental_vehicles v JOIN public.rental_vehicle_models m ON m.id=v.model_id
 WHERE v.active=true AND m.active=true AND ($2::text IS NULL OR m.category=$2)
 AND ($3::uuid IS NULL OR v.public_id=$3::uuid)
 ORDER BY m.brand,m.model_name,v.id`,[locale,category,id]);
 const vehicles=rows.map(r=>vehicleSchema.parse({...r,media:Array.isArray(r.media)?r.media.filter(m=>mediaSchema.safeParse(m).success):[]}));
 const contacts=await query(`SELECT phone_e164 AS phone,zalo_url AS "zaloUrl",helmets_included AS "helmetsIncluded",
 CASE WHEN $1='ko' THEN COALESCE(NULLIF(policy_ko,''),policy_en,policy_vi)
 WHEN $1 IN ('en','ru','zh') THEN COALESCE(NULLIF(policy_en,''),policy_vi)
 ELSE policy_vi END AS policy
 FROM public.rental_contact_settings WHERE id=1 AND active=true`,[locale]);
 return {vehicles,contact:contacts.length?contactSchema.parse(contacts[0]):null};
}
