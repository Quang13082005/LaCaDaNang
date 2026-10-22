"use client";
import {useEffect,useState} from "react";
import {useLocale} from "@/components/i18n/LocaleProvider";
import type {RentalData} from "@/lib/rental/repository";
import {RentalCatalog} from "./RentalCatalog";

const copy={vi:{loading:"Đang tải danh sách xe…",empty:"Chưa có xe được công khai.",error:"Không tải được danh sách xe.",retry:"Thử lại",back:"Trở lại",source:"Dữ liệu Neon · chỉ xe đã được công khai"},en:{loading:"Loading vehicles…",empty:"No vehicles are published yet.",error:"Unable to load vehicles.",retry:"Retry",back:"Back",source:"Neon data · published vehicles only"},ko:{loading:"차량 목록 불러오는 중…",empty:"아직 공개된 차량이 없습니다.",error:"차량을 불러올 수 없습니다.",retry:"다시 시도",back:"뒤로",source:"Neon 데이터 · 공개된 차량만 표시"}};
export function RemoteRentalCatalog({onClose}:{onClose:()=>void}){
 const {locale}=useLocale();const t=(copy as Record<string, typeof copy.vi>)[locale] ?? copy.en;
 const [state,setState]=useState<{locale:string;data?:RentalData;error?:boolean}>({locale});
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();let current=true;
  setState({locale});
  const timeout=setTimeout(()=>controller.abort(),15000);
  fetch(`/api/rentals?locale=${locale}`,{signal:controller.signal,cache:"no-store"}).then(async response=>{
   if(!response.ok)throw new Error("Unavailable");
   const data:RentalData=await response.json();
   if(!Array.isArray(data.vehicles))throw new Error("Invalid response");
   if(current)setState({locale,data});
  }).catch(()=>{if(current)setState({locale,error:true});}).finally(()=>clearTimeout(timeout));
  return()=>{current=false;controller.abort();clearTimeout(timeout);};
 },[locale,attempt]);
 const data=state.locale===locale?state.data:undefined;
 if(data?.vehicles.length)return <RentalCatalog onClose={onClose} notice={t.source} contact={data.contact} vehicles={data.vehicles.map(v=>({code:v.publicId,brand:v.brand,model:v.model,category:v.category,engineCc:v.engineCc,registrationYear:v.registrationYear,color:v.color,dailyPriceVnd:v.dailyPriceVnd,depositVnd:v.depositVnd,media:v.media.map(m=>({...m,id:m.imageUrl}))}))}/>;
 const error=state.locale===locale&&state.error;
 return <main className="max-w-2xl mx-auto p-5 space-y-4"><button onClick={onClose} className="min-h-11 px-4 border rounded-xl">{t.back}</button><p role={error?"alert":"status"}>{error?t.error:data?t.empty:t.loading}</p>{error&&<button className="min-h-11 px-4 rounded-xl bg-sky-600 text-white" onClick={()=>setAttempt(n=>n+1)}>{t.retry}</button>}</main>;
}
