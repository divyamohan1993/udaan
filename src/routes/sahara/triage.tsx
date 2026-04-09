import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { CrisisType } from "../../shared/types";
import { TriageForm } from "../../components/crisis/triage-form";

const reassuranceMessages: Record<CrisisType, { hi: string; en: string }> = {
  "job-loss": {
    hi: "चिंता मत करें. लाखों लोगों ने इस स्थिति से बाहर निकलने का रास्ता पाया है. हम आपको सही सरकारी योजनाओं से जोड़ेंगे.",
    en: "Don't worry. Millions have found a way out. We'll connect you with the right government schemes.",
  },
  "no-food": {
    hi: "आप अकेले नहीं हैं. तुरंत भोजन सहायता उपलब्ध है. हम अभी आपकी मदद करते हैं.",
    en: "You're not alone. Immediate food assistance is available.",
  },
  "no-money": {
    hi: "वित्तीय संकट अस्थायी है. कई सरकारी योजनाएं आपकी मदद के लिए बनी हैं.",
    en: "Financial crisis is temporary. Many government schemes exist to help you.",
  },
  health: {
    hi: "आपका स्वास्थ्य सबसे पहले. मुफ्त इलाज की कई सरकारी योजनाएं हैं.",
    en: "Your health comes first. Many free treatment schemes are available.",
  },
  lost: {
    hi: "रास्ता खोना कमज़ोरी नहीं है. आप सही जगह आए हैं.",
    en: "Feeling lost isn't weakness. You've come to the right place.",
  },
  purpose: {
    hi: "उद्देश्य की तलाश सबसे बड़ी ताकत है. आइए साथ मिलकर आपका रास्ता खोजें.",
    en: "Searching for purpose is the greatest strength. Let's find your path together.",
  },
};

export default component$(() => {
  const loc = useLocation();
  const crisisType = (loc.url.searchParams.get("crisis") || "job-loss") as CrisisType;
  const reassurance = reassuranceMessages[crisisType] ?? reassuranceMessages["job-loss"];

  return (
    <div class="mx-auto max-w-lg space-y-6">
      <section aria-labelledby="triage-heading">
        <h1
          id="triage-heading"
          class="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          आइए आपकी मदद करते हैं
          <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
            Let us help you
          </span>
        </h1>

        <div
          class="mt-4 rounded-xl border-2 border-purpose/30 bg-blue-50 p-4 dark:border-purpose/40 dark:bg-blue-950"
          role="status"
          aria-live="polite"
        >
          <p class="text-base font-semibold text-stone-900 dark:text-stone-100">
            {reassurance.hi}
          </p>
          <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {reassurance.en}
          </p>
        </div>
      </section>

      <section>
        <TriageForm crisisType={crisisType} />
      </section>

      <nav aria-label="सहायता लिंक / Help links" class="flex gap-3">
        <a
          href="/sahara/mental-health"
          class="min-h-[48px] rounded-lg border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          मानसिक स्वास्थ्य सहायता / Mental Health
        </a>
      </nav>
    </div>
  );
});

export const head: DocumentHead = {
  title: "सहारा - संकट आकलन | Sahara - Crisis Triage | उड़ान",
  meta: [
    {
      name: "description",
      content: "अपनी जानकारी दें और सरकारी योजनाएं खोजें। Crisis assessment to find matching government schemes.",
    },
  ],
};
