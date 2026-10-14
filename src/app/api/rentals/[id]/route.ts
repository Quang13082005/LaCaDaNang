import {NextRequest,NextResponse} from "next/server";
import {readRentals,rentalUuid} from "@/lib/rental/repository";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest,context:{params:Promise<{id:string}>}){
 const {id}=await context.params;const p=request.nextUrl.searchParams;const locale=p.get("locale")??"vi";
 if(!rentalUuid.safeParse(id).success||!["vi","en","ko"].includes(locale)||[...p.keys()].some(k=>k!=="locale"||p.getAll(k).length!==1))return NextResponse.json({error:"INVALID_QUERY"},{status:400});
 try{const data=await readRentals(locale as "vi"|"en"|"ko",null,id);return NextResponse.json(data.vehicles.length?{vehicle:data.vehicles[0],contact:data.contact}:{error:"NOT_FOUND"},{status:data.vehicles.length?200:404,headers:{"Cache-Control":"no-store"}});}
 catch{return NextResponse.json({error:"RENTAL_UNAVAILABLE"},{status:503,headers:{"Cache-Control":"no-store"}});}
}
