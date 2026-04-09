import { component$, useSignal, useStore, $, type QRL } from "@builder.io/qwik";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { getQuestionOptions } from "../../lib/matching/purpose";

interface CompassFlowProps {
  onComplete$: QRL<(answers: string[]) => void>;
}

const questionTexts = [
  { hi: "काम से पहले क्या करने में मज़ा आता था?", en: "What did you enjoy before work defined you?" },
  { hi: "आपके मोहल्ले को क्या चाहिए?", en: "What does your neighborhood need?" },
  { hi: "अगर पैसों की चिंता न हो तो क्या करेंगे?", en: "What would you do if money wasn't the question?" },
  { hi: "लोगों की कौन सी समस्या आपको सबसे ज़्यादा परेशान करती है?", en: "Which problem of people bothers you the most?" },
  { hi: "आप किसके लिए जाने जाना चाहते हैं?", en: "What do you want to be known for?" },
];

export const CompassFlow = component$<CompassFlowProps>((props) => {
  const step = useSignal(0);
  const answers = useStore<{ values: string[] }>({ values: [] });

  const currentOptions = getQuestionOptions(step.value);
  const currentQ = questionTexts[step.value];

  const handleSelect = $((value: string) => {
    const newValues = [...answers.values];
    newValues[step.value] = value;
    answers.values = newValues;
  });

  const handleNext = $(() => {
    if (step.value < 4) {
      step.value++;
    } else {
      props.onComplete$(answers.values);
    }
  });

  return (
    <div class="space-y-6">
      <Progress
        value={step.value + 1}
        max={5}
        label={`प्रश्न ${step.value + 1} / 5`}
        variant="purpose"
      />

      <div role="status" aria-live="polite" class="sr-only">
        प्रश्न {step.value + 1} / 5
      </div>

      <div class="rounded-xl border-2 border-purpose/30 bg-blue-50 p-4 dark:border-purpose/40 dark:bg-blue-950">
        <p class="text-lg font-bold text-stone-900 dark:text-stone-100">
          {currentQ.hi}
        </p>
        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {currentQ.en}
        </p>
      </div>

      <RadioGroup
        legend={currentQ.hi}
        name={`compass-q${step.value}`}
        options={currentOptions.map((opt) => ({
          value: opt.value,
          label: `${opt.labelHi} / ${opt.label}`,
        }))}
        value={answers.values[step.value] ?? ""}
        onChange$={handleSelect}
      />

      <div class="flex items-center gap-3">
        {step.value > 0 && (
          <Button
            variant="secondary"
            onClick$={$(() => { step.value--; })}
            ariaLabel="पीछे / Back"
          >
            पीछे / Back
          </Button>
        )}

        <Button
          variant="purpose"
          onClick$={handleNext}
          disabled={!answers.values[step.value]}
          ariaLabel={step.value < 4 ? "आगे / Next" : "मेरा उद्देश्य खोजें / Find My Purpose"}
        >
          {step.value < 4 ? "आगे / Next" : "मेरा उद्देश्य खोजें / Find My Purpose"}
        </Button>
      </div>
    </div>
  );
});
