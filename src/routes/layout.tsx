import { component$, Slot, useSignal, useContextProvider, createContextId, $ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import type { Signal } from "@builder.io/qwik";

export const LocaleContext = createContextId<Signal<"hi" | "en">>("locale");

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({ staleWhileRevalidate: 60 * 60 * 24, maxAge: 5 });
};

export default component$(() => {
  const locale = useSignal<"hi" | "en">("hi");
  useContextProvider(LocaleContext, locale);

  return (
    <div class="min-h-screen bg-surface text-text font-body dark:bg-surface-dark dark:text-text-dark">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-purpose focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-3 focus:ring-purpose focus:ring-offset-2"
      >
        मुख्य सामग्री पर जाएं / Skip to main content
      </a>

      <header
        role="banner"
        class="sticky top-0 z-40 border-b-2 border-stone-200 bg-white/95 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/95"
      >
        <nav
          aria-label="मुख्य नेविगेशन / Main navigation"
          class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
        >
          <a
            href="/"
            class="text-xl font-extrabold text-stone-900 dark:text-stone-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 rounded-lg px-1"
            aria-label="उड़ान Udaan - होम पेज"
          >
            <span class="text-crisis">उड़ान</span>{" "}
            <span class="text-sm font-semibold text-stone-600 dark:text-stone-400">
              Udaan
            </span>
          </a>

          <div class="flex items-center gap-1">
            <ul class="flex items-center gap-1" role="list">
              <li>
                <a
                  href="/sahara/triage"
                  class="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  सहारा
                </a>
              </li>
              <li>
                <a
                  href="/khoj/compass"
                  class="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  खोज
                </a>
              </li>
              <li>
                <a
                  href="/sangam/circles"
                  class="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  संगम
                </a>
              </li>
            </ul>

            {/* Language toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={locale.value === "hi"}
              aria-label={
                locale.value === "hi"
                  ? "भाषा: हिन्दी. अंग्रेज़ी पर बदलें"
                  : "Language: English. Switch to Hindi"
              }
              onClick$={$(() => { locale.value = locale.value === "hi" ? "en" : "hi"; })}
              class="ml-1 inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg px-2 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-stone-800 cursor-pointer"
            >
              <span class={locale.value === "hi" ? "text-purpose" : "text-stone-400"} aria-hidden="true">हि</span>
              <span class="text-stone-300 mx-0.5" aria-hidden="true">/</span>
              <span class={locale.value === "en" ? "text-purpose" : "text-stone-400"} aria-hidden="true">En</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main" class="mx-auto max-w-5xl px-4 py-6">
        <Slot />
      </main>

      {/* Footer: emergency contacts on every page + mental health link + tagline */}
      <footer
        role="contentinfo"
        class="border-t-2 border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900"
      >
        <div class="mx-auto max-w-5xl px-4 py-6 space-y-4">
          {/* Mental health always accessible */}
          <div class="flex items-center justify-center">
            <a
              href="/sahara/mental-health"
              class="inline-flex min-h-[48px] items-center gap-2 rounded-lg border-2 border-purpose/30 bg-blue-50 px-4 py-2 text-sm font-semibold text-purpose hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-purpose/40 dark:bg-blue-950 dark:hover:bg-blue-900"
              aria-label="मानसिक स्वास्थ्य सहायता / Mental Health Support"
            >
              मन की बात? सांस लें, हम यहाँ हैं
              <span class="text-xs text-stone-500 dark:text-stone-400 ml-1">Feeling overwhelmed? We're here</span>
            </a>
          </div>

          {/* Emergency contacts hardcoded in HTML -- works without JS, without API, without anything */}
          <nav aria-label="आपातकालीन संपर्क / Emergency Contacts" class="flex flex-wrap items-center justify-center gap-3">
            <span class="text-xs font-bold text-crisis" aria-hidden="true">SOS:</span>
            <a
              href="tel:112"
              class="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-crisis/20 px-3 py-1 text-sm font-bold text-crisis hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:hover:bg-red-950"
              aria-label="आपातकालीन सेवा 112"
            >
              112
            </a>
            <a
              href="tel:1800-599-0019"
              class="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-crisis/20 px-3 py-1 text-sm font-semibold text-stone-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-red-950"
              aria-label="किरण मानसिक स्वास्थ्य हेल्पलाइन 1800-599-0019"
            >
              किरण 1800-599-0019
            </a>
            <a
              href="tel:181"
              class="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-crisis/20 px-3 py-1 text-sm font-semibold text-stone-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-red-950"
              aria-label="महिला हेल्पलाइन 181"
            >
              महिला 181
            </a>
            <a
              href="tel:1098"
              class="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-crisis/20 px-3 py-1 text-sm font-semibold text-stone-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:bg-red-950"
              aria-label="चाइल्डलाइन 1098"
            >
              बच्चे 1098
            </a>
          </nav>

          <div class="text-center">
            <p class="text-sm text-stone-600 dark:text-stone-400">
              <strong class="text-stone-900 dark:text-stone-100">उड़ान</strong>{" "}
              संकट से संकल्प तक | From Crisis to Purpose
            </p>
            <p class="mt-1 text-xs text-stone-500 dark:text-stone-500">
              सपने देखो, साकार करो, साथ चलो | Dream, Manifest, Journey as One
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});
