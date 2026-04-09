import { component$, useStore, $, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type {
  State,
  AgeBracket,
  IncomeBracket,
  Category,
  Gender,
  OccupationType,
  CrisisType,
} from "../../shared/types";
import { Select } from "../ui/select";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface TriageFormProps {
  crisisType: CrisisType;
}

const stateOptions = [
  { value: "UP", label: "उत्तर प्रदेश / Uttar Pradesh" },
  { value: "Bihar", label: "बिहार / Bihar" },
  { value: "MP", label: "मध्य प्रदेश / Madhya Pradesh" },
  { value: "Rajasthan", label: "राजस्थान / Rajasthan" },
  { value: "Maharashtra", label: "महाराष्ट्र / Maharashtra" },
  { value: "TamilNadu", label: "तमिलनाडु / Tamil Nadu" },
  { value: "Delhi", label: "दिल्ली / Delhi" },
  { value: "Karnataka", label: "कर्नाटक / Karnataka" },
  { value: "WestBengal", label: "पश्चिम बंगाल / West Bengal" },
  { value: "Gujarat", label: "गुजरात / Gujarat" },
];

const ageOptions = [
  { value: "18-25", label: "18-25 वर्ष" },
  { value: "26-35", label: "26-35 वर्ष" },
  { value: "36-45", label: "36-45 वर्ष" },
  { value: "46-60", label: "46-60 वर्ष" },
  { value: "60+", label: "60+ वर्ष" },
];

const incomeOptions = [
  { value: "BPL", label: "BPL - गरीबी रेखा से नीचे / Below Poverty Line" },
  { value: "LIG", label: "LIG - निम्न आय / Low Income" },
  { value: "MIG", label: "MIG - मध्य आय / Middle Income" },
  { value: "HIG", label: "HIG - उच्च आय / High Income" },
];

const categoryOptions = [
  { value: "General", label: "सामान्य / General" },
  { value: "OBC", label: "OBC - अन्य पिछड़ा वर्ग" },
  { value: "SC", label: "SC - अनुसूचित जाति" },
  { value: "ST", label: "ST - अनुसूचित जनजाति" },
  { value: "EWS", label: "EWS - आर्थिक रूप से कमज़ोर" },
];

const genderOptions = [
  { value: "male", label: "पुरुष / Male" },
  { value: "female", label: "महिला / Female" },
  { value: "other", label: "अन्य / Other" },
];

const occupationOptions = [
  { value: "farmer", label: "किसान / Farmer" },
  { value: "laborer", label: "मज़दूर / Laborer" },
  { value: "skilled", label: "कुशल कारीगर / Skilled Worker" },
  { value: "service", label: "नौकरी / Service" },
  { value: "business", label: "व्यापार / Business" },
  { value: "student", label: "विद्यार्थी / Student" },
  { value: "unemployed", label: "बेरोज़गार / Unemployed" },
  { value: "homemaker", label: "गृहिणी / Homemaker" },
];

const urgencyOptions = [
  { value: "immediate", label: "अभी तुरंत / Right now", description: "बहुत ज़रूरी स्थिति / Critical situation" },
  { value: "urgent", label: "जल्द ही / Soon", description: "कुछ दिनों में / In a few days" },
  { value: "stable", label: "व्यवस्थित / Stable", description: "जानकारी चाहिए / Looking for information" },
];

const stepLabels = [
  "राज्य और उम्र / State & Age",
  "आय और वर्ग / Income & Category",
  "लिंग और पेशा / Gender & Occupation",
  "तात्कालिकता / Urgency",
];

export const TriageForm = component$<TriageFormProps>(({ crisisType }) => {
  const nav = useNavigate();
  const step = useSignal(0);
  const form = useStore({
    state: "" as string,
    ageBracket: "" as string,
    incomeBracket: "" as string,
    category: "" as string,
    gender: "" as string,
    occupationType: "" as string,
    urgency: "" as string,
  });

  const canNext = $(() => {
    if (step.value === 0) return form.state && form.ageBracket;
    if (step.value === 1) return form.incomeBracket && form.category;
    if (step.value === 2) return form.gender && form.occupationType;
    if (step.value === 3) return form.urgency;
    return false;
  });

  const handleSubmit = $(async () => {
    const params = new URLSearchParams({
      crisis: crisisType,
      state: form.state,
      age: form.ageBracket,
      income: form.incomeBracket,
      category: form.category,
      gender: form.gender,
      occupation: form.occupationType,
      urgency: form.urgency,
    });
    await nav(`/sahara/schemes?${params.toString()}`);
  });

  return (
    <div class="space-y-6">
      <div role="status" aria-live="polite" class="sr-only">
        चरण {step.value + 1} / {stepLabels.length}: {stepLabels[step.value]}
      </div>

      <Progress
        value={step.value + 1}
        max={4}
        label={`चरण ${step.value + 1} / 4`}
        variant="purpose"
      />

      <div class="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="फ़ॉर्म चरण / Form steps">
        {stepLabels.map((label, i) => (
          <span
            key={i}
            role="tab"
            aria-selected={i === step.value}
            aria-label={label}
            class={[
              "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
              i === step.value
                ? "bg-purpose text-white"
                : i < step.value
                  ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                  : "bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400",
            ].join(" ")}
          >
            {label}
          </span>
        ))}
      </div>

      <form
        preventdefault:submit
        onSubmit$={handleSubmit}
        class="space-y-6"
        aria-label="संकट आकलन फ़ॉर्म / Crisis assessment form"
      >
        {step.value === 0 && (
          <div class="space-y-4">
            <Select
              label="राज्य / State"
              name="state"
              options={stateOptions}
              value={form.state}
              required
              onChange$={$((v: string) => { form.state = v as State; })}
            />
            <Select
              label="उम्र / Age"
              name="age"
              options={ageOptions}
              value={form.ageBracket}
              required
              onChange$={$((v: string) => { form.ageBracket = v as AgeBracket; })}
            />
          </div>
        )}

        {step.value === 1 && (
          <div class="space-y-4">
            <Select
              label="आय वर्ग / Income Bracket"
              name="income"
              options={incomeOptions}
              value={form.incomeBracket}
              required
              onChange$={$((v: string) => { form.incomeBracket = v as IncomeBracket; })}
            />
            <Select
              label="श्रेणी / Category"
              name="category"
              options={categoryOptions}
              value={form.category}
              required
              onChange$={$((v: string) => { form.category = v as Category; })}
            />
          </div>
        )}

        {step.value === 2 && (
          <div class="space-y-4">
            <RadioGroup
              legend="लिंग / Gender"
              name="gender"
              options={genderOptions}
              value={form.gender}
              onChange$={$((v: string) => { form.gender = v as Gender; })}
            />
            <Select
              label="पेशा / Occupation"
              name="occupation"
              options={occupationOptions}
              value={form.occupationType}
              required
              onChange$={$((v: string) => { form.occupationType = v as OccupationType; })}
            />
          </div>
        )}

        {step.value === 3 && (
          <RadioGroup
            legend="कितनी जल्दी मदद चाहिए? / How soon do you need help?"
            name="urgency"
            options={urgencyOptions}
            value={form.urgency}
            onChange$={$((v: string) => { form.urgency = v; })}
          />
        )}

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

          {step.value < 3 ? (
            <Button
              variant="primary"
              onClick$={$(async () => {
                if (await canNext()) step.value++;
              })}
              ariaLabel="आगे / Next"
            >
              आगे / Next
            </Button>
          ) : (
            <Button
              variant="crisis"
              type="submit"
              ariaLabel="योजनाएं खोजें / Find Schemes"
            >
              योजनाएं खोजें / Find Schemes
            </Button>
          )}
        </div>
      </form>
    </div>
  );
});
