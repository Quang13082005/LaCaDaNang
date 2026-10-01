import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Chưa tìm thấy địa điểm",
  message = "Hãy thử chọn một tiêu chí khác để nhận gợi ý phù hợp.",
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
          className="min-h-[44px] px-4 py-2 rounded-[12px] bg-sky-500 text-white font-medium text-sm hover:bg-sky-600 transition-colors cursor-pointer"
        >
          Chọn lại tiêu chí
        </button>
      )}
    </div>
  );
};
