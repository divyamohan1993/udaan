import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { Button } from "../ui/button";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const phases: { phase: BreathPhase; duration: number; labelHi: string; labelEn: string }[] = [
  { phase: "inhale", duration: 4, labelHi: "सांस लें", labelEn: "Breathe in" },
  { phase: "hold", duration: 4, labelHi: "रोकें", labelEn: "Hold" },
  { phase: "exhale", duration: 6, labelHi: "सांस छोड़ें", labelEn: "Breathe out" },
  { phase: "rest", duration: 2, labelHi: "आराम", labelEn: "Rest" },
];

export const BreathingExercise = component$(() => {
  const isRunning = useSignal(false);
  const phaseIndex = useSignal(0);
  const secondsLeft = useSignal(0);
  const timerRef = useSignal<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = phases[phaseIndex.value];

  const stop = $(() => {
    isRunning.value = false;
    if (timerRef.value) {
      clearInterval(timerRef.value);
      timerRef.value = null;
    }
    phaseIndex.value = 0;
    secondsLeft.value = 0;
  });

  const start = $(() => {
    isRunning.value = true;
    phaseIndex.value = 0;
    secondsLeft.value = phases[0].duration;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    const running = track(() => isRunning.value);
    if (!running) return;

    const interval = setInterval(() => {
      if (secondsLeft.value > 1) {
        secondsLeft.value--;
      } else {
        const nextIdx = (phaseIndex.value + 1) % phases.length;
        phaseIndex.value = nextIdx;
        secondsLeft.value = phases[nextIdx].duration;
      }
    }, 1000);

    timerRef.value = interval;
    cleanup(() => clearInterval(interval));
  });

  const circleSize = isRunning.value
    ? currentPhase.phase === "inhale"
      ? "scale-125"
      : currentPhase.phase === "exhale"
        ? "scale-75"
        : "scale-100"
    : "scale-100";

  return (
    <div class="flex flex-col items-center gap-6" role="region" aria-label="श्वास व्यायाम / Breathing Exercise">
      <div
        class={[
          "flex h-48 w-48 items-center justify-center rounded-full border-4 border-purpose bg-blue-50 transition-transform duration-1000 dark:bg-blue-950",
          circleSize,
        ].join(" ")}
        aria-hidden="true"
        style={isRunning.value ? {} : {}}
      >
        <div class="text-center">
          {isRunning.value ? (
            <>
              <p class="text-lg font-bold text-purpose">
                {currentPhase.labelHi}
              </p>
              <p class="text-sm text-stone-600 dark:text-stone-400">
                {currentPhase.labelEn}
              </p>
              <p class="mt-1 text-3xl font-extrabold text-stone-900 dark:text-stone-100">
                {secondsLeft.value}
              </p>
            </>
          ) : (
            <p class="text-base font-semibold text-stone-600 dark:text-stone-400">
              4-4-6-2
            </p>
          )}
        </div>
      </div>

      <div role="status" aria-live="assertive" class="sr-only">
        {isRunning.value
          ? `${currentPhase.labelHi} - ${secondsLeft.value} सेकंड`
          : "श्वास व्यायाम रुका हुआ है"}
      </div>

      <div class="flex gap-3">
        {isRunning.value ? (
          <Button variant="secondary" onClick$={stop} ariaLabel="रुकें / Stop">
            रुकें / Stop
          </Button>
        ) : (
          <Button variant="purpose" onClick$={start} ariaLabel="शुरू करें / Start">
            शुरू करें / Start
          </Button>
        )}
      </div>

      <p class="text-center text-sm text-stone-600 dark:text-stone-400">
        4 सेकंड सांस लें, 4 सेकंड रोकें, 6 सेकंड छोड़ें, 2 सेकंड आराम
        <br />
        <span class="text-xs">
          Breathe in 4s, hold 4s, breathe out 6s, rest 2s
        </span>
      </p>
    </div>
  );
});
