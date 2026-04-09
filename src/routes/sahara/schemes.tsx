import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import type {
  State,
  AgeBracket,
  IncomeBracket,
  Category,
  Gender,
  OccupationType,
  CrisisType,
} from "../../shared/types";
import { findSchemes } from "../../lib/eligibility/engine";
import { SchemeCard } from "../../components/crisis/scheme-card";
import emergencyContacts from "../../data/emergency/contacts.json";

export default component$(() => {
  const loc = useLocation();
  const params = loc.url.searchParams;

  const profile = {
    id: "triage-user",
    state: (params.get("state") || "UP") as State,
    ageBracket: (params.get("age") || "26-35") as AgeBracket,
    incomeBracket: (params.get("income") || "BPL") as IncomeBracket,
    category: (params.get("category") || "General") as Category,
    gender: (params.get("gender") || "male") as Gender,
    occupationType: (params.get("occupation") || "unemployed") as OccupationType,
    language: "hi" as const,
    crisisType: (params.get("crisis") || "job-loss") as CrisisType,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const urgency = params.get("urgency") || "stable";
  const schemes = findSchemes(profile);
  const isImmediate = urgency === "immediate";

  const mentalHealthContacts = emergencyContacts.filter(
    (c: { type: string }) => c.type === "mental-health"
  );

  return (
    <div class="mx-auto max-w-2xl space-y-6">
      <section aria-labelledby="schemes-heading">
        <h1
          id="schemes-heading"
          class="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          आपके लिए योजनाएं
          <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
            Schemes for You
          </span>
        </h1>

        {schemes.length > 0 && (
          <p class="mt-2 text-sm text-stone-600 dark:text-stone-400">
            {schemes.length} योजनाएं मिलीं / {schemes.length} schemes found
          </p>
        )}
      </section>

      {/* Immediate urgency: emergency contacts first, always */}
      {isImmediate && (
        <section
          aria-labelledby="immediate-help-heading"
          class="rounded-xl border-2 border-crisis bg-red-50 p-4 dark:bg-red-950"
        >
          <h2
            id="immediate-help-heading"
            class="text-lg font-bold text-crisis"
          >
            तुरंत मदद उपलब्ध है
            <span class="block text-sm font-normal text-stone-600 dark:text-stone-400">
              Immediate help is available
            </span>
          </h2>
          <ul class="mt-2 space-y-2" role="list">
            <li>
              <a
                href="tel:112"
                class="flex min-h-[48px] items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold text-crisis hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:bg-stone-900 dark:hover:bg-red-950"
                aria-label="आपातकालीन सेवा 112 पर कॉल करें"
              >
                112 - आपातकालीन सेवा / Emergency
              </a>
            </li>
            {mentalHealthContacts.map((c: { id: string; number: string; nameHi: string }) => (
              <li key={c.id}>
                <a
                  href={`tel:${c.number}`}
                  class="flex min-h-[48px] items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-stone-900 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-red-950"
                  aria-label={`${c.nameHi} - ${c.number} पर कॉल करें`}
                >
                  {c.number} - {c.nameHi}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Scheme results or caring empty state */}
      {schemes.length === 0 ? (
        <div
          class="rounded-xl border-2 border-purpose/30 bg-blue-50 p-6 text-center dark:border-purpose/40 dark:bg-blue-950"
          role="status"
        >
          <p class="text-xl font-bold text-stone-900 dark:text-stone-100">
            हम समझते हैं, कोई बात नहीं
          </p>
          <p class="mt-2 text-base text-stone-700 dark:text-stone-300">
            अभी कोई योजना नहीं मिली, लेकिन और रास्ते हैं.
          </p>
          <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
            We understand. No schemes matched right now, but there are other paths.
          </p>
          <div class="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href="/sahara/triage"
              class="inline-flex min-h-[48px] items-center rounded-lg bg-purpose px-4 py-2 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2"
            >
              जानकारी बदलें / Change Details
            </a>
            <a
              href="/sahara/mental-health"
              class="inline-flex min-h-[48px] items-center rounded-lg border-2 border-purpose/30 px-4 py-2 font-semibold text-purpose hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2"
            >
              सांस लें / Take a Breath
            </a>
          </div>
        </div>
      ) : (
        <div class="space-y-4">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

      {/* Bridge to Layer 2: warm, not clinical */}
      <section
        aria-labelledby="bridge-purpose-heading"
        class="rounded-xl border-2 border-purpose/30 bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:border-purpose/40 dark:from-blue-950 dark:to-blue-900"
      >
        <h2
          id="bridge-purpose-heading"
          class="text-xl font-bold text-stone-900 dark:text-stone-100"
        >
          अब मकसद खोजें?
        </h2>
        <p class="mt-1 text-base text-stone-700 dark:text-stone-300">
          योजनाएं सहारा हैं. असली ताकत उद्देश्य में है.
        </p>
        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Schemes are support. Real strength is in purpose.
        </p>
        <a
          href="/khoj/compass"
          class="mt-3 inline-flex min-h-[48px] items-center rounded-lg bg-purpose px-5 py-2.5 font-bold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2"
          aria-label="उद्देश्य खोजें / Discover your purpose"
        >
          5 सवाल, आपका रास्ता
          <span class="ml-2 text-sm font-normal opacity-80">5 questions, your path</span>
        </a>
      </section>

      {/* Mental health check-in */}
      <a
        href="/sahara/mental-health"
        class="flex min-h-[48px] items-center gap-3 rounded-xl border-2 border-community/30 bg-green-50 px-4 py-3 hover:bg-green-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-community focus-visible:ring-offset-2 dark:border-community/40 dark:bg-green-950 dark:hover:bg-green-900"
        aria-label="मानसिक स्वास्थ्य सहायता / Mental Health Support"
      >
        <span class="text-2xl" aria-hidden="true">&#x1F33F;</span>
        <div>
          <span class="block text-sm font-bold text-stone-900 dark:text-stone-100">
            मन भारी है? एक पल रुकें.
          </span>
          <span class="block text-xs text-stone-500 dark:text-stone-400">
            Feeling heavy? Pause for a moment. Breathing exercises and grounding.
          </span>
        </div>
      </a>
    </div>
  );
});

export const head: DocumentHead = {
  title: "आपके लिए योजनाएं | Schemes for You | उड़ान",
  meta: [
    {
      name: "description",
      content: "आपके लिए सरकारी योजनाएं। Government schemes matched to your profile.",
    },
  ],
};
