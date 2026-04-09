import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getAllMissions } from "../../lib/matching/purpose";
import { MissionCard } from "../../components/purpose/mission-card";

export default component$(() => {
  const missions = getAllMissions();

  return (
    <div class="mx-auto max-w-2xl space-y-6">
      <section aria-labelledby="missions-heading">
        <h1
          id="missions-heading"
          class="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          मिशन
          <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
            Missions
          </span>
        </h1>
        <p class="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {missions.length} मिशन उपलब्ध हैं / {missions.length} missions available
        </p>
      </section>

      <div class="space-y-4">
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      <nav aria-label="और विकल्प / More options" class="flex gap-3">
        <a
          href="/khoj/compass"
          class="min-h-[48px] rounded-lg border-2 border-purpose/30 px-4 py-2 text-sm font-semibold text-purpose hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:hover:bg-blue-950"
        >
          उद्देश्य खोजें / Purpose Compass
        </a>
        <a
          href="/sangam/circles"
          class="min-h-[48px] rounded-lg border-2 border-community/30 px-4 py-2 text-sm font-semibold text-community hover:bg-green-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-community focus-visible:ring-offset-2 dark:hover:bg-green-950"
        >
          समुदाय / Community
        </a>
      </nav>
    </div>
  );
});

export const head: DocumentHead = {
  title: "मिशन | Missions | उड़ान",
  meta: [
    {
      name: "description",
      content: "समुदाय मिशन खोजें और जुड़ें। Find and join community missions.",
    },
  ],
};
