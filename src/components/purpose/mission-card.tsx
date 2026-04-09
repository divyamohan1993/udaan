import { component$ } from "@builder.io/qwik";
import type { Mission } from "../../shared/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface MissionCardProps {
  mission: Mission;
}

const difficultyLabels: Record<string, { hi: string; en: string }> = {
  easy: { hi: "आसान", en: "Easy" },
  medium: { hi: "मध्यम", en: "Medium" },
  hard: { hi: "कठिन", en: "Hard" },
};

const categoryLabels: Record<string, string> = {
  people: "लोग / People",
  nature: "प्रकृति / Nature",
  knowledge: "ज्ञान / Knowledge",
  craft: "शिल्प / Craft",
  service: "सेवा / Service",
  expression: "अभिव्यक्ति / Expression",
};

export const MissionCard = component$<MissionCardProps>(({ mission }) => {
  const diffLabel = difficultyLabels[mission.difficulty] ?? { hi: mission.difficulty, en: mission.difficulty };

  return (
    <article
      class="rounded-xl border-2 border-purpose/30 bg-blue-50 p-4 dark:border-purpose/40 dark:bg-blue-950"
      aria-labelledby={`mission-${mission.id}`}
    >
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3
            id={`mission-${mission.id}`}
            class="text-lg font-bold text-stone-900 dark:text-stone-100"
          >
            {mission.titleHi}
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400">
            {mission.title}
          </p>
        </div>
        <div class="flex gap-1">
          <Badge variant="purpose">
            {categoryLabels[mission.category] ?? mission.category}
          </Badge>
          <Badge variant={mission.difficulty as "easy" | "medium" | "hard"}>
            {diffLabel.hi}
          </Badge>
        </div>
      </div>

      <p class="mt-2 text-sm text-stone-700 dark:text-stone-300">
        {mission.descriptionHi}
      </p>

      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs text-stone-500 dark:text-stone-400">
          प्रभाव: {mission.impactMetricHi}
        </span>
        <Button variant="purpose" size="sm" ariaLabel={`${mission.titleHi} में जुड़ें`}>
          जुड़ें / Join
        </Button>
      </div>
    </article>
  );
});
