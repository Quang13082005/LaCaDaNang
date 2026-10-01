import React from "react";
import { Sparkles } from "lucide-react";
import { MoodChip } from "@/components/shared/MoodChip";
import { PREFERENCES_BY_INTENT } from "@/data/demo-places";

interface PreferencePanelProps {
  intentId: "EAT" | "GO" | "NOW" | "STAY";
  selectedPreferenceId: string | null;
  onSelectPreference: (preferenceId: string) => void;
}

export const PreferencePanel: React.FC<PreferencePanelProps> = ({
  intentId,
  selectedPreferenceId,
  onSelectPreference,
}) => {
  const chips = PREFERENCES_BY_INTENT[intentId] || [];

  return (
    <div className="w-full pt-3 pb-1 transition-all duration-200 ease-out">
      <div className="rounded-[18px] bg-slate-50/80 border border-slate-200/80 p-3.5 sm:p-4 shadow-sm">
        {/* Header: Friendly, mood-driven microcopy */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-xs font-semibold text-slate-700">
              {intentId === "NOW"
                ? "Đi cùng ai hoặc thích không khí thế nào?"
                : "Chọn nhanh một gu bạn muốn:"}
            </span>
          </div>
          <span className="text-[11px] text-sky-600 font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100/80">
            Chạm 1 để xem
          </span>
        </div>

        {/* Chip Grid: 2 columns on small mobile, 3 on standard mobile, auto-wrap on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
          {chips.map((chip) => (
            <MoodChip
              key={chip.id}
              id={chip.id}
              label={chip.label}
              emoji={chip.emoji}
              isSelected={selectedPreferenceId === chip.id}
              onClick={() => onSelectPreference(chip.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
