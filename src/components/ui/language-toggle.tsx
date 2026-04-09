import { component$, type QRL } from "@builder.io/qwik";

interface LanguageToggleProps {
  locale: "hi" | "en";
  onToggle$: QRL<(locale: "hi" | "en") => void>;
}

export const LanguageToggle = component$<LanguageToggleProps>(
  ({ locale, onToggle$ }) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={locale === "hi"}
        aria-label={
          locale === "hi"
            ? "भाषा बदलें: हिन्दी चुनी है, अंग्रेज़ी पर बदलें"
            : "Change language: English selected, switch to Hindi"
        }
        onClick$={() => onToggle$(locale === "hi" ? "en" : "hi")}
        class={[
          "inline-flex min-h-[48px] min-w-[48px] items-center gap-1 rounded-lg border-2 px-3 py-2",
          "font-bold text-base",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2",
          "cursor-pointer select-none transition-colors duration-150",
          "border-stone-300 bg-white hover:bg-stone-50",
          "dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700",
        ].join(" ")}
      >
        <span
          class={
            locale === "hi"
              ? "text-purpose font-extrabold"
              : "text-stone-400"
          }
          aria-hidden="true"
        >
          हि
        </span>
        <span class="text-stone-400" aria-hidden="true">
          /
        </span>
        <span
          class={
            locale === "en"
              ? "text-purpose font-extrabold"
              : "text-stone-400"
          }
          aria-hidden="true"
        >
          En
        </span>
      </button>
    );
  }
);
