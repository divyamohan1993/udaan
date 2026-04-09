import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { CrisisType } from "../shared/types";

interface CrisisEntry {
  type: CrisisType;
  emoji: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
}

const crisisEntries: CrisisEntry[] = [
  {
    type: "job-loss",
    emoji: "\uD83D\uDCBC",
    titleHi: "नौकरी गई",
    titleEn: "Lost my job",
    descHi: "रोज़गार खोजने और सरकारी योजनाओं का लाभ लेने में मदद",
  },
  {
    type: "no-food",
    emoji: "\uD83C\uDF5A",
    titleHi: "खाना नहीं है",
    titleEn: "No food",
    descHi: "तुरंत भोजन सहायता और राशन योजनाएं",
  },
  {
    type: "no-money",
    emoji: "\uD83D\uDCB0",
    titleHi: "पैसे नहीं हैं",
    titleEn: "No money",
    descHi: "वित्तीय सहायता योजनाएं और आपातकालीन मदद",
  },
  {
    type: "health",
    emoji: "\uD83C\uDFE5",
    titleHi: "स्वास्थ्य समस्या",
    titleEn: "Health issue",
    descHi: "मुफ्त इलाज और स्वास्थ्य बीमा योजनाएं",
  },
  {
    type: "lost",
    emoji: "\uD83E\uDDED",
    titleHi: "रास्ता नहीं मिल रहा",
    titleEn: "Feeling lost",
    descHi: "मानसिक स्वास्थ्य सहायता और मार्गदर्शन",
  },
  {
    type: "purpose",
    emoji: "\uD83C\uDF1F",
    titleHi: "उद्देश्य चाहिए",
    titleEn: "Need purpose",
    descHi: "अपना रास्ता खोजें, समुदाय से जुड़ें",
  },
];

const emergencyContacts = [
  { number: "112", labelHi: "आपातकालीन सेवा", labelEn: "Emergency" },
  { number: "1800-599-0019", labelHi: "मानसिक स्वास्थ्य (किरण)", labelEn: "Mental Health (KIRAN)" },
  { number: "181", labelHi: "महिला हेल्पलाइन", labelEn: "Women Helpline" },
];

