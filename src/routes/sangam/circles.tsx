import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { Circle } from "../../shared/types";
import { CircleCard } from "../../components/community/circle-card";
import { CreateCircle } from "../../components/community/create-circle";
import { Button } from "../../components/ui/button";
import { JourneyBridge } from "../../components/shared/journey-bridge";

const demoCircles: Circle[] = [
  {
    id: "circle-1",
    name: "मोहल्ला शिक्षक मंडल",
    mission: {
      id: "mission-teach",
      title: "Teach children in your locality",
      titleHi: "अपने मोहल्ले के बच्चों को पढ़ाएं",
      description: "Volunteer to teach basic literacy and numeracy to neighborhood children",
      descriptionHi: "पड़ोस के बच्चों को बुनियादी साक्षरता और गणित सिखाने के लिए स्वयंसेवा करें",
      category: "knowledge",
      requirements: ["2 hours per week", "Basic literacy"],
      impactMetric: "Children taught per month",
      impactMetricHi: "प्रति माह पढ़ाए गए बच्चे",
      difficulty: "easy",
    },
    members: ["user-1", "user-2", "user-3", "user-4", "user-5"],
    location: "गोमती नगर, लखनऊ",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    activityLog: [
      {
        id: "act-1",
        circleId: "circle-1",
        description: "Conducted math class for 8 children",
        descriptionHi: "8 बच्चों के लिए गणित की कक्षा ली",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        memberId: "user-1",
      },
      {
        id: "act-2",
        circleId: "circle-1",
        description: "Distributed notebooks to 12 students",
        descriptionHi: "12 छात्रों को कॉपियां बांटीं",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        memberId: "user-3",
      },
      {
        id: "act-3",
        circleId: "circle-1",
        description: "Weekly reading session with 15 kids",
        descriptionHi: "15 बच्चों के साथ साप्ताहिक पठन सत्र",
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        memberId: "user-2",
      },
    ],
  },
  {
    id: "circle-2",
    name: "हरित बागान समूह",
    mission: {
      id: "mission-garden",
      title: "Start a community garden",
      titleHi: "सामुदायिक बागान शुरू करें",
      description: "Transform empty plots into productive community gardens",
      descriptionHi: "खाली ज़मीन को उत्पादक सामुदायिक बागान में बदलें",
      category: "nature",
      requirements: ["Land access", "Basic gardening tools"],
      impactMetric: "Kg of vegetables grown per month",
      impactMetricHi: "प्रति माह उगाई गई सब्ज़ियां (किलो)",
      difficulty: "medium",
    },
    members: ["user-6", "user-7", "user-8", "user-9", "user-10", "user-11"],
    location: "राजाजीपुरम, लखनऊ",
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    activityLog: [
      {
        id: "act-4",
        circleId: "circle-2",
        description: "Harvested 25kg tomatoes this week",
        descriptionHi: "इस हफ़्ते 25 किलो टमाटर तोड़े",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        memberId: "user-7",
      },
      {
        id: "act-5",
        circleId: "circle-2",
        description: "Planted new batch of spinach and coriander",
        descriptionHi: "पालक और धनिया की नई फ़सल लगाई",
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
        memberId: "user-9",
      },
    ],
  },
  {
    id: "circle-3",
    name: "कथा कहानी मंच",
    mission: {
      id: "mission-stories",
      title: "Document local history and stories",
      titleHi: "स्थानीय इतिहास और कहानियां दस्तावेज़ करें",
      description: "Record oral histories and local stories before they are lost",
      descriptionHi: "मौखिक इतिहास और स्थानीय कहानियों को खोने से पहले दर्ज करें",
      category: "expression",
      requirements: ["Recording device", "Writing skills"],
      impactMetric: "Stories documented per month",
      impactMetricHi: "प्रति माह दर्ज की गई कहानियां",
      difficulty: "easy",
    },
    members: ["user-12", "user-13", "user-14", "user-15"],
    location: "चौक, लखनऊ",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    activityLog: [
      {
        id: "act-6",
        circleId: "circle-3",
        description: "Recorded 3 stories from elderly residents",
        descriptionHi: "बुज़ुर्ग निवासियों से 3 कहानियां रिकॉर्ड कीं",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        memberId: "user-12",
      },
    ],
  },
];

