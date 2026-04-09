/**
 * Mental Health FAB -- floating access to mental health support.
 * Visible on EVERY page. Because crisis doesn't wait for navigation.
 * Defense in depth: links to tel: directly, works without JS.
 */
import { component$, useSignal } from "@builder.io/qwik";

export const MentalHealthFab = component$(() => {
  const expanded = useSignal(false);

  return (
    <div
      class="fixed bottom-4 right-4 z-50"
      role="region"
      aria-label="Mental health quick access"
    >
      {expanded.value && (
        <div class="mb-2 rounded-xl bg-white dark:bg-stone-900 border-2 border-purpose/30 shadow-lg p-3 space-y-2 min-w-[200px]">
          <a
            href="/sahara/mental-health"
            class="block text-sm font-semibold text-purpose hover:underline min-h-[44px] flex items-center"
          >
            🫁 सांस लें / Breathe
          </a>
          <a
            href="tel:1800-599-0019"
            class="block text-sm font-semibold text-crisis hover:underline min-h-[44px] flex items-center"
          >
            📞 KIRAN: 1800-599-0019
          </a>
          <a
            href="tel:988"
            class="block text-sm text-stone-600 dark:text-stone-400 hover:underline min-h-[44px] flex items-center"
          >
            📞 988 Helpline
          </a>
        </div>
      )}

      <button
        type="button"
        onClick$={() => { expanded.value = !expanded.value; }}
        class="h-14 w-14 rounded-full bg-purpose text-white shadow-lg flex items-center justify-center text-2xl hover:bg-purpose/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purpose transition-transform active:scale-95"
        aria-label={expanded.value ? "Close mental health menu" : "Mental health support"}
        aria-expanded={expanded.value}
      >
        {expanded.value ? "✕" : "🤍"}
      </button>
    </div>
  );
});
