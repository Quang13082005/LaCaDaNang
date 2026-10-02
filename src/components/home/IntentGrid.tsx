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

  const isAnyIntentSelected = selectedIntent !== null;

  return (
    <section className="w-full space-y-3" aria-label="Mục đích khám phá">
      {/* 1. Featured Intent: "BÂY GIỜ LÀM GÌ?" */}
      <div className="w-full">
        <IntentCard
          intent={nowIntent}
          isSelected={selectedIntent === "NOW"}
          onClick={() => onSelectIntent("NOW")}
          layoutMode={
            isAnyIntentSelected && selectedIntent !== "NOW"
              ? "compact"
              : "featured"
          }
        />
        {selectedIntent === "NOW" && !selectedPreference && (
          <div id="preference-panel-active" className="mt-2">
            <PreferencePanel
              intentId="NOW"
              selectedPreferenceId={selectedPreference}
              onSelectPreference={onSelectPreference}
            />
          </div>
        )}
      </div>

      {/* 2. Standard Discovery Intents (EAT, GO, STAY) */}
      <div
        className={
          isAnyIntentSelected
            ? "space-y-3"
            : "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
        }
      >
        {standardIntents.map((intent) => {
          const isSelected = selectedIntent === intent.id;
          const isCompact = isAnyIntentSelected && !isSelected;

          return (
            <div key={intent.id} className="w-full">
              <IntentCard
                intent={intent}
                isSelected={isSelected}
                onClick={() => onSelectIntent(intent.id)}
                layoutMode={isCompact ? "compact" : "grid"}
              />
              {/* P1.1: Preference panel renders directly after the active card in DOM order */}
              {isSelected && !selectedPreference && (
                <div id="preference-panel-active" className="mt-2">
                  <PreferencePanel
                    intentId={intent.id}
                    selectedPreferenceId={selectedPreference}
                    onSelectPreference={onSelectPreference}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
