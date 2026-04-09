/**
 * Journey Bridge -- the connective tissue between layers.
 * Shows context-aware suggestions based on where the user has been.
 * "You found schemes. Now find purpose." "People like you are nearby."
 */
import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { loadJourney, getNextSuggestion } from "../../lib/state/journey";

export const JourneyBridge = component$(() => {
  const suggestion = useSignal<{
    route: string;
    titleHi: string;
    titleEn: string;
    reason: string;
  } | null>(null);

  useVisibleTask$(() => {
    const journey = loadJourney();
    suggestion.value = getNextSuggestion(journey);
  });

  if (!suggestion.value) return null;

  const s = suggestion.value;

  return (
    <a
      href={s.route}
      class="block rounded-xl border-2 border-community/30 bg-community/5 p-4 mt-6 transition-colors hover:bg-community/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-community group"
      aria-label={`${s.titleEn}: ${s.reason}`}
    >
      <p class="text-lg font-display font-bold text-community group-hover:text-community/80">
        {s.titleHi} →
      </p>
      <p class="text-sm text-stone-500 mt-0.5">{s.titleEn}</p>
      <p class="text-xs text-stone-400 mt-1">{s.reason}</p>
    </a>
  );
});
