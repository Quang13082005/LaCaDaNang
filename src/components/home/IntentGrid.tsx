import React from "react";
import { IntentCard } from "@/components/home/IntentCard";
import { PreferencePanel } from "@/components/home/PreferencePanel";
import { PRIMARY_INTENTS, type IntentConfig } from "@/data/demo-places";

interface IntentGridProps {
  selectedIntent: "EAT" | "GO" | "NOW" | "STAY" | null;
  selectedPreference: string | null;
  onSelectIntent: (intent: "EAT" | "GO" | "NOW" | "STAY") => void;
  onSelectPreference: (preferenceId: string) => void;
}

export const IntentGrid: React.FC<IntentGridProps> = ({
  selectedIntent,
  selectedPreference,
  onSelectIntent,
  onSelectPreference,
}) => {
  const nowIntent = PRIMARY_INTENTS.find((i) => i.id === "NOW") as IntentConfig;
  const standardIntents = PRIMARY_INTENTS.filter(
    (i) => i.id !== "NOW"
  ) as IntentConfig[];

  const isStandardIntentSelected =
    selectedIntent !== null && selectedIntent !== "NOW";

  return (
    <section className="w-full space-y-4" aria-label="Mục đích khám phá">
      {/* 1. Featured Intent: "BÂY GIỜ LÀM GÌ?" (Full-Width Banner) */}
      <div className="w-full">
        <IntentCard
          intent={nowIntent}
          isSelected={selectedIntent === "NOW"}
          onClick={() => onSelectIntent("NOW")}
          layoutMode="featured"
        />
        {selectedIntent === "NOW" && (
          <PreferencePanel
            intentId="NOW"
            selectedPreferenceId={selectedPreference}
            onSelectPreference={onSelectPreference}
          />
        )}
      </div>

      {/* 2. Standard Discovery Intents Header Divider */}
      <div className="flex items-center gap-2 pt-1 pb-0 px-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Hoặc khám phá theo nhu cầu:
        </span>
        <div className="flex-1 h-[1px] bg-slate-200/80" />
      </div>

      {/* 3. Responsive Grid: 1 column on mobile (< md), 3 columns on tablet/desktop (>= md) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {standardIntents.map((intent) => {
          const isSelected = selectedIntent === intent.id;
          return (
            <IntentCard
              key={intent.id}
              intent={intent}
              isSelected={isSelected}
              onClick={() => onSelectIntent(intent.id)}
              layoutMode="grid"
            />
          );
        })}
      </div>

      {/* 4. Preference Panel for Standard Discovery Intents */}
      {isStandardIntentSelected && selectedIntent && (
        <PreferencePanel
          intentId={selectedIntent}
          selectedPreferenceId={selectedPreference}
          onSelectPreference={onSelectPreference}
        />
      )}
    </section>
  );
};
