/**
 * Emergency Footer -- appears on EVERY page.
 * Defense in depth: hardcoded numbers, no data dependency.
 * Always works, even if everything else breaks.
 */
import { component$ } from "@builder.io/qwik";

export const EmergencyFooter = component$(() => {
  return (
    <div
      class="border-t border-crisis/10 bg-crisis/5 px-4 py-3 mt-8"
      role="complementary"
      aria-label="Emergency contacts"
    >
      <p class="text-xs text-stone-500 mb-1.5 font-semibold">
        आपातकालीन / Emergency
      </p>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a
          href="tel:112"
          class="text-crisis font-bold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-crisis focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center"
          aria-label="Emergency services: dial 112"
        >
          112 Emergency
        </a>
        <a
          href="tel:1800-599-0019"
          class="text-purpose font-semibold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-purpose focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center"
          aria-label="KIRAN mental health helpline: dial 1800-599-0019"
        >
          1800-599-0019 KIRAN
        </a>
        <a
          href="tel:181"
          class="text-stone-700 dark:text-stone-300 font-semibold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-stone-500 focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center"
          aria-label="Women helpline: dial 181"
        >
          181 Women
        </a>
      </div>
    </div>
  );
});
