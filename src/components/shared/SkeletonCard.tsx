import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] animate-pulse space-y-3">
      <div className="w-full h-44 bg-slate-200 rounded-[12px]" />
      <div className="h-5 bg-slate-200 rounded w-2/3" />
      <div className="flex gap-2">
        <div className="h-4 bg-slate-200 rounded w-16" />
        <div className="h-4 bg-slate-200 rounded w-24" />
      </div>
      <div className="space-y-1.5 pt-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="h-11 bg-slate-200 rounded-[12px] w-full mt-3" />
    </div>
  );
};

