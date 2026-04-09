import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { BreathingExercise } from "../../components/crisis/breathing-exercise";
import emergencyContacts from "../../data/emergency/contacts.json";

const groundingSteps = [
  { count: 5, hi: "5 चीज़ें देखें जो दिख रही हैं", en: "See 5 things around you", sense: "देखें / See" },
  { count: 4, hi: "4 चीज़ें छुएं", en: "Touch 4 things", sense: "छुएं / Touch" },
  { count: 3, hi: "3 आवाज़ें सुनें", en: "Hear 3 sounds", sense: "सुनें / Hear" },
  { count: 2, hi: "2 खुशबू महसूस करें", en: "Smell 2 things", sense: "सूंघें / Smell" },
  { count: 1, hi: "1 स्वाद चखें", en: "Taste 1 thing", sense: "चखें / Taste" },
];

export default component$(() => {
  const mentalHealthContacts = emergencyContacts.filter(
    (c: { type: string }) => c.type === "mental-health"
  );

  return (
    <div class="mx-auto max-w-2xl space-y-8">
      <section aria-labelledby="mh-heading">
        <h1
          id="mh-heading"
          class="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          मानसिक स्वास्थ्य सहायता
          <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
            Mental Health Support
          </span>
        </h1>
        <p class="mt-2 text-base text-stone-700 dark:text-stone-300">
          एक पल रुकें. सांस लें. आप सुरक्षित हैं.
        </p>
        <p class="text-sm text-stone-500 dark:text-stone-400">
          Pause. Breathe. You are safe.
        </p>
      </section>

      {/* Breathing Exercise */}
      <section
        aria-labelledby="breathing-heading"
        class="rounded-xl border-2 border-purpose/30 bg-blue-50 p-6 dark:border-purpose/40 dark:bg-blue-950"
      >
        <h2
          id="breathing-heading"
          class="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100"
        >
          श्वास व्यायाम{" "}
          <span class="text-sm font-normal text-stone-500 dark:text-stone-400">
            Breathing Exercise
          </span>
        </h2>
        <BreathingExercise />
      </section>

      {/* 5-4-3-2-1 Grounding */}
      <section
        aria-labelledby="grounding-heading"
        class="rounded-xl border-2 border-community/30 bg-green-50 p-6 dark:border-community/40 dark:bg-green-950"
      >
        <h2
          id="grounding-heading"
          class="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100"
        >
          5-4-3-2-1 ग्राउंडिंग{" "}
          <span class="text-sm font-normal text-stone-500 dark:text-stone-400">
            Grounding Exercise
          </span>
        </h2>
        <p class="mb-4 text-sm text-stone-700 dark:text-stone-300">
          अपनी इंद्रियों पर ध्यान दें. यह आपको वर्तमान में लाएगा.
          <br />
          <span class="text-xs text-stone-500 dark:text-stone-400">
            Focus on your senses. This will bring you to the present.
          </span>
        </p>
        <ol class="space-y-3" role="list">
          {groundingSteps.map((s) => (
            <li
              key={s.count}
              class="flex min-h-[48px] items-center gap-3 rounded-lg border-2 border-community/20 bg-white px-4 py-3 dark:border-community/30 dark:bg-stone-900"
            >
              <span
                class="flex h-10 w-10 items-center justify-center rounded-full bg-community text-lg font-extrabold text-white"
                aria-hidden="true"
              >
                {s.count}
              </span>
              <div>
                <p class="font-semibold text-stone-900 dark:text-stone-100">
                  {s.hi}
                </p>
                <p class="text-xs text-stone-500 dark:text-stone-400">
                  {s.en}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Helplines */}
      <section
        aria-labelledby="helplines-heading"
        class="rounded-xl border-2 border-crisis/30 bg-red-50 p-6 dark:border-crisis/40 dark:bg-red-950"
      >
        <h2
          id="helplines-heading"
          class="mb-4 text-xl font-bold text-crisis"
        >
          हेल्पलाइन नंबर{" "}
          <span class="text-sm font-normal text-stone-600 dark:text-stone-400">
            Helpline Numbers
          </span>
        </h2>
        <ul class="space-y-2" role="list">
          {mentalHealthContacts.map((c: { id: string; number: string; nameHi: string; name: string; available: string }) => (
            <li key={c.id}>
              <a
                href={`tel:${c.number}`}
                class="flex min-h-[48px] items-center gap-3 rounded-lg border-2 border-crisis/20 bg-white px-4 py-3 font-semibold text-stone-900 hover:border-crisis hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:border-crisis/30 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-red-950"
                aria-label={`${c.nameHi} - ${c.number} पर कॉल करें`}
              >
                <div>
                  <span class="block text-lg font-bold text-crisis">
                    {c.number}
                  </span>
                  <span class="block text-sm text-stone-700 dark:text-stone-300">
                    {c.nameHi}
                  </span>
                  <span class="block text-xs text-stone-500 dark:text-stone-400">
                    {c.name} | {c.available}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="और विकल्प / More options" class="flex gap-3">
        <a
          href="/sahara/triage"
          class="min-h-[48px] rounded-lg border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          योजनाएं खोजें / Find Schemes
        </a>
        <a
          href="/"
          class="min-h-[48px] rounded-lg border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          होम / Home
        </a>
      </nav>
    </div>
  );
});

export const head: DocumentHead = {
  title: "मानसिक स्वास्थ्य सहायता | Mental Health Support | उड़ान",
  meta: [
    {
      name: "description",
      content: "श्वास व्यायाम, ग्राउंडिंग और हेल्पलाइन। Breathing exercises, grounding, and helpline numbers.",
    },
  ],
};
