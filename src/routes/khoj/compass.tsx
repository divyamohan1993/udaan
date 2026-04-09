import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { PurposeVector } from "../../shared/types";
import { CompassFlow } from "../../components/purpose/compass-flow";
import { PurposeRadar } from "../../components/purpose/purpose-radar";
import { MissionCard } from "../../components/purpose/mission-card";
import { computePurposeVector, matchMissions } from "../../lib/matching/purpose";
import type { Mission } from "../../shared/types";

export default component$(() => {
  const showResults = useSignal(false);
  const purposeVector = useStore<{ value: PurposeVector }>({
    value: { people: 0, nature: 0, knowledge: 0, craft: 0, service: 0, expression: 0 },
  });
  const matchedMissions = useStore<{ value: Mission[] }>({ value: [] });

  const handleComplete = $((answers: string[]) => {
    const vector = computePurposeVector(answers);
    purposeVector.value = vector;
    matchedMissions.value = matchMissions(vector);
    showResults.value = true;
  });

  return (
    <div class="mx-auto max-w-lg space-y-6">
      <section aria-labelledby="compass-heading">
        <h1
          id="compass-heading"
          class="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          उद्देश्य खोज
          <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
            Purpose Compass
          </span>
        </h1>
        {!showResults.value && (
          <p class="mt-2 text-sm text-stone-600 dark:text-stone-400">
            5 सवालों के जवाब दें और अपना उद्देश्य खोजें
            <br />
            <span class="text-xs">
              Answer 5 questions to discover your purpose
            </span>
          </p>
        )}
      </section>

      {!showResults.value ? (
        <CompassFlow onComplete$={handleComplete} />
      ) : (
        <div class="space-y-8">
          <section aria-labelledby="radar-heading">
            <h2
              id="radar-heading"
              class="text-xl font-bold text-stone-900 dark:text-stone-100"
            >
              आपका उद्देश्य मानचित्र
              <span class="block text-sm font-normal text-stone-500 dark:text-stone-400">
                Your Purpose Map
              </span>
            </h2>
            <div class="mt-4">
              <PurposeRadar vector={purposeVector.value} />
            </div>
          </section>

          <section aria-labelledby="missions-heading">
            <h2
              id="missions-heading"
              class="text-xl font-bold text-stone-900 dark:text-stone-100"
            >
              सुझाए गए मिशन
              <span class="block text-sm font-normal text-stone-500 dark:text-stone-400">
                Suggested Missions
              </span>
            </h2>
            <div class="mt-4 space-y-4">
              {matchedMissions.value.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </section>

          {/* Bridge to Layer 3: warm, personal */}
          <section
            aria-labelledby="bridge-sangam-heading"
            class="rounded-xl border-2 border-community/30 bg-gradient-to-br from-green-50 to-green-100 p-6 dark:border-community/40 dark:from-green-950 dark:to-green-900"
          >
            <h2
              id="bridge-sangam-heading"
              class="text-xl font-bold text-stone-900 dark:text-stone-100"
            >
              आपके जैसे लोग पास में हैं
            </h2>
            <p class="mt-1 text-base text-stone-700 dark:text-stone-300">
              अकेले नहीं चलना है. आपके मोहल्ले में लोग इसी राह पर हैं.
            </p>
            <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
              You don't walk alone. People near you are on the same path.
            </p>
            <a
              href="/sangam/circles"
              class="mt-3 inline-flex min-h-[48px] items-center rounded-lg bg-community px-5 py-2.5 font-bold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-community focus-visible:ring-offset-2"
              aria-label="समुदाय मंडलों से जुड़ें / Join Community Circles"
            >
              मंडल खोजें / Find Your Circle
            </a>
          </section>

          <nav aria-label="और विकल्प / More options" class="flex flex-wrap gap-3">
            <a
              href="/khoj/missions"
              class="min-h-[48px] rounded-lg border-2 border-purpose/30 px-4 py-2 text-sm font-semibold text-purpose hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:hover:bg-blue-950"
            >
              सभी मिशन देखें / View All Missions
            </a>
            <a
              href="/sahara/triage"
              class="min-h-[48px] rounded-lg border-2 border-crisis/30 px-4 py-2 text-sm font-semibold text-crisis hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:hover:bg-red-950"
            >
              योजनाएं खोजें / Find Schemes
            </a>
          </nav>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "उद्देश्य खोज | Purpose Compass | उड़ान",
  meta: [
    {
      name: "description",
      content: "5 सवालों से अपना उद्देश्य खोजें। Discover your purpose through 5 reflective questions.",
    },
  ],
};
