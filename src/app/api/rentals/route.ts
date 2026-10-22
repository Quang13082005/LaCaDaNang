import { NextRequest,NextResponse } from "next/server";
import {readRentals,rentalCategory} from "@/lib/rental/repository";
import {SUPPORTED_LOCALES, type SupportedLocale} from "@/lib/i18n/locales";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams;
 if([...p.keys()].some(k=>!["locale","category"].includes(k)||p.getAll(k).length!==1))return NextResponse.json({error:"INVALID_QUERY"},{status:400});
 const locale=(p.get("locale")??"vi") as SupportedLocale,category=p.get("category");
 if(!SUPPORTED_LOCALES.includes(locale)||(category!==null&&!rentalCategory.safeParse(category).success))return NextResponse.json({error:"INVALID_QUERY"},{status:400});
 try{return NextResponse.json(await readRentals(locale,category),{headers:{"Cache-Control":"no-store"}});}
 catch{return NextResponse.json({error:"RENTAL_UNAVAILABLE"},{status:503,headers:{"Cache-Control":"no-store"}});}
}