export default component$(() => {
  const showCreateForm = useSignal(false);

  return (
    <div class="mx-auto max-w-2xl space-y-6">
      <section aria-labelledby="circles-heading">
        <div class="flex items-center justify-between">
          <h1
            id="circles-heading"
            class="text-2xl font-bold text-stone-900 dark:text-stone-100"
          >
            समुदाय मंडल
            <span class="block text-sm font-normal text-stone-500 dark:text-stone-400 mt-1">
              Community Circles
            </span>
          </h1>
          {!showCreateForm.value && (
            <Button
              variant="community"
              size="sm"
              onClick$={$(() => { showCreateForm.value = true; })}
              ariaLabel="नया मंडल बनाएं / Create New Circle"
            >
              + नया मंडल
            </Button>
          )}
        </div>
        <p class="mt-2 text-sm text-stone-600 dark:text-stone-400">
          अपने मोहल्ले में लोगों से जुड़ें, साथ मिलकर बदलाव लाएं
          <br />
          <span class="text-xs">
            Connect with people in your neighborhood, create change together
          </span>
        </p>
      </section>

      {showCreateForm.value && (
        <CreateCircle onClose$={$(() => { showCreateForm.value = false; })} />
      )}

      <div class="space-y-4">
        {demoCircles.map((circle) => (
          <CircleCard key={circle.id} circle={circle} />
        ))}
      </div>

      {/* Cross-layer: scheme reminder for circle context */}
      <section
        aria-labelledby="scheme-hint-heading"
        class="rounded-xl border-2 border-crisis/20 bg-red-50 p-4 dark:border-crisis/30 dark:bg-red-950"
      >
        <h2
          id="scheme-hint-heading"
          class="text-base font-bold text-stone-900 dark:text-stone-100"
        >
          क्या आपके मंडल को सरकारी मदद मिल सकती है?
        </h2>
        <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
          बागान चलाते हैं? PM-KISAN से मदद मिल सकती है. बच्चों को पढ़ाते हैं? शिक्षा योजनाएं देखें.
        </p>
        <p class="text-xs text-stone-500 dark:text-stone-500 mt-1">
          Running a garden? PM-KISAN can help. Teaching kids? Check education schemes.
        </p>
        <a
          href="/sahara/triage"
          class="mt-2 inline-flex min-h-[48px] items-center rounded-lg border-2 border-crisis/30 px-4 py-2 text-sm font-semibold text-crisis hover:bg-red-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-crisis focus-visible:ring-offset-2 dark:hover:bg-red-900"
        >
          योजनाएं खोजें / Find Schemes
        </a>
      </section>

      {/* Cross-layer: mental health check-in */}
      <a
        href="/sahara/mental-health"
        class="flex min-h-[48px] items-center gap-3 rounded-xl border-2 border-purpose/20 bg-blue-50 px-4 py-3 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2 dark:border-purpose/30 dark:bg-blue-950 dark:hover:bg-blue-900"
        aria-label="मानसिक स्वास्थ्य जांच / Mental health check-in"
      >
        <span class="text-xl" aria-hidden="true">&#x1F33F;</span>
        <div>
          <span class="block text-sm font-bold text-stone-900 dark:text-stone-100">
            समुदाय में होना अच्छा है, लेकिन अपना ख़्याल भी रखें
          </span>
          <span class="block text-xs text-stone-500 dark:text-stone-400">
            Community is good, but take care of yourself too. Breathing exercises inside.
          </span>
        </div>
      </a>

      {/* Cross-layer: purpose compass if not done */}
      <section
        aria-labelledby="bridge-khoj-heading"
        class="rounded-xl border-2 border-purpose/20 bg-gradient-to-br from-blue-50 to-white p-4 dark:border-purpose/30 dark:from-blue-950 dark:to-stone-900"
      >
        <h2
          id="bridge-khoj-heading"
          class="text-base font-bold text-stone-900 dark:text-stone-100"
        >
          अपना उद्देश्य अभी तक नहीं खोजा?
        </h2>
        <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
          5 सवाल. आपका मिशन. सही मंडल.
        </p>
        <p class="text-xs text-stone-500 dark:text-stone-500">
          5 questions. Your mission. The right circle.
        </p>
        <a
          href="/khoj/compass"
          class="mt-2 inline-flex min-h-[48px] items-center rounded-lg bg-purpose px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2"
        >
          उद्देश्य खोजें / Find Purpose
        </a>
      </section>

      {/* Journey-aware bridge */}
      <JourneyBridge />
    </div>
  );
});

export const head: DocumentHead = {
  title: "समुदाय मंडल | Community Circles | उड़ान",
  meta: [
    {
      name: "description",
      content: "समुदाय मंडलों से जुड़ें और साथ मिलकर बदलाव लाएं। Join community circles and create change together.",
    },
  ],
};
