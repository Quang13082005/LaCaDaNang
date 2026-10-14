"use client";
import { useState } from "react";
import { Motorbike } from "lucide-react";
import type { VehicleMedia } from "@/lib/rental/types";
export function VehicleImage({ media, label, compact = false }: {media?: VehicleMedia; label: string; compact?: boolean}) {
 const [failedUrl, setFailedUrl] = useState<string | null>(null);
 const valid = media && /^https:\/\//.test(media.imageUrl) && failedUrl !== media.imageUrl;
 return <div className={`relative bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200/50 ${compact ? "w-20 h-20 shrink-0" : "w-full aspect-[4/3]"}`}>
  {valid ? /* eslint-disable-next-line @next/next/no-img-element */
   <img src={media.imageUrl} alt={media.altText || label} width={compact ? 80 : 800} height={compact ? 80 : 600} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailedUrl(media.imageUrl)} className="absolute inset-0 w-full h-full object-contain" /> :
   <div className="flex flex-col items-center text-center gap-4 p-4 text-slate-500"><Motorbike aria-hidden="true" strokeWidth={1.5} size={compact ? 42 : 88} className="text-slate-400"/>{!compact && <p className="text-sm leading-relaxed">{label}</p>}</div>}
 </div>;
}
