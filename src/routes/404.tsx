import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="mx-auto max-w-lg py-12 text-center space-y-6">
      <div
        class="rounded-xl border-2 border-purpose/30 bg-blue-50 p-8 dark:border-purpose/40 dark:bg-blue-950"
        role="alert"
      >
        <p class="text-2xl font-bold text-stone-900 dark:text-stone-100">
          हम समझते हैं, कोई बात नहीं
        </p>
        <p class="mt-2 text-base text-stone-700 dark:text-stone-300">
          यह पेज नहीं मिला. लेकिन आपकी मदद अभी भी यहाँ है.
        </p>
        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
          We understand, no worries. This page wasn't found, but help is still here.
        </p>
      </div>

      <div class="flex flex-col items-center gap-3">
        <a
          href="/"
          class="inline-flex min-h-[48px] items-center rounded-lg bg-purpose px-6 py-3 font-bold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2"
          aria-label="होम पेज पर जाएं / Go to Home"
        >
          वापस जाएं / Go Home
        </a>

        <div class="flex flex-wrap justify-center gap-3">
          <a
            href="/sahara/triage"
            class="min-h-[48px] rounded-lg border-2 border-crisis/30 px-4 py-2 text-sm font-semibold text-crisis hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:hover:bg-red-950"
          >
            योजनाएं खोजें / Find Schemes
          </a>
          <a
            href="/sahara/mental-health"
            class="min-h-[48px] rounded-lg border-2 border-purpose/30 px-4 py-2 text-sm font-semibold text-purpose hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:hover:bg-blue-950"
          >
            सांस लें / Breathe
          </a>
        </div>
      </div>

      {/* Hardcoded emergency -- always works */}
      <div class="text-center text-sm text-stone-500 dark:text-stone-400">
        <p class="font-semibold text-crisis">आपातकालीन / Emergency</p>
        <p>
          <a href="tel:112" class="text-crisis font-bold hover:underline focus-visible:outline-2 focus-visible:outline-crisis">112</a>
          {" | "}
          <a href="tel:1800-599-0019" class="text-purpose font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-purpose">KIRAN 1800-599-0019</a>
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "पेज नहीं मिला | Page Not Found | उड़ान",
  meta: [
    {
      name: "description",
      content: "यह पेज नहीं मिला। This page was not found.",
    },
  ],
};
