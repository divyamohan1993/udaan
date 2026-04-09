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

        <p class="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {schemes.length} योजनाएं मिलीं / {schemes.length} schemes found
        </p>
      </section>

      {isImmediate && (
        <section
          aria-labelledby="immediate-help-heading"
          class="rounded-xl border-2 border-crisis bg-red-50 p-4 dark:bg-red-950"
        >
          <h2
            id="immediate-help-heading"
            class="text-lg font-bold text-crisis"
          >
            तुरंत मदद / Immediate Help
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

      {schemes.length === 0 ? (
        <div
          class="rounded-xl border-2 border-stone-200 bg-stone-50 p-6 text-center dark:border-stone-700 dark:bg-stone-800"
          role="status"
        >
          <p class="text-lg font-semibold text-stone-700 dark:text-stone-300">
            कोई योजना नहीं मिली
          </p>
          <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
            No schemes found. Please try changing your details.
          </p>
          <a
            href="/sahara/triage"
            class="mt-4 inline-flex min-h-[48px] items-center rounded-lg bg-purpose px-4 py-2 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2"
          >
            दोबारा कोशिश करें / Try Again
          </a>
        </div>
      ) : (
        <div class="space-y-4">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

      <nav aria-label="और विकल्प / More options" class="flex flex-wrap gap-3">
        <a
          href="/sahara/triage"
          class="min-h-[48px] rounded-lg border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          जानकारी बदलें / Change Details
        </a>
        <a
          href="/sahara/mental-health"
          class="min-h-[48px] rounded-lg border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          मानसिक स्वास्थ्य / Mental Health
        </a>
        <a
          href="/khoj/compass"
          class="min-h-[48px] rounded-lg border-2 border-purpose/30 px-4 py-2 text-sm font-semibold text-purpose hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:hover:bg-blue-950"
        >
          उद्देश्य खोजें / Find Purpose
        </a>
      </nav>
    </div>
  );
});

export const head: DocumentHead = {
  title: "योजनाएं | Schemes | उड़ान",
  meta: [
    {
      name: "description",
      content: "आपके लिए सरकारी योजनाएं। Government schemes matched to your profile.",
    },
  ],
};
