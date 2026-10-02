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
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">
            {intentId === "NOW"
              ? "Đi cùng ai:"
              : "Bạn muốn tìm chỗ thế nào?"}
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
