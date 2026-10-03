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


  if (selectedIntent) {
    const activeIntent = PRIMARY_INTENTS.find((intent) => intent.id === selectedIntent)!;
    return (
      <section className="w-full space-y-3" aria-label="Mục đích khám phá">
        <IntentCard
          intent={activeIntent}
          isSelected
          onClick={() => onSelectIntent(activeIntent.id)}
          layoutMode="compact"
        />
        <div id="preference-panel-active">
          <PreferencePanel
            intentId={selectedIntent}
            selectedPreferenceId={selectedPreference}
            onSelectPreference={onSelectPreference}
          />
        </div>
        {PRIMARY_INTENTS.filter((intent) => intent.id !== selectedIntent).map((intent) => (
          <IntentCard
            key={intent.id}
            intent={intent}
            isSelected={false}
            onClick={() => onSelectIntent(intent.id)}
            layoutMode="compact"
          />
        ))}
      </section>
    );
  }

  return (
    <section className="w-full space-y-3" aria-label="Mục đích khám phá">
      <IntentCard
        intent={nowIntent}
        isSelected={false}
        onClick={() => onSelectIntent("NOW")}
        layoutMode="featured"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {standardIntents.map((intent) => (
          <IntentCard
            key={intent.id}
            intent={intent}
            isSelected={false}
            onClick={() => onSelectIntent(intent.id)}
          />
        ))}
      </div>
    </section>
  );
};
