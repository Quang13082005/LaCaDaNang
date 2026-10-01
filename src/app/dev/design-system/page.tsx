import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 sm:p-8 max-w-xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ</span>
      </Link>

      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded">
            Internal Dev Reference
          </span>
          <h1 className="text-2xl font-bold mt-2">Locked Design Tokens</h1>
          <p className="text-sm text-slate-500">
            Hệ thống Design Tokens đã khóa theo AGENTS.md
          </p>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-[12px] bg-slate-50 border border-slate-200">
              <div className="w-full h-10 rounded bg-[#0EA5E9] mb-2" />
              <div className="text-xs font-bold text-slate-800">Primary (sky-500)</div>
              <div className="text-xs font-mono text-slate-500">#0EA5E9</div>
            </div>
            <div className="p-3 rounded-[12px] bg-slate-50 border border-slate-200">
              <div className="w-full h-10 rounded bg-[#0284C7] mb-2" />
              <div className="text-xs font-bold text-slate-800">Primary Dark (sky-600)</div>
              <div className="text-xs font-mono text-slate-500">#0284C7</div>
            </div>
            <div className="p-3 rounded-[12px] bg-slate-50 border border-slate-200">
              <div className="w-full h-10 rounded bg-[#F97316] mb-2" />
              <div className="text-xs font-bold text-slate-800">Accent (orange-500)</div>
              <div className="text-xs font-mono text-slate-500">#F97316</div>
            </div>
            <div className="p-3 rounded-[12px] bg-slate-50 border border-slate-200">
              <div className="w-full h-10 rounded bg-[#F8FAFC] border border-slate-300 mb-2" />
              <div className="text-xs font-bold text-slate-800">Surface (slate-50)</div>
              <div className="text-xs font-mono text-slate-500">#F8FAFC</div>
            </div>
          </div>
        </div>

        {/* Typography & Spacing */}
        <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Typography &amp; Metrics
          </h2>
          <div className="text-sm space-y-1">
            <p><span className="text-slate-500">Font:</span> <strong>Be Vietnam Pro</strong></p>
            <p><span className="text-slate-500">Radius:</span> Card 16px, Chip 12px, Button 12px</p>
            <p><span className="text-slate-500">Tap target:</span> Tối thiểu 44×44px</p>
          </div>
        </div>
      </div>
    </main>
  );
}
