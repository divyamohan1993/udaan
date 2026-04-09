import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({ staleWhileRevalidate: 60 * 60 * 24, maxAge: 5 });
};

export default component$(() => {
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
        </nav>
      </header>

      <main id="main-content" role="main" class="mx-auto max-w-5xl px-4 py-6">
        <Slot />
      </main>

      <footer
        role="contentinfo"
        class="border-t-2 border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900"
      >
        <div class="mx-auto max-w-5xl px-4 py-6 text-center">
          <p class="text-sm text-stone-600 dark:text-stone-400">
            <strong class="text-stone-900 dark:text-stone-100">उड़ान</strong>{" "}
            संकट से संकल्प तक | From Crisis to Purpose
          </p>
          <p class="mt-1 text-xs text-stone-500 dark:text-stone-500">
            सपने देखो, साकार करो, साथ चलो | Dream, Manifest, Journey as One
          </p>
        </div>
      </footer>
    </div>
  );
});
