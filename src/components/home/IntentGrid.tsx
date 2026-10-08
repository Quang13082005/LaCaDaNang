"use client";

import React from "react";
import { IntentCard } from "@/components/home/IntentCard";
import { PreferenceBottomSheet } from "@/components/home/PreferenceBottomSheet";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRIMARY_INTENTS, type IntentConfig } from "@/data/demo-places";

export interface IntentGridProps {
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
  const { t } = useLocale();

  const nowIntent = PRIMARY_INTENTS.find((i) => i.id === "NOW") as IntentConfig;
  const eatIntent = PRIMARY_INTENTS.find((i) => i.id === "EAT") as IntentConfig;
  const goIntent = PRIMARY_INTENTS.find((i) => i.id === "GO") as IntentConfig;
  const stayIntent = PRIMARY_INTENTS.find((i) => i.id === "STAY") as IntentConfig;

  return (
    <div className="w-full">
      {/* 1. Flat "Chọn nhanh" Header — no floating/raised container */}
      <div className="mb-3 px-0.5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {t("home.quickSelect.title")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          {t("home.quickSelect.subtitle")}
        </p>
      </div>

      {/* 2. 2x2 Intent Grid — strictly maintains DOM order: NOW, EAT, GO, STAY */}
      <section className="w-full" aria-label={t("intent.region")}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {/* Slot 1: NOW */}
          <IntentCard
            intent={nowIntent}
            isSelected={selectedIntent === "NOW"}
            onClick={() => onSelectIntent("NOW")}
          />

          {/* Slot 2: EAT */}
          <IntentCard
            intent={eatIntent}
            isSelected={selectedIntent === "EAT"}
            onClick={() => onSelectIntent("EAT")}
          />

          {/* Slot 3: GO */}
          <IntentCard
            intent={goIntent}
            isSelected={selectedIntent === "GO"}
            onClick={() => onSelectIntent("GO")}
          />

          {/* Slot 4: STAY */}
          <IntentCard
            intent={stayIntent}
            isSelected={selectedIntent === "STAY"}
            onClick={() => onSelectIntent("STAY")}
          />
        </div>
      </section>

      {/* 3. Mobile Preference Bottom Sheet — opens in thumb zone on intent tap */}
      {selectedIntent && (
        <PreferenceBottomSheet
          intentId={selectedIntent}
          isOpen={selectedIntent !== null && selectedPreference === null}
          onClose={() => onSelectIntent(selectedIntent)}
          selectedPreferenceId={selectedPreference}
          onSelectPreference={onSelectPreference}
        />
      )}
    </div>
  );
};
