export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-between p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center pt-8 pb-6">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-sky-100">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          Phase 0 · Foundation Shell
        </div>

        {/* Title */}
        <h1 className="text-[28px] leading-tight font-bold text-slate-900 mb-2">
          La Cà Đà Nẵng
        </h1>
        <p className="text-base font-normal text-slate-500 mb-8 max-w-xs">
          Khám phá Đà Nẵng trong tối đa 3 lần chạm. Base shell đã sẵn sàng cho Phase 1.
        </p>

        {/* Design Token Test Card */}
        <div className="w-full rounded-[16px] bg-slate-50 border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold text-slate-900">
              Kiểm tra Design Tokens
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
              Locked
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Primary Color</span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#0EA5E9] inline-block border border-slate-200" />
                <code className="text-xs font-mono text-slate-700">#0EA5E9</code>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Accent Color</span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#F97316] inline-block border border-slate-200" />
                <code className="text-xs font-mono text-slate-700">#F97316</code>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Surface / Border</span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#F8FAFC] inline-block border border-[#E2E8F0]" />
                <code className="text-xs font-mono text-slate-700">#F8FAFC</code>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Typography</span>
              <span className="font-medium text-slate-800">Be Vietnam Pro</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Radius (Card / Chip)</span>
              <span className="font-mono text-xs text-slate-700">16px / 12px</span>
            </div>
          </div>
        </div>

        {/* Responsive Target Indicators */}
        <div className="w-full grid grid-cols-3 gap-2 text-center text-xs">
          <div className="py-2 px-1 rounded-[12px] bg-slate-100 text-slate-600 font-medium">
            360px
          </div>
          <div className="py-2 px-1 rounded-[12px] bg-slate-100 text-slate-600 font-medium">
            390px
          </div>
          <div className="py-2 px-1 rounded-[12px] bg-slate-100 text-slate-600 font-medium">
            430px
          </div>
        </div>
      </div>

      <footer className="w-full max-w-md mx-auto text-center py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Da Nang 3-Tap Discovery · Foundation Shell
        </p>
      </footer>
    </main>
  );
}
