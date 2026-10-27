"use client";
import { useState, useRef, useLayoutEffect } from "react";
import { ArrowLeft, ChevronRight, Phone, Motorbike, Gauge, ShieldCheck, MapPin, Palette, Tag } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { rentalCopy, formatVehicleColor } from "@/lib/rental/messages";
import type { RentalVehicle, RentalCategory } from "@/lib/rental/types";
import { VehicleImage } from "./VehicleImage";


export function RentalCatalog({
  onClose,
  vehicles = [],
  contact,
  notice,
}: {
  onClose: () => void;
  vehicles?: RentalVehicle[];
  contact?: { phone: string; zaloUrl: string; policy: string } | null;
  notice?: string;
}) {
 const {locale,formatNumber}=useLocale(); const t=rentalCopy(locale);
 const [filter,setFilter]=useState<RentalCategory|"all">("all");
 const [selectedCode,setSelectedCode]=useState<string|null>(null);
 const lastSelectedCode=useRef<string|null>(null);
 const selected=vehicles.find(v=>v.code===selectedCode)??null;
 const [imageIndex,setImageIndex]=useState(0);
 const catalogScroll=useRef(0);const scroller=useRef<HTMLDivElement>(null);const cardButtons=useRef(new Map<string,HTMLButtonElement>());const heading=useRef<HTMLHeadingElement>(null);
 const shown=vehicles.filter(v=>filter==="all"||v.category===filter);
 const media=selected?.media?.slice().sort((a,b)=>Number(b.isPrimary)-Number(a.isPrimary)||a.sortOrder-b.sortOrder||a.id.localeCompare(b.id))??[];
 useLayoutEffect(()=>{if(selected){heading.current?.focus({preventScroll:true});}else if(lastSelectedCode.current){if(scroller.current)scroller.current.scrollTop=catalogScroll.current;cardButtons.current.get(lastSelectedCode.current)?.focus({preventScroll:true});}},[selected]);
 const back=()=>{if(selectedCode){setSelectedCode(null);}else onClose();};
 const open=(v:RentalVehicle)=>{catalogScroll.current=scroller.current?.scrollTop??0;lastSelectedCode.current=v.code;setSelectedCode(v.code);setImageIndex(0);if(scroller.current)scroller.current.scrollTop=0;};
 return <div className="bg-sky-50/70 text-slate-900 h-dvh flex flex-col [overflow-wrap:anywhere]" lang={locale}>
  <header className="shrink-0 border-b border-sky-100 bg-white/95 px-3 py-3"><div className="max-w-2xl mx-auto flex items-center gap-2"><button type="button" onClick={back} aria-label={selected?t.back:t.close} className="min-w-11 min-h-11 flex items-center justify-center rounded-xl"><ArrowLeft aria-hidden="true"/></button><h1 ref={heading} tabIndex={-1} className="flex-1 min-w-0 text-lg font-extrabold text-sky-950 leading-snug">{selected?`${selected.brand} ${selected.model}`:t.title}</h1><LanguageSelector/></div></header>
  <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain" data-testid="rental-scroll"><div className="max-w-2xl mx-auto p-4 pb-[calc(12rem+env(safe-area-inset-bottom,0px))] space-y-4">
   {notice && <p className="text-xs text-slate-500">{notice}</p>}
   {selected ? <>
    <VehicleImage media={media[imageIndex]} label={t.noImage}/>
    {media.length>1&&<nav aria-label={t.image} className="flex flex-wrap gap-2">{media.map((m,i)=><button type="button" key={m.id} onClick={()=>setImageIndex(i)} aria-pressed={imageIndex===i} aria-label={`${t.chooseImage} ${i+1}`} className={`min-h-11 min-w-11 rounded-lg border ${imageIndex===i?"bg-sky-100 border-sky-600":"bg-white"}`}>{i+1}</button>)}</nav>}
    <h2 className="text-2xl font-extrabold tracking-tight text-sky-950">{selected.brand} {selected.model}</h2><div className="flex flex-wrap gap-2 text-sm text-sky-900">{[[Motorbike,t[selected.category]],[Gauge,`${formatNumber(selected.engineCc,{maximumFractionDigits:3})} cm³`]].map(([Icon,value],i)=>{const BadgeIcon=Icon as typeof Motorbike;return <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white border border-sky-100 px-3 py-2"><BadgeIcon size={16} aria-hidden="true"/>{value as string}</span>;})}</div>
    <div className="rounded-2xl border border-sky-200 bg-sky-100/60 px-4 py-4 flex items-center gap-3"><Tag className="text-sky-600 shrink-0" aria-hidden="true"/><div><p className="text-xs font-medium text-sky-900">{t.price}</p><p className="text-xl font-extrabold text-sky-700">{formatNumber(selected.dailyPriceVnd ?? (selected.rawDailyPrice ?? 0) * 1000)} VND</p></div></div><dl className="divide-y divide-sky-100 rounded-3xl border border-sky-100 bg-white px-4 shadow-sm">{[
     [t.category,t[selected.category]],[t.capacity,`${formatNumber(selected.engineCc,{maximumFractionDigits:3})} cm³`],
     [t.color,formatVehicleColor(selected.color,locale)],[t.depositCondition,`${formatNumber(selected.depositVnd ?? {semi:1000000,scooter:2000000,manual:1500000}[selected.category])} VND`],
    ].map(([label,value])=><div className="py-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 text-sm leading-relaxed" key={label}><dt className="text-slate-600 flex items-start gap-2">{(() => {const Icon=label===t.category?Motorbike:label===t.capacity?Gauge:label===t.color?Palette:label===t.price?Tag:ShieldCheck;return <Icon size={18} className="shrink-0 mt-0.5 text-sky-700" aria-hidden="true"/>;})()}{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl>
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 flex items-start gap-3"><MapPin aria-hidden="true" className="shrink-0 text-sky-600"/><p className="text-sm text-sky-950 leading-relaxed">{t.availability}</p></div>
    <p className="rounded-2xl bg-white border border-sky-100 p-4 text-sm text-slate-600 leading-relaxed">{contact?.policy ?? t.terms}</p>
   </>:<>
    <div className="relative isolate overflow-hidden rounded-3xl bg-sky-950 text-white shadow-sm"><div aria-hidden="true" className="absolute inset-0 -z-10 bg-cover bg-center" style={{backgroundImage:"linear-gradient(90deg,rgba(8,47,73,.90),rgba(8,47,73,.3)),url(/images/hero/da-nang-dragon-bridge.webp)"}}/><div className="p-5 min-h-44 flex flex-col justify-between gap-6"><span className="text-xs tracking-[.2em] font-bold">LA CÀ ĐÀ NẴNG</span><p className="text-xl sm:text-2xl font-extrabold leading-snug max-w-xs">{t.intro}</p><span className="inline-flex items-center gap-2 text-sm"><Motorbike size={20} aria-hidden="true"/>{t.title}</span></div></div>
    <div className="space-y-3" aria-live="polite">{shown.map(v=><button type="button" key={v.code} ref={node=>{if(node)cardButtons.current.set(v.code,node);else cardButtons.current.delete(v.code);}} onClick={()=>open(v)} className="w-full flex items-center gap-3 text-left bg-white border border-white rounded-3xl p-3 shadow-sm hover:border-sky-300 hover:shadow-md transition-[box-shadow,border-color] focus-visible:outline-2 focus-visible:outline-sky-600">
     <VehicleImage media={v.media?.find(m=>m.isPrimary)??v.media?.[0]} label={t.image} compact/>
     <span className="min-w-0 flex-1 space-y-1"><span className="block font-extrabold text-sky-950 leading-snug">{v.brand} {v.model}</span><span className="block text-xs text-slate-500">{t[v.category]} · {formatNumber(v.engineCc,{maximumFractionDigits:3})} cm³</span><span className="block text-xs text-slate-500">{formatVehicleColor(v.color,locale)}</span><span className="block text-base font-extrabold text-sky-600 leading-snug pt-1">{formatNumber(v.dailyPriceVnd ?? (v.rawDailyPrice ?? 0) * 1000)} VND / {locale === "vi" ? "ngày" : locale === "en" ? "day" : locale === "ru" ? "день" : locale === "zh" ? "天" : "일"}</span></span><ChevronRight aria-hidden="true" size={28} className="shrink-0 rounded-full bg-sky-50 p-1 text-sky-600"/>
    </button>)}</div>
   </>}
  </div></div>
  <div className="fixed bottom-0 inset-x-0 border-t border-sky-100 rounded-t-3xl shadow-[0_-6px_24px_rgba(14,165,233,0.06)] bg-white px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
   {selected? contact === null ? null : <div className="max-w-2xl mx-auto"><p className="text-xs text-slate-500 mb-2 text-center">{contact?.phone ?? "0931 981 789"}</p><div className="grid grid-cols-2 gap-3"><a href={contact?.zaloUrl ?? "https://zalo.me/0931981789"} target="_blank" rel="noopener noreferrer" className="min-h-14 rounded-2xl bg-sky-600 text-white px-3 py-3 font-semibold flex items-center justify-center text-center">{t.zalo}</a><a href={`tel:${contact?.phone ?? "0931981789"}`} className="min-h-14 rounded-2xl bg-emerald-600 text-white px-3 py-3 font-semibold inline-flex items-center justify-center gap-2 text-center"><Phone size={18} aria-hidden="true"/>{t.call}</a></div></div>:
    <nav aria-label={t.filters} className="max-w-2xl mx-auto grid grid-cols-2 min-[390px]:grid-cols-4 gap-2">{(["all","scooter","semi","manual"] as const).map(k=><button type="button" key={k} aria-pressed={filter===k} onClick={()=>{setFilter(k);if(scroller.current)scroller.current.scrollTop=0;}} className={`min-h-11 px-2 py-2 rounded-full text-sm font-semibold ${filter===k?"bg-sky-600 text-white":"bg-slate-100 text-slate-600"}`}>{t[k]} ({k==="all"?vehicles.length:vehicles.filter(v=>v.category===k).length})</button>)}</nav>}
  </div>
 </div>;
}



