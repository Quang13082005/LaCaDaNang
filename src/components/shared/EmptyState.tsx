import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Chưa có gợi ý phù hợp tiêu chí này.",
  message = "Hãy thử chọn một lựa chọn khác để nhận gợi ý phù hợp.",
  onReset,
}) => {
  return (
    <div className="w-full rounded-[16px] border border-dashed border-slate-300 p-8 text-center bg-slate-50">
      <span className="text-3xl block mb-2" role="img" aria-hidden="true">
        🔍
      </span>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-4">{message}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] px-5 py-2.5 rounded-[12px] bg-sky-500 text-white font-medium text-sm hover:bg-sky-600 active:bg-sky-700 transition-colors cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          Đổi lựa chọn
        </button>
      )}
    </div>
  );
};
