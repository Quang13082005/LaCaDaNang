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

  return (
    <section className="w-full space-y-3" aria-label="Mục đích khám phá">
      {/* 1. NOW Intent Card (Featured) */}
      <div className="space-y-3">
        <IntentCard
          intent={nowIntent}
          isSelected={selectedIntent === "NOW"}
          onClick={() => onSelectIntent("NOW")}
          layoutMode="featured"
        />
        {selectedIntent === "NOW" && (
          <div id="preference-panel-active">
            <PreferencePanel
              intentId="NOW"
              selectedPreferenceId={selectedPreference}
              onSelectPreference={onSelectPreference}
            />
          </div>
        )}
      </div>

      {/* 2. Standard Discovery Intents (EAT, GO, STAY) with stable in-place Accordion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {standardIntents.map((intent, index) => {
          const isSelected = selectedIntent === intent.id;
          const desktopOrderClass =
            index === 0 ? "md:order-1" : index === 1 ? "md:order-2" : "md:order-3";

          return (
            <React.Fragment key={intent.id}>
              <div className={`w-full ${desktopOrderClass}`}>
                <IntentCard
                  intent={intent}
                  isSelected={isSelected}
                  onClick={() => onSelectIntent(intent.id)}
                />
              </div>

              {/* In-place Accordion: expands directly below selected intent card */}
              {isSelected && (
                <div
                  id="preference-panel-active"
                  className="col-span-1 md:col-span-3 md:order-4 w-full"
                >
                  <PreferencePanel
                    intentId={intent.id}
                    selectedPreferenceId={selectedPreference}
                    onSelectPreference={onSelectPreference}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
