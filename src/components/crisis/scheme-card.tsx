import { component$, useSignal, $ } from "@builder.io/qwik";
import type { Scheme } from "../../shared/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface SchemeCardProps {
  scheme: Scheme;
}

const categoryLabels: Record<string, { hi: string; en: string }> = {
  employment: { hi: "रोज़गार", en: "Employment" },
  food: { hi: "खाद्य सुरक्षा", en: "Food Security" },
  housing: { hi: "आवास", en: "Housing" },
  health: { hi: "स्वास्थ्य", en: "Health" },
  education: { hi: "शिक्षा", en: "Education" },
  finance: { hi: "वित्तीय सहायता", en: "Finance" },
  skill: { hi: "कौशल विकास", en: "Skill Development" },
  pension: { hi: "पेंशन", en: "Pension" },
  insurance: { hi: "बीमा", en: "Insurance" },
};

export const SchemeCard = component$<SchemeCardProps>(({ scheme }) => {
  const expanded = useSignal(false);

  return (
    <article
      class="rounded-xl border-2 border-stone-200 bg-white p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900"
      aria-labelledby={`scheme-title-${scheme.id}`}
    >
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3
            id={`scheme-title-${scheme.id}`}
            class="text-lg font-bold text-stone-900 dark:text-stone-100"
          >
            {scheme.nameHi}
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400">
            {scheme.name}
          </p>
        </div>
        <Badge variant="purpose">
          {categoryLabels[scheme.category]?.hi ?? scheme.category}
        </Badge>
      </div>

      <p class="mt-3 text-sm text-stone-700 dark:text-stone-300">
        {scheme.descriptionHi}
      </p>

      <div class="mt-3 rounded-lg bg-green-50 p-3 dark:bg-green-950">
        <p class="text-sm font-semibold text-green-900 dark:text-green-100">
          लाभ / Benefits
        </p>
        <p class="text-sm text-green-800 dark:text-green-200">
          {scheme.benefitsHi}
        </p>
      </div>

      <div class="mt-3">
        <button
          type="button"
          onClick$={$(() => { expanded.value = !expanded.value; })}
          aria-expanded={expanded.value}
          aria-controls={`steps-${scheme.id}`}
          class="min-h-[48px] w-full rounded-lg border-2 border-stone-200 px-4 py-2 text-left text-sm font-semibold text-stone-900 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800"
        >
          {expanded.value ? "▼" : "▶"} आवेदन कैसे करें / How to Apply
        </button>

        {expanded.value && (
          <div id={`steps-${scheme.id}`} class="mt-2 space-y-2 pl-4">
            <ol class="list-decimal space-y-1 pl-4 text-sm text-stone-700 dark:text-stone-300">
              {scheme.applyStepsHi.map((stepText, i) => (
                <li key={i}>{stepText}</li>
              ))}
            </ol>
            {scheme.applyUrl && (
              <Button
                variant="primary"
                size="sm"
                onClick$={$(() => { window.open(scheme.applyUrl, "_blank", "noopener"); })}
                ariaLabel={`ऑनलाइन आवेदन करें - ${scheme.nameHi}`}
              >
                ऑनलाइन आवेदन करें / Apply Online
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
});
