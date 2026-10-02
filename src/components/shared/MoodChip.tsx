import React from "react";

interface MoodChipProps {
  id: string;
  label: string;
  emoji: string;
  isSelected?: boolean;
  onClick: () => void;
  countBadge?: number;
}

export const MoodChip: React.FC<MoodChipProps> = ({
  label,
  emoji,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`min-h-[44px] px-3.5 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
        isSelected
          ? "bg-sky-500 text-white shadow-[0_3px_10px_rgba(14,165,233,0.3)] border border-sky-500 scale-[1.01]"
          : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] active:scale-[0.98]"
      }`}
    >
      <span className="text-base shrink-0 leading-none" role="img" aria-hidden="true">
        {emoji}
      </span>
      <span className="font-medium text-xs sm:text-sm leading-snug text-left sm:text-center break-words">
        {label}
      </span>
    </button>
  );
};