export default component$(() => {
  return (
    <div class="space-y-10">
      <section aria-labelledby="hero-heading" class="py-8 text-center">
        <p class="text-lg font-semibold text-purpose dark:text-blue-300">
          आपकी मदद यहाँ है
        </p>
        <h1
          id="hero-heading"
          class="mt-2 font-display text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl"
        >
          <span class="text-crisis">उड़ान</span>
        </h1>
        <p class="mt-3 text-xl font-semibold text-stone-700 dark:text-stone-300">
          संकट में सहारा. उद्देश्य की खोज. समुदाय का संगम.
        </p>
        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Help is here. Support in crisis. Discovery of purpose. Confluence of community.
        </p>
      </section>

      <section aria-labelledby="crisis-heading">
        <h2
          id="crisis-heading"
          class="mb-6 text-center text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          आपको किस मदद की ज़रूरत है?
          <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
            What help do you need?
          </span>
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crisisEntries.map((entry) => (
            <a
              key={entry.type}
              href={`/sahara/triage?crisis=${entry.type}`}
              class={[
                "group flex min-h-[48px] items-start gap-3 rounded-xl border-2 p-4",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2",
                entry.type === "lost" || entry.type === "purpose"
                  ? "border-purpose/30 bg-blue-50 hover:border-purpose hover:bg-blue-100 dark:border-purpose/40 dark:bg-blue-950 dark:hover:bg-blue-900"
                  : "border-crisis/30 bg-red-50 hover:border-crisis hover:bg-red-100 dark:border-crisis/40 dark:bg-red-950 dark:hover:bg-red-900",
              ].join(" ")}
              aria-label={`${entry.titleHi} - ${entry.titleEn}`}
            >
              <span class="text-2xl" aria-hidden="true">
                {entry.emoji}
              </span>
              <div>
                <span class="block text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:underline">
                  {entry.titleHi}
                </span>
                <span class="block text-sm font-semibold text-stone-600 dark:text-stone-400">
                  {entry.titleEn}
                </span>
                <span class="mt-1 block text-sm text-stone-600 dark:text-stone-400">
                  {entry.descHi}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="emergency-heading"
        class="rounded-xl border-2 border-crisis/30 bg-red-50 p-6 dark:border-crisis/40 dark:bg-red-950"
      >
        <h2
          id="emergency-heading"
          class="mb-4 text-xl font-bold text-crisis"
        >
          आपातकालीन संपर्क{" "}
          <span class="text-sm font-normal text-stone-600 dark:text-stone-400">
            Emergency Contacts
          </span>
        </h2>
        <ul class="grid gap-3 sm:grid-cols-3" role="list">
          {emergencyContacts.map((contact) => (
            <li key={contact.number}>
              <a
                href={`tel:${contact.number}`}
                class={[
                  "flex min-h-[48px] items-center gap-3 rounded-lg border-2 border-crisis/20 bg-white px-4 py-3",
                  "font-semibold text-stone-900",
                  "hover:border-crisis hover:bg-red-50",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2",
                  "dark:border-crisis/30 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-red-950",
                ].join(" ")}
                aria-label={`कॉल करें ${contact.labelHi} - ${contact.number}`}
              >
                <span class="text-xl text-crisis" aria-hidden="true">
                  \u260E\uFE0F
                </span>
                <div>
                  <span class="block text-lg font-bold">{contact.number}</span>
                  <span class="block text-xs text-stone-600 dark:text-stone-400">
                    {contact.labelHi}
                  </span>
                  <span class="block text-xs text-stone-500 dark:text-stone-500">
                    {contact.labelEn}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="मुख्य सेवाएं / Main services" class="grid gap-4 sm:grid-cols-3">
        <a
          href="/sahara/triage"
          class="flex min-h-[48px] flex-col items-center gap-2 rounded-xl border-2 border-crisis/30 bg-red-50 p-6 text-center hover:border-crisis focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:border-crisis/40 dark:bg-red-950 dark:hover:border-crisis"
          aria-label="सहारा - संकट सहायता / Sahara - Crisis Support"
        >
          <span class="text-3xl font-extrabold text-crisis">सहारा</span>
          <span class="text-sm text-stone-600 dark:text-stone-400">
            Crisis Support
          </span>
        </a>
        <a
          href="/khoj/compass"
          class="flex min-h-[48px] flex-col items-center gap-2 rounded-xl border-2 border-purpose/30 bg-blue-50 p-6 text-center hover:border-purpose focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-purpose/40 dark:bg-blue-950 dark:hover:border-purpose"
          aria-label="खोज - उद्देश्य खोज / Khoj - Purpose Discovery"
        >
          <span class="text-3xl font-extrabold text-purpose">खोज</span>
          <span class="text-sm text-stone-600 dark:text-stone-400">
            Purpose Discovery
          </span>
        </a>
        <a
          href="/sangam/circles"
          class="flex min-h-[48px] flex-col items-center gap-2 rounded-xl border-2 border-community/30 bg-green-50 p-6 text-center hover:border-community focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-community focus-visible:ring-offset-2 dark:border-community/40 dark:bg-green-950 dark:hover:border-community"
          aria-label="संगम - समुदाय / Sangam - Community"
        >
          <span class="text-3xl font-extrabold text-community">संगम</span>
          <span class="text-sm text-stone-600 dark:text-stone-400">
            Community Circles
          </span>
        </a>
      </nav>
    </div>
  );
});

export const head: DocumentHead = {
  title: "उड़ान Udaan - संकट से संकल्प तक | From Crisis to Purpose",
  meta: [
    {
      name: "description",
      content:
        "उड़ान - संकट में सहारा, उद्देश्य की खोज, समुदाय का संगम। Udaan - Crisis support, purpose discovery, community building for India.",
    },
    { property: "og:title", content: "उड़ान Udaan - From Crisis to Purpose" },
    {
      property: "og:description",
      content: "Crisis support, purpose discovery, community building for India.",
    },
    { name: "theme-color", content: "#dc2626" },
  ],
  links: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Noto+Sans:wght@400;600;700;800&display=swap",
    },
  ],
};
